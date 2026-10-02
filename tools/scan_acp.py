#!/usr/bin/env python3
"""Sweep old-style Planning Inspectorate ACP case pages (7-digit 33xxxxx refs) and record decisions.

Usage: python3 tools/scan_acp.py LO HI OUT.jsonl [THREADS] [DELAY_S]
  - Fetches https://acp.planninginspectorate.gov.uk/ViewCase.aspx?caseid=N for N in [LO, HI).
  - Appends one JSON line per existing case to OUT.jsonl (fields as shown on the page + fileids).
  - Appends every case decided on/after 2026-08-17 to harvest-log/acp-decided-index.tsv.
  - Polite: per-thread delay, backoff 60 s on 429/5xx. Resumable: skips refs already in OUT.jsonl.
New-style 600xxxx refs are NOT on ACP (use the comment-planning-appeal service / pins-corpus).
"""
import concurrent.futures as cf, html, json, os, re, sys, time, urllib.request, urllib.error
from datetime import datetime, date

BASE = "https://acp.planninginspectorate.gov.uk/ViewCase.aspx?caseid="
DOC = "https://acp.planninginspectorate.gov.uk/ViewDocument.aspx?fileid="
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from paths import DECISIONS  # noqa: E402
TSV = os.path.join(DECISIONS, "harvest-log", "acp-decided-index.tsv")
KEYS = ["Reference:", "Appellant/Applicant", "Agent", "Site Address", "Case Details", "Case Type", "Start Date",
        "Local Planning Authority", "Questionnaire due", "Statement(s) due", "Case Officer", "Interested Party",
        "Procedure", "Appellant/LPA", "Status", "Inquiry Evidence", "Decision and Outcome", "Event Date",
        "Case Link Status", "Decision Date", "Linked Cases"]


def fetch(n, delay):
    for attempt in range(6):
        time.sleep(delay)
        try:
            req = urllib.request.Request(BASE + str(n), headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return n, r.read().decode("utf8", "ignore")
        except urllib.error.HTTPError as e:
            time.sleep(60 if e.code == 429 or e.code >= 500 else 5)
        except Exception:
            time.sleep(5)
    return n, "ERROR"


def parse(n, t):
    if t == "ERROR":
        return {"ref": n, "status": "ERROR"}
    if "No case found" in t:
        return None
    files = re.findall(r"ViewDocument\.aspx\?fileid=(\d+)", t)
    t2 = re.sub(r"<script.*?</script>", "", t, flags=re.S)
    txt = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t2)))
    i = txt.find("Reference: APP")
    if i < 0:
        return {"ref": n, "status": "unparsed"}
    txt = txt[i:i + 2500]
    rec = {"ref": n, "fileids": sorted(set(files), key=files.index)}
    parts = re.split("(" + "|".join(re.escape(k) for k in KEYS) + ")", txt)
    for j in range(1, len(parts) - 1, 2):
        rec[parts[j].rstrip(":")] = parts[j + 1].strip()[:300]
    return rec


def tsv_row(r):
    try:
        d = datetime.strptime(r.get("Decision Date", "")[:11], "%d %b %Y").date()
    except ValueError:
        return None
    if d < date(2026, 8, 17):
        return None
    out = r.get("Decision and Outcome", "").split(" ")[0] if r.get("Decision and Outcome") else ""
    pdf = DOC + r["fileids"][0] if r.get("fileids") else ""
    cols = [str(r["ref"]), str(d), r.get("Decision and Outcome", "")[:40], r.get("Case Type", ""), r.get("Procedure", ""),
            r.get("Site Address", ""), r.get("Local Planning Authority", ""), r.get("Reference", ""), pdf]
    return "\t".join(c.replace("\t", " ") for c in cols)


def main():
    lo, hi, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
    threads = int(sys.argv[4]) if len(sys.argv) > 4 else 6
    delay = float(sys.argv[5]) if len(sys.argv) > 5 else 0.3
    done = set()
    if os.path.exists(out):
        done = {json.loads(l)["ref"] for l in open(out) if '"ERROR"' not in l}
    if not os.path.exists(TSV):
        open(TSV, "w").write("ref\tdecision_date\toutcome\tcase_type\tprocedure\tsite\tlpa\tappeal_ref\tdecision_pdf\n")
    todo = [n for n in range(hi - 1, lo - 1, -1) if n not in done]  # newest first
    with open(out, "a") as fo, cf.ThreadPoolExecutor(threads) as ex:
        for n, t in ex.map(lambda n: fetch(n, delay), todo):
            r = parse(n, t)
            if not r:
                continue
            fo.write(json.dumps(r) + "\n"); fo.flush()
            row = tsv_row(r)
            if row:
                with open(TSV, "a") as ft:
                    ft.write(row + "\n")


if __name__ == "__main__":
    main()
