"""Shared pieces for the council adapters: an HTTP client over /usr/bin/curl, text extraction, paths, item shape."""
import datetime as dt
import html
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
from paths import DECISIONS, SOURCES  # noqa: E402

LOG = os.path.join(DECISIONS, 'harvest-log')
REGISTER = os.path.join(LOG, 'council-register.tsv')
STATE = os.path.join(LOG, 'council-state.json')
ITEMS_DIR = os.path.join(LOG, 'council')              # one <slug>.jsonl per council: every item ever swept
OUT_ROOT = os.path.join(SOURCES, 'council', 'sweep')  # private: <slug>/<ref-slug>/<files>
FRAMEWORK_DATE = dt.date(2026, 8, 17)
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
CURL = '/usr/bin/curl'
BLOCK_RE = re.compile(r'Just a moment|Access is denied|cf-browser-verification|Attention Required!|Cloudflare|'
                      r'Request unsuccessful\. Incapsula|Pardon Our Interruption', re.I)

# Item fields (a dict; adapters may add portal-specific keys under 'extra'):
#   council  slug from the register
#   kind     'application' | 'meeting'
#   ref      application reference, or 'meeting-<date>' for a committee meeting
#   date     ISO date: decision issued (application) or meeting date (meeting)
#   outcome  decision text as the portal gives it ('' if unknown)
#   level    'delegated' | 'committee' | '' (unknown)
#   address  site address or meeting title
#   proposal description of development ('' for meetings)
#   url      the page the item was found on (application detail page or meeting documents page)
#   extra    dict of anything the adapter needs again at fetch time (keyVal, document links, CId/MId)
ITEM_KEYS = ('council', 'kind', 'ref', 'date', 'outcome', 'level', 'address', 'proposal', 'url', 'extra')


class Blocked(Exception):
    """The portal returned a bot-wall / access-denied page; stop hitting it."""


class Http:
    """Thin client over /usr/bin/curl with a cookie jar, a UA, a per-request delay and retries."""

    def __init__(self, jar, delay=1.0, timeout=90, verbose=False):
        self.jar, self.delay, self.timeout, self.verbose = jar, float(delay), int(timeout), verbose
        self.calls = 0
        os.makedirs(os.path.dirname(jar) or '.', exist_ok=True)

    def _run(self, url, out=None, data=None, headers=(), method=None, follow=True, tries=4):
        cmd = [CURL, '-sS', '-m', str(self.timeout), '-A', UA, '-c', self.jar, '-b', self.jar,
               '-w', '\n%{http_code} %{content_type}']
        if follow:
            cmd.append('-L')
        if method:
            cmd += ['-X', method]
        for h in headers:
            cmd += ['-H', h]
        if data is not None:
            for k, v in data:
                cmd += ['--data-urlencode', f'{k}={v}']
        if out:
            cmd += ['-o', out]
        # Portals link to file names with spaces and other raw characters; curl rejects those. Encode once here.
        cmd.append(urllib.parse.quote(url, safe=":/?&=%#+,;@!$'()*[]~"))
        for attempt in range(tries):
            time.sleep(self.delay)
            self.calls += 1
            if self.verbose:
                print(f'    curl {method or "GET"} {url}', file=sys.stderr)
            p = subprocess.run(cmd, capture_output=True)
            raw = p.stdout
            nl = raw.rfind(b'\n')
            trailer = raw[nl + 1:].decode('ascii', 'ignore').split(' ', 1) if nl >= 0 else ['000', '']
            body = raw[:nl] if nl >= 0 else b''
            code = int(trailer[0] or 0)
            ctype = trailer[1] if len(trailer) > 1 else ''
            if p.returncode == 0 and code and code < 500 and code != 429:
                return code, ctype, body
            if attempt < tries - 1:
                time.sleep(60 if code == 429 else 10 * (attempt + 1))
        raise RuntimeError(f'curl failed for {url}: rc={p.returncode} http={code} {p.stderr.decode("utf8", "ignore")[:200]}')

    def get(self, url, headers=(), follow=True):
        """-> (status, text). Raises Blocked on a bot wall."""
        code, ctype, body = self._run(url, headers=headers, follow=follow)
        text = body.decode('utf8', 'replace')
        if code in (403, 503) and BLOCK_RE.search(text):
            raise Blocked(url)
        return code, text

    def post(self, url, data, headers=(), follow=True):
        """data: list of (field, value). -> (status, text)."""
        code, ctype, body = self._run(url, data=data, headers=headers, follow=follow)
        text = body.decode('utf8', 'replace')
        if code in (403, 503) and BLOCK_RE.search(text):
            raise Blocked(url)
        return code, text

    def post_json(self, url, headers=(), follow=True):
        """An empty POST (`--data ""`), as some APIs want. -> (status, text)."""
        # curl sends no Content-Length with -X POST and no body; some APIs answer 411 without it.
        code, ctype, body = self._run(url, data=[], headers=('Content-Length: 0',) + tuple(headers),
                                      follow=follow, method='POST')
        return code, body.decode('utf8', 'replace')

    def download(self, url, path, headers=()):
        """Save a document; returns (status, content_type, size). Refuses to overwrite an existing file."""
        if os.path.exists(path) and os.path.getsize(path) > 0:
            return 200, 'cached', os.path.getsize(path)
        tmp = path + '.part'
        code, ctype, _ = self._run(url, out=tmp, headers=headers)
        size = os.path.getsize(tmp) if os.path.exists(tmp) else 0
        if code == 200 and size > 0:
            with open(tmp, 'rb') as f:
                head = f.read(2048)
            if b'<html' in head.lower() and BLOCK_RE.search(head.decode('utf8', 'ignore')):
                os.remove(tmp)
                raise Blocked(url)
            os.replace(tmp, path)
        elif os.path.exists(tmp):
            os.remove(tmp)
        return code, ctype, size


