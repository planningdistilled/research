#!/usr/bin/env python3
"""Build the NPPF 2026 decisions index from cases/*.md frontmatter.

Run: uv run tools/build_index.py
Writes index/cases.json, index/cases-table.md, index/policy-index.md,
index/tag-index.md, index/dev-plan-index.md and prints validation warnings.
"""
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from paths import DECISIONS  # noqa: E402

ROOT = Path(DECISIONS)
CASES = ROOT / "cases"
OUT = ROOT / "index"

REQUIRED = ["case_id", "title", "authority", "decision_maker", "decision_date",
            "outcome", "development", "determinative_policies", "policy_findings",
            "key_facts", "sources", "verification"]
NPPF_START = date(2026, 8, 17)

# Rank for sorting: appeals / SoS first.
AUTH_RANK = {"secretary-of-state": 0, "inspector": 1, "lpa-committee": 2, "lpa-delegated": 3}
CODE_RE = re.compile(r"^(Annex[A-Z]|Transitional|fn\d+|[A-Z]{1,2}\d{1,2})")


def load_cases():
    cases, warnings = [], []
    for p in sorted(CASES.glob("*.md")):
        text = p.read_text()
        m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
        if not m:
            warnings.append(f"{p.name}: no frontmatter")
            continue
        try:
            fm = yaml.safe_load(m.group(1)) or {}
        except yaml.YAMLError as e:
            warnings.append(f"{p.name}: YAML error: {e}")
            continue
        fm["_file"] = f"cases/{p.name}"
        for k in REQUIRED:
            if fm.get(k) in (None, "", []):
                warnings.append(f"{p.name}: missing {k}")
        d = fm.get("decision_date")
        if isinstance(d, str):
            try:
                d = date.fromisoformat(d)
            except ValueError:
                warnings.append(f"{p.name}: bad decision_date {d!r}")
                d = None
        fm["decision_date"] = d
        if d and d < NPPF_START:
            warnings.append(f"{p.name}: decision_date {d} is before 17 Aug 2026")
        if fm.get("case_id") and fm["case_id"] != p.stem:
            warnings.append(f"{p.name}: case_id {fm['case_id']} != filename")
        cases.append(fm)
    return cases, warnings


def dupes(cases):
    w = []
    for key in ("appeal_ref", "lpa_ref"):
        seen = defaultdict(list)
        for c in cases:
            v = c.get(key)
            if v:
                seen[(c.get("authority"), str(v).strip().upper())].append(c["_file"])
        w += [f"possible duplicate {key} {k[1]}: {v}" for k, v in seen.items() if len(v) > 1]
    return w


def sort_key(c):
    return (AUTH_RANK.get(c.get("decision_maker"), 9), -(c["decision_date"] or date.min).toordinal())


def link(c):
    return f"[{c.get('title') or c['case_id']}](../{c['_file']})"


def as_list(v):
    if v is None:
        return []
    return v if isinstance(v, list) else [v]


def base_code(policy):
    m = CODE_RE.match(str(policy).strip())
    return m.group(1) if m else "other"


def weight_label(c):
    return {"secretary-of-state": "SoS", "inspector": "Appeal",
            "lpa-committee": "Committee", "lpa-delegated": "Delegated"}.get(c.get("decision_maker"), "?")


