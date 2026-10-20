#!/usr/bin/env python3
"""Sweep council planning registers and committee pages for officer reports decided under the 2026 Framework.

    uv run tools/council_sweep.py status                       # per-council watermarks and counts
    uv run tools/council_sweep.py register                     # the register, one line a council
    uv run tools/council_sweep.py sweep [--council SLUG ...] [--since YYYY-MM-DD] [--until YYYY-MM-DD]
    uv run tools/council_sweep.py fetch [--council SLUG ...] [--limit N] [--filter REGEX|all] [--retry-failed] [--refetch]
    uv run tools/council_sweep.py minutes [--council SLUG ...] [--min-age DAYS]   # later-published committee minutes
    uv run tools/council_sweep.py all   [--council SLUG ...]   # sweep, fetch, minutes, status
    uv run tools/council_sweep.py list  [--council SLUG ...] [--fetched|--unfetched]
    uv run tools/council_sweep.py ocr   [--council SLUG ...] [--limit N]   # scanned reports flagged *.needs-ocr
    uv run tools/council_sweep.py reclassify [--council SLUG ...]        # re-judge fetched files after a rule change

Register: data/decisions/harvest-log/council-register.tsv (portal, URLs, what the council publishes).
State:    data/decisions/harvest-log/council-state.json (watermarks), harvest-log/council/<slug>.jsonl (items).
Output:   ../sources/council/sweep/<slug>/<ref>/ (PDFs plus pdftotext -layout .txt; private, council copyright).

`sweep` lists decisions issued (or committee meetings held) since the council's watermark (first run: the
Framework date, 17 August 2026). `fetch` downloads the officer report, decision notice and minutes for items
whose proposal matches --filter (default: housing words; `all` for everything). Each adapter in tools/council/
handles one portal product; the contract is in tools/council/__init__.py. Councils flagged blocked=yes are
skipped, and an adapter that meets a bot wall marks the council blocked for the run and moves on.
"""
import argparse
import datetime as dt
import importlib
import json
import os
import re
import subprocess
import sys
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from council import common as c  # noqa: E402

HOUSING = re.compile(r'dwelling|house|home|residential|bungalow|flat|apartment|c3\b|self[- ]build|pip\b|'
                     r'permission in principle|outline', re.I)
# Reference suffixes that never carry a location-and-design report (trees, adverts, listed building works only,
# conditions, agreements). Skipped by the default filter; `--filter all` fetches them too.
SKIP_SUFFIX = re.compile(r'/(TREE|TPO|TCA|TP|CA|ADV|LBC|LB|COND|CONDS|DISC|S106|NMA|AMD|CLE|CLP|LDC|PNH|HH|CPE|CPL)$', re.I)
# Idox lists clamp the proposal to about 100 characters, so a truncated description that is not obviously
# householder work, trees, adverts or a certificate is fetched rather than lost (the full text arrives at fetch).
HOUSEHOLDER = re.compile(r'extension|porch|dormer|conservatory|loft|rooflight|window|door|fascia|sign|dwarf wall|fence|'
                         r'canopy|decking|lawful development certificate|certificate of lawful|advertisement|\btree|crown|'
                         r'\bT\d+\b|hedge|outbuilding|garden room|shopfront|solar|air source|heat pump', re.I)
RUNS = os.path.join(c.LOG, 'council-runs.jsonl')


def log_run(cmd, **kw):
    os.makedirs(c.LOG, exist_ok=True)
    with open(RUNS, 'a') as o:
        o.write(json.dumps({'at': c.now(), 'cmd': cmd, **kw}, sort_keys=True) + '\n')


def adapter_for(row):
    try:
        return importlib.import_module(f'council.{row["portal"]}')
    except ModuleNotFoundError:
        return None


def councils(a, reg):
    want = set(a.council or [])
    rows = [r for r in reg if not want or r['slug'] in want]
    missing = want - {r['slug'] for r in rows}
    if missing:
        sys.exit(f'not in the register: {" ".join(sorted(missing))}')
    return rows


