# Analyst brief (shared by analysis agents)

Repo root: the planningdistilled/research checkout. Work in data/decisions/.
Read first: README.md (schema), nppf-2026-policy-codes.md.

Inputs (~790 case files, all decisions 17 Aug–23 Sep 2026 under the August 2026 NPPF):
- cases/*.md — the distilled decisions. index/cases.json has every frontmatter (easy to load with python/jq).
- index/policy-index.md (policy → cases with findings), index/stats.md (outcome rates by finding), index/tag-index.md.
- harvest-log/*.md — each harvester's OBSERVED PATTERNS section (hypotheses to TEST, not facts to copy).
- Full decision-letter text for PINS appeals: data/open-sources/pins-corpus/<ref>.txt — use it to verify
  quotes and to check claimed patterns against the primary text (grep across the corpus is powerful here).

Caveats: tier-2 cases (tag tier-2) are thinly coded; some tier-2 codes are the harvester's nearest-fit mapping, not the
inspector's. pins-corpus-index.tsv's code column is unreliable (picks up local plan numbers). Weight: SoS > inquiry/hearing
appeal > written-reps appeal > committee > delegated. Council decisions show practice, appeals show the law being applied.

Your output (one file, analysis/<topic>.md), structured as:
1. **Headline propositions** — numbered, each a quotable rule-of-thumb about how the 2026 Framework is being applied,
   with: supporting case ids (strongest first, with DL ¶ refs and a short verbatim quote for the best one), counts
   (n supporting / n contrary), and COUNTER-EXAMPLES. State confidence (strong / emerging / single-case).
2. **Fact thresholds** — tables of the concrete facts that tip each test (distances, footways, lighting, speed, bus
   frequency, supply years, scale, harm grade, weight words...), pass vs fail columns, with case ids.
3. **Test sequences as actually applied** — the step order decision-makers use for your policies (a short decision graph),
   noting where decision-makers diverge or err.
4. **Reference-case shortlist** — the 10–20 best cases to cite for your topic, one line each on why, appeals first.
5. **Distillation notes** — for a future agent reading a NEW decision on your topic: which facts, findings and quotes must be
   captured, which fields/tags to use, common traps (miscoded policies, old wording, transitional letters). Also propose any
   schema/tag improvements (don't apply them — list them).
6. **Gaps and open questions** — what the dataset can't yet answer; what a future harvest should target.

Rules: verify before asserting — every proposition must be traceable to case files you actually opened (read at least the
cases you cite). Don't edit cases/ except to fix clear errors you find (log each fix at the end of your file under
"Corrections made"). Don't git commit. Keep the file tight: dense tables and bullets, no filler. Final reply: 5–8 headline
findings + the path of your file.
