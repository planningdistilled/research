# Distillation guide: turning a new decision into a case file

This is the operating manual for an agent handed one planning decision and asked to add it to `cases/`. The decision may be a PINS appeal letter, a SoS letter, a committee report plus minutes, a delegated report, a decision notice or a court judgment.
- The schema and vocabularies are in `README.md`, and the codes in `nppf-2026-policy-codes.md`.
- The Framework text is in `data/open-sources/nppf/NPPF-August-2026.pdf`; extract it with `pdftotext -layout`.
- Four topic analyses, written from about 790 cases decided 17 Aug–23 Sep 2026, supply the fact thresholds used here. They are `analysis/green-belt.md`, `analysis/principle-and-balance.md`, `analysis/heritage-design-environment.md` and `analysis/transition-and-decision-makers.md`.

**Quick path (one case, about 20 minutes):**
1. Check scope (§1).
2. Grep `cases/` for duplicates.
3. Read the document in the order given in §2.
4. Map the reasoning onto the graphs in §3.
5. Extract the facts on the checklists in §4.
6. Code the case (§5) and check it against the traps (§6).
7. Write the body using the README template.
8. Rebuild the index and fix any WARN lines (§8).

---

## 1. Triage

| Question | Rule |
| --- | --- |
| **In scope?** | Decision date is **on or after 17 Aug 2026**. The date is the decision date, not the date of the hearing, site visit or committee resolution. For council cases it is the notice date. If only a resolution exists (s106 pending), record it with the resolution date and say so in `key_facts`. The index builder WARNs on earlier dates. |
| **Which Framework?** | Find the switch paragraph, usually under "Preliminary/Procedural matters", ¶2–5. Then set `nppf_applied` (see below) and a tag. |
| **Tier 1 or tier 2?** (PINS letters) | **Tier 1** if the letter reasons through any of these: S3–S6, GB6–GB8, HO10–HO12, a policy-led balance, HE4–HE7, DP3(3) or S4(2)/S5(2) triggers, TR3/TR6, F4–F9, N4/N6, L2/L3, or says anything about the switch. **Tier 2** covers routine amenity, character and design appeals, most householders and adverts: 1–3 findings and a short body. Tag it `tier-2`. |
| **Unusable?** | Withdrawn, invalid, procedural only, or text missing: log it in your harvest log. Never drop a letter silently. |
| **Duplicate?** | `grep -ril "<appeal ref>\|<LPA ref>\|<site name>" cases/`. If a file exists, **enrich** it. An appeal and the refusal it tested are **two** files, cross-linked through `related:`. |

**`nppf_applied` values:**
- `2026-08` when the 2026 text is operative.
- `"2024-12 (transitional)"` when 2024 paragraphs or tests are operative, **even if the letter never says so**.
- `not-cited` when no Framework is named.

**Switch tags:**
- `parties-consulted-on-2026-framework`: comments were invited.
- `transitional-no-consultation`: the 2026 Framework was applied without consultation, usually under a "no material change" formula. The name is legacy; it does **not** mean the 2024 text was applied.
- `transitional`: the 2024 text was operative.
- `old-framework-applied-silently`: the 2024 text was applied after 17 Aug with no acknowledgement.

**Weight of authority, highest first:**
1. Court (on law).
2. Secretary of State.
3. Inspector after an inquiry.
4. Inspector after a hearing.
5. Inspector on written representations.
6. Appeal planning officer recommendation (tag `appeal-planning-officer`).
7. Council committee.
8. Delegated decision.

At 23 Sep 2026 there is **no SoS or court decision on the 2026 Framework**. The two SoS DCO letters (SOS-EN010151, SOS-EN020032) kept the 2024 text. The field `weight_of_authority` is only `high | medium | low`, and every appeal is `high`, so rank appeals by `procedure`.

**Case id** (README): `PINS-<7-digit>` for new-style refs, `APP-<LPA>-<type>-<yy>-<n>` for old-style ACP refs, `<lpa-slug>-<ref>` for councils, `SOS-…` and `CROWN-…` for the others.

---

## 2. Reading order by document type

**PINS appeal letter (new-style 600xxxx or ACP 3xxxxxx):**
1. **Header block**: decision date, procedure (hearing or inquiry dates), inspector, LPA and application ref, description of development. Check whether this is a non-determination appeal.
2. **¶1 Decision**: the outcome, and whether it is split or part-allowed.
3. **Preliminary matters, ¶2–6**: the switch paragraph, any amended description, fallback or PIP stage, conceded reasons, and emerging-plan weight.
4. **Main issues paragraph.** This sets the structure of the case file.
5. **Reasoning, issue by issue.** The decisive sentences are usually the last paragraph of each issue section ("I conclude that…"). Quote those.
6. **Other matters.** Supply figures, HDT, S6, BNG and HRA often sit here, *not* in the main issues. Housing-supply numbers are often in the planning balance instead.
7. **Planning balance / Conclusion.** Find which balance was run and the weight word for each item. Check the operative formula: "substantially outweighed", "clearly outweighed" (VSC), or the old "significantly and demonstrably".
8. **Conditions and costs.** A costs decision is a separate PDF with the same ref. Record it in the parent file's `key_facts` and tags (`costs-application`, `costs-award`, `costs-refused`), citing "costs DL ¶n". Do not open a new case file for costs.

