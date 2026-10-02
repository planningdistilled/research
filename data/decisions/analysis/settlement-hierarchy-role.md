# The role of the settlement hierarchy

**A settlement hierarchy ranks *settlements* for the *plan*; it doesn't rule on *sites* for the *decision*.**

Draft, 30 September 2026. A general explainer of what a settlement hierarchy is, what it was built to do, and why a settlement's tier cannot answer whether a particular site is a sustainable location under the August 2026 National Planning Policy Framework (NPPF). Claverdon is used as a worked example. Companion to `settlement-hierarchy-and-service-centres.md` (which covers how the dataset codes the term) and to the published explainer *Service Village Does Not Mean Sustainable*.

Verification: NPPF text checked against the committed extract (`data/open-sources/nppf/NPPF-August-2026.txt`); Stratford Core Strategy and the 2014 LSV scoring checked against the PDFs in `source/`; appeal quotations checked against `open:pins-corpus/`. External articles are marked **[web-verified]** where I read the source and **[summary only]** where I have only a search summary and the wording should be checked before it is quoted anywhere shared.

---

## 1. The characterisation

A settlement hierarchy is, in effect, a **coarse, comparative ranking of settlements by their relative sustainability**: chiefly whether a settlement has the services, size and accessibility to absorb growth without pushing its residents into the car. It is built **for plan-making**, so that a local plan can steer most growth to the higher-ranked places. Councils describe it in those terms: their settlement assessments "identify which settlements… may not be classed as 'sustainable', where development may lead to additional car trips out of the settlement" **[summary only]**, and Stratford's Core Strategy says its list of Local Service Villages is "'dynamic' in order to reflect the sustainability of a particular LSV at any point in time" (CS.15, note 3).

Three features follow from that, and each limits what the tier can do:

1. **It ranks settlements, not sites.** The unit is the whole village or town, its facilities and self-containment. It is never a particular field on the edge.
2. **Its "sustainability" is a broad composite, not the TR3 test.** It blends services, capacity, the viability of rural services and rough accessibility. TR3 asks a narrow, site-specific question: can the occupiers of *this* site reach everyday services on foot, wheel, cycle or public transport, on the actual route.
3. **It is relative, not absolute.** It sorts settlements against each other within one plan area, most to least. A top-rung village in a rural district is only the best of that district's villages, not certified sustainable in any absolute sense.

Put together: a coarse, settlement-level, relative, plan-making ranking is being asked to do a fine-grained, site-level, absolute, decision-taking job. It was never calibrated for it.

## 2. What it is not

The August 2026 NPPF has **no settlement hierarchy and no "service village"**. Neither phrase appears in it. Its spatial vocabulary is "settlement" (Annex B), the split between development within settlements (S4) and outside them (S5), and the sustainable-location test (TR3). The tiers, their names and their criteria are left entirely to each local plan, which is why the labels vary from council to council and are not comparable between them.

The two national policies usually cited the other way are both about **plan-making**, not decisions:

- **HO6(1)(b)**: *local plans* should "allocate sites which will support and enhance the vitality of rural communities and enable villages to grow and thrive, especially where this will support local services." It sits under the instruction to plan-makers; the national decision-making policies begin at HO7.
- **Planning Practice Guidance, Paragraph 67-009** **[web-verified]**: "a wide range of settlements can play a role in delivering sustainable development in rural areas, so blanket policies restricting housing development in some types of settlement will need to be supported by robust evidence of their appropriateness." A caution to plan-makers against blanket bans; not a finding that any site near a service village is sustainable.

## 3. Where the idea comes from

The device descends from the geographers' concept of **central places**, settlements that supply goods and services to the area around them, and, in England, from the **"key settlement" policy** of county development plans in the 1950s and 1960s. In a period of rural depopulation and tight budgets, counties concentrated rural growth in selected villages to keep schools, shops and buses viable and to stop development scattering across the countryside. The founding study, Paul Cloke's *Key Settlements in Rural Areas* (1979), took **Warwickshire** and Devon as its two case studies **[summary only]**. The aims were to sustain rural services economically and to conserve the countryside, the "concentration versus dispersal" debate; the later drive to reduce car dependence reinforced them.

The device was built to rank villages against each other for plan-making. It was never designed to certify that a site beside one of them is sustainable.

## 4. What hierarchies look like

Every plan builds its own **[summary only; check each plan before citing]**:

