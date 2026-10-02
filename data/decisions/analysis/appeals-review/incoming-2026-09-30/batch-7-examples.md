# Batch 7: candidate examples for the NPPF Navigator

Cases from batch 7 (decided 28 Aug to 30 Sep 2026) that illustrate a point better than the case the graph now cites, fill a gap with no example, or cut against a point the graph makes. Every quote below was machine-checked against the letter text, and each ¶ is the paragraph the quote is in. All are inspector decisions on written representations.

## Top three

### 1. Langley, Cheshire East: PINS-6010253 (PIP, one dwelling, Green Belt, dismissed 28 Sep 2026)
- **Node and point:** `tr3.ts`, `tr3Engaged` help: "This step is not asked in the Green Belt: GB7(1)(g)(iii) requires a sustainable-location finding whatever the scale of the scheme." No case is cited for it. The `tr3` fail pointer "An unlit lane with no footway at the national speed limit (6006950 ¶18)" is the same kind of point.
- **Quotes:**
  - ¶18: "Consequently, notwithstanding the small scale of the proposal, future occupiers would be likely to rely heavily on private car use to meet their day-to-day needs"
  - ¶17: "Beyond the edge of the village, the route lacks footways and street lighting, is subject to the national speed limit and is on an incline."
  - ¶19, Connectivity Tool: "little detail has been provided regarding its findings beyond a score of 25 and a colour-coded map"
- **Why it's stronger:** a single dwelling that fails GB7(1)(g)(iii) on the route alone, with grey belt and unmet need conceded. The inspector says in terms that small scale does not help, which is exactly the graph's Green Belt point. ¶19 also supports the `tr3Tool` help: a bare score is not enough.

### 2. Great Casterton, Rutland: PINS-6010934 (HO11(e) isolated house, dismissed 30 Sep 2026)
- **Node and point:** `countryside.ts`, `ho11` method, step (e) "Exceptional design…", and the evidence item "Independent design review, if exceptional design is claimed". No case is cited for HO11(e).
- **Quotes:**
  - ¶18: "I understand the policy requirement to mean ‘one of a kind’ dwellings which reach the highest standards of architecture"
  - ¶23: "It does not appear that the scheme has been submitted to an external design critique such as a Design Review Panel."
  - ¶28: "The policy requirement is for the proposal to be seen, to some extent, in its surrounding context."
- **Why it's stronger:** it fills the gap. It is the first 2026 HO11(e) appeal in the dataset, and it gives three usable fail factors: a replica of a design allowed elsewhere is not "one of a kind", there was no design review, and concealing the house is not enhancing its setting. Suggested fail pointer: "A design copied from a scheme allowed elsewhere, or one hidden rather than seen in its context (6010934 ¶18, ¶28)".

### 3. Sproston, Cheshire West and Chester: PINS-6010642 (PIP, one dwelling, outside settlement, dismissed 28 Sep 2026)
- **Node and point:** `tr3.ts`, `tr3` method step "Test the route for all users, including children, older people, and wheelchair and pushchair users (TR4(1)(c)(ii))", which has no case. Also the `tr3Bus` help, which cites only a twice-weekly bus (6006637).
- **Quotes:**
  - ¶13: "Whilst the bus stop is within an acceptable walking distance, the first part of the route requires walking within the road along Brereton Lane given the lack of a pavement or grass verge."
  - ¶13: "this route would not be a realistic option for many future occupiers especially a parent with young children or those with mobility issues"
- **Why it's stronger:** an hourly bus 400 m away still did not give a genuine choice, because the walk to it is in the carriageway of an unrestricted lane and crosses the A54 with no formal crossing. It is the clearest all-users wording in the batch.
- **Cuts against `tr3Engaged`:** the help says "A single dwelling among existing houses has not (one home was not significant at 6010973 ¶20)", and the "no" effect caps car reliance at limited weight. Here, outside the Green Belt, one dwelling beside an existing cul-de-sac was found contrary to TR3 with significant weight. ¶27: "would therefore be contrary to Policy TR3 of the Framework. Significant weight is attached to this conflict." The letter does not discuss "significant amount of movement" at all, so it does not decide the TR3(1)(a) point either way. It does show inspectors giving TR3 significant weight for one home. The `tr3Engaged` "no" branch's fixed limited weight may be too low. Also ¶17, relevant to the isolation and TR3 separation in `countryside.ts` (j)(i) step 3: "the presence of other nearby dwellings does not overcome the concerns raised over the unsustainability of the location".

## Other candidates