**Secretary of State letter.** Read the SoS decision letter (DL) first; it has its own numbering. Then read the inspector's report (IR) only where the SoS disagrees, which the DL flags ("the SoS disagrees with the Inspector at IR x"). Record both DL ¶ and IR ¶. The SoS's weight words govern.

**Committee report plus minutes:**
1. Recommendation and conditions at the front or end.
2. The "Planning policy" or "NPPF" section: how the switch was handled and the Transitional(2) paragraph.
3. Principle, whether S4/S5 or GB6/GB7.
4. Each technical issue.
5. The "Planning balance" section.
6. **Update or late-items sheet.** It is often annexed to the printed minutes, and often changes weights. Stratford raised HO7 from "significant" to "substantial" there.
7. **Printed minutes** for the outcome, the vote and members' reasons. Minutes are the only reliable source for the outcome.
8. Then the notice, for the date and the refusal reasons as issued.

**Overturned recommendations:**
- Quote the members' reasons verbatim from the minutes or notice. Set `outcome` to what was decided and tag `overturned-officer-rec`, recording the officer recommendation in `key_facts`.
- Tag `officer-rec-followed` if the recommendation was followed. Use `split-vote` when the vote was close.
- Code the members' findings in `policy_findings`, and the officer's contrary finding as a second row with `note: officer view`.

**Delegated report.** Read the assessment, then the balance, then the notice. SDC delegated reports are usually scanned images; OCR them (§7). Bromsgrove notices contain the full report.

**Decision notice only.** Code the refusal reasons as `fail` or `conflict` findings and set `verification: notice-read`. Do not infer reasoning the notice does not contain.

**Court judgment:**
- Record the ground(s), which Framework policy was construed, the construction adopted (quote it), and the relief.
- Case id: `COURT-<neutral citation>`, e.g. `COURT-2026-EWHC-1234-Admin`. This is a new prefix; add it to the README.
- Put the challenged decision's case id in `related:`, and enrich that file with a `key_facts` line: "quashed / upheld by …".

---

## 3. Decision graphs: map every finding onto a node

### 3a. Principle (non-Green Belt)
```
S3(1): Green Belt or LGS? → yes: go to 3b (S5(5)); S4/S5(1)(j) NOT available (6008528 ¶8)
       S3(2): split site → S4 for the inside part, S5 for the rest (maldon-26-00066-OUTM)
Settlement? Annex B "settlement": plan-defined OR built-up on the ground ("includes" is
   non-exhaustive, 6008314 ¶102); washed-over GB villages and hamlets are EXCLUDED
 ├ inside → S4(1) "approve unless substantially outweighed"
 │     S4(2) triggers: (a)(i) allocation or safeguarding loss │ (a)(ii) HC7, HC8, N6, N4, L2(1)(d)
 │                     (b) cemetery / flood storage │ (c) any "should be refused" policy
 └ outside → S5(3): isolated home (outside settlement AND group)? → only via HO11(1)(a)–(e)
             S5(1) category?  a land uses │ b rural business "shown to be necessary"
                c reuse/extension/replacement (fn25: baseline = building at 17 Aug 2026; same use)
                d whole-site PDL (rural gardens count) │ e limited infill WITHIN a group of houses
                f HO10 / CRtBO / NDO │ g traveller need + HO12 │ h well-connected station ≤800 m
                i allocation │ j evidenced unmet need + (i) physically well-related + scale/infrastructure
             ├ category met → S5(2) trigger check → balance "substantially outweighed"
             └ none met → S5(4): approve only if the benefits SUBSTANTIALLY OUTWEIGH the harm,
                          including countryside character and movement (37 fails / 3 passes at appeal)
Overlays: S6 (housing): NP made ≤5 yrs before the decision date AND has allocations → conflict
          "likely" decisive. Paperwork gate: HRA/N6 obligation, BNG metric or exemption,
          self-build UU, third-party splay land
Plan weight: Annex A ¶2 (code Transitional(2)): only the clause that bars what S5/GB7 now allow
          gets very limited weight
Final step: s38(6), plan-led, where the letter frames it that way
```
**"Should be refused" triggers seen:**
- DP3(3), TR6(4), F5, F6, F7, F9, N6/Habitats, L3(4), HE6(5), TC3, S4(2)(a)(i) and (a)(ii).
- F5 ("should not be located") and F9 ("should not take place") are contested as triggers.
- HE6(4) harm is **not** a trigger, but it decides the balance anyway.

### 3b. Green Belt
```
GB6: inappropriate unless a GB7 category applies. Categories are ALTERNATIVES: one pass is enough
GB7(1) (a) agriculture │ (b) reuse/extension/replacement vs ORIGINAL building (fn40: 1 Jul 1948)
       (c) limited infill in villages │ (d) limited affordable │ (e) PDL, not substantial openness harm
       (f)(i)–(iv) listed forms, openness minimised │ (h) station: Annex B well-connected (≥4 tph daytime
           or ≥2 tph one way) AND ~800 m; only the part of the site within 800 m qualifies
       (g) ALL four:  (i) grey belt [Annex B: no strong contribution to (a), (b), (d); villages are never
                          large built-up areas (Annex E ¶3); (b) is towns only; judge site not parcel;
                          purpose (c) irrelevant] + "not fundamentally undermine … across the plan area"
                          (never failed)
                      (ii) fn41 evidenced unmet need of this TYPE (automatic for housing if <5 yrs or HDT <75%)
                      (iii) sustainable location "with particular reference to TR3" (HO12 for travellers)
                      (iv) major housing (10+ or 0.5 ha) → GB8 Golden Rules
  ├ not inappropriate → S5(5) balance "substantially outweighed", applying S5(2) triggers;
  │     openness is NOT weighed again (6011301 ¶18)
  └ inappropriate → GB6(2) VSC: substantial weight to Green Belt harm; benefits must CLEARLY outweigh
        harm + other harm. Housing supply alone: 0 passes at appeal. S5(5) "not engaged" (6007428 ¶28)
```

