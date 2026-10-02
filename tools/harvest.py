#!/usr/bin/env python3
"""Harvest pipeline for the NPPF 2026 decisions database.

    uv run tools/harvest.py status
    uv run tools/harvest.py all                  # weekly: sweep, fetch, index, queue, build, status
    uv run tools/harvest.py sweep [--areas CV B] [--threads 3]
    uv run tools/harvest.py fetch [--limit N] [--retry-failed]
    uv run tools/harvest.py index                # incremental pins-corpus-index.tsv refresh
    uv run tools/harvest.py queue [--all-types]  # distillation work list -> harvest-log/slices/queue-<date>.tsv
    uv run tools/harvest.py skip REF [REF ...] --reason "..."
    uv run tools/harvest.py acp LO HI OUT.jsonl  # wraps scan_acp.py for old-style refs
    uv run tools/harvest.py record --source lpa:stratford --newest 2026-09-22 --note "..."
    uv run tools/harvest.py build                # normalise.py + build_index.py, then stamp cases

Every run updates harvest-log/state.json (watermarks) and appends a line to harvest-log/runs.jsonl.
New-service PINS refs (600xxxx) come from the comment-planning-appeal service; the decided list is
per postcode area and needs a cookie from the search page first (DISTILLATION-GUIDE §7).
"""
import argparse
import concurrent.futures as cf
import csv
import datetime as dt
import html
import http.cookiejar
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(__file__))
import pinscorpus as pc  # noqa: E402

FRAMEWORK_DATE = '2026-08-17'
BASE = 'https://appeal-planning-decision.service.gov.uk'
SEARCH = f'{BASE}/comment-planning-appeal'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
AREAS = ('AL B BA BB BD BH BL BN BR BS CA CB CH CM CO CR CT CV CW DA DE DH DL DN DT DY E EC EN EX FY GL GU '
         'HA HD HG HP HR HU HX IG IP KT L LA LE LN LS LU M ME MK N NE NG NN NR NW OL OX PE PL PO PR RG RH RM '
         'S SE SG SK SL SM SN SO SP SR SS ST SW SY TA TF TN TQ TR TS TW UB W WA WC WD WF WN WR WS WV YO').split()

STATE = f'{pc.LOG}/state.json'
RUNS = f'{pc.LOG}/runs.jsonl'
FAILURES = f'{pc.LOG}/fetch-failures.json'
SKIPPED = f'{pc.LOG}/skipped.tsv'
SLICES = f'{pc.LOG}/slices'
CASES_JSON = f'{pc.DB}/index/cases.json'
ACP_TSV = f'{pc.LOG}/acp-decided-index.tsv'
# Appeal types distilled by default; householder and advertisement appeals are triaged out (DISTILLATION-GUIDE §2).
QUEUE_TYPES = ('Planning', 'Planning listed building and conservation area', 'Enforcement notice',
               'Commercial planning (CAS)', 'Lawful development certificate')


def now():
    return dt.datetime.now().astimezone().isoformat(timespec='seconds')


# ---------- state ----------

def load_state():
    if os.path.exists(STATE):
        return json.load(open(STATE))
    return {'schema': 1, 'frameworkDate': FRAMEWORK_DATE, 'sources': {}, 'cases': {}}


def save_state(s):
    tmp = STATE + '.tmp'
    with open(tmp, 'w') as o:
        json.dump(s, o, indent=2, sort_keys=True)
        o.write('\n')
    os.replace(tmp, STATE)


def src(s, name):
    return s['sources'].setdefault(name, {})


def log_run(cmd, args, deltas, t0):
    with open(RUNS, 'a') as o:
        o.write(json.dumps({'at': now(), 'cmd': cmd, 'args': args, 'deltas': deltas,
                            'seconds': round(time.time() - t0, 1)}) + '\n')