def write_table(cases):
    lines = ["# NPPF 2026 decisions — case table", "",
             f"Generated {date.today()} from `cases/`. {len(cases)} decisions. Appeals and SoS first, newest first.", "",
             "| Case | Authority | Date | Maker | Outcome | Type | Units | Determinative NPPF policies | Verif. |",
             "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    for c in sorted(cases, key=sort_key):
        lines.append("| {} | {} | {} | {} | **{}** | {} | {} | {} | {} |".format(
            link(c), c.get("authority", ""), c["decision_date"] or "", weight_label(c),
            c.get("outcome", ""), ", ".join(as_list(c.get("dev_type"))), c.get("units") or "",
            ", ".join(map(str, as_list(c.get("determinative_policies")))), c.get("verification", "")))
    (OUT / "cases-table.md").write_text("\n".join(lines) + "\n")


def write_policy_index(cases):
    by_base = defaultdict(lambda: defaultdict(list))  # base -> full code -> [(case, finding)]
    for c in cases:
        det = {str(p).replace(" ", "") for p in as_list(c.get("determinative_policies"))}
        seen = set()
        for f in as_list(c.get("policy_findings")):
            if not isinstance(f, dict) or not f.get("policy"):
                continue
            code = str(f["policy"]).replace(" ", "")
            by_base[base_code(code)][code].append((c, f, code in det))
            seen.add(code)
        for code in det - seen:
            by_base[base_code(code)][code].append((c, {"finding": "determinative"}, True))

    lines = ["# NPPF 2026 policy → cases index", "",
             f"Generated {date.today()}. Each NPPF policy with every decision that made a finding on it. "
             "★ = determinative of the outcome. Appeals/SoS listed first.", "",
             "Jump to: " + " · ".join(f"[{b}](#{b.lower()})" for b in sorted(by_base) if b.startswith(("S", "GB", "TR", "HE", "N", "HO", "DM", "F", "DP", "L", "W", "E", "Annex", "Trans")))]
    for base in sorted(by_base):
        if not base[0].isupper():
            continue
        lines += ["", f"## {base}"]
        codes = by_base[base]
        for code in sorted(codes):
            rows = sorted(codes[code], key=lambda r: sort_key(r[0]))
            tally = Counter(str(r[1].get("finding")) for r in rows)
            lines += ["", f"### {code}  ({', '.join(f'{k} {v}' for k, v in tally.most_common())})", "",
                      "| Case | Maker | Outcome | Finding | Weight | Note |", "| --- | --- | --- | --- | --- | --- |"]
            for c, f, det in rows:
                lines.append("| {}{} | {} | {} | {} | {} | {} |".format(
                    "★ " if det else "", link(c), weight_label(c), c.get("outcome", ""),
                    f.get("finding", ""), f.get("weight") or "", str(f.get("note") or "").replace("|", "/")))
    (OUT / "policy-index.md").write_text("\n".join(lines) + "\n")


def write_simple_index(cases, fields, fname, title):
    lines = [f"# {title}", "", f"Generated {date.today()}."]
    for field in fields:
        groups = defaultdict(list)
        for c in cases:
            for v in as_list(c.get(field)):
                groups[str(v)].append(c)
        lines += ["", f"## {field}"]
        for k in sorted(groups, key=lambda k: (-len(groups[k]), k)):
            items = sorted(groups[k], key=sort_key)
            lines.append(f"- **{k}** ({len(items)}): " + "; ".join(
                f"{link(c)} ({weight_label(c)}, {c.get('outcome')})" for c in items))
    (OUT / fname).write_text("\n".join(lines) + "\n")


def write_devplan_index(cases):
    groups = defaultdict(list)
    for c in cases:
        for f in as_list(c.get("policy_findings")):
            if isinstance(f, dict) and f.get("policy") and base_code(f["policy"]) == "other":
                groups[(c.get("authority"), str(f["policy"]))].append((c, f))
        for p in as_list(c.get("development_plan")):
            groups[(c.get("authority"), str(p))].append((c, None))
    lines = ["# Development plan policies → cases", "", f"Generated {date.today()}. Grouped by authority."]
    for auth in sorted({a for a, _ in groups}, key=str):
        lines += ["", f"## {auth}"]
        for (a, pol), rows in sorted(groups.items(), key=lambda kv: kv[0][1]):
            if a != auth:
                continue
            uniq = {}
            for c, f in rows:
                if f or c["case_id"] not in uniq:
                    uniq[c["case_id"]] = (c, f)
            lines.append(f"- **{pol}**: " + "; ".join(
                f"{link(c)} ({c.get('outcome')}{', ' + f.get('finding') if f and f.get('finding') else ''})"
                for c, f in uniq.values()))
    (OUT / "dev-plan-index.md").write_text("\n".join(lines) + "\n")


def win(c):
    """True if the development was permitted (appeal allowed / application approved)."""
    return c.get("outcome") in ("allowed", "approved", "part-allowed", "split")


def rate_row(label, items):
    n = len(items)
    w = sum(win(c) for c in items)
    return f"| {label} | {n} | {w} | {100 * w // n if n else 0}% |"


def write_stats(cases):
    hdr = ["| Group | Cases | Permitted | Rate |", "| --- | --- | --- | --- |"]
    lines = ["# NPPF 2026 decisions — outcome statistics", "",
             f"Generated {date.today()}. 'Permitted' = allowed / approved / part-allowed / split. "
             "Rates for small groups are anecdotes, not statistics. Tier-2 cases carry thinner coding.", ""]

    def section(title, keyf):
        groups = defaultdict(list)
        for c in cases:
            for k in keyf(c):
                groups[str(k)].append(c)
        lines.extend(["", f"## {title}", ""] + hdr)
        for k in sorted(groups, key=lambda k: -len(groups[k])):
            lines.append(rate_row(k, groups[k]))

    section("By decision maker", lambda c: [c.get("decision_maker")])
    section("By dev_type", lambda c: as_list(c.get("dev_type")))
    section("By site_context", lambda c: as_list(c.get("site_context")))
    section("By grey_belt", lambda c: [c.get("grey_belt")] if c.get("green_belt") else [])
    section("By NPPF applied", lambda c: [c.get("nppf_applied")])

    # Policy finding -> outcome: how often does a finding on a policy go with a win?
    pf = defaultdict(list)
    for c in cases:
        for f in as_list(c.get("policy_findings")):
            if isinstance(f, dict) and f.get("policy") and base_code(f["policy"]) != "other":
                code = str(f["policy"]).replace(" ", "")
                pf[(code, str(f.get("finding")))].append(c)
    lines += ["", "## Policy finding → outcome (codes with 5+ findings)", "",
              "| Policy | Finding | Cases | Permitted | Rate |", "| --- | --- | --- | --- | --- |"]
    totals = Counter()
    for (code, _), cs in pf.items():
        totals[code] += len(cs)
    for (code, finding) in sorted(pf, key=lambda k: (k[0], -len(pf[k]))):
        if totals[code] < 5:
            continue
        cs = pf[(code, finding)]
        w = sum(win(c) for c in cs)
        lines.append(f"| {code} | {finding} | {len(cs)} | {w} | {100 * w // len(cs)}% |")
    (OUT / "stats.md").write_text("\n".join(lines) + "\n")


def main():
    OUT.mkdir(exist_ok=True)
    cases, warnings = load_cases()
    warnings += dupes(cases)
    (OUT / "cases.json").write_text(json.dumps(
        [{k: v for k, v in c.items()} for c in sorted(cases, key=sort_key)], default=str, indent=1))
    write_table(cases)
    write_policy_index(cases)
    write_simple_index(cases, ["dev_type", "site_context", "tags", "main_issues", "outcome", "authority"],
                       "tag-index.md", "Cases by type, context, tag and issue")
    write_devplan_index(cases)
    write_stats(cases)
    print(f"{len(cases)} cases indexed -> {OUT}")
    for w in warnings:
        print("WARN", w, file=sys.stderr)


if __name__ == "__main__":
    main()