### 3c. Heritage
```
HE5(1) significance and setting (an evidence gap here is fatal)
HE5(2)(c) degree of effect: positive │ none │ harm [graded: "very low/low/minor/moderate"] │ substantial │ total loss
   none → heritage drops out
HE6(1) substantial weight to the asset's CONSERVATION (more for Grade I/II*)
HE6(3) any harm = "considerable importance and weight"
 ├ substantial harm or total loss → HE6(5)/(6): refuse unless substantial public benefits or (a)–(d)
 └ other harm → HE6(4): harm vs PUBLIC benefits; named examples: reuse of a vacant listed building,
                energy efficiency / low-carbon heat. Filters: private? unsecured? achievable less
                harmfully or elsewhere? not the existing building?
HE4(2) clear and convincing justification (often a separate conclusion)
NDHA → HE7(2) ordinary balanced judgement; HE7(3) total loss │ CA → HE9 plus the HE6 balance │ s66/s72 duties
Result feeds S4(1)/S5(1) (S4(2) "not exhaustive", 6007054 ¶22) or GB6(2) VSC; DP3(3) often added as the trigger
```

### 3d. Where the development plan fits
- Where the plan-led framing is used, s38(6) comes first or last. Annex A ¶2 (Transitional(2)) then sets the weight of each policy.
- **Cut** (very limited weight): clauses that forbid an S5(1) or GB7 category, such as boundary, countryside, conversion-hierarchy and pre-grey-belt Green Belt tests.
- **Kept** (full weight): spatial preferences and quality standards (design, heritage, landscape, access, amenity).
- Reducing weight for under-delivery is 2024-style "out of date" reasoning. Record it, but code it separately (`annex-a-weight-reduction`).
- S3(1)(c) (accords with an up-to-date plan *and* the Framework: approve without delay) is rarely engaged.

---

## 4. Per-issue extraction checklists

Put these facts in `key_facts` (one line each, with numbers) and the policy `note` (with DL ¶). If a fact is not stated, write "not stated". Do not guess.

| Issue | Must capture |
| --- | --- |
| **TR3 / GB7(1)(g)(iii) / S5(1)(j)(i) location** | Walking distance and time to each named service; footway (none, partial, far side, continuous, narrow) and where it ends; lighting; speed limit and any measured speeds or traffic flows; metres walked in the carriageway; crossings (none, informal, secured); bus operator, frequency, days, evening and Sunday service, **and whether timetable evidence was produced**; DRT or on-demand (claimed or evidenced); rail tph each way, distance, step-free; Connectivity Tool score **and its comparator**; highway authority stance; mitigation offered and whether it was secured (s106, s278, condition, TRO); whether the scheme is "significant movement … in context"; any "existing residents walk it" or "short car trips" argument and the answer given. Quote the ¶ that characterises the route. |
| **GB7(1)(h) / S5(1)(h) station** | Station name; tph daytime and per direction; distance and route; which Annex B limb failed; part-site rule; "around 800m" reading. |
| **Grey belt, GB7(1)(g)(i)** | Which purpose was disputed; the settlement named and whether it is a village or a large built-up area; study parcel ref and rating, and whether the site was distinguished from it; containment features; any purpose (c) creep; the "fundamentally undermine" finding. |
| **Unmet need, GB7(1)(g)(ii) / S5(1)(j) / fn41** | 5YHLS figure, whose figure it is and its base date; HDT %; other need evidence (self-build register deficit, housing register, GTAA, sector need) and whether it was type-specific. |
| **Housing weight (HO7, HO8)** | The **exact weight word** and units; any qualifier (scale, need type, PIP range, delivery uncertainty, car dependence) with ¶; affordable % and tenure; whether secured. |
| **Self-build and BNG** | Register and permission figures; securing mechanism (s106 or UU; signed? correct land?); application date against **6 Aug 2026** (small-site 0.2 ha exemption; self-build exemption removed); metric submitted? |
| **S5(1)(c)/(d)/(e), S5(3), HO11** | (c): existing building, lawful? same use? % increase against the building at 17 Aug 2026 (fn25). (d): whole site PDL? (e): houses on both sides? "within" the group or extending it? S5(3): isolated, and why. HO11 limb and the evidence (essential need appraisal, redundancy, enhancement). |
| **S5(4)** | Every benefit and harm with weight; the conclusion ¶ verbatim. |
| **Triggers (S4(2)/S5(2))** | The policy that "should be refused", its code, and whether the letter routed it through S4(2)(c) or S5(2) or merely cited it. |
| **Heritage** | Asset, grade, and whether the effect is on the asset or its setting; the **degree words verbatim**; whether HE6(1) and HE6(3) are stated correctly; whether HE6(4) was run separately and before S4/S5; each public benefit with its weight and the reason it was discounted; HE4(2); s66/s72; any legacy wording ("less than substantial", "great weight"). |
| **Design and land use** | DP3 limb (1)/(2)(x)/(3)/(5); the explicit local standard breached; L2(1)(d)(i)–(iii) facts (footprint multiple, % curtilage retained); L3 dph and station distance. |
| **Highways, TR6(4)** | Safety limb ("unacceptable") or capacity limb ("severe"); splay dimensions and design speed; land control (red line, highway, third party); trees or hedges lost to splays; collision data; LHA stance; standard used (MfS, DMRB CD 143). |
| **Flood (F4–F9)** | Flood zone and source; FRA present?; sequential-test search area and discounting; exception test parts 1 and 2; access depth and hazard rating; vulnerability class. |
| **Landscape (N4), trees (N2(1)(d)), habitats (N6)** | NL or NP name; "major" under fn59?; special qualities affected; tree or hedge loss and replacement; HRA zone, tariff, and whether the obligation was executed. |
| **Transition and plan weight** | Switch ¶ verbatim; 2024 ¶ numbers or phrases; for each local policy, Annex A ¶2 result (cut, kept, reduced for supply) and clause; emerging-plan (DM4) weight. |
| **Council cases** | Officer recommendation; vote; members' reasons verbatim; update-sheet changes; S106 status. |
| **Fallback** | What the fallback is (Class Q, extant permission, lawful use, PIP); real prospect evidenced?; whether it is less harmful; weight given. |