def http_for(row, verbose=False):
    jar = os.path.join(c.LOG, 'council', 'jars', row['slug'] + '.jar')
    return c.Http(jar, delay=float(row.get('delay') or 1.0), verbose=verbose)


def council_state(state, slug):
    return state['councils'].setdefault(slug, {})


# ---------- sweep ----------

def cmd_sweep(a, reg, state):
    until = dt.date.fromisoformat(a.until) if a.until else dt.date.today()
    totals = {}
    for row in councils(a, reg):
        cs = council_state(state, row['slug'])
        if row.get('blocked') == 'yes' and not a.force:
            print(f'{row["slug"]}: blocked ({row.get("notes", "")[:80]}), skipped')
            continue
        mod = adapter_for(row)
        if mod is None:
            print(f'{row["slug"]}: no adapter for portal "{row["portal"]}", skipped')
            continue
        if a.since:
            since = dt.date.fromisoformat(a.since)
        elif cs.get('newestDateSeen'):
            since = dt.date.fromisoformat(cs['newestDateSeen']) - dt.timedelta(days=int(a.overlap))
        else:
            since = c.FRAMEWORK_DATE
        print(f'{row["slug"]}: sweep {since} .. {until} via {row["portal"]}')
        items = c.load_items(row['slug'])
        http = http_for(row, a.verbose)
        try:
            found = mod.sweep(http, row, since, until)
        except c.Blocked as e:
            print(f'  BLOCKED at {e}; flag the council in the register if it persists')
            cs['lastSweepBlockedAt'] = c.now()
            continue
        except Exception:  # noqa: BLE001
            print(f'  sweep failed:\n{traceback.format_exc()}')
            cs['lastSweepError'] = c.now()
            continue
        new = 0
        for it in found:
            it.setdefault('council', row['slug'])
            old = items.get(it['ref'])
            if old:
                it['fetched'] = old.get('fetched', [])
                it['fetchedAt'] = old.get('fetchedAt', '')
                it['fetchError'] = old.get('fetchError', '')
            else:
                new += 1
            items[it['ref']] = it
        c.save_items(row['slug'], items)
        dates = [it['date'] for it in items.values() if it.get('date')]
        cs.update({'lastSweepAt': c.now(), 'items': len(items), 'newestDateSeen': max(dates) if dates else '',
                   'lastSweepFound': len(found), 'lastSweepNew': new, 'requests': http.calls})
        cs.pop('lastSweepError', None)
        totals[row['slug']] = new
        print(f'  {len(found)} listed, {new} new (register now {len(items)}; {http.calls} requests)')
    c.save_state(state, [r['slug'] for r in councils(a, reg)])
    log_run('sweep', new=totals)


# ---------- fetch ----------

def wanted(it, filt):
    """Meetings always; applications by regex on the proposal (the address alone says "Coach House" too often)."""
    if it['kind'] == 'meeting' or filt is None:
        return True
    if SKIP_SUFFIX.search(it.get('ref', '')):
        return False
    text = it.get('proposal') or it.get('address', '')
    if filt.search(text):
        return True
    return text.endswith('...') and not HOUSEHOLDER.search(text)


def extract_and_record(outdir, files):
    """pdftotext every PDF in `files` and (re)write the folder's SOURCES.tsv (file, kind, url)."""
    for f in files:
        p = os.path.join(outdir, f['file'])
        if c.is_pdf(p):
            f['txt'] = os.path.basename(c.pdf_to_text(p) or '')
    with open(os.path.join(outdir, 'SOURCES.tsv'), 'w') as o:
        o.write('file\tkind\turl\n')
        for f in files:
            o.write(f'{f["file"]}\t{f.get("kind", "")}\t{f["url"]}\n')