### Highbury, Islington: PINS-6005590, DP3(3) explicit standards (dismissed 24 Sep 2026)
- **Node and point:** `triggers.ts`, DP3(3) conflict options. The `standards` option is framed as "a Village Design Statement, design guide, code or masterplan" (6010826). The clear-justification step's help says DP3(3) "has beaten substantial housing weight (6008167 ¶21)".
- **Quote (¶46):** "Notwithstanding that I attach substantial weight to housing delivery and significant weight to the affordable housing contribution, collectively these benefits do not amount to the clear justification required by Policy DP3(3) to depart from explicit accessibility standards in the development plan."
- **Why it's stronger:** it shows that "explicit design standards" reach beyond character codes to development-plan accessibility standards (step-free access, London Plan D5/D7, SDMP H4, ¶45). It also applies the level-balance reading of clear justification against two named benefit weights. Consider widening the `standards` label to "including accessibility standards".

### Westcliff-on-Sea, Southend: PINS-6008855, DP3(3) clear justification (dismissed 30 Sep 2026)
- **Node and point:** `triggers.ts`, clear-justification step: "about 20 made the clear-justification finding in so many words (e.g. 6008167 ¶21, 6006720 ¶34)".
- **Quote (¶45):** "In this instance the benefits of the proposed development would not amount to the clear justification for its harmful effects on the character and appearance of the area"
- **Why:** another clean example. It covers a combined DP3(1) and P3 conflict, and ¶44 says the result holds even if the benefits are given substantial weight. It is an alternative to the existing examples, not clearly better.

### Bledlow Ridge, Buckinghamshire: PINS-6010097, Green Belt village treated as a settlement (dismissed 30 Sep 2026)
- **Node and point:** `core.ts`, washed-over-village node. The contested reading "Treated as a settlement in practice" cites council reports only, and the appeals review found only Lacey Green 6009997 doing this at appeal.
- **Quotes:**
  - ¶15: "As the proposal is within a settlement, it benefits from the in-principle support provided by policies S3 and S4 of the Framework."
  - ¶20: "it is unnecessary to determine whether the proposal would constitute inappropriate development in the Green Belt because that assessment would not alter the outcome"
- **Cuts against the graph:** the site is in the Green Belt and within the village's defined settlement boundary, and the inspector ran S4, which the node says "cannot apply". It is a second appeal example for the "treated as a settlement" reading. The outcome was unaffected (dismissed on heritage).
- **Also, `heritage.ts` HE6(4) help "Small housing schemes have lost this balance on 'low' harm…":** ¶14 is a cleaner version: "The substantial weight attached to the additional dwelling, together with the other public benefits, would not outweigh that harm." The harm was modest, and full HO7 substantial weight was given to the one home.
- **Cuts against `benefits.ts` `homes` help ("Decisions have tempered the weight for very small numbers…"):** ¶11 gives one dwelling substantial weight under HO7. Other letters in this batch give one dwelling significant weight (6010253 ¶32) or limited weight (6010642 ¶26), and three dwellings moderate weight (6011585 ¶17). Weight for 1 to 3 homes is not settled.

### Staines-upon-Thames, Spelthorne: PINS-6007619, Connectivity Tool anchor (allowed 25 Sep 2026)
- **Node and point:** `tr3.ts`, `tr3Tool` bands (under 30 / 30 to 50 / over 50), which have no case support for the 50 anchor.
- **Quote (¶21):** "giving it a score well above the median score of 50 and thus denoting good accessibility"
- **Why:** an inspector reading a score (79 to 82) against the national median of 50. It supports the band boundary. Caveat: this is a parking case, not a TR3 location decision.

### Hadlow, Tonbridge and Malling: PINS-6009847, energy-efficiency public benefit (LBC, dismissed 29 Sep 2026)
- **Node and point:** `heritage.ts`, public-benefit option `energy` ("An important public benefit named in HE6(4). Measures that only meet Building Regulations are neutral."). No case is cited.
- **Quote (¶16):** "there is no substantive evidence before me that demonstrates that the proposed windows and doors would enhance energy efficiency in comparison to the existing double-glazed windows"
- **Why:** it fills the gap. The benefit must be shown as an improvement over the existing building, not just claimed. ¶16 also adds security and low maintenance to the private-benefit examples.

## Not recommended
- **Rusper, Horsham, PINS-6007772** (allowed under S5(1)(d)): it found heavy car reliance on unlit, footway-free lanes (¶12) but never applied TR3. Do not cite it as an S5(1)(d) pass example without that caveat.
- **Tibenham, South Norfolk, PINS-6010418:** its S5(1)(e) reasoning contradicts itself (¶12), and it concludes in the 2024 "significantly and demonstrably" wording (¶24).