---

## 5. How to code

**Policy codes:**
- Use `nppf-2026-policy-codes.md` with limbs, e.g. `GB7(1)(g)(iii)`, `S5(1)(j)(i)`, `HE6(4)`, `DP3(3)`, `TR6(4)`.
- Glossary terms take the form `AnnexB:grey-belt`, `AnnexB:settlement` or `AnnexB:PDL`; footnotes `fn41`; transition `Transitional(2)`. Use **only** `Transitional(1)/(2)/(3)` for Annex A ¶1–3, not `AnnexA(2)` or `Annex A`.
- Local plan policies go in `development_plan`, never as a bare `policy:` code. If a local policy needs a finding row, write `policy: 'LP CS.8 (local)'` so it cannot be read as an NPPF code.
- Non-NPPF tests: `BNG (Sch 7A TCPA)`, `GPDO Sch2 Pt3 Class Q …`, `s38(6)`, `PSED`.

**Common miscodings to correct:**

| Seen in letter or file | Code as | Note |
| --- | --- | --- |
| "S3 Part 4", "S3(3)" (for S5) | S5(4) / S5(3) | Record the slip (6011694) |
| (j) called "(h)"; "(j)(ii)" for the well-related limb | S5(1)(j)(i) | 6006289, 6005664, 6010826 |
| "H07", "SD5", "T3", "LP2/LP3", "HR11", "HE6:4", "HE6.1" | HO7, S5, TR3, L2/L3, HO11, HE6(4), HE6(1) | House styles and typos |
| "HE7(4)" | HE6(4) (a CA is a designated asset) | 6011786 was corrected |
| GB1 cited for the Green Belt purposes | AnnexB:grey-belt / GB2 | GB1 is plan-making |
| N5(4) for a Protected Landscape setting | N4(4) | malvern-M-25-01235-RM |
| Council "S5(2)" inside a settlement | S4(2)(c) | stratford-26-01906-PIP |
| "Annex B" for transitional weight | Transitional(2) | 6010471 ¶35 |
| Tree or hedge retention coded N3 | N2(1)(d) and/or DP3(2)(c) | N3 is trees in new development |
| N2 with no limb | N2(1)(a) landscape, or N2 (BNG) | Always add the limb |
| CA harm coded only HE9 | HE9 plus HE6(3)/(4) | HE9 has no balance; the balance is HE6 |
| Local-plan numbers picked up as NPPF codes (DM10, DP21, SP1, S4 from drawings, HO9 Bradford) | Move to `development_plan` | The `pins-corpus-index.tsv` code column does this systematically |
| 2024 ¶ numbers | Map: 11(d) → S3/S4/S5; 155(b) → GB7(1)(g)(ii); 155(c) → GB7(1)(g)(iii); 212 → HE6(1)/(3); 213 → HE4(2); 214 → HE6(5); 215 → HE6(4); 216 → HE7(2) | Record the 2024 ¶ in the note, set `nppf_applied: "2024-12 (transitional)"` |
| Plan-making policies used as decision tests (HO1, HO5, L1, TR1, DP1, GB1/GB2) | Code as cited, tag `plan-making-policy-as-harm` | Framework intro ¶8 bars this |

**Finding vocabulary:**
- `pass` / `fail`: a test that is met or not.
- `harm` / `benefit`: an item weighed in a balance.
- `conflict` / `accord`: plan or policy compliance.
- `neutral`: no effect.
- `not-engaged`: the test does not apply, or is unavailable (e.g. (h) where the station is not well-connected).
- One row per policy per finding. The same code may appear twice, once as harm and once as benefit.

**Weight words.** Copy the decision's word: substantial, very-significant, significant, great, considerable, moderate, limited, very-limited. Use `null` when no word is used. Never infer a weight.
- On **HE6(1)** rows, weight means weight to *conservation*. Put the harm-severity words in the note.
- For heritage harm rows, use `HE6(3)` with weight `considerable`.

**Nearest-fit coding.** Where the letter cites no Framework policy (common in tier 2), you may record the nearest 2026 code so the index builds. The note must begin `mapped:` or `Framework not cited`, and the case should carry `framework-not-cited` or `limited-nppf-engagement`. Analysts discount these rows.