def refresh_pins_watermarks(s):
    """Recompute pins-new watermarks from the files on disk (cheap, always consistent)."""
    decided = {r: v for r, v in pc.load_decided().items() if v.get('date', '') >= FRAMEWORK_DATE}
    corpus = set(pc.corpus_refs())
    p = src(s, 'pins-new')
    p['listed'] = len(decided)
    if decided:
        newest = max(decided.values(), key=lambda v: (v['date'], v['ref']))
        p['newestDecisionDateSeen'] = newest['date']
        p['newestRefSeen'] = max(decided)
    p['corpusLetters'] = len(corpus)
    in_corpus = [decided[r]['date'] for r in corpus if r in decided]
    p['newestLetterDate'] = max(in_corpus) if in_corpus else None
    p['awaitingFetch'] = len([r for r in decided if r not in corpus])
    p['fetchFailures'] = len(load_failures())


def refresh_cases(s):
    cases = json.load(open(CASES_JSON))
    by = {}
    for c in cases:
        by[c['decision_maker']] = by.get(c['decision_maker'], 0) + 1
    s['cases'] = {
        'total': len(cases),
        'byDecisionMaker': dict(sorted(by.items())),
        'newestDecisionDate': max(c['decision_date'] for c in cases),
        'newestHarvestedOn': max(str(c.get('harvested_on') or '') for c in cases),
        'refreshedAt': now(),
    }


def refresh_acp(s):
    if not os.path.exists(ACP_TSV):
        return
    rows = list(csv.DictReader(open(ACP_TSV), delimiter='\t'))
    if not rows:
        return
    a = src(s, 'pins-acp')
    a['decidedSinceFramework'] = len(rows)
    a['newestDecisionDateSeen'] = max(r['decision_date'] for r in rows)
    a['highestDecidedRef'] = max(int(r['ref']) for r in rows)


# ---------- http ----------

def opener():
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))