| Council | Tiers, top to bottom |
|---|---|
| West Oxfordshire | Principal Towns (Witney, Carterton, Chipping Norton) → Service Centres → Large Villages → Medium Villages → Small Villages, hamlets, open countryside |
| Central Lincolnshire | Market Towns → Large Villages (750+ homes) → smaller villages → the rest |
| Stratford-on-Avon | Stratford-upon-Avon → eight Main Rural Centres → Local Service Villages, Categories 1–3 → villages not in the hierarchy |
| Elsewhere | "Key service villages" (Purbeck); "Rural service centres" (East Dorset); "Urban/Rural Local Service Centres" (Rossendale); "Key Rural Service Centres" (West Norfolk) |

What puts a settlement in a tier is usually the services it contains, often with an accessibility screen; a common test is a primary school and a GP surgery within about 800 m of the **settlement boundary**. That measures the settlement as a whole. It says nothing about whether a particular edge site can reach those services on foot.

## 5. Its proper use, the shorthand it became, and what applies now

### Then: the proper use, for plan-making

The Framework asks every local plan to identify its settlements and draw their boundaries. **S2(1)(a)** (Producing a spatial strategy): the development plan should identify "Settlements within the development plan area (applying the definition in the glossary at Annex B), whether existing or proposed, and their boundaries". And it asks plans to allocate sites that "enable villages to grow and thrive, especially where this will support local services" (**HO6(1)(b)**). The settlement hierarchy is how a plan does that: score each settlement on size, the services it contains and accessibility, rank them, and **distribute growth down the tiers**, most to towns and service centres, least (often none) to small villages and open countryside. In practice the tier decides two plan-making things: how much housing a settlement is allocated, and whether it gets a settlement boundary within which development is acceptable in principle. Comparative, settlement-level, forward-looking, and entirely proper. That job continues unchanged under the 2026 Framework.

### The drift: how it became "must be sustainable"

In day-to-day decision-taking the tier drifted into a **shorthand for sustainability**: "it is a Category 3 Local Service Village with a shop, school, pub and surgery, so the site is in a sustainable location". Sometimes the route analysis was dropped altogether. At **Earlswood, 26/01458/FUL**, the sustainable-location limb GB7(1)(g)(iii) was passed in one sentence because the footprint sat within the built-up-area boundary of a Category 3 LSV, with no TR3 analysis of routes or services (`cases/stratford-26-01458-FUL.md`). The consistency review found Stratford's reports "lean on Local Service Village status as proof of sustainability" (`appeals-consistency-review.md`, issue 5).

The plan's own language invites it. CS.15 frames the tier as reflecting a settlement's "sustainability" and says a settlement's "status… could alter if the availability of services changes". But what CS.15 means is the sustainability of the **settlement as a place to direct growth**, reassessed over time, not whether a **particular site's walking route** offers a genuine choice of transport modes.

Why the habit took hold is structural. Before August 2026 there was no dedicated, codified per-application test for sustainable location. Sustainability of location *was* judged on individual applications (a pre-2026 Claverdon decision, 22/01896/FUL, found "an unsustainable location… future occupants would be principally reliant on the motor vehicle"), but diffusely, through the sustainable-transport paragraphs and the overall balance, and leaning heavily on where the plan's spatial strategy had put growth. In the absence of a discrete test, the plan-making device filled the vacuum.

### Now: route evidence replaces the shorthand

The August 2026 Framework moved to what Cornerstone Barristers call a "rules-based planning system" with a "locational-based presumption" **[web-verified]**. For sustainable location it supplies an explicit, per-site test. **TR3** asks for "a genuine choice of transport modes" on the actual journey (footway, lighting, traffic speed, crossings, and evidenced bus and train), and TR3(2) says the Connectivity Tool should be used. For a Green Belt village the test is reached through GB7(1)(g)(iii). The tier is not that test.

**How the hierarchy is applied now.** It is not abolished; it is put back in its lane, with exactly two roles:

- **In the plan**: unchanged. It still distributes growth and draws boundaries (S2, HO6).
- **In a decision**: as evidence of *plan accordance* only. Is the site inside the settlement boundary and within the spatial strategy? (At Claverdon it is outside both.) That is weighed under section 38(6), with the plan's weight fixed by Annex A(2). It can also record the services a village contains, as background to TR3.