**Canonical tags (counts at 23 Sep 2026; reuse these, do not coin synonyms):**
- **Scope and switch:** `tier-2` 326 · `parties-consulted-on-2026-framework` 263 · `transitional-no-consultation` 192 · `transitional` 43 · `old-framework-applied-silently` 5 · `framework-not-cited` 14 · `limited-nppf-engagement` 45 · `appeal-planning-officer` 31 · `old-style-acp` 5.
- **Slips:** `old-wording-slip` 64 (any pre-2026 phrase) · `old-balance-wording` 10 ("significantly and demonstrably") · `old-heritage-wording` 7 ("less than substantial" / "great weight") · `drafting-slip` 52 (miscited codes, internal inconsistency).
- **Principle:** `s4-within-settlement` 97 · `s4-substantially-outweighed` 110 · `s4-approve` 20 · `s5-1-j` 66 · `s5-1-c-reuse` 24 · `s5-1-e-infill` 14 · `infill-rejected` 5 · `s5-4-exceptional` 31 · `isolated-home` 19 · `s5-2-refusal-policy` 26 · `s4-2-c-refusal-policy` 10 · `dp3-refuse-trigger` 21 · `substantially-outweighed` 60.
- **Green Belt:** `grey-belt-accepted` 44 · `grey-belt-rejected` 7 · `not-inappropriate` 37 · `s5-5-balance` 15 · `vsc-not-shown` 58 · `vsc-shown` 10 · `openness-harm` 46 · `pdl-e-limb` 25 · `disproportionate-extension` 28 · `golden-rules` 10 · `station-route-h` 6 · `village-not-large-built-up-area` 3.
- **Location:** `sustainable-location-fail` 68 · `sustainable-location-pass` 45 · `rural-lane-no-footway` 58 · `connectivity-tool` 14.
- **Housing:** `housing-shortfall` 159 · `five-year-supply-met` 8 · `small-scheme` 205 · `large-scheme` 24 · `self-build` 50 · `self-build-unsecured` 20 · `bng-exemption-not-shown` 13 · `habitats-mitigation` 13 · `evidence-gap` 8 · `fallback` 56 · `fallback-rejected` 5 · `class-q-fallback` 7 · `rural-worker-dwelling` 10.
- **Heritage and design:** `heritage-harm-decisive` 114 · `heritage-harm-outweighed` 8 · `heritage-no-harm` 17 · `he6-public-benefits-insufficient` 28 · `he6-harm-graded` 13 · `private-benefit-not-public` 7 · `energy-efficiency` 6 · `ndha` 13 · `design-refusal` 81 · `backland` 20 · `l2-1-d-curtilage` 6.
- **Other:** `tr6-highway-safety` 14 · `flood-risk` 15 · `national-landscape` 39 · `costs-application` 34 / `costs-award` 7 / `costs-refused` 11 · `overturned-officer-rec` 10 · `officer-rec-followed` 8 · `split-vote` 6 · `materially-inconsistent-very-limited-weight` 9 · `annex-a-weight-reduction` 9 · `stratford-relevant` 22.

**Synonyms to stop using** (map to the canonical tag):
- `dp3-3-refusal` → `dp3-refuse-trigger`
- `less-than-substantial-legacy-wording` and `heritage-less-than-substantial` → `old-heritage-wording`
- `no-framework-reference` and `no-framework-cited` → `framework-not-cited`
- `highway-safety` and `highway-safety-fail` → `tr6-highway-safety`
- `no-consultation-on-2026-framework` → `transitional-no-consultation`
- `5yhls-shown` → `five-year-supply-met`

**Recording slips:**
- **Old wording:** quote it with its ¶ in the relevant `note`, add the slip tag, and say in the body whether it was **operative** (the conclusion rests on it) or **incidental**.
- **Drafting errors** (wrong code, a (b) pass followed by "inappropriate", PDL conflated with (g)): code what the words *mean*, put the letter's wording in the note ("letter says 'S3(3)'"), and tag `drafting-slip`.

---

## 6. Traps

1. **Letters dated 17 Aug 2026 are 2024 decisions in substance.** 64 of 65 have no switch paragraph. Treat them as transitional unless the text shows otherwise.
2. **Later letters that applied the 2024 text** are live challenge candidates. Examples: PINS-6002759 (18 Aug, 11(d)), 6009270, 6007837, 6010844 (s56 re-issue), 6007519 and 6003168. Record `challenge_deadline` in `key_facts`: decision date + 6 weeks.
3. **Consulted letters can still conclude in 2024 wording.** Examples: 6005108 ¶145 (inquiry) and 6005664 ¶59. Check the conclusion paragraph itself.
4. **Joint letters.** One letter can decide appeals A and B (planning and LBC, planning and advert, or linked sites). Write **one file per appeal ref**, cross-linked through `related:`. If Appeal A has a file, enrich it rather than duplicating it: 6003318/6003486, 6010765/6010767 and the Raunds set (APP-M2840-…).
5. **Costs** belong in the parent file (§2).
6. **PIP stages:**
   - Stage 1 decides only location, land use and amount, so design detail is deferred to the technical details consent (TDC) stage.
   - A PIP "up to N" range can cut housing weight (6011431 ¶23, limited).
   - A PIP cannot secure self-build by UU (6006900, 6012985 ¶20). A SAC tariff via a s111 LGA undertaking is accepted (6005328, 6007431).
   - Record the range in `units` (upper bound) and the range in `development`.