def get(op, url, binary=False, delay=0.5, tries=5):
    for attempt in range(tries):
        time.sleep(delay)
        try:
            with op.open(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r:
                data = r.read()
                return data if binary else data.decode('utf8', 'ignore')
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < tries - 1:
                time.sleep(60 if e.code == 429 else 10 * (attempt + 1))
                continue
            raise
        except (urllib.error.URLError, TimeoutError):
            if attempt < tries - 1:
                time.sleep(10 * (attempt + 1))
                continue
            raise


def cell_text(c):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', c))).strip()


# ---------- sweep ----------

def sweep_area(area, delay):
    op = opener()
    get(op, f'{SEARCH}/appeals?search={area}', delay=delay)          # sets the session cookie
    h = get(op, f'{SEARCH}/decided-appeals?search={area}', delay=delay)
    out = []
    for r in re.findall(r'<tr class="govuk-table__row">(.*?)</tr>', h, re.S):
        cells = [cell_text(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', r, re.S)]
        if len(cells) < 5:
            continue
        try:
            d = dt.datetime.strptime(cells[2], '%d %B %Y').date().isoformat()
        except ValueError:
            continue
        out.append(dict(area=area, ref=cells[0], addr=cells[1], date=d, type=cells[3], decision=cells[4]))
    m = re.search(r'(\d+) decided Appeals found', h)
    return area, out, int(m.group(1)) if m else None


def cmd_sweep(a, s):
    areas = a.areas or AREAS
    rows = pc.load_decided()
    before = len(rows)
    seen_new = []
    errors = []
    with cf.ThreadPoolExecutor(a.threads) as ex:
        for fut in cf.as_completed([ex.submit(sweep_area, ar, a.delay) for ar in areas]):
            try:
                area, found, total = fut.result()
            except Exception as e:  # keep going; record the area
                errors.append(str(e)[:200])
                continue
            kept = [r for r in found if r['date'] >= FRAMEWORK_DATE]
            for r in kept:
                if r['ref'] not in rows:
                    seen_new.append(r['ref'])
                rows[r['ref']] = {**rows.get(r['ref'], {}), **r}
            print(f'{area:3} listed {total if total is not None else "?":>4}  since {FRAMEWORK_DATE}: {len(kept):>4}', flush=True)
    pc.save_decided(rows)
    p = src(s, 'pins-new')
    p['lastSweepAt'] = now()
    p['lastSweepAreas'] = 'all' if not a.areas else ' '.join(areas)
    p['lastSweepErrors'] = len(errors)
    print(f'new refs: {len(seen_new)} (store {before} -> {len(rows)}); area errors: {len(errors)}')
    return {'newRefs': len(seen_new), 'errors': len(errors)}


# ---------- fetch ----------

def load_failures():
    return json.load(open(FAILURES)) if os.path.exists(FAILURES) else {}


def save_failures(f):
    with open(FAILURES, 'w') as o:
        json.dump(f, o, indent=1, sort_keys=True)


def fetch_one(ref, area, delay):
    op = opener()
    get(op, f'{SEARCH}/appeals?search={area or ref}', delay=delay)
    page = get(op, f'{SEARCH}/appeals/{ref}', delay=delay)
    links = [(m.group(1), cell_text(m.group(2)))
             for m in re.finditer(r'href="([^"]*published-document/[^"]+)"[^>]*>(.*?)</a>', page, re.S)]
    if not links:
        raise RuntimeError('no published document on case page')
    decision = [l for l in links if l[1].lower().startswith('appeal decision')] or links
    path = decision[0][0]
    path = path[path.index('/published-document/'):]
    pdf = get(op, BASE + path, binary=True, delay=delay)
    with tempfile.NamedTemporaryFile(suffix='.pdf') as t:
        t.write(pdf)
        t.flush()
        txt = subprocess.run(['pdftotext', '-layout', t.name, '-'], capture_output=True, text=True).stdout
    if len(txt.strip()) < 200:
        raise RuntimeError('no text layer (scanned PDF?)')
    return ref, path, txt


def cmd_fetch(a, s):
    decided = {r: v for r, v in pc.load_decided().items() if v.get('date', '') >= FRAMEWORK_DATE}
    have = set(pc.corpus_refs())
    fails = load_failures()
    todo = sorted((r for r in decided if r not in have and (a.retry_failed or fails.get(r, {}).get('tries', 0) < 3)),
                  key=lambda r: decided[r]['date'], reverse=True)
    if a.limit:
        todo = todo[:a.limit]
    print(f'to fetch: {len(todo)}')
    got = 0
    with cf.ThreadPoolExecutor(a.threads) as ex, open(pc.DOCS_MAP, 'a') as dm:
        futs = {ex.submit(fetch_one, r, decided[r].get('area'), a.delay): r for r in todo}
        for fut in cf.as_completed(futs):
            r = futs[fut]
            try:
                ref, path, txt = fut.result()
            except Exception as e:
                f = fails.setdefault(r, {'tries': 0})
                f['tries'] += 1
                f['last'] = str(e)[:200]
                f['at'] = now()
                print(f'{r} FAIL {f["last"]}', flush=True)
                continue
            with open(f'{pc.CORPUS}/{ref}.txt', 'w') as o:
                o.write(txt)
            dm.write(f'{ref} {path}\n')
            dm.flush()
            fails.pop(ref, None)
            got += 1
            print(f'{ref} ok', flush=True)
    save_failures(fails)
    src(s, 'pins-new')['lastFetchAt'] = now()
    return {'fetched': got, 'failed': len(todo) - got}


# ---------- index ----------

def cmd_index(a, s):
    meta = pc.load_decided()
    idx = pc.read_index()
    idx_mtime = os.path.getmtime(pc.INDEX_TSV) if os.path.exists(pc.INDEX_TSV) else 0
    rows, changed = [], 0
    for ref in pc.corpus_refs():
        f = f'{pc.CORPUS}/{ref}.txt'
        old = idx.get(ref)
        if old and os.path.getmtime(f) <= idx_mtime and (old['date'] or ref not in meta):
            rows.append([old[c] for c in pc.INDEX_COLS])
        else:
            rows.append(pc.parse_letter(ref, open(f, errors='ignore').read(), meta.get(ref)))
            changed += 1
    if changed:
        pc.write_index(rows)
    src(s, 'pins-new')['lastIndexAt'] = now()
    print(f'indexed {len(rows)} letters ({changed} new or changed)')
    return {'indexedChanged': changed}


# ---------- queue ----------

def covered_refs():
    cov = set()
    for c in json.load(open(CASES_JSON)):
        for text in [c.get('appeal_ref') or '', c['case_id']] + list(c.get('sources') or []):
            cov.update(re.findall(r'(?<!\d)([36]\d{6})(?!\d)', text))
    return cov


def skipped_refs():
    if not os.path.exists(SKIPPED):
        return set()
    return {r['ref'] for r in csv.DictReader(open(SKIPPED), delimiter='\t')}


def queue_rows(all_types=False):
    cov, skip = covered_refs(), skipped_refs()
    out = []
    for r in pc.read_index().values():
        if r['ref'] in cov or r['ref'] in skip or r['cites_2026_fw'] != 'Y':
            continue
        if not all_types and r['type'] not in QUEUE_TYPES:
            continue
        out.append(r)
    return sorted(out, key=lambda r: (r['date'], r['ref']), reverse=True)


def cmd_queue(a, s):
    rows = queue_rows(a.all_types)
    p = src(s, 'pins-new')
    p['lastQueueAt'] = now()
    p['queued'] = len(rows)
    if rows:
        os.makedirs(SLICES, exist_ok=True)
        out = f'{SLICES}/queue-{dt.date.today().isoformat()}.tsv'
        with open(out, 'w') as o:
            o.write('\t'.join(pc.INDEX_COLS) + '\n')
            for r in rows:
                o.write('\t'.join(r[c] for c in pc.INDEX_COLS) + '\n')
        p['lastQueueFile'] = os.path.relpath(out, pc.DB)
        print(f'queued {len(rows)} letters for distillation -> {out}')
    else:
        print('nothing to distil')
    return {'queued': len(rows)}


def cmd_skip(a, s):
    new = not os.path.exists(SKIPPED)
    with open(SKIPPED, 'a') as o:
        if new:
            o.write('ref\tskipped_on\treason\n')
        for r in a.refs:
            o.write(f'{r}\t{dt.date.today().isoformat()}\t{a.reason}\n')
    print(f'skipped {len(a.refs)}')
    return {'skipped': len(a.refs)}


# ---------- acp / record / build ----------

def cmd_acp(a, s):
    here = os.path.dirname(__file__)
    subprocess.run([sys.executable, f'{here}/scan_acp.py', str(a.lo), str(a.hi), a.out,
                    str(a.threads), str(a.delay)], check=True)
    acp = src(s, 'pins-acp')
    acp['lastRunAt'] = now()
    acp['highestRefScanned'] = max(acp.get('highestRefScanned') or 0, a.hi - 1)
    acp['lastRange'] = [a.lo, a.hi]
    return {'range': [a.lo, a.hi]}


def cmd_record(a, s):
    r = src(s, a.source)
    r['lastRunAt'] = now()
    r['newestDecisionDateSeen'] = a.newest
    if a.note:
        r['note'] = a.note
    print(f'recorded {a.source}: newest {a.newest}')
    return {'source': a.source}


def cmd_build(a, s):
    here = os.path.dirname(__file__)
    subprocess.run([sys.executable, f'{here}/normalise.py'], check=True)
    subprocess.run([sys.executable, f'{here}/build_index.py'], check=True)
    s['cases']['builtAt'] = now()
    return {}


# ---------- status ----------

def age(ts):
    if not ts:
        return 'never'
    try:
        d = dt.datetime.fromisoformat(ts)
        days = (dt.datetime.now(d.tzinfo) - d).days if d.tzinfo else (dt.datetime.now() - d).days
    except ValueError:
        d = dt.datetime.fromisoformat(ts + 'T00:00:00')
        days = (dt.datetime.now() - d).days
    return f'{ts[:16].replace("T", " ")} ({days}d ago)'


def cmd_status(a, s):
    c = s.get('cases', {})
    print(f"Cases: {c.get('total')}  {c.get('byDecisionMaker')}")
    print(f"  newest decision {c.get('newestDecisionDate')}, newest harvested {c.get('newestHarvestedOn')}, "
          f"index built {age(c.get('builtAt'))}")
    p = s['sources'].get('pins-new', {})
    print('PINS new-service (600xxxx):')
    print(f"  decided since {FRAMEWORK_DATE}: {p.get('listed')}  newest seen {p.get('newestDecisionDateSeen')} "
          f"(ref {p.get('newestRefSeen')})")
    print(f"  letters in corpus: {p.get('corpusLetters')}  newest letter {p.get('newestLetterDate')}  "
          f"awaiting fetch: {p.get('awaitingFetch')}  failures: {p.get('fetchFailures')}")
    print(f"  last sweep {age(p.get('lastSweepAt'))}; fetch {age(p.get('lastFetchAt'))}; "
          f"index {age(p.get('lastIndexAt'))}; queue {age(p.get('lastQueueAt'))}")
    print(f"  queued for distillation: {len(queue_rows())} (planning-type, cites 2026 Framework, no case file)")
    acp = s['sources'].get('pins-acp', {})
    if acp:
        print(f"PINS ACP (old-style): decided since Framework {acp.get('decidedSinceFramework')}, newest "
              f"{acp.get('newestDecisionDateSeen')}, highest decided ref {acp.get('highestDecidedRef')}, "
              f"highest scanned {acp.get('highestRefScanned')}, last run {age(acp.get('lastRunAt'))}")
    for name, v in sorted(s['sources'].items()):
        if name.startswith('lpa:'):
            print(f"{name}: newest {v.get('newestDecisionDateSeen')}, recorded {age(v.get('lastRunAt'))}"
                  f"{'  - ' + v['note'] if v.get('note') else ''}")
    return None


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    sw = sub.add_parser('sweep')
    sw.add_argument('--areas', nargs='*')
    sw.add_argument('--threads', type=int, default=3)
    sw.add_argument('--delay', type=float, default=0.5)
    fe = sub.add_parser('fetch')
    fe.add_argument('--limit', type=int)
    fe.add_argument('--threads', type=int, default=3)
    fe.add_argument('--delay', type=float, default=0.5)
    fe.add_argument('--retry-failed', action='store_true')
    sub.add_parser('index')
    qu = sub.add_parser('queue')
    qu.add_argument('--all-types', action='store_true')
    sk = sub.add_parser('skip')
    sk.add_argument('refs', nargs='+')
    sk.add_argument('--reason', required=True)
    ac = sub.add_parser('acp')
    ac.add_argument('lo', type=int)
    ac.add_argument('hi', type=int)
    ac.add_argument('out')
    ac.add_argument('--threads', type=int, default=3)
    ac.add_argument('--delay', type=float, default=0.5)
    re_ = sub.add_parser('record')
    re_.add_argument('--source', required=True)
    re_.add_argument('--newest', required=True)
    re_.add_argument('--note')
    sub.add_parser('build')
    sub.add_parser('status')
    al = sub.add_parser('all')
    al.add_argument('--threads', type=int, default=3)
    al.add_argument('--delay', type=float, default=0.5)
    a = ap.parse_args()

    s = load_state()
    s.setdefault('frameworkDate', FRAMEWORK_DATE)
    t0 = time.time()
    steps = {'sweep': cmd_sweep, 'fetch': cmd_fetch, 'index': cmd_index, 'queue': cmd_queue, 'skip': cmd_skip,
             'acp': cmd_acp, 'record': cmd_record, 'build': cmd_build}
    if a.cmd == 'all':
        a.areas, a.limit, a.retry_failed, a.all_types = None, None, False, False
        deltas = {}
        for name in ('sweep', 'fetch', 'index', 'queue', 'build'):
            print(f'== {name}')
            deltas[name] = steps[name](a, s)
            refresh_pins_watermarks(s)
            save_state(s)
    elif a.cmd == 'status':
        deltas = None
    else:
        deltas = steps[a.cmd](a, s)
    refresh_pins_watermarks(s)
    refresh_acp(s)
    if os.path.exists(CASES_JSON):
        built = s.get('cases', {}).get('builtAt')
        refresh_cases(s)
        if built:
            s['cases']['builtAt'] = built
    if a.cmd != 'status':  # status is read-only: it reports refreshed figures without writing state.json
        save_state(s)
    if a.cmd != 'status':
        log_run(a.cmd, {k: v for k, v in vars(a).items() if k != 'cmd'}, deltas, t0)
    if a.cmd in ('status', 'all'):
        cmd_status(a, s)


if __name__ == '__main__':
    main()