def cmd_minutes(a, reg, state):
    """Committee minutes are published weeks after the meeting: for fetched meetings with no minutes yet, ask the
    adapter's refetch_minutes() for anything new and append it."""
    grace = dt.date.today() - dt.timedelta(days=int(a.min_age))
    got = 0
    for row in councils(a, reg):
        mod = adapter_for(row)
        if mod is None or not hasattr(mod, 'refetch_minutes') or row.get('blocked') == 'yes':
            continue
        items = c.load_items(row['slug'])
        todo = [it for it in items.values() if it['kind'] == 'meeting' and it.get('fetchedAt')
                and it.get('date', '9') <= grace.isoformat()
                and not any(f.get('kind') == 'minutes' for f in it.get('fetched', []))]
        if not todo:
            continue
        print(f'{row["slug"]}: {len(todo)} meeting(s) awaiting minutes')
        http = http_for(row, a.verbose)
        for it in sorted(todo, key=lambda x: x['date']):
            outdir = c.outdir_for(row['slug'], it)
            try:
                new = mod.refetch_minutes(http, row, it, outdir)
            except c.Blocked as e:
                print(f'  BLOCKED at {e}')
                break
            except Exception as e:  # noqa: BLE001
                print(f'  {it["ref"]}: {type(e).__name__}: {str(e)[:200]}')
                continue
            if new:
                it['fetched'] = it.get('fetched', []) + new
                extract_and_record(outdir, it['fetched'])
                got += len(new)
                print(f'  {it["ref"]}: {", ".join(f["file"] for f in new)}')
            else:
                print(f'  {it["ref"]}: not yet published')
        c.save_items(row['slug'], items)
    log_run('minutes', got=got)


def cmd_fetch(a, reg, state):
    filt = None if a.filter == 'all' else re.compile(a.filter, re.I) if a.filter else HOUSING
    done_total = 0
    for row in councils(a, reg):
        cs = council_state(state, row['slug'])
        if row.get('blocked') == 'yes' and not a.force:
            continue
        mod = adapter_for(row)
        if mod is None:
            continue
        items = c.load_items(row['slug'])
        todo = [it for it in sorted(items.values(), key=lambda x: x.get('date') or '')
                if wanted(it, filt) and (a.refetch or not it.get('fetchedAt'))
                and (a.retry_failed or not it.get('fetchError'))]
        if not todo:
            continue
        print(f'{row["slug"]}: {len(todo)} to fetch')
        http = http_for(row, a.verbose)
        n = 0
        for it in todo:
            if a.limit and done_total >= a.limit:
                break
            outdir = c.outdir_for(row['slug'], it)
            os.makedirs(outdir, exist_ok=True)
            done_total += 1   # --limit counts attempts, so a failing council cannot run through its whole list
            try:
                files = mod.fetch(http, row, it, outdir)
            except c.Blocked as e:
                print(f'  BLOCKED at {e}; stopping this council')
                cs['lastFetchBlockedAt'] = c.now()
                break
            except Exception as e:  # noqa: BLE001
                it['fetchError'] = f'{type(e).__name__}: {e}'[:300]
                print(f'  {it["ref"]}: {it["fetchError"]}')
                continue
            extract_and_record(outdir, files)
            it['fetched'] = files
            it['fetchedAt'] = c.now()
            it.pop('fetchError', None)
            n += 1
            kinds = ','.join(sorted({f.get('kind', '?') for f in files})) or 'nothing'
            print(f'  {it["ref"]} {it.get("date", "")}: {len(files)} file(s) [{kinds}]')
            c.save_items(row['slug'], items)
        c.save_items(row['slug'], items)
        fetched = [it for it in items.values() if it.get('fetchedAt')]
        reports = sum(1 for it in fetched if any(f.get('kind') == 'report' for f in it['fetched']))
        cs.update({'lastFetchAt': c.now(), 'fetched': len(fetched), 'withReport': reports,
                   'fetchErrors': sum(1 for it in items.values() if it.get('fetchError'))})
        c.save_state(state, [row['slug']])
    log_run('fetch', fetched=done_total)


# ---------- status / list / register ----------

def age(ts):
    if not ts:
        return 'never'
    d = dt.datetime.now().astimezone() - dt.datetime.fromisoformat(ts)
    return f'{d.days}d ago' if d.days else f'{d.seconds // 3600}h ago'