7. **Fallbacks.** Record whether the "real prospect" was evidenced and whether the fallback is less harmful than the scheme. Councils accept fallbacks on assertion; inspectors do not.
8. **Green Belt sites decided under S5.** 6011694 ignored S5(5). Code what was done, tag `green-belt-policy-not-applied`, and do not cite such a case as S5 authority.
9. **Washed-over villages.** Annex B excludes them from "settlement". SDC ignores this and treats them as settlements; tag `washed-over-village-as-settlement`.
10. **Non-determination appeals** have no council decision to overturn. Tag `non-determination`.
11. **Appeal planning officer letters** ("on the recommendation of…") carry less weight. Tag `appeal-planning-officer`.
12. **AI-summary sites misstate outcomes.** opencouncil.network showed Kislingbury as both approved and refused. Use such sites for leads only. Planning Resource and Property Week are paywalled or blocked: use search snippets only, and mark the case `secondary-only`.
13. **`harvest-log/pins-corpus-index.tsv` code column is unreliable.** It captures local-plan and London Plan codes and drawing numbers. Never code from it; read the letter.
14. **Search-engine titles for ACP `ViewDocument` PDFs are unreliable** (fileid 65299169 was an unrelated decision). Open the PDF and check the ref and date.
15. **Scanned council PDFs** have no text layer. OCR them (§7). Page numbers cited are PDF pages.
16. **Resolutions are not decisions.** A committee "minded to" or "resolved to grant subject to s106" is pending. Record it only if useful, with the resolution date in `key_facts` and the proposed tag `resolution-s106-pending`, and re-check it.
17. **The HE6(1) weight field is ambiguous** (§5): put conservation weight there, and harm severity in the note.
18. **Council update sheets** can reverse a report. Always read the one annexed to the minutes.

---

## 7. Sourcing recipes

| Source | Route that works | Notes |
| --- | --- | --- |
| **All new-style PINS decisions** (600xxxx) | **`tools/harvest.py all`** (see the README runbook) automates everything in this row: sweep, fetch, index and the distillation queue, with watermarks in `harvest-log/state.json`. The mechanics, per postcode area: GET `…/comment-planning-appeal/appeals?search=<AREA>` (sets the cookie), then `…/decided-appeals?search=<AREA>` with the same cookie jar. Rows are merged into `harvest-log/pins-decided.jsonl`. Case page `…/appeals/<ref>` → `/published-document/<uuid>` PDF | No cookie gives a 500 or "Sorry, there is a problem". Area codes work; place names do not. Rate-limit about 3 threads with a 0.5 s delay, and back off 60 s on 429. Filter on date ≥ last harvest. The 17 Aug–23 Sep corpus is in `data/open-sources/pins-corpus/` (1,088 .txt files plus `docs.map`) |
| Corpus index | `tools/index_pins_corpus.py` writes `harvest-log/pins-corpus-index.tsv` | The code column is unreliable (§6) |
| **Old-style ACP** (3xxxxxx: older s78 inquiries, enforcement, LDC) | `tools/scan_acp.py LO HI OUT.jsonl [THREADS] [DELAY]` scans `ViewCase.aspx?caseid=` and appends ≥17-Aug decisions to `harvest-log/acp-decided-index.tsv`; PDFs via `ViewDocument.aspx?fileid=` | Slow (about 75–100 pages a minute). Needs a browser UA. New-style refs return "No case found". **Unscanned ranges:** 3340000–3345000, 3345690–3350000, 3356815–3360000, 3365308–3368500, 3374119–3377518, 3379193+ |
| Planning Geek | WP REST `https://www.planninggeek.co.uk/wp-json/wp/v2/posts?after=<ISO>&per_page=100&_fields=date,link,title,content`; PDFs under `/wp-content/uploads/YYYY/MM/` | Best route to old-style refs and commentary |
| Richborough appeals DB | `richborough.co.uk/appeal-decisions/` | Major housing appeals |
| SoS casework | gov.uk content API `/api/content/…` and `/api/search.json?filter_organisations=…&filter_content_store_document_type=correspondence&order=-public_timestamp`; NSIP project pages; `find-crown-development.planninginspectorate.gov.uk` | Much better than WebSearch |
| **Stratford-on-Avon** | JSON API `https://apps.stratford.gov.uk/EplanningV2/API/v1/Search?parish=…` (has no decision date, so fetch `v1/PlanningApplication/{id}` → `importantDates.dateDecisionIssued`). Documents: `v1/Documents/Folder/{folderId}/Category/{catId}` (REPORTS `c3e21d4b-df12-cdcc-c4b6-08d025d0f088`, DECISIONS `c30e3fa7-9f46-cf53-5678-08d025d0f9aa`), then POST `v1/Document/{id}/Request` with `--data ""` and GET `…/Download`. Committee: `democracy.stratford.gov.uk`, CommitteeId 772 | Limit 10 calls/s; throttle to about 5/s. Search caps at 500 per parish. Delegated reports are scanned |
| OCR (macOS) | `uv run tools/ocr_pdf.py IN.pdf [OUT.txt]`: renders each page with Quartz and runs Vision's `VNRecognizeTextRequest`; writes `=== PAGE n ===` markers (= PDF page numbers) | tesseract is absent. About 4–7 s a page |
| modern.gov councils | `mgCalendarMonthView.aspx?M=<m>&Y=<y>&GL=1`, then `ieListDocuments.aspx` → `documents/sNNN/*.pdf` (reports) and `documents/gNNN/*.pdf?T=n` (printed minutes; fetch separately) | Printed minutes give outcomes. Fast publishers: Basildon, Maldon, Chorley, North Herts, Test Valley, TMBC, Dacorum, BathNES, Sefton, Elmbridge, Three Rivers, Cheshire East, Cornwall, East Devon, Dorset, BCP |
| South Worcs (Wychavon, Malvern Hills, Worcester) | `plan.<council>.gov.uk/Search/Advanced` (anti-forgery token) → POST `/Search/SiteResults` → `/Search/Results` → `/Search/ResultsPage/N?module=PLA`. Supports DateIssued and **DateAppealDecision** filters. Docs are in the `data-disabled-link` attribute | Delegated reports are named `delegated report_<ref>.pdf` |
| Idox | Bromsgrove & Redditch `publicaccess.bromsgroveandredditch.gov.uk`; Lichfield `planning.lichfielddc.gov.uk`; **Warwick `https://planningdocuments.warwickdc.gov.uk/online-applications/`** (https only). Advanced search with `_csrf` and `date(applicationDecisionStart/End)` | Download in the same cookie session |
| West Northants | `https://wnc.planning-register.co.uk/`: POST `/Disclaimer/Accept?returnUrl=%2F` `--data ""`, then `/Planning/Display/<ref>` | |
| Rugby | `https://www.rugby.gov.uk/l/<id>` meeting pages (list `/l/6638692`) | |
| **Blocked: do not retry without a new idea** | `*.moderngov.co.uk` Cloudflare 403 (Tandridge, St Albans, Bucks, Mid Sussex, Uttlesford, Bradford, Calderdale, Horsham, Hertsmere, RBWM, Reigate, Babergh/Mid Suffolk, Rugby, Tamworth, West Northants); Warwick CMIS (503); Solihull Idox (refused); Planning Resource and Property Week (403); Maldon civica (JS only) | WebFetch has not been tried on the Cloudflare hosts. Worth one attempt |