What it does not do: it does not choose the route an application takes (Annex B does, and Annex B excludes villages that lie within and are defined as part of the Green Belt, so a washed-over village goes to S5 and the Green Belt policies, not S4, whatever its tier); and it does not answer TR3. "Augmented" is the right word: the tier says where the plan wanted growth; the route evidence decides whether this site is sustainable.

Why the tier cannot answer the sustainability question:
- **On a poor route it fails on appeal.** Inspectors go back to the route: Findon 6006900 (the settlement "is a service village", yet "future occupiers would have a reliance on the private car… irrespective of the precise distance", ¶15, ¶17); Hatton Station 6006637 (350 m to a station with "no meaningful dedicated facilities for either pedestrians or cyclists", ¶19); Halsall 6007428 ("without relying principally on the private car… the quality and safety of the route materially limit its usefulness", ¶14–16). The full list is in the published explainer. The tier is still cited in favour where the route is adequate (Broadwas 6010973, Biddulph Moor 6011103, Chaldon 6006497), and one appeal was allowed on the tier plus a bare proximity statement (Henfield 6007104, a sentence copied from the adjoining appeal; the inspector recorded reasonable public transport). Aston Clinton 6008253 looks the same in the letter but its location was agreed on a Transport Assessment with secured off-site works. TR3(1)(e) is a duty to improve rural connectivity, not an allowance, and was applied against a scheme at Trewarmett 6000903; but Tarleton 6007484 was allowed on the deleted 2024 allowance sentence quoted as current, so expect the argument. See `service-village-page-adversarial-review.md`.
- **It is circular.** The tier was built from a settlement-wide services-and-accessibility score. Using it to prove a site sustainable re-runs a plan-making screen as if it were the decision test, and imports its blind spots. At Claverdon that score gave the village **0 for public transport**.
- **The settlement question is separate too.** Annex B excludes "villages which lie within and are defined as part of the Green Belt". A washed-over village is not a "settlement" for the Framework, whatever its tier.

## 6. National evidence

- **The 2026 shift to explicit decision tests.** Cornerstone Barristers describe the revised NPPF as "the starkest illustration… of the Government's objective to move to a more 'rules-based' planning system", one that "eschews the trigger for the presumption of plans or policies being 'out-of-date', in favour of a locational-based presumption", with materially inconsistent plan policies given "very limited weight" **[web-verified]**. That is the structural change: diffuse discretion replaced by discrete, locational decision policies, of which TR3 is the sustainable-location one.
- **What actually drives car use.** The RTPI's evidence review *Settlement Patterns, Urban Form and Sustainability* (May 2018) finds that "larger settlements, higher densities and mixed land uses [reduce] the need to travel by car", and that housing permitted on the "edge of settlements and more rural locations" and far from stations "may result in higher levels of car use" **[web-verified, read from the PDF]**. Sustainability tracks density, mix and proximity, measurable form-and-access factors, not a tier label. Note the report argues for concentrating growth in larger, denser settlements; five low-density houses on the edge of a small village with poor public transport are the opposite of what it recommends.

Neither source states the thesis of this note outright. Cornerstone supplies the rules-based half, the RTPI the mechanism, and the 2026 appeals the application.

## 7. Worked example: Claverdon

Claverdon is a Category 3 Local Service Village (CS.15, CS.16) and is washed over by the Green Belt. In the Council's 2014 LSV scoring it scored 2 for size, 1 for a shop, 3 for a school and **0 for public transport**, total 6 (`sources:stratford-dc/SDC-LSV-revised-categories-2014.pdf`). Two things follow. Because it lies within the Green Belt it is not a "settlement" under Annex B, so applications go through GB6–GB8, not S4. And the sustainable-location question for a site north of Station Road is decided on the route east to the services, bus stops and station, which has no site-side footway, no lighting, a 40 mph limit, no formal crossing, a Wednesday-only request bus and an unstaffed request-stop station. On the reasoning of Findon and Hatton that is a car-reliant location, irrespective of the precise distance and irrespective of the village's tier.

## 8. Open items

- Read Cloke (1979) or a reliable secondary source before quoting the Warwickshire/Devon point in anything shared.
- Verify each other-council hierarchy in §4 against its plan before citing it by name.
- A pre-2024 appeal search for "sustainable by virtue of the village" reasoning has not been done; the dataset is 2026-only.
- *Braintree DC v SSCLG* [2018] EWCA Civ 610 and *Stratford-on-Avon DC v SSLUHC* [2022] EWHC 445 (Admin) are potentially relevant and unread; do not cite until read.