# ---------- text helpers ----------

def strip_tags(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).replace('\xa0', ' ').strip()


def slug(s):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', (s or '').lower())).strip('-')


def ref_slug(ref):
    return re.sub(r'[^A-Za-z0-9.]+', '-', ref).strip('-')


def safe_name(name, limit=120):
    name = urllib.parse.unquote(name or '')
    name = re.sub(r'[^A-Za-z0-9._()&+, -]+', '_', name).strip(' ._')
    return name[:limit] or 'document'


def uk_date(s):
    """'17/10/2026' or '2026-10-17' or '17 October 2026' -> ISO, else ''."""
    if not s:
        return ''
    s = s.strip()
    m = re.match(r'(\d{1,2})/(\d{1,2})/(\d{4})', s)
    if m:
        return f'{m[3]}-{int(m[2]):02d}-{int(m[1]):02d}'
    m = re.match(r'(\d{4})-(\d{2})-(\d{2})', s)
    if m:
        return m[0]
    for fmt in ('%d %B %Y', '%d %b %Y', '%A, %d %B %Y', '%A %d %B %Y', '%d %B, %Y'):
        try:
            return dt.datetime.strptime(re.sub(r'(\d)(st|nd|rd|th)\b', r'\1', s), fmt).date().isoformat()
        except ValueError:
            pass
    return ''


def is_pdf(path):
    try:
        with open(path, 'rb') as f:
            return f.read(5) == b'%PDF-'
    except OSError:
        return False


def pdf_to_text(pdf, txt=None):
    """pdftotext -layout; form feeds mark page breaks (page n = PDF page n). Returns the .txt path or ''."""
    txt = txt or re.sub(r'\.pdf$', '', pdf, flags=re.I) + '.txt'
    if os.path.exists(txt) and os.path.getsize(txt) > 0:
        return txt
    p = subprocess.run(['pdftotext', '-layout', pdf, txt], capture_output=True)
    if p.returncode != 0 or not os.path.exists(txt):
        return ''
    if os.path.getsize(txt) < 200:   # scanned: leave a marker so status can report it
        with open(txt + '.needs-ocr', 'w') as f:
            f.write('run: uv run tools/ocr_pdf.py ' + pdf + '\n')
    return txt


# ---------- register and state ----------

def read_register():
    """Rows of council-register.tsv as dicts (comment lines starting with # skipped)."""
    rows = []
    with open(REGISTER, encoding='utf8') as f:
        header = None
        for line in f:
            if not line.strip() or line.startswith('#'):
                continue
            cells = line.rstrip('\n').split('\t')
            if header is None:
                header = cells
                continue
            rows.append(dict(zip(header, cells + [''] * (len(header) - len(cells)))))
    return rows


def load_state():
    if os.path.exists(STATE):
        with open(STATE) as f:
            return json.load(f)
    return {'schema': 1, 'frameworkDate': FRAMEWORK_DATE.isoformat(), 'councils': {}}


def save_state(s, slugs=None):
    """Write the state. With `slugs`, re-read the file first and replace only those councils' entries, so two
    sweeps running at once (different councils) do not overwrite each other's watermarks."""
    if slugs:
        fresh = load_state()
        for slug_ in slugs:
            if slug_ in s['councils']:
                fresh['councils'][slug_] = s['councils'][slug_]
        s = fresh
    tmp = STATE + '.tmp'
    with open(tmp, 'w') as o:
        json.dump(s, o, indent=2, sort_keys=True)
        o.write('\n')
    os.replace(tmp, STATE)


def items_path(council_slug):
    return os.path.join(ITEMS_DIR, council_slug + '.jsonl')


def load_items(council_slug):
    """-> {ref: item}; later lines win."""
    out = {}
    p = items_path(council_slug)
    if os.path.exists(p):
        with open(p, encoding='utf8') as f:
            for line in f:
                if line.strip():
                    it = json.loads(line)
                    out[it['ref']] = it
    return out


def save_items(council_slug, items):
    os.makedirs(ITEMS_DIR, exist_ok=True)
    p = items_path(council_slug)
    tmp = p + '.tmp'
    with open(tmp, 'w', encoding='utf8') as o:
        for ref in sorted(items, key=lambda r: (items[r].get('date') or '', r)):
            o.write(json.dumps(items[ref], ensure_ascii=False, sort_keys=True) + '\n')
    os.replace(tmp, p)


def item(council, kind, ref, date, **kw):
    it = {'council': council, 'kind': kind, 'ref': ref, 'date': date, 'outcome': '', 'level': '',
          'address': '', 'proposal': '', 'url': '', 'extra': {}}
    it.update(kw)
    return it


def outdir_for(council_slug, it):
    return os.path.join(OUT_ROOT, council_slug, ref_slug(it['ref']))


def now():
    return dt.datetime.now().astimezone().isoformat(timespec='seconds')