**Re-run schedule** (from `analysis/transition-and-decision-makers.md` §8 and `harvest-log/sos-and-other.md`):

| When | What |
| --- | --- |
| Weekly | `uv run tools/harvest.py all` (PINS sweep, fetch, corpus-index refresh, queue, rebuild); distil the queue; Planning Geek API |
| 24–25 Sep 2026 | SDC committee of 23 Sep minutes: 25/00347/FUL Home Farm crossing; **26/01894/PIP Pillerton Priors** (L2(1)(d) failure not run as an S4(2)(a)(ii) trigger) |
| From 29 Sep to 21 Oct 2026 | s288 and JR windows close for the transitional letters: 6002759 (29 Sep), SOS-EN010151 (2 Oct), 6009270 (5 Oct), SDC 26/01764 and 26/01393 and wychavon-W-25-01931 (6 Oct), 6007837 (13 Oct), 6010844 (16 Oct), 6003168 and 6007519 (21 Oct). Search Find Case Law and Planning Geek in late October |
| 7 Oct 2026 | SDC committee (MId 6931) |
| 9 Oct 2026 | Albrighton recovered inquiry closes (SoS decision likely 2027) |
| Monthly | Croxley Green 6004972 (inquiry; watch for recovery); Holocaust Memorial; member-overturn appeals (Basildon ×3, Three Rivers 25/2168, Chorley 6014396, Nuneaton 041303) |
| Now (overdue) | MOD Bicester Site A urgent Crown decision (SOS-PCU-RARE-C3105-3378843) |
| 5 Nov / 10 Nov / 10 Dec 2026 | Maple House s62A (S62A/2026/0159); Dacorum Land East of Tring inquiry opens; Laugherne Villa s62A (S62A/2026/0157) |
| November | Wychavon and Chalfont St Peter High Court challenges (2024-Framework decisions) |

---

## 8. After writing

```bash
cd research                       # the repo root
python3 tools/normalise.py        # nppf_applied vocabulary (idempotent)
uv run tools/build_index.py       # rebuild index/, prints WARN lines to stderr
```
- Fix every WARN for your files: YAML error, missing required field, case_id not matching the filename, date before 17 Aug, possible duplicate appeal or LPA ref.
- YAML hygiene: single-quote any value containing `:`, `#`, a leading quote, or a quote followed by more text, and double any inner `'`. Put the appeal-ref number in quotes (`"6006637"`).
- Required fields: case_id, title, authority, decision_maker, decision_date, outcome, development, determinative_policies, policy_findings, key_facts, sources, verification.
- Then check that your case appears under its codes in `index/policy-index.md`.

---

## 9. Worked example: PINS-6006637, Hatton Station (hearing, 23 Sep 2026)