def cmd_status(a, reg, state):
    print(f'Council sweep: {len(reg)} councils in the register, framework date {c.FRAMEWORK_DATE}')
    print(f'{"council":<30}{"portal":<18}{"items":>6}{"fetched":>8}{"reports":>8}{"errors":>7}  newest       last sweep  notes')
    for row in reg:
        cs = state['councils'].get(row['slug'], {})
        items = c.load_items(row['slug'])   # counts come from the items file; the state holds only watermarks
        fetched = [it for it in items.values() if it.get('fetchedAt')]
        cs = dict(cs, items=len(items), fetched=len(fetched),
                  withReport=sum(1 for it in fetched if any(f.get('kind') == 'report' for f in it['fetched'])),
                  fetchErrors=sum(1 for it in items.values() if it.get('fetchError')),
                  newestDateSeen=max([it['date'] for it in items.values() if it.get('date')] or ['']))
        note = 'BLOCKED' if row.get('blocked') == 'yes' else ('bot wall ' + age(cs['lastSweepBlockedAt'])
                                                             if cs.get('lastSweepBlockedAt') else '')
        if adapter_for(row) is None:
            note = (note + ' no adapter').strip()
        if row.get('delegated_published') in ('no', 'notice-only'):
            note = (note + f' delegated:{row["delegated_published"]}').strip()
        print(f'{row["slug"]:<30}{row["portal"]:<18}{cs.get("items", 0):>6}{cs.get("fetched", 0):>8}'
              f'{cs.get("withReport", 0):>8}{cs.get("fetchErrors", 0):>7}  {cs.get("newestDateSeen", "") or "-":<12} '
              f'{age(cs.get("lastSweepAt")):<11} {note}')
    needs_ocr = 0
    for root, _, files in os.walk(c.OUT_ROOT) if os.path.isdir(c.OUT_ROOT) else []:
        needs_ocr += sum(1 for f in files if f.endswith('.needs-ocr'))
    if needs_ocr:
        print(f'{needs_ocr} scanned PDF(s) need OCR (look for *.needs-ocr under {c.OUT_ROOT})')


def cmd_list(a, reg, state):
    for row in councils(a, reg):
        for it in sorted(c.load_items(row['slug']).values(), key=lambda x: x.get('date') or ''):
            if a.fetched and not it.get('fetchedAt'):
                continue
            if a.unfetched and it.get('fetchedAt'):
                continue
            kinds = ','.join(sorted({f.get('kind', '?') for f in it.get('fetched', [])}))
            print(f'{row["slug"]}\t{it["ref"]}\t{it.get("date", "")}\t{it.get("level", "")}\t{it.get("outcome", "")[:40]}'
                  f'\t{it.get("address", "")[:50]}\t{kinds}\t{it.get("fetchError", "")[:60]}')


def cmd_ocr(a, reg, state):
    """Run tools/ocr_pdf.py over every scanned PDF the fetch flagged (*.needs-ocr), newest council first."""
    want = set(a.council or [])
    todo = []
    for root, _, files in os.walk(c.OUT_ROOT) if os.path.isdir(c.OUT_ROOT) else []:
        slug_ = os.path.relpath(root, c.OUT_ROOT).split(os.sep)[0]
        if want and slug_ not in want:
            continue
        todo += [os.path.join(root, f) for f in files if f.endswith('.needs-ocr')]
    print(f'{len(todo)} scanned PDF(s) to OCR')
    ocr = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ocr_pdf.py')
    done = 0
    for marker in sorted(todo):
        if a.limit and done >= a.limit:
            break
        txt = marker[:-len('.needs-ocr')]
        pdf = re.sub(r'\.txt$', '.pdf', txt)
        if not os.path.exists(pdf):
            os.remove(marker)
            continue
        print(f'  {os.path.relpath(pdf, c.OUT_ROOT)}')
        p = subprocess.run(['uv', 'run', ocr, pdf, txt], capture_output=True, text=True)  # inline deps need uv
        if p.returncode == 0 and os.path.exists(txt) and os.path.getsize(txt) > 200:
            os.remove(marker)
            done += 1
        else:
            print(f'    OCR failed: {(p.stderr or p.stdout)[-200:]}')
    log_run('ocr', done=done)