| Letter | → Field |
| --- | --- |
| Header: "Hearing held on 20 August 2026 … Decision date: 23 September 2026 … Warwick District Council … Ref is W/24/0706 … erection of 28 residential dwellings" | `procedure: hearing`, `decision_date: 2026-09-23`, `authority: Warwick`, `lpa_ref`, `development`, `units: 28` |
| ¶1 "The appeal is dismissed." | `outcome: dismissed` |
| ¶2 "Framework (August 2026) … published three days before the Hearing … parties had sufficient opportunity" | `nppf_applied: 2026-08`; switch recorded in the body |
| ¶3 emerging SWLP (Reg 19) "only limited weight" | `key_facts` (emerging allocation B1/HAT); DM4 context |
| ¶10 (i) grey belt and (ii) unmet need "common ground" | `AnnexB:grey-belt pass`, `GB7(1)(g)(i) pass`, `GB7(1)(g)(ii) pass` (1.96 yrs → `housing_land_supply_years`), `grey_belt: accepted` |
| ¶18 "fewer than four trains per hour … fewer than two … in any one direction" | `GB7(1)(h) not-engaged` (station not "well-connected"); tags `station-route-h`, `near-station` |
| ¶21–26 unlit, verges only, bridge; collisions "treated with caution"; "necessity rather than choice" | `key_facts` (350 m, 653 vpd, 85th percentile ~30 mph); tag `rural-lane-no-footway` |
| ¶29 28 homes are "significant movement … in context" | TR3(1)(a) engaged: note on the `TR3` row |
| ¶32–39 no "genuine choice"; TRO and signage "relatively minor" or unsecured; "not … a sustainable location as required by Policy GB7(1)(g)(iii)" | `GB7(1)(g)(iii) fail`, `TR3 fail` → both in `determinative_policies`; tag `sustainable-location-fail` |
| ¶41–44 highway improvements "not suitably identified, substantiated, or secured" | `GB8(1)(b) fail`; tag `golden-rules` |
| ¶52 limited urbanising harm | `DP3 / local BE1, NE4` harm, limited (better: `DP3` plus the local codes in `development_plan`) |
| ¶55 inappropriate; spatial openness loss | `GB6(2) harm substantial`; tag `openness-harm` |
| ¶57 affordable weight | `HO8 benefit very-significant` |
| ¶60 "would not clearly outweigh" | Planning balance = GB6(2) VSC; tag `vsc-not-shown`; `weight_of_authority: high` (hearing) |

---

## 10. Schema v2 proposals (consolidated from the four analysts; NOT applied)

| # | Field | Values | Why |
| --- | --- | --- | --- |
| 1 | `framework_switch` | consulted \| not-consulted-no-change \| noted \| silent \| pre-switch | Replaces the ambiguous `transitional-no-consultation` tag |
| 2 | `challenge_deadline` | ISO date | Tracks the s288/JR windows |
| 3 | `settlement_finding` / `settlement_basis` | inside \| outside \| split \| not-a-settlement / plan-boundary \| on-ground \| allocation-limb \| hamlet-excluded \| washed-over-excluded | S4/S5 gateway |
| 4 | `route` / `category_found` | s4 \| s5-1-a…j \| s5-3 \| s5-4 \| gb7-1-a…h \| none | Stops confusion between (b), (e) and (g), and between (c) and (d) |
| 5 | `balance_run` | s4-1 \| s5-1 \| s5-4 \| s5-5 \| gb6-vsc \| he6-4 \| plan-led | Which test decided the case |
| 6 | `refusal_trigger` | list: DP3(3), TR6(4), F5–F9, N6, L3(4), HE6(5), TC3, HC5, S4(2)(a)(i)/(ii) | A structured trigger list |
| 7 | `location_facts` | `{walk_m, footway: none\|partial\|far-side\|continuous\|narrow, lit: y\|n\|part, speed_mph, carriageway_walking_m, crossing: none\|informal\|secured, bus_per_hour, bus_evidence: y/n, drt: none\|claimed\|evidenced, rail_tph, rail_m, ct_score, hwa_objection}` | Makes the TR3/(g)(iii) tables generatable |
| 8 | `grey_belt_purposes` / `parcel_rating` | `{a,b,d: strong\|moderate\|weak\|n/a}` | The grey-belt fight is purpose (a) |
| 9 | `housing_weight` / `ho7_weight_basis` | weight word / scale \| need-type \| supply \| text | HO7 weight split for 1–9 homes |
| 10 | `heritage` block per asset | `{asset, grade, effect, degree_words, he6_4: pass\|fail\|skipped, public_benefits: [{benefit, weight, discount_reason}]}` | Removes the overloaded HE6(1) weight |
| 11 | `annex_a_findings` | `[{policy, clause, result: cut\|kept\|reduced-supply, weight}]` | Plan weight is currently buried in notes |
| 12 | `officer_recommendation` / `vote` | approve \| refuse \| none / "6–0–3" | Replaces the overturn tags |
| 13 | `obligation_failure` | hra \| bng \| self-build \| third-party-land \| s106-other | Paperwork losses |
| 14 | `j_wellrelated_reading` | physical \| visual \| accessibility \| form | Four competing readings of S5(1)(j)(i) |
| 15 | `highway_evidence` | speed survey, collision data, LHA stance | TR6 outcomes turn on it |
| 16 | `weight_of_authority` | court \| sos \| inquiry \| hearing \| wr \| apo \| committee \| delegated | The current `high` covers every appeal |
| 17 | Tags | New: `footway-far-side`, `crossing-secured`, `drt-evidenced`, `existing-users-argument`, `letter-internal-inconsistency`, `he6-4-skipped`, `heritage-weight-misstated`, `setting-functional`, `splay-third-party-land`, `splay-tree-hedge-loss`, `energy-benefit-discounted`, `pdl-rural-garden`, `tr3-1a-small-scale`, `plan-policy-consistent-full-weight`, `s5-2-used-to-skip-s5-4`, `resolution-s106-pending`. Merge the synonyms listed in §5 | |
| 18 | Code normalisation in `build_index.py` | Map `AnnexA(2)`/`Annex A` → `Transitional(2)`; flag non-NPPF codes in `policy:` | Clean statistics |