def cmd_reclassify(a, reg, state):
    """After an adapter's document rules change: re-judge every fetched application file by name, drop the ones the
    rules would no longer download (PDF, text extract and OCR marker) and rewrite kinds and SOURCES.tsv."""
    dropped = rekinded = 0
    for row in councils(a, reg):
        mod = adapter_for(row)
        if mod is None or not hasattr(mod, 'reclassify'):
            continue
        items = c.load_items(row['slug'])
        d = k = 0
        for it in items.values():
            if it['kind'] != 'application' or not it.get('fetched'):
                continue
            outdir = c.outdir_for(row['slug'], it)
            keep = []
            for f in it['fetched']:
                kind = mod.reclassify(f['file'])
                if kind is None:
                    for ext in ('', '.txt', '.txt.needs-ocr'):
                        p = os.path.join(outdir, re.sub(r'\.pdf$', '', f['file'], flags=re.I) + ext if ext else f['file'])
                        if os.path.exists(p):
                            os.remove(p)
                    d += 1
                    continue
                if kind != f.get('kind'):
                    f['kind'] = kind
                    k += 1
                keep.append(f)
            if len(keep) != len(it['fetched']) or k:
                it['fetched'] = keep
                extract_and_record(outdir, keep)
        c.save_items(row['slug'], items)
        if d or k:
            print(f'{row["slug"]}: dropped {d} file(s), re-kinded {k}')
        dropped += d
        rekinded += k
    print(f'dropped {dropped}, re-kinded {rekinded}')
    log_run('reclassify', dropped=dropped, rekinded=rekinded)


def cmd_register(a, reg, state):
    for row in reg:
        print(f'{row["slug"]:<22}{row["portal"]:<18}{row.get("blocked", ""):<4}{row.get("delegated_published", ""):<12}'
              f'{row.get("base_url", "")}')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--council', action='append', help='register slug; repeatable')
    ap.add_argument('--verbose', action='store_true')
    ap.add_argument('--force', action='store_true', help='include councils flagged blocked')
    sub = ap.add_subparsers(dest='cmd', required=True)
    sw = sub.add_parser('sweep')
    sw.add_argument('--since')
    sw.add_argument('--until')
    sw.add_argument('--overlap', default='7', help='days before the watermark to re-list (default 7)')
    fe = sub.add_parser('fetch')
    fe.add_argument('--limit', type=int, default=0)
    fe.add_argument('--filter', help='regex on proposal+address, or "all" (default: housing words)')
    fe.add_argument('--retry-failed', action='store_true')
    fe.add_argument('--refetch', action='store_true', help='run fetch again on items already fetched (after an adapter fix)')
    mi = sub.add_parser('minutes')
    mi.add_argument('--min-age', default='3', help='only meetings at least this many days old (default 3)')
    al = sub.add_parser('all')
    al.add_argument('--since')
    al.add_argument('--until')
    al.add_argument('--overlap', default='7')
    al.add_argument('--limit', type=int, default=0)
    al.add_argument('--filter')
    al.add_argument('--retry-failed', action='store_true')
    al.add_argument('--refetch', action='store_true')
    al.add_argument('--min-age', default='3')
    li = sub.add_parser('list')
    li.add_argument('--fetched', action='store_true')
    li.add_argument('--unfetched', action='store_true')
    oc = sub.add_parser('ocr')
    oc.add_argument('--limit', type=int, default=0)
    sub.add_parser('reclassify')
    sub.add_parser('status')
    sub.add_parser('register')
    a = ap.parse_args()
    reg = c.read_register()
    state = c.load_state()
    if a.cmd == 'all':
        cmd_sweep(a, reg, state)
        cmd_fetch(a, reg, state)
        cmd_minutes(a, reg, state)
        cmd_status(a, reg, state)
    else:
        {'sweep': cmd_sweep, 'fetch': cmd_fetch, 'status': cmd_status, 'list': cmd_list,
         'register': cmd_register, 'ocr': cmd_ocr, 'minutes': cmd_minutes, 'reclassify': cmd_reclassify}[a.cmd](a, reg, state)


if __name__ == '__main__':
    main()
