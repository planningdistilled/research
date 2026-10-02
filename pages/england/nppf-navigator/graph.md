# NPPF 2026 Navigator: decision graph (v1)

Generated from `graph/` by `npm run build`. Do not edit by hand. 75 nodes, 74 verbatim quotes (all verified against the National Planning Policy Framework (August 2026) text at build time).

Reading guide: nodes are asked in this order, each only when its **Shown when** condition holds. A **judgement** is a planning judgement the user makes with the policy text, guidance and matching cases in front of them. **Findings** are what the answer records for the final reasons.

## Derived facts

| Fact | Value | When | Basis |
| --- | --- | --- | --- |
| `major` | true | `units` ≥ 10; or Site area = "Yes, 0.5 ha or more" | Annex B: 10 or more homes, or a site of 0.5 ha or more. |
| `major` | false | always |  |
| `unmetNeed` | true | Housing land supply = "No, below five years"; or Housing Delivery Test = "Yes, below 75%" | GB7 footnote 41; S5(1)(j). |
| `unmetNeed` | false | always |  |
| `tr3Lean` | "fail" | Walking route: footway = "Gaps with no footway, where people walk in the carriageway or on the verge"; or Walking route: footway = "No pedestrian provision for most of the route"; or (Walking route: footway = "Narrow for some or all of the route: too narrow for a wheelchair or pushchair to pass another person", and (Walking route: traffic speed = "40 mph"; or Walking route: traffic speed = "50 mph or more")); or ((Bus service = "Minimal: one or two days a week, or demand-responsive without evidence it serves the site" or Bus service = "None"), and Everyday services = "More than 2 km, or not available locally", and not Rail = "A well-connected station (Annex B) within about 800 m") | Provisional: the route answers point to car reliance. |
| `tr3Lean` | "pass" | Walking route: footway = "A continuous footway of adequate width for the whole route", and not (Walking route: footway = "Gaps with no footway, where people walk in the carriageway or on the verge"), and not (Walking route: footway = "No pedestrian provision for most of the route"), and not (Walking route: footway = "Narrow for some or all of the route: too narrow for a wheelchair or pushchair to pass another person"), and Walking route: lighting = "Lit throughout", and not (Walking route: traffic speed = "40 mph"; or Walking route: traffic speed = "50 mph or more"), and (Bus service = "Frequent: at least hourly through the day, including weekends"; or Rail = "A well-connected station (Annex B) within about 800 m"), and not Everyday services = "More than 2 km, or not available locally" | Provisional: a continuous route with a genuine transport alternative. |
| `tr3Lean` | "balanced" | always |  |
| `heEffectLean` | "total-loss" | HE5(2): what would the effect be? = "Demolition, or removal of every element that gives the asset significance" |  |
| `heEffectLean` | "substantial" | HE5(2): what would the effect be? = "Seriously affects a key element of significance — for example the legibility of a principal historic elevation"; or HE5(2): what would the effect be? = "Removes the main feature from which the asset draws its significance" |  |
| `heEffectLean` | "harm-high" | HE5(2): what would the effect be? = "Removes a historic functional link — for example a farmhouse losing its adjoining farmland" |  |
| `heEffectLean` | "harm-moderate" | HE5(2): what would the effect be? = "The development would dominate a key element of the setting, or erode the rural or open context in which the asset is experienced" |  |
| `heEffectLean` | "harm-low" | HE5(2): what would the effect be? = "A minor part of the setting; the proposal is subordinate, glimpsed or peripheral, leaving the main significance legible" |  |
| `heEffectLean` | "positive" | HE5(2): what would the effect be? = "Positive: removes a harmful later addition, or reveals or restores a lost feature" |  |
| `heEffectLean` | "none" | always |  |
| `dp3Lean` | "conflict" | DP3(3): what does the scheme conflict with? = "DP3(1) context — does not respond to the history, character and features of the site and its setting, or fails to integrate with and enhance its surroundings"; or DP3(3): what does the scheme conflict with? = "An explicit design standard in the development plan — a Village Design Statement, design guide, code or masterplan"; or DP3(3): what does the scheme conflict with? = "DP3(2)(a) Liveability — mix, tenures, social interaction, robustness"; or DP3(3): what does the scheme conflict with? = "DP3(2)(b) Climate — layout, orientation, massing, materials; overheating and net zero"; or DP3(3): what does the scheme conflict with? = "DP3(2)(c) Nature — green infrastructure and habitats (tree cover is the separate DP3(2)(c) step above)"; or DP3(3): what does the scheme conflict with? = "DP3(2)(d) Movement — walking, wheeling, cycling and public-transport connections"; or DP3(3): what does the scheme conflict with? = "DP3(2)(e) Built form — streets, spaces, density and the pattern of buildings"; or DP3(3): what does the scheme conflict with? = "DP3(2)(f) Public space — safe, secure, inclusive, accessible spaces"; or DP3(3): what does the scheme conflict with? = "DP3(2)(g) Identity — attractive, distinctive, characterful development and local character" |  |
| `dp3Lean` | "none" | always |  |
| `outside` | true | Green Belt = "No", and (Settlement = "Outside any settlement" or Settlement = "Partly within, partly outside") | S3(1)(b), S3(2). |
| `outside` | false | always |  |
| `designated` | true | Heritage assets = "Grade II listed building"; or Heritage assets = "Grade I or II* listed building"; or Heritage assets = "Conservation area"; or Heritage assets = "Registered park or garden"; or Heritage assets = "Scheduled monument, or other asset of the highest significance" | Annex B: designated heritage assets. |
| `designated` | false | always |  |
| `s5pass` | true | (S5(1) category = "S5(1)(c): reuse, extension, alteration or replacement of an existing building", and S5(1)(c): existing building = "Yes"); or (S5(1) category = "S5(1)(d): redevelopment of previously developed land", and S5(1)(d): previously developed land = "Yes"); or (S5(1) category = "S5(1)(e): limited infilling within a group of houses", and S5(1)(e): limited infilling = "Yes"); or (S5(1) category = "S5(1)(f): an exception site (HO10), or a Community Right to Build or Neighbourhood Development Order", and S5(1)(f): exception site = "Yes"); or (S5(1) category = "S5(1)(h): land around a well-connected station", and S5(1)(h): well-connected station = "Yes"); or (S5(1) category = "S5(1)(i): land allocated for this purpose in the development plan", and S5(1)(i): allocated land = "Yes"); or (S5(1) category = "S5(1)(j): evidenced unmet need, physically well-related to an existing settlement", and S5(1)(j): unmet need = "Yes") |  |
| `s5pass` | false | always |  |
| `route` | "S5(5)" | (Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and ((GB7 category = "GB7(1)(b): reuse, extension, alteration or replacement of an existing building", and GB7(1)(b): existing building = "Yes: all conditions met"); or (GB7 category = "GB7(1)(c): limited infilling in a village lying within the Green Belt", and GB7(1)(c): limited infilling in a village = "Yes: limited infilling in the village"); or (GB7 category = "GB7(1)(d): limited affordable housing for local community needs", and GB7(1)(d): limited affordable housing = "Yes"); or (GB7 category = "GB7(1)(e): redevelopment of previously developed land", and GB7(1)(e): previously developed land = "Yes: PDL, and no substantial harm to openness"); or (GB7 category = "GB7(1)(h): land around a well-connected station", and GB7(1)(h): land around a well-connected station = "Yes: every limb is met"); or (GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply", and not (GB7(1)(g)(i): is it grey belt? = "(a) Checking the unrestricted sprawl of a large built-up area"; or GB7(1)(g)(i): is it grey belt? = "(b) Preventing neighbouring towns from merging into one another"; or GB7(1)(g)(i): is it grey belt? = "(d) Preserving the setting and special character of historic towns"), and GB7(1)(g)(i): would it fundamentally undermine the Green Belt? = "No", and unmetNeed = "true", and TR3: is this a sustainable location? = "Yes: a sustainable location", and (not major = "true"; or GB7(1)(g)(iv): Golden Rules = "Yes"))) | GB7 category met: not inappropriate (S5(5)). |
| `route` | "GB6(2)" | Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt" | Inappropriate development (GB6). |
| `route` | "S4" | Green Belt = "No", and Settlement = "Within a settlement" | S3(1)(a). |
| `route` | "S5(1)" | outside = "true", and s5pass = "true" | S5(1). |
| `route` | "S5(3)" | outside = "true", and S5(3): isolated homes = "Yes: isolated" | S5(3). |
| `route` | "S5(4)" | outside = "true" | S5(4). |

## The site and the proposal

### Green Belt `gb` (question)

**Shown when:** always

**Asks:** Is the site in the Green Belt?

- No
- Yes, open Green Belt
- Yes, in or on the edge of a village washed over by the Green Belt

**Guidance:**
- In the Green Belt, policies S4 and S5 do not apply: the route is GB6, GB7 and GB8 (S5(5)).
- Grey belt is still Green Belt, so answer Yes. Grey belt is not a designation or a line on the policies map. It is a label for Green Belt land that meets the Annex B definition: previously developed land, or land that does not strongly contribute to purposes (a), (b) or (d). Being grey belt does not take the site out of the Green Belt. It only opens a route to being "not inappropriate" under GB7(1)(g), which this tool tests later.
- A council's Green Belt assessment may identify areas of grey belt (Annex E). That is evidence for the judgement, not a finding that binds a decision on a particular site.
- Local Green Space (HC8) is decided consistently with Green Belt policy. This version of the tool does not cover it.

**Framework text:**

> **S5(5)** This policy does not apply to development proposals in the Green Belt or on land designated as Local Green Space, which should instead be determined in accordance with policies HC8, GB6, GB7 and/or GB8 (as appropriate). However, where development would not be inappropriate in these locations (through the application of policies HC8 and GB7), proposals should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework, and applying paragraph 2 of this policy.
>
> **GB6(1)** Development in the Green Belt is inappropriate unless it falls within one of the categories in policy GB7.

### A washed-over village is not a "settlement" `washedOverSettlement` (info)

**Shown when:** Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"

**Asks:** Annex B excludes villages that lie within, and are defined as part of, the Green Belt from the Framework's definition of "settlement". S4 (within settlements) cannot apply, and S5(5) sends the proposal to GB6 to GB8 in any event. Village facilities still matter under TR3, but as facts about the location, not as a settlement category.

**Contested:** Some council reports have treated a washed-over village as a settlement: asking whether a site is "well-related to an existing settlement" (an S5(1)(j) test), or treating a site within the village boundary as a sustainable location without examining the route. Appeals have now gone both ways. One applied the exclusion squarely: villages defined as part of the Green Belt "are not settlements for the purposes of the Framework, and consequently Policy S4 is not engaged" (6009919 ¶49). Another ran S4 for a Green Belt site inside a village's defined settlement boundary, leaving the Green Belt question undecided because the appeal failed on heritage (6010097 ¶15, ¶20).
- *Annex B: not a settlement*: The Framework definition applies "for the purpose of this Framework". S4 is not engaged, and the proposal is decided under GB6 and GB7 (6009919 ¶49). The location question is answered under GB7(1)(g)(iii) and TR3 on the facts of the route.
- *Treated as a settlement in practice*: Council reports that ran settlement-based tests for washed-over villages, and one appeal that applied S4 to a Green Belt site within a village's defined settlement boundary: "As the proposal is within a settlement, it benefits from the in-principle support provided by policies S3 and S4 of the Framework" (6010097 ¶15).

**Framework text:**

> **AnnexB:settlement** Includes cities, towns, villages and other predominantly built-up areas, including land which is allocated or has permission for development which will form part of the built-up area once the development is complete. This includes areas defined as a settlement in the development plan (whether using defined settlement boundaries or equivalent terms, or criteria for identifying settlement extents where boundaries have yet to be defined). Settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas, unless specifically defined as a settlement in the development plan. For the purpose of this Framework they also exclude villages which lie within and are defined as part of the Green Belt in the development plan.
>
> **S5(5)** This policy does not apply to development proposals in the Green Belt or on land designated as Local Green Space, which should instead be determined in accordance with policies HC8, GB6, GB7 and/or GB8 (as appropriate). However, where development would not be inappropriate in these locations (through the application of policies HC8 and GB7), proposals should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework, and applying paragraph 2 of this policy.

### Settlement `settlementLoc` (question)

**Shown when:** Green Belt = "No"

**Asks:** Is the site within a settlement, as the Framework defines it?

- Within a settlement
- Outside any settlement
- Partly within, partly outside

**Findings:**
- if Settlement = "Partly within, partly outside": *note* **S3(2)**: The site is partly within and partly outside a settlement: S4 applies to the part inside and S5 to the part outside, before an overall view is reached on the whole proposal (S3(2)).

**Guidance:**
- Settlements include land allocated or with permission that will form part of the built-up area.
- Hamlets and scattered groups of houses outside predominantly built-up areas are not settlements unless the development plan defines them as such.

**Cases:** policies AnnexB:settlement, S3

**Framework text:**

> **S3(1)** Decisions on development proposals should apply a presumption in favour of sustainable development. This means: a. Policy S4 in this Framework should be applied when considering development proposals within settlements; b. Outside settlements, policy S5 should be applied; and c. In all locations, development proposals that accord with both an up-to-date development plan and the decision-making policies in this Framework should be approved without delay.
>
> **AnnexB:settlement** Includes cities, towns, villages and other predominantly built-up areas, including land which is allocated or has permission for development which will form part of the built-up area once the development is complete. This includes areas defined as a settlement in the development plan (whether using defined settlement boundaries or equivalent terms, or criteria for identifying settlement extents where boundaries have yet to be defined). Settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas, unless specifically defined as a settlement in the development plan. For the purpose of this Framework they also exclude villages which lie within and are defined as part of the Green Belt in the development plan.
>
> **S3(2)** Where a development proposal falls partly within and partly outside a settlement, policies S4 and S5 should be applied to the relevant parts which are inside or outside of the settlement boundary (as appropriate), before coming to an overall view on the proposal.

### Proposal `devType` (question)

**Shown when:** always

**Asks:** What is proposed?

- New-build housing on a greenfield or undeveloped site
- Affordable housing for local needs (rural exception site or similar)
- Reuse, conversion, extension or replacement of an existing building for housing
- Housing on previously developed land

**Guidance:**
- This version covers residential development. Other development types (commercial, telecoms, householder and so on) are outside its scope.

**Framework text:**

> **AnnexB:PDL** Land which has been lawfully developed and is or was occupied by a permanent structure and any fixed surface infrastructure associated with it, including the curtilage of the developed land (although it should not be assumed that the whole of the curtilage should be developed). It also includes land comprising large areas of fixed surface infrastructure such as large areas of hardstanding which have been lawfully developed. Previously developed land excludes: land that is or was last occupied by agricultural or forestry buildings; land that has been developed but where provision for restoration has been made through development management procedures (including development related to minerals extraction, waste disposal by landfill and renewable and low carbon energy development, where provision for restoration exists); land in built-up areas such as residential gardens, parks, recreation grounds and allotments; and land that was previously developed but where the remains of the permanent structure or fixed surface structure have blended into the landscape.

### Number of homes `units` (question)

**Shown when:** always

**Asks:** How many homes (net)?

Number (homes)

**Guidance:**
- For a permission in principle with a range, use the upper end: inspectors assess the maximum (e.g. appeal 6003055, ¶9).

### Site area `largeSite` (question)

**Shown when:** `units` < 10

**Asks:** Is the site 0.5 hectares or more?

- No, under 0.5 ha
- Yes, 0.5 ha or more

**Framework text:**

> **AnnexB:major-development** For housing, development where 10 or more homes will be provided, or the site has an area of 0.5 hectares or more.

### Heritage assets `heritage` (question)

**Shown when:** always

**Asks:** Which heritage assets could the proposal affect, including through development in their setting? Select all that apply, or none.

- Grade II listed building
- Grade I or II* listed building
- Conservation area
- Registered park or garden
- Scheduled monument, or other asset of the highest significance
- Non-designated heritage asset (identified by the council: e.g. on a local heritage list, in a neighbourhood plan or the Historic Environment Record, or during the decision; such as an unregistered historic park)

**Guidance:**
- Setting is "the surroundings in which a heritage asset is experienced". It is not limited to views: inspectors have found harm through lost historic and functional relationships without intervisibility (e.g. 6006475 ¶14, ¶32; 6007136 ¶21).

**Framework text:**

> **AnnexB:setting** The surroundings in which a heritage asset is experienced. Its extent is not fixed and may change as the asset and its surroundings evolve. Elements of a setting may make a positive or negative contribution to the significance of an asset, may affect the ability to appreciate that significance or may be neutral.
>
> **AnnexB:heritage-asset** Heritage asset: A building, monument, site, place, area or landscape identified as having a degree of significance meriting consideration in planning decisions, because of its heritage interest. It includes but is not limited to designated heritage assets and assets identified by the local planning authority (including local listing).
>
> **HE5(1)** Development proposals affecting heritage assets should be accompanied by an assessment of the significance of the assets affected (including any contribution made by their setting) and of the potential effect of the proposal on their significance.

### Housing land supply `supply` (question)

**Shown when:** always

**Asks:** Can the local planning authority demonstrate a five-year supply of deliverable housing sites (with the relevant buffer)?

- No, below five years
- Yes, five years or more
- Not known

**Framework text:**

> **GB7(1)(g)(ii)** Which, in the case of applications involving the provision of housing, means the lack of a five year supply of deliverable housing sites, including the relevant buffer where applicable, or where the Housing Delivery Test result was below 75% of the housing requirement over the previous three years
>
> **S5(1)(j)** j. Development which would address an evidenced unmet need (including, but not limited to, development proposals involving the provision of housing where the local planning authority cannot demonstrate a five year supply of deliverable housing sites or scores below 75% in the most recent Housing Delivery Test), and where the development would: i. Be physically well-related to an existing settlement (unless the nature of the development would make this inappropriate) and be of a scale which can be accommodated taking into account the existing or proposed availability of infrastructure; or

### Housing Delivery Test `hdt` (question)

**Shown when:** not Housing land supply = "No, below five years"

**Asks:** Was the most recent Housing Delivery Test result below 75%?

- Yes, below 75%
- No, 75% or more
- Not known

**Framework text:**

> **GB7(1)(g)(ii)** Which, in the case of applications involving the provision of housing, means the lack of a five year supply of deliverable housing sites, including the relevant buffer where applicable, or where the Housing Delivery Test result was below 75% of the housing requirement over the previous three years

### Site constraints `constraints` (question)

**Shown when:** always

**Asks:** Which of these apply? Select all that apply, or none. Each one opens the policies that govern it.

- Known risk from any form of flooding (river, sea, surface water, groundwater), now or in the future
- Within a National Park, National Landscape or the Broads
- Within the setting of a Protected Landscape
- Ancient woodland, or ancient or veteran trees, affected
- Habitats or protected species that could be significantly harmed
- Established trees or hedgerows lost or cut back (including for visibility splays)
- New or altered vehicular access onto a public road
- A railway station within about 800 m walk
- A neighbourhood plan covers the site (made, or approved at referendum)

## Green Belt

### GB7 category `gb7cat` (question)

**Shown when:** Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"

**Asks:** Which GB7 category does the proposal rely on to be "not inappropriate"?

- GB7(1)(b): reuse, extension, alteration or replacement of an existing building _(offered when Proposal = "Reuse, conversion, extension or replacement of an existing building for housing")_
- GB7(1)(c): limited infilling in a village lying within the Green Belt _(offered when Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt")_
- GB7(1)(d): limited affordable housing for local community needs _(offered when Proposal = "Affordable housing for local needs (rural exception site or similar)")_
- GB7(1)(e): redevelopment of previously developed land _(offered when Proposal = "Housing on previously developed land" or Proposal = "Reuse, conversion, extension or replacement of an existing building for housing")_
- GB7(1)(h): land around a well-connected station _(offered when Site constraints = "A railway station within about 800 m walk")_
- GB7(1)(g): grey belt — or none of the categories above apply

**Guidance:**
- Choose the category the application relies on. If it argues more than one, run the tool again for each.
- Categories that cannot apply to the proposal type you chose are not offered.
- Each category is a separate test in the steps that follow. The last option, GB7(1)(g), is the residual route: choose it when the scheme relies on grey belt or when none of the specific categories fit. If it is not grey belt, or another part of (g) fails, the proposal is inappropriate development, approvable only in very special circumstances where the harm is clearly outweighed (GB6(2)) — and the tool records the reason.

**Cases:** policies GB7(1); grouped by finding

**Framework text:**

> **GB6(1)** Development in the Green Belt is inappropriate unless it falls within one of the categories in policy GB7.
>
> **GB7(1)** The following categories of development are not inappropriate in the Green Belt, and therefore should not be regarded as harmful to the Green Belt or be required to demonstrate very special circumstances:

### GB7(1)(g): how this is tested `gb7gPlan` (info)

**Shown when:** (Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply"

**Asks:** Grey belt development is "not inappropriate" only if all four parts are met. The next steps take them in turn.

**Guidance:**
- (i) Grey belt. The land must meet the Annex B grey belt definition — it must not strongly contribute to Green Belt purposes (a), (b) or (d) — and the development must not fundamentally undermine the purposes of the remaining Green Belt.
- (ii) Unmet need. There must be an evidenced unmet need. For housing, footnote 41 makes this a five-year-supply or Housing Delivery Test question.
- (iii) Sustainable location. The site must be a sustainable location, with particular reference to policy TR3.
- (iv) Golden Rules. Major development must also comply with GB8.
- If any part is not met, GB7(1)(g) does not apply and the proposal is inappropriate development — approvable only in very special circumstances, where the harm is clearly outweighed (GB6(2)).

**Framework text:**

> **GB7(1)** The following categories of development are not inappropriate in the Green Belt, and therefore should not be regarded as harmful to the Green Belt or be required to demonstrate very special circumstances:
>
> **GB6(2)** Inappropriate development is, by definition, harmful to the Green Belt and should not be approved except in very special circumstances. Such circumstances will not exist unless the potential harm to the Green Belt by reason of inappropriateness and any other harm resulting from the proposed development, is clearly outweighed by other considerations. In making this assessment, substantial weight should be given to the harm to the Green Belt which would be caused, including harm to its openness.

### GB7(1)(b): existing building `gb7b` (judgement)

**Shown when:** (Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(b): reuse, extension, alteration or replacement of an existing building"

**Asks:** Is the existing building of permanent and substantial construction and lawful, and would any extension or alteration avoid a disproportionate increase over the original building (or a replacement be for the same use and not materially larger)?

- Yes: all conditions met
- No: at least one condition is not met

**Findings:**
- if GB7(1)(b): existing building = "Yes: all conditions met": *pass* **GB7(1)(b)**: Falls within GB7(1)(b), so it is not inappropriate development.
- if GB7(1)(b): existing building = "No: at least one condition is not met": *fail* **GB7(1)(b)**: Does not meet GB7(1)(b), so it is inappropriate development.

**Guidance:**
- "Original building" means the building as it existed on 1 July 1948, or as originally built if later (footnote 40).

**Cases:** policies GB7(1)(b); grouped by finding

**Framework text:**

> **GB7(1)(b)** b. The reuse, extension, alteration or replacement of an existing building, provided that the existing building is of permanent and substantial construction, is lawful in planning terms, and any extension or alteration will not result in a disproportionate increase in size compared to the original building. In the case of proposals for a replacement building, it should be for the same use and not materially larger than the one it replaces;

### GB7(1)(c): limited infilling in a village `gb7c` (judgement)

**Shown when:** (Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(c): limited infilling in a village lying within the Green Belt"

**Asks:** Is the site in the village (as it exists on the ground), and is the proposal limited infilling?

- Yes: limited infilling in the village
- No

**Findings:**
- if GB7(1)(c): limited infilling in a village = "Yes: limited infilling in the village": *pass* **GB7(1)(c)**: Limited infilling in a village within the Green Belt, so it is not inappropriate development.
- if GB7(1)(c): limited infilling in a village = "No": *fail* **GB7(1)(c)**: Not limited infilling in a village, so it is inappropriate development.

**Guidance:**
- Whether a site is "in a village" is a matter of judgement on the ground; a settlement boundary in the plan is relevant but not decisive.
- Infilling usually means filling a small gap in an otherwise built-up frontage.

**Cases:** policies GB7(1)(c), S5(1)(e); grouped by finding

**Framework text:**

> **GB7(1)(c)** c. Limited infilling in villages lying within the Green Belt;

### GB7(1)(d): limited affordable housing `gb7d` (judgement)

**Shown when:** (Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(d): limited affordable housing for local community needs"

**Asks:** Is the proposal limited affordable housing for local community needs under Framework or development plan policies (for instance a rural exception site)?

- Yes
- No

**Findings:**
- if GB7(1)(d): limited affordable housing = "Yes": *pass* **GB7(1)(d)**: Limited affordable housing for local community needs, so it is not inappropriate development.
- if GB7(1)(d): limited affordable housing = "No": *fail* **GB7(1)(d)**: Does not meet GB7(1)(d), so it is inappropriate development.

**Framework text:**

> **GB7(1)(d)** d. Limited affordable housing for local community needs under policies set out in this Framework or the development plan (for instance, on a rural exception site);

### GB7(1)(e): previously developed land `gb7e` (judgement)

**Shown when:** (Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(e): redevelopment of previously developed land"

**Asks:** Is the land previously developed land as Annex B defines it, and would the redevelopment avoid substantial harm to the openness of the Green Belt?

- Yes: PDL, and no substantial harm to openness
- No: the land is not PDL
- No: substantial harm to openness

**Findings:**
- if GB7(1)(e): previously developed land = "Yes: PDL, and no substantial harm to openness": *pass* **GB7(1)(e)**: Redevelopment of previously developed land without substantial harm to openness, so it is not inappropriate development.
- if GB7(1)(e): previously developed land = "No: the land is not PDL": *fail* **AnnexB:PDL**: The land is not previously developed land as defined in Annex B, so GB7(1)(e) does not apply and the proposal is inappropriate development (GB6).
- if GB7(1)(e): previously developed land = "No: substantial harm to openness": *fail* **GB7(1)(e)**: Redevelopment would cause substantial harm to openness, so it is inappropriate development.

**Guidance:**
- Annex B excludes land last occupied by agricultural or forestry buildings, and remains that have blended into the landscape.

**Cases:** policies GB7(1)(e), AnnexB:PDL; grouped by finding

**Framework text:**

> **GB7(1)(e)** e. The redevelopment of previously developed land (including a material change of use to residential or mixed-use including residential), which would not cause substantial harm to the openness of the Green Belt;
>
> **AnnexB:PDL** Land which has been lawfully developed and is or was occupied by a permanent structure and any fixed surface infrastructure associated with it, including the curtilage of the developed land (although it should not be assumed that the whole of the curtilage should be developed). It also includes land comprising large areas of fixed surface infrastructure such as large areas of hardstanding which have been lawfully developed. Previously developed land excludes: land that is or was last occupied by agricultural or forestry buildings; land that has been developed but where provision for restoration has been made through development management procedures (including development related to minerals extraction, waste disposal by landfill and renewable and low carbon energy development, where provision for restoration exists); land in built-up areas such as residential gardens, parks, recreation grounds and allotments; and land that was previously developed but where the remains of the permanent structure or fixed surface structure have blended into the landscape.

### GB7(1)(g)(i): is it grey belt? `greyBelt` (judgement)

**Shown when:** (Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply"

**Asks:** Judged on the ground, which of Green Belt purposes (a), (b) and (d) does the land strongly contribute to? Tick each that applies. Leave all unticked if it does not strongly contribute to any — that makes the land grey belt.

- (a) Checking the unrestricted sprawl of a large built-up area
- (b) Preventing neighbouring towns from merging into one another
- (d) Preserving the setting and special character of historic towns

**Findings:**
- if not (GB7(1)(g)(i): is it grey belt? = "(a) Checking the unrestricted sprawl of a large built-up area"; or GB7(1)(g)(i): is it grey belt? = "(b) Preventing neighbouring towns from merging into one another"; or GB7(1)(g)(i): is it grey belt? = "(d) Preserving the setting and special character of historic towns"): *pass* **AnnexB:grey-belt**: The land is grey belt: it does not strongly contribute to purposes (a), (b) or (d).
- if GB7(1)(g)(i): is it grey belt? = "(a) Checking the unrestricted sprawl of a large built-up area"; or GB7(1)(g)(i): is it grey belt? = "(b) Preventing neighbouring towns from merging into one another"; or GB7(1)(g)(i): is it grey belt? = "(d) Preserving the setting and special character of historic towns": *fail* **AnnexB:grey-belt**: The land strongly contributes to purpose (a), (b) or (d), so it is not grey belt: GB7(1)(g) cannot apply and the proposal is inappropriate development (GB6).

**Guidance:**
- This is a planning judgement about the site, not a check against a map. Grey belt is a label for Green Belt land that meets the Annex B definition, not a designation. A council's Green Belt assessment is evidence, but it does not settle the question.
- Only purposes (a), (b) and (d) count for grey belt. Purpose (c), encroachment on the countryside, and purpose (e), regeneration, do not — so they are not listed below.
- A strong contribution to any one of (a), (b) or (d) excludes the land from grey belt. Tick none and the land is grey belt; the next step then tests whether the development would fundamentally undermine the wider Green Belt.
- Annex E: villages are not "large built-up areas" for purpose (a); purpose (b) concerns towns merging, not villages; purpose (d) concerns historic towns, not villages. Inspectors apply Annex E directly on this point (e.g. 6011103 ¶12, 6007428 ¶10).

**Cases:** policies AnnexB:grey-belt, GB7(1)(g)(i); grouped by finding

**Framework text:**

> **AnnexB:grey-belt** For the purposes of plan-making and decision-making, 'grey belt' is defined as land in the Green Belt comprising previously developed land and/or any other land that, in either case, does not strongly contribute to any of purposes (a), (b), or (d) in policy GB2.
>
> **GB2(1)** a. Check the unrestricted sprawl of large built-up areas; b. Prevent neighbouring towns merging into one another; c. Assist in safeguarding the countryside from encroachment; d. Preserve the setting and special character of historic towns; and e. Assist urban regeneration by encouraging the recycling of derelict and other urban land.
>
> **AnnexE(3)** This purpose relates to the sprawl of large built-up areas. Villages should not be considered large built-up areas.
>
> **AnnexE(4)** This purpose relates to the merging of towns, not villages.
>
> **AnnexE(5)** This purpose relates to historic towns, not villages.

### GB7(1)(g)(i): would it fundamentally undermine the Green Belt? `greyBeltUndermine` (judgement)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply"), and not (GB7(1)(g)(i): is it grey belt? = "(a) Checking the unrestricted sprawl of a large built-up area"; or GB7(1)(g)(i): is it grey belt? = "(b) Preventing neighbouring towns from merging into one another"; or GB7(1)(g)(i): is it grey belt? = "(d) Preserving the setting and special character of historic towns")

**Asks:** Would the development fundamentally undermine the purposes (taken together) of the remaining Green Belt across the area of the plan?

- No
- Yes

**Findings:**
- if GB7(1)(g)(i): would it fundamentally undermine the Green Belt? = "No": *pass* **GB7(1)(g)(i)**: Uses grey belt land and would not fundamentally undermine the remaining Green Belt.
- if GB7(1)(g)(i): would it fundamentally undermine the Green Belt? = "Yes": *fail* **GB7(1)(g)(i)**: Would fundamentally undermine the purposes of the remaining Green Belt, so GB7(1)(g) cannot apply and the proposal is inappropriate development (GB6).

**Guidance:**
- This is rarely met, so the answer is usually "No". Across the decisions reviewed, no scheme was found to fundamentally undermine the remaining Green Belt. A "Yes" needs a genuinely plan-wide effect, not just local harm to the site and its edges.
- The test is plan-wide and weighs all five Green Belt purposes together: (a) checking the unrestricted sprawl of large built-up areas; (b) preventing neighbouring towns merging into one another; (c) safeguarding the countryside from encroachment; (d) preserving the setting and special character of historic towns; and (e) assisting urban regeneration. It is wider than the grey belt question, which uses only (a), (b) and (d).
- Decisions on small village-edge schemes have usually found the effect limited (e.g. stratford-26-00617-PIP, stratford-26-00918-PIP).

**Cases:** policies GB7(1)(g)(i); grouped by finding

**Framework text:**

> **GB7(1)(g)(i)** i. The development would utilise grey belt land and would not fundamentally undermine the purposes (taken together) of the remaining Green Belt across the area of the plan;

### GB7(1)(g)(ii): evidenced unmet need `unmetNeedCheck` (info)

**Shown when:** (Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply"

**Asks:** For housing, footnote 41 makes this limb mechanical: there is unmet need if the authority lacks a five-year supply (with buffer) or its Housing Delivery Test result was below 75%. The finding follows from your earlier answers.

**Findings:**
- if unmetNeed = "true": *pass* **GB7(1)(g)(ii)**: There is an evidenced unmet need for housing (footnote 41).
- if not unmetNeed = "true": *fail* **GB7(1)(g)(ii)**: An evidenced unmet need is not shown on the supply and delivery answers given.

**Cases:** policies GB7(1)(g)(ii); grouped by finding

**Framework text:**

> **GB7(1)(g)(ii)** ii. There is an evidenced unmet need for the type of development proposed
>
> **GB7(1)(g)(ii)** Which, in the case of applications involving the provision of housing, means the lack of a five year supply of deliverable housing sites, including the relevant buffer where applicable, or where the Housing Delivery Test result was below 75% of the housing requirement over the previous three years

### GB7(1)(h): land around a well-connected station `gb7h` (judgement)

**Shown when:** (Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(h): land around a well-connected station"

**Asks:** Does the proposal meet every limb of GB7(1)(h), applying the Annex B definitions of "well-connected station" and "reasonable walking distance"?

- Yes: every limb is met
- No

**Findings:**
- if GB7(1)(h): land around a well-connected station = "Yes: every limb is met": *pass* **GB7(1)(h)**: Meets GB7(1)(h), so it is not inappropriate development.
- if GB7(1)(h): land around a well-connected station = "No": *fail* **GB7(1)(h)**: Does not meet GB7(1)(h): the station is not well-connected, or the site is not within reasonable walking distance, so the proposal is inappropriate development (GB6).

**Guidance:**
- A well-connected station needs at least four trains an hour overall, or two an hour in one direction, through the daytime on a normal weekday, and must be within a top-80 Travel to Work Area by GVA.
- Only the part of a site within reasonable walking distance qualifies (Annex B).
- An hourly or two-hourly rural service does not qualify (e.g. 6006637 ¶18).

**Cases:** policies GB7(1)(h), S5(1)(h); grouped by finding

**Framework text:**

> **GB7(1)(h)** h. Residential or mixed-use development which would: i. Be within reasonable walking distance of a well-connected station (applying the definitions in the glossary at Annex B); ii. Be physically well-related to the station or the settlement within which the station is located; iii. Be of a scale which can be accommodated taking into account the existing or proposed availability of infrastructure; iv. Not prejudice any proposals for long-term comprehensive development in the same location; and v. In the case of proposals for major development, comply with policy GB8.
>
> **AnnexB:well-connected-station** Railway stations and underground, tram and light rail stops located within a top 80 Travel to Work Area located partially or fully within England by Gross Value Added (GVA) and which, in the normal weekday timetable, are served (or have a reasonable prospect of being served due to planned upgrades or through agreement with the rail operator) throughout the daytime by at least four trains or trams per hour overall, or at least two trains or trams per hour in any one direction.
>
> **AnnexB:reasonable-walking-distance** For the purpose of policies S5, L3, GB7 (relating to land around well-connected stations), this should be considered to be around 800 metres, or around 10 minutes' walk time if topography, route availability and quality or physical barriers would prevent or discourage walking from up to 800 metres away.

### GB7(1)(g)(iv): Golden Rules `gb8` (judgement)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"), and GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply"), and major = "true"

**Asks:** Does the proposal comply with GB8: affordable housing at the required level, necessary infrastructure improvements, and new or improved green space accessible to the public?

- Yes
- No

**Findings:**
- if GB7(1)(g)(iv): Golden Rules = "Yes": *pass* **GB7(1)(g)(iv)**: Complies with the Golden Rules (GB8), which carries substantial weight (GB8(2)).
- if GB7(1)(g)(iv): Golden Rules = "No": *fail* **GB7(1)(g)(iv)**: Does not comply with the Golden Rules (GB8).

**Guidance:**
- GB8 does not apply to every major scheme. Footnote 43 excludes traveller sites, land released from the Green Belt through a plan adopted before 12 December 2024, and development permitted before that date; for those, the Golden Rules are not a requirement.
- Where GB8 does apply and there is no development plan requirement, the default affordable level is 15 percentage points above the highest existing affordable requirement, capped at 50%; 50% where there is no existing requirement (GB8(1)(a)(ii)). Footnote 44 sets out the limited circumstances in which the cap does not apply.

**Cases:** policies GB8, GB7(1)(g)(iv); grouped by finding

**Framework text:**

> **GB7(1)(g)(iv)** iv. In the case of major development involving the provision of housing, the development proposed complies with policy GB8.
>
> **GB8(1)** Where major development involving the provision of housing is proposed on land released from the Green Belt through plan preparation or review, or on sites in the Green Belt subject to a planning application, all of the following contributions ('Golden Rules') should be made
>
> **GB8(2)** In considering applications for major development involving the provision of housing on land released from the Green Belt through plan preparation or review, or on sites in the Green Belt subject to a planning application, substantial weight should be given to the importance of complying with the Golden Rules.

## Outside settlements

### S5(1) category `s5cat` (question)

**Shown when:** outside = "true"

**Asks:** Which S5(1) category does the proposal rely on?

- S5(1)(c): reuse, extension, alteration or replacement of an existing building _(offered when Proposal = "Reuse, conversion, extension or replacement of an existing building for housing")_
- S5(1)(d): redevelopment of previously developed land _(offered when Proposal = "Housing on previously developed land" or Proposal = "Reuse, conversion, extension or replacement of an existing building for housing")_
- S5(1)(e): limited infilling within a group of houses
- S5(1)(f): an exception site (HO10), or a Community Right to Build or Neighbourhood Development Order _(offered when Proposal = "Affordable housing for local needs (rural exception site or similar)")_
- S5(1)(h): land around a well-connected station _(offered when Site constraints = "A railway station within about 800 m walk")_
- S5(1)(i): land allocated for this purpose in the development plan
- S5(1)(j): evidenced unmet need, physically well-related to an existing settlement _(offered when unmetNeed = "true")_
- None of these

**Guidance:**
- Choose the category the application relies on. Categories that cannot apply to the proposal type or your earlier answers are not offered.

**Cases:** policies S5(1); grouped by finding

**Framework text:**

> **S5(1)** Only certain forms of development should be approved outside settlements, as set out in the following list. These should be approved, unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework:

### S5(1)(c): existing building `s5c` (judgement)

**Shown when:** outside = "true", and S5(1) category = "S5(1)(c): reuse, extension, alteration or replacement of an existing building"

**Asks:** Is the existing building permanent, substantial and lawful, with no disproportionate increase in size over the existing building (or a replacement for the same use, not disproportionately larger)?

- Yes
- No

**Findings:**
- if S5(1)(c): existing building = "Yes": *pass* **S5(1)(c)**: Falls within S5(1)(c).
- if S5(1)(c): existing building = "No": *fail* **S5(1)(c)**: Does not meet S5(1)(c).

**Guidance:**
- Unlike GB7(1)(b), S5(1)(c) compares with the existing building as it stood on the Framework's publication date (footnote 25).

**Cases:** policies S5(1)(c); grouped by finding

**Framework text:**

> **S5(1)(c)** c. The reuse, extension, alteration or replacement of an existing building, provided that the existing building is of permanent and substantial construction, is lawful in planning terms, and any extension or alteration will not result in a disproportionate increase in size compared to the existing building. In the case of proposals for a replacement building, it should be for the same use and not disproportionately larger than the one it replaces;

### S5(1)(d): previously developed land `s5d` (judgement)

**Shown when:** outside = "true", and S5(1) category = "S5(1)(d): redevelopment of previously developed land"

**Asks:** Is the land previously developed land as Annex B defines it?

- Yes
- No

**Findings:**
- if S5(1)(d): previously developed land = "Yes": *pass* **S5(1)(d)**: Redevelopment of previously developed land under S5(1)(d).
- if S5(1)(d): previously developed land = "No": *fail* **S5(1)(d)**: The land is not previously developed land, so S5(1)(d) does not apply.

**Cases:** policies S5(1)(d); grouped by finding

**Framework text:**

> **S5(1)(d)** d. The redevelopment of previously developed land (including a material change of use to residential or mixed-use including residential);
>
> **AnnexB:PDL** Land which has been lawfully developed and is or was occupied by a permanent structure and any fixed surface infrastructure associated with it, including the curtilage of the developed land (although it should not be assumed that the whole of the curtilage should be developed). It also includes land comprising large areas of fixed surface infrastructure such as large areas of hardstanding which have been lawfully developed. Previously developed land excludes: land that is or was last occupied by agricultural or forestry buildings; land that has been developed but where provision for restoration has been made through development management procedures (including development related to minerals extraction, waste disposal by landfill and renewable and low carbon energy development, where provision for restoration exists); land in built-up areas such as residential gardens, parks, recreation grounds and allotments; and land that was previously developed but where the remains of the permanent structure or fixed surface structure have blended into the landscape.

### S5(1)(e): limited infilling `s5e` (judgement)

**Shown when:** outside = "true", and S5(1) category = "S5(1)(e): limited infilling within a group of houses"

**Asks:** Is the proposal limited infilling within an existing group of houses?

- Yes
- No

**Findings:**
- if S5(1)(e): limited infilling = "Yes": *pass* **S5(1)(e)**: Limited infilling within a group of houses under S5(1)(e).
- if S5(1)(e): limited infilling = "No": *fail* **S5(1)(e)**: Not limited infilling within a group of houses.

**Guidance:**
- Decisions have accepted a gap between two houses fronting the same road (6009593 ¶15), but rejected a plot with houses on one side only, which "would extend built form beyond the existing edge of the hamlet rather than being within it" (6008739 ¶9).

**Cases:** policies S5(1)(e); grouped by finding

**Framework text:**

> **S5(1)(e)** e. Limited infilling within groups of houses;

### S5(1)(f): exception site `s5f` (judgement)

**Shown when:** outside = "true", and S5(1) category = "S5(1)(f): an exception site (HO10), or a Community Right to Build or Neighbourhood Development Order"

**Asks:** Is the proposal an exception site under HO10, or brought forward under a Community Right to Build Order or Neighbourhood Development Order?

- Yes
- No

**Findings:**
- if S5(1)(f): exception site = "Yes": *pass* **S5(1)(f)**: An exception site under S5(1)(f).
- if S5(1)(f): exception site = "No": *fail* **S5(1)(f)**: Does not meet S5(1)(f).

**Cases:** policies S5(1)(f); grouped by finding

**Framework text:**

> **S5(1)(f)** f. An exception site as provided for in policy HO10, or development brought forward under a Community Right to Build Order or Neighbourhood Development Order;

### S5(1)(h): well-connected station `s5h` (judgement)

**Shown when:** outside = "true", and S5(1) category = "S5(1)(h): land around a well-connected station"

**Asks:** Does the site meet every limb of S5(1)(h), applying the Annex B definitions?

- Yes
- No

**Findings:**
- if S5(1)(h): well-connected station = "Yes": *pass* **S5(1)(h)**: Within reasonable walking distance of a well-connected station under S5(1)(h).
- if S5(1)(h): well-connected station = "No": *fail* **S5(1)(h)**: Does not meet S5(1)(h).

**Cases:** policies S5(1)(h); grouped by finding

**Framework text:**

> **S5(1)(h)** h. Residential and mixed-use development which would: i. Be within reasonable walking distance of a well-connected station (applying the definitions in the glossary at Annex B); ii. Be physically well-related to the station or the settlement within which the station is located; iii. Be of a scale which can be accommodated taking into account the existing or proposed availability of infrastructure; and iv. Not prejudice any proposals for long-term comprehensive development in the same location.
>
> **AnnexB:well-connected-station** Railway stations and underground, tram and light rail stops located within a top 80 Travel to Work Area located partially or fully within England by Gross Value Added (GVA) and which, in the normal weekday timetable, are served (or have a reasonable prospect of being served due to planned upgrades or through agreement with the rail operator) throughout the daytime by at least four trains or trams per hour overall, or at least two trains or trams per hour in any one direction.
>
> **AnnexB:reasonable-walking-distance** For the purpose of policies S5, L3, GB7 (relating to land around well-connected stations), this should be considered to be around 800 metres, or around 10 minutes' walk time if topography, route availability and quality or physical barriers would prevent or discourage walking from up to 800 metres away.

### S5(1)(i): allocated land `s5i` (judgement)

**Shown when:** outside = "true", and S5(1) category = "S5(1)(i): land allocated for this purpose in the development plan"

**Asks:** Is the land allocated for this purpose in the development plan?

- Yes
- No

**Findings:**
- if S5(1)(i): allocated land = "Yes": *pass* **S5(1)(i)**: Allocated land under S5(1)(i).
- if S5(1)(i): allocated land = "No": *fail* **S5(1)(i)**: The land is not allocated for this purpose.

**Cases:** policies S5(1)(i); grouped by finding

**Framework text:**

> **S5(1)(i)** i. The development of land allocated for that purpose in the development plan (where this lies outside settlements); and

### S5(1)(j): unmet need `s5j` (judgement)

**Shown when:** outside = "true", and S5(1) category = "S5(1)(j): evidenced unmet need, physically well-related to an existing settlement"

**Asks:** Is the site physically well-related to an existing settlement, and of a scale that existing or proposed infrastructure can accommodate?

- Yes
- No

**Findings:**
- if S5(1)(j): unmet need = "Yes": *pass* **S5(1)(j)**: Addresses an evidenced unmet need and is physically well-related to an existing settlement under S5(1)(j).
- if S5(1)(j): unmet need = "No": *fail* **S5(1)(j)**: Not physically well-related to an existing settlement, or of a scale infrastructure cannot accommodate.

**Guidance:**
- "Existing settlement" takes the Annex B definition, which excludes villages washed over by the Green Belt.
- The unmet need limb is met on your supply answers.

**Cases:** policies S5(1)(j); grouped by finding

**Framework text:**

> **S5(1)(j)** j. Development which would address an evidenced unmet need (including, but not limited to, development proposals involving the provision of housing where the local planning authority cannot demonstrate a five year supply of deliverable housing sites or scores below 75% in the most recent Housing Delivery Test), and where the development would: i. Be physically well-related to an existing settlement (unless the nature of the development would make this inappropriate) and be of a scale which can be accommodated taking into account the existing or proposed availability of infrastructure; or

### S5(3): isolated homes `isolated` (judgement)

**Shown when:** outside = "true", and not s5pass = "true"

**Asks:** Would the homes be isolated: outside settlements or groups of houses?

- No: they would be by a group of houses or on a settlement edge
- Yes: isolated

**Cases:** policies S5(3), HO11; grouped by finding

**Framework text:**

> **S5(3)** Development proposals comprising isolated homes, which are those lying outside settlements or groups of houses, should not be approved other than in accordance with policy HO11.

### HO11: isolated homes `ho11` (judgement)

**Shown when:** outside = "true", and S5(3): isolated homes = "Yes: isolated"

**Asks:** Does the proposal meet one of the circumstances in policy HO11 for isolated homes?

- Yes
- No

**Findings:**
- if HO11: isolated homes = "Yes": *pass* **HO11**: An isolated home justified under HO11.
- if HO11: isolated homes = "No": *fail* **S5(3)**: An isolated home that does not meet HO11: S5(3) says it should not be approved.

**Cases:** policies HO11, S5(3); grouped by finding

**Framework text:**

> **S5(3)** Development proposals comprising isolated homes, which are those lying outside settlements or groups of houses, should not be approved other than in accordance with policy HO11.

## Sustainable location

### TR3(1)(a): is a significant amount of movement generated? `tr3Engaged` (judgement)

**Shown when:** outside = "true"

**Asks:** Would the proposal generate "a significant amount of movement, in the context of the area within which [it] would be situated"?

- Yes: a significant amount of movement in this context
- No: not a significant amount of movement in this context
- No, but the car reliance still carries moderate weight here (for example a poor walking route)

**Findings:**
- if TR3(1)(a): is a significant amount of movement generated? = "Yes: a significant amount of movement in this context": *note* **TR3(1)(a)**: TR3(1)(a) is engaged: the proposal would generate a significant amount of movement in this context, so the location must offer a genuine choice of transport modes.
- if TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context": *harm* (limited) **TR3(1)(a)**: The proposal would not generate a significant amount of movement in this context, so TR3(1)(a) is not engaged; any reliance on the car carries limited weight.
- if TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)": *harm* (moderate) **TR3(1)(a)**: TR3(1)(a) is not engaged, as the proposal would not generate a significant amount of movement in this context, but its reliance on the car still carries moderate weight (as at 6010422 ¶49).

**Guidance:**
- There is no fixed number — judge it against the size and pattern of the surrounding area, not in the abstract.
- A handful of homes has been significant in a small or sparsely built village: five homes were "a significant amount of movement in this context" (6010313 ¶13). A single dwelling among existing houses has not (one home was not significant at 6010973 ¶20).
- If it is not engaged, TR3(1)(a) is not a decisive matter, but reliance on the car is still weighed in the planning balance (P12). Inspectors have differed on how much: limited weight is common, but one home with TR3(1)(a) not engaged was given "moderate negative weight" for a poor walking route (6010422 ¶49), and another single home was held to conflict with TR3's "more general principles about sustainable patterns of movement" (6008773 ¶30–32). Car dependence has also been treated as a DP3(2)(d) conflict without clear justification, engaging DP3(3) (6007677 ¶27). If it is engaged, the location must offer a genuine choice of transport modes, tested in the next steps.
- One inspector read the proviso "unless the nature of the development would make this impractical" as covering a change of use of an existing building (6009619 ¶18). The proviso refers to the nature of the development; whether a conversion meets it is a judgement to state.
- This step is not asked in the Green Belt: GB7(1)(g)(iii) requires a sustainable-location finding whatever the scale of the scheme. One home failed there on the route alone, "notwithstanding the small scale of the proposal" (6010253 ¶18).

**Cases:** policies TR3(1)(a); grouped by finding

**Framework text:**

> **TR3(1)(a)** a. Development proposals which could generate a significant amount of movement, in the context of the area within which they would be situated, should be in locations that are sustainable (or which can be made so, taking into account planned improvements, including any provided for as part of the development itself). This means the location should limit the need to travel, particularly by private car, and offer a genuine choice of transport modes for residents and users, unless the nature of the development would make this impractical;

### Walking route: footway `tr3Footway` (question)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"); or outside = "true"), and not (outside = "true", and (TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context" or TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)"))

**Asks:** On the everyday walking route from the site to shops, school and public transport, which of these describe the pedestrian provision? Select all that apply.

- A continuous footway of adequate width for the whole route
- Narrow for some or all of the route: too narrow for a wheelchair or pushchair to pass another person
- On the far side of the road only, so residents must cross to reach it
- Gaps with no footway, where people walk in the carriageway or on the verge
- Broken or uneven surface, or obstructions such as poles or overgrown vegetation
- Not step-free: full-height kerbs, no dropped kerbs or tactile paving at crossings or the destination
- No pedestrian provision for most of the route

**Guidance:**
- Measure the route people would actually use, not a straight-line distance.
- Width matters: a lit, continuous but narrow footway beside a busy road failed at 6008688 (¶14).
- TR4 is framed around the design of the development, but it asks for priority to walking, wheeling and cycling "both within the scheme and with neighbouring areas" (TR4(1)(a)) and for measures that "meet the needs of disabled people, older people and children" (TR4(1)(c)(ii)). A route to services that a wheelchair or pushchair cannot use is not a genuine choice for them under TR3(1)(a).

### Walking route: lighting `tr3Lit` (question)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"); or outside = "true"), and not (outside = "true", and (TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context" or TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)"))

**Asks:** Is the walking route lit?

- Lit throughout
- Partly lit
- Unlit

### Walking route: traffic speed `tr3Speed` (question)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"); or outside = "true"), and not (outside = "true", and (TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context" or TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)"))

**Asks:** What speed limits apply where people walk beside or in the road? Select any that appear along the route.

- 20 or 30 mph
- 40 mph
- 50 mph or more

**Guidance:**
- Where the footway is narrow or absent, the speed beside it matters as much as the limit; a measured 85th-percentile speed is better evidence than the posted limit.

### Walking route: evidenced traffic speed `tr3SpeedEvidence` (question)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"); or outside = "true"), and not (outside = "true", and (TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context" or TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)"))

**Asks:** What is the highest traffic speed evidenced anywhere on the walking route? Use the largest recorded figure at or below the 95th percentile (for example an 85th- or 95th-percentile speed from a speed survey or automatic traffic count).

Number (mph)

**Guidance:**
- Take the figure from the application's own survey where there is one, or from a highway authority, parish or community speed-watch survey. Note the source and date in your own record.
- The 85th-percentile speed is the usual design measure: highway authorities set visibility splays from it.
- Where recorded speeds exceed the limit beside a narrow or missing footway, that is evidence about how attractive the route is to walk, not only about highway safety.

### Everyday services `tr3Services` (question)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"); or outside = "true"), and not (outside = "true", and (TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context" or TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)"))

**Asks:** How far is the walk to everyday services (food shop, primary school, GP)?

- Within about 800 m
- About 800 m to 2 km
- More than 2 km, or not available locally

**Guidance:**
- Measure to the services, not to the edge of the settlement: distances of 0.72 km and 1.15 km to two town edges did not count, because "the distance to key services, facilities and public transport would be significantly further" (6006224 ¶13).

### Bus service `tr3Bus` (question)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"); or outside = "true"), and not (outside = "true", and (TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context" or TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)"))

**Asks:** What bus service is within reasonable walking distance?

- Frequent: at least hourly through the day, including weekends
- Limited: a few journeys a day, or weekdays only
- Minimal: one or two days a week, or demand-responsive without evidence it serves the site
- None

**Guidance:**
- Inspectors want evidence of frequency, hours, destinations and reliability (6009966 ¶22). A twice-weekly bus did not help at 6006637 (¶15). With a timetable in evidence, six buses a day Monday to Saturday, with none in the evenings, on Sundays or bank holidays, was not frequent enough for day-to-day needs (6007668 ¶15, ¶19).
- At inquiry, a bus about every two hours, with no service at commuting times, was still "a genuine sustainable transport mode" for daytime trips such as grocery shopping, alongside term-time school buses; the inspector accepted that commuting by public transport would be challenging (6006497 ¶37–40).

### Rail `tr3Rail` (question)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"); or outside = "true"), and not (outside = "true", and (TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context" or TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)"))

**Asks:** Is there a railway station within reasonable walking distance?

- A well-connected station (Annex B) within about 800 m
- A station within walking distance, but not well-connected, or reached on a poor route
- No

### Connectivity Tool `tr3Tool` (question)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"); or outside = "true"), and not (outside = "true", and (TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context" or TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)"))

**Asks:** What does the DfT Connectivity Tool score the site (overall, excluding driving)?

- Low: under about 30
- Middle: about 30 to 50
- High: over about 50
- Not run → *note* TR3(2): Evidence gap: the Connectivity Tool has not been run, although TR3(2) says it "should be used alongside other relevant quantitative or qualitative evidence".

**Guidance:**
- TR3(2) says the tool "should be used alongside other relevant quantitative or qualitative evidence".
- The same score has gone both ways: 52 failed at 6011736 and passed at 6010471. The tool does not measure footway width or lighting.
- The score "is a relative measure not an absolute measure of connectivity" and "should always be interpreted comparatively" (6006497 ¶42, inquiry). There a 52 was read against the authority's own bands and against settlements where development is accepted (¶43–44). A high percentile within a rural class did not help where the route failed (6006224 ¶11, ¶13), and a bare score with a map carried little weight (6010253 ¶19).

### TR3: is this a sustainable location? `tr3` (judgement)

**Shown when:** ((Green Belt = "Yes, open Green Belt" or Green Belt = "Yes, in or on the edge of a village washed over by the Green Belt"); or outside = "true"), and not (outside = "true", and (TR3(1)(a): is a significant amount of movement generated? = "No: not a significant amount of movement in this context" or TR3(1)(a): is a significant amount of movement generated? = "No, but the car reliance still carries moderate weight here (for example a poor walking route)"))

**Asks:** Taking the route, the services and the transport together, would the location limit the need to travel, particularly by private car, and offer a genuine choice of transport modes for residents?

- Yes: a sustainable location
- No: residents would be reliant on the private car

**Findings:**
- if GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply", and TR3: is this a sustainable location? = "Yes: a sustainable location": *pass* **GB7(1)(g)(iii)**: A sustainable location with particular reference to TR3.
- if GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply", and TR3: is this a sustainable location? = "No: residents would be reliant on the private car": *fail* **GB7(1)(g)(iii)**: Not a sustainable location with reference to TR3: the location does not offer a genuine choice of transport modes, so GB7(1)(g) is not met.
- if not (GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply"), and TR3: is this a sustainable location? = "Yes: a sustainable location": *pass* **TR3(1)(a)**: The location offers a genuine choice of transport modes (TR3(1)(a)).
- if not (GB7 category = "GB7(1)(g): grey belt — or none of the categories above apply"), and TR3: is this a sustainable location? = "No: residents would be reliant on the private car": *harm* **TR3(1)(a)**: The location would not limit the need to travel by private car or offer a genuine choice of transport modes (TR3(1)(a)).

**Guidance:**
- The walking route usually decides this limb, not the distance. Contested inspector failures have had one or more of: no footway or a broken one, no lighting, walking in the carriageway, 40–60 mph traffic, and thin or unevidenced public transport (6010313, 6009966, 6011736, 6007428, 6008528, 6012481, 6006637).
- Contested passes had a continuous footway for most of the route, or a short benign gap, plus an evidenced bus service (6010471, 6011103, 6009645, 6011301, 6005877).
- Walking in the carriageway on the everyday route is the most reliable failing fact. Lighting does not cure it, and a short distance does not excuse it (6007428 ¶15–16).
- Small schemes are not exempt: five homes were "a significant amount of movement in this context" (6010313 ¶13).
- A highway authority's "no objection" answers highway safety and network capacity (TR3(1)(c), TR6(4)). It does not answer whether the location limits the need to travel by car and offers a genuine choice of transport modes (TR3(1)(a), GB7(1)(g)(iii)). At 6007668 ¶19 the highway authority raised no objection, but the inspector still found "an unsustainable location".
- Counts, housing only: inspectors passed this limb 11 times and failed it 9; councils passed it 15 times and failed it twice. Appeals are mostly of refusals, so the two groups are not like for like.

**Contested:** Is a route acceptable because existing residents already walk it?
- *Accepted: villagers already cope*: A council decision accepted short unfooted sections in a historic village core because "Villagers appear to cope with this existing situation without any great trouble" (stratford-26-00918-PIP, p.9). On appeal, a footway condition for one home was removed where existing houses relied on the verge with no recorded pedestrian injury collisions (6010706 ¶9), though the inspector accepted this "may well result in access not being suitable for all people" (¶13).
- *Not enough on its own: use can show necessity, not safety*: Hatton Station (6006637 ¶26): "at least some journeys arise out of necessity rather than choice … the recorded levels of activity do not demonstrate that the route is universally perceived as safe."

**Cases:** policies GB7(1)(g)(iii), TR3; grouped by finding

**Framework text:**

> **TR3(1)(a)** a. Development proposals which could generate a significant amount of movement, in the context of the area within which they would be situated, should be in locations that are sustainable (or which can be made so, taking into account planned improvements, including any provided for as part of the development itself). This means the location should limit the need to travel, particularly by private car, and offer a genuine choice of transport modes for residents and users, unless the nature of the development would make this impractical;
>
> **TR3(1)(e)** e. In rural areas, opportunities to improve walking, wheeling, cycling and public transport and enhance the connectivity of an area should be taken where they exist and can be supported by the development proposed.
>
> **TR3(2)** The Connectivity Tool (Connectivity Tool - GOV.UK) should be used alongside other relevant quantitative or qualitative evidence in assessing the connectivity of particular locations proposed for development.
>
> **GB7(1)(g)(iii)** iii. The development would be in a sustainable location, with particular reference to policy TR3 of this Framework
>
> **TR4(1)(a)** To contribute to creating well-designed places, transport considerations should be integral to the design of development, proposals for which should: a. Give priority first to walking, wheeling and cycle movements, both within the scheme and with neighbouring areas; and second – so far as possible – to facilitating easy access to high quality public transport, with layouts and densities which maximise the catchments for bus or other public transport services;
>
> **TR4(1)(c)** c. Ensure that the arrangement of streets and other routes help to create places that are safe, inclusive and attractive for all users (particularly for women and girls, for other groups who may be vulnerable to crime or the fear of crime, and for those with limited mobility).
>
> **TR4(1)(c)(ii)** This includes reflecting relevant aspects of policy DP3(2), as well as employing measures to: … ii. Meet the needs of disabled people, older people and children in relation to all modes of transport, and

## Heritage

### HE5: is the heritage assessment adequate? `he5` (judgement)

**Shown when:** designated = "true"; or Heritage assets = "Non-designated heritage asset (identified by the council: e.g. on a local heritage list, in a neighbourhood plan or the Historic Environment Record, or during the decision; such as an unregistered historic park)"

**Asks:** Does the evidence identify the significance of each asset (including the contribution of its setting) and the effect of the proposal on it, well enough for the decision-maker to be satisfied it is accurate?

- Yes
- Gaps, but the decision-maker can fill them (e.g. with specialist conservation advice)
- No: the effect on significance cannot be properly assessed → *fail* HE5(1): The effect on the significance of the heritage assets has not been properly assessed (HE5(1), HE5(4)). → *harm* HE5(1): Harm to the heritage assets cannot be ruled out on the evidence; the burden is on the applicant, so the gap counts against the proposal in the balance (e.g. 6006330 ¶16, ¶23).

**Guidance:**
- HE5(3): it is the effect on significance, not the scale of the development, that matters.
- Where the applicant accepts harm but disputes its degree, specialist conservation advice is the usual way to satisfy HE5(4).
- Inspectors have dismissed appeals where the assessment of significance was missing or inadequate (HE5(1) fail: 3 decisions in the dataset). They carried the gap into the heritage balance rather than refusing on HE5 alone: "I am unable to determine whether the proposal would result in the loss of any historic fabric", then the public benefits were weighed against the harm (6006330 ¶16, ¶23).
- HE5 is an assessment requirement, not a policy that says development "should be refused". A failed assessment means harm cannot be ruled out; it counts against the proposal in the balance, and the burden of filling the gap is on the applicant.

**Cases:** policies HE5; grouped by finding

**Framework text:**

> **HE5(1)** Development proposals affecting heritage assets should be accompanied by an assessment of the significance of the assets affected (including any contribution made by their setting) and of the potential effect of the proposal on their significance.
>
> **HE5(4)** Decision-makers should be satisfied that assessments accurately reflect the effects on heritage assets caused by development proposals.
>
> **HE5(3)** In making this assessment it is the effect on a heritage asset's significance rather than the scale of the development which should be considered.

### HE5(2): what would the effect be? `heHarmFactors` (question)

**Shown when:** designated = "true", and not HE5: is the heritage assessment adequate? = "No: the effect on significance cannot be properly assessed"

**Asks:** Which of these describe the effect on the significance of the asset? Select all that apply — the next step suggests a degree from your answers, for you to confirm.

- Positive: removes a harmful later addition, or reveals or restores a lost feature
- No historic, functional or visual link; the site makes no contribution to the asset’s significance
- A minor part of the setting; the proposal is subordinate, glimpsed or peripheral, leaving the main significance legible
- The development would dominate a key element of the setting, or erode the rural or open context in which the asset is experienced
- Removes a historic functional link — for example a farmhouse losing its adjoining farmland
- Seriously affects a key element of significance — for example the legibility of a principal historic elevation
- Removes the main feature from which the asset draws its significance
- Demolition, or removal of every element that gives the asset significance

**Guidance:**
- Judge the effect on significance, not the scale of the development (HE5(3)). Setting is read historically and functionally, not only visually (6007136 ¶21).
- "Substantial harm" is reached only where a key element of significance is seriously affected (HE5(2)); below that, harm sits on a scale. "Less than substantial harm" is a 2024 term and is not used in the 2026 Framework.

**Framework text:**

> **HE5(2)** Assessments of the potential effects of development proposals on the significance of heritage assets (including through effects on their setting) should identify whether proposals would be likely to: a. Have a positive effect, which is where the significance of a heritage asset would be enhanced, or better revealed; or b. Have no effect on the significance of a heritage asset; or c. Result in harm to the significance of a heritage asset, either from work affecting the asset itself or from development within its setting. The degree of harm should be identified: substantial harm would occur where the development proposal would seriously affect a key element of the asset's significance; or d. Cause the total loss of the significance of a heritage asset.
>
> **AnnexB:setting** The surroundings in which a heritage asset is experienced. Its extent is not fixed and may change as the asset and its surroundings evolve. Elements of a setting may make a positive or negative contribution to the significance of an asset, may affect the ability to appreciate that significance or may be neutral.

### HE5(2): effect on the designated asset `heEffect` (judgement)

**Shown when:** designated = "true", and not HE5: is the heritage assessment adequate? = "No: the effect on significance cannot be properly assessed"

**Asks:** Confirm the degree of effect on the significance of the asset. If several are affected, answer for the most harmed.

- Positive: significance enhanced or better revealed
- No effect
- Harm: very low to low
- Harm: moderate
- Harm: high, short of substantial
- Substantial harm: a key element of significance seriously affected
- Total loss of significance

**Findings:**
- if HE5(2): effect on the designated asset = "Harm: very low to low" or HE5(2): effect on the designated asset = "Harm: moderate" or HE5(2): effect on the designated asset = "Harm: high, short of substantial": *harm* (considerable) **HE6(3)**: Harm to the significance of a designated heritage asset. Any harm is "a matter of considerable importance and weight" (HE6(3)), with substantial weight given to the asset's conservation (HE6(1)).
- if HE5(2): effect on the designated asset = "Substantial harm: a key element of significance seriously affected" or HE5(2): effect on the designated asset = "Total loss of significance": *harm* (considerable) **HE6(5)**: Substantial harm to, or total loss of, the significance of a designated heritage asset.
- if HE5(2): effect on the designated asset = "No effect": *note* **HE5(2)**: No effect on the significance of the designated heritage assets.
- if HE5(2): effect on the designated asset = "Positive: significance enhanced or better revealed": *benefit* **HE5(2)**: A positive effect on the significance of a designated heritage asset.

**Guidance:**
- The Framework no longer uses "less than substantial harm". It asks for the degree of harm to be identified; "substantial harm" means seriously affecting a key element of significance.
- Setting is read functionally and historically, not only visually. For example, a farmhouse "would become an historic farmhouse without adjoining farmland" (6006475 ¶32); "impact on setting is not limited to intervisibility" (6007136 ¶21).
- Across the dataset, inspectors dismissed 124 of 134 appeals in which they found harm to a designated asset. Where they found no harm, 52 of 81 were permitted.

**Cases:** policies HE6; grouped by outcome

**Framework text:**

> **HE5(2)** Assessments of the potential effects of development proposals on the significance of heritage assets (including through effects on their setting) should identify whether proposals would be likely to: a. Have a positive effect, which is where the significance of a heritage asset would be enhanced, or better revealed; or b. Have no effect on the significance of a heritage asset; or c. Result in harm to the significance of a heritage asset, either from work affecting the asset itself or from development within its setting. The degree of harm should be identified: substantial harm would occur where the development proposal would seriously affect a key element of the asset's significance; or d. Cause the total loss of the significance of a heritage asset.
>
> **AnnexB:setting** The surroundings in which a heritage asset is experienced. Its extent is not fixed and may change as the asset and its surroundings evolve. Elements of a setting may make a positive or negative contribution to the significance of an asset, may affect the ability to appreciate that significance or may be neutral.

### HE6(4): public benefits in the balance `heBenefits` (question)

**Shown when:** designated = "true", and (HE5(2): effect on the designated asset = "Harm: very low to low" or HE5(2): effect on the designated asset = "Harm: moderate" or HE5(2): effect on the designated asset = "Harm: high, short of substantial")

**Asks:** Which public benefits weigh on the other side of this balance, and at what level? Tick the rows that fit. A benefit that is not secured or not evidenced carries no weight.

- Housing — a larger scheme where housing supply is short
- Housing — one or a few homes
- Affordable housing — secured by obligation
- Affordable housing — offered but not secured
- Long-term reuse of a vacant or underused listed building — secured
- Energy efficiency or low-carbon heating — beyond the regulatory minimum
- Economic — ongoing: permanent jobs or sustained local activity
- Economic — short-term only: construction spend and jobs during the build
- Biodiversity net gain beyond the statutory 10% — secured
- Publicly accessible green space — secured
- Environmental benefit claimed but not demonstrated
- Other public benefit (describe it in the notes at the next step)

**Guidance:**
- Only public benefits count; private benefits such as extra living space are excluded (6011314 ¶39).
- Reduce the weight of any benefit that is not secured, could be delivered elsewhere without the harm, or could be achieved with less harm (6007466 ¶23). Where a benefit is claimed but not demonstrated — for example the application does not address more recent survey findings, conditions or standards — give it no weight and tick the "not demonstrated" row.
- HE6(4) names two important public benefits: securing the long-term reuse of a vacant or underused listed building, and enabling energy efficiency or low carbon heating.
- These are the same public benefits weighed in the overall balance later; here they inform only the HE6(4) heritage balance. Weigh each one once. For each benefit, tick the single row that best fits its level.

**Framework text:**

> **HE6(4)** Where a development proposal would harm the significance of a designated heritage asset the effect on the asset and its significance should be weighed against any public benefits resulting from the proposal. Important public benefits can include securing the long-term reuse of a vacant or underused listed building, and enabling energy efficiency and low carbon heating measures to be employed.

### HE6(4): harm against public benefits `he64` (judgement)

**Shown when:** designated = "true", and (HE5(2): effect on the designated asset = "Harm: very low to low" or HE5(2): effect on the designated asset = "Harm: moderate" or HE5(2): effect on the designated asset = "Harm: high, short of substantial")

**Asks:** Giving the harm considerable importance and weight, and substantial weight to the asset's conservation, do the public benefits of the proposal outweigh it, with a clear and convincing justification?

- Yes: the public benefits outweigh the harm
- No: the harm is not outweighed

**Findings:**
- if HE6(4): harm against public benefits = "Yes: the public benefits outweigh the harm": *pass* **HE6(4)**: The heritage harm is outweighed by the public benefits (HE6(4)).
- if HE6(4): harm against public benefits = "No: the harm is not outweighed": *fail* **HE6(4)**: The heritage harm is not outweighed by the public benefits (HE6(4)); there is no clear and convincing justification (HE4(2)).

**Guidance:**
- Only public benefits count: private benefits such as extra living space are excluded (e.g. 6011314 ¶39, 6004673 ¶37).
- Benefits discounted in decisions: unsecured benefits, those achievable with less harm, and those that could be delivered elsewhere (6007466 ¶23).
- Small housing schemes have lost this balance on "low" harm despite supply shortfalls (6009545: 1 home, 3.68 years; 6007054: moderate harm, 1 home, 2.98 years). At 6010097 ¶14 one home was given substantial weight and still did not outweigh harm that was "modest in extent".
- An informal public benefit that is not secured carries reduced weight: community use "on an informal ad-hoc basis" got modest weight (6001939 ¶14).
- Minor harm has been outweighed by larger schemes with a shortfall (3375062: 20 homes; 6005664: 110 homes).
- No appeal since August 2026 in the dataset allows 1 to 9 homes against "low" (as opposed to "very low") harm to a designated asset.

**Contested:** Should HE6(4) be run as its own balance, or folded into the overall S4/S5 balance?
- *Run separately, then carried into the overall balance*: The usual appeal sequence: HE6(4) first (6007221 ¶40), then the overall balance, where the unjustified harm has led inspectors to find the benefits substantially outweighed (6007221 ¶51; 6006475 ¶59, ¶68; SDC at Ilmington, stratford-26-01399-PIP). The failure is weighed there; it is not a "should be refused" trigger.
- *Folded into one balance*: Heritage harm treated as one input to the overall balance with no separate HE6(4) exercise (SDC at Long Marston, stratford-26-01906-PIP, granted).

**Cases:** policies HE6(4); grouped by finding

**Framework text:**

> **HE6(4)** Where a development proposal would harm the significance of a designated heritage asset the effect on the asset and its significance should be weighed against any public benefits resulting from the proposal. Important public benefits can include securing the long-term reuse of a vacant or underused listed building, and enabling energy efficiency and low carbon heating measures to be employed.
>
> **HE6(1)** When considering the potential effect of a development proposal on the significance of a designated heritage asset, substantial weight should be given to the asset's conservation (and the more important the asset, the greater the weight should be). This is irrespective of whether any potential effect amounts to a positive effect, harm, substantial harm, or total loss of its significance.
>
> **HE6(3)** Any harm to a designated heritage asset will be a matter of considerable importance and weight, which should be dealt with in accordance with paragraphs 4 to 6 of this policy.
>
> **HE4(2)** Any harm to, or loss of, the significance of a designated heritage asset (including from development within its setting) should have a clear and convincing justification in accordance with the policies in this chapter.

### HE6(5): substantial harm or total loss `he65` (judgement)

**Shown when:** designated = "true", and (HE5(2): effect on the designated asset = "Substantial harm: a key element of significance seriously affected" or HE5(2): effect on the designated asset = "Total loss of significance")

**Asks:** Is the harm necessary to achieve substantial public benefits that outweigh it, or do all four conditions (a) to (d) apply?

- Yes
- No

**Findings:**
- if HE6(5): substantial harm or total loss = "Yes": *pass* **HE6(5)**: The substantial harm is necessary to achieve substantial public benefits that outweigh it (HE6(5)).
- if HE6(5): substantial harm or total loss = "No": *trigger* **HE6(5)**: Substantial harm without the justification HE6(5) requires: consent "should be refused".

**Cases:** policies HE6(5); grouped by finding

**Framework text:**

> **HE6(5)** Where a development proposal would cause substantial harm to, or the total loss of, the significance of a designated heritage asset, consent should be refused unless it can be demonstrated that the harm is necessary to achieve substantial public benefits that outweigh the harm or loss, or if all of the following apply: a. The nature of the heritage asset would otherwise prevent all reasonable uses of the site; b. No suitable use for the heritage asset itself can be found in the medium term through appropriate marketing that will enable its conservation; c. Conservation by grant-funding or some form of not for profit, charitable or public ownership is not possible; and d. The harm or loss is outweighed by the benefit of bringing the asset back into use.

### HE7(2): non-designated heritage asset `he7` (judgement)

**Shown when:** Heritage assets = "Non-designated heritage asset (identified by the council: e.g. on a local heritage list, in a neighbourhood plan or the Historic Environment Record, or during the decision; such as an unregistered historic park)", and not HE5: is the heritage assessment adequate? = "No: the effect on significance cannot be properly assessed"

**Asks:** Having regard to the scale of any harm and the asset's significance, is any harm to the non-designated asset outweighed by the benefits?

- No harm
- Harm, outweighed by the benefits
- Harm, not outweighed

**Findings:**
- if HE7(2): non-designated heritage asset = "Harm, outweighed by the benefits": *harm* (limited) **HE7(2)**: Harm to a non-designated heritage asset, outweighed in the balanced judgement (HE7(2)).
- if HE7(2): non-designated heritage asset = "Harm, not outweighed": *harm* (significant) **HE7(2)**: Harm to a non-designated heritage asset that the benefits do not outweigh (HE7(2)).

**Guidance:**
- This is a balanced judgement, not the HE6 test. Limited harm to a non-designated asset is routinely outweighed (e.g. 6007184); total loss of one was not outweighed by one replacement home (6007188).

**Cases:** policies HE7; grouped by finding

**Framework text:**

> **HE7(2)** Where a development proposal would harm the significance of a non-designated heritage asset, this should be weighed against the benefits of the proposal and a balanced judgement made, having regard to the scale of any harm or loss and the significance of the non-designated heritage asset.

## Other national policies

### F7(2): flood risk from any source `f7` (judgement)

**Shown when:** Site constraints = "Known risk from any form of flooding (river, sea, surface water, groundwater), now or in the future"

**Asks:** Has the applicant demonstrated all five matters (a) to (e) in F7(2)?

- Yes: all five are demonstrated
- No, or not evidenced

**Findings:**
- if F7(2): flood risk from any source = "No, or not evidenced": *trigger* **F7(2)**: In a location known to be at risk of flooding, F7(2)(a) to (e) are not demonstrated, so the proposal "should be refused".

**Guidance:**
- F7(2) covers any form of flooding, including surface water and groundwater, now or in the future.
- The sequential test (F5) applies separately in areas at risk. F5 is worded "should not be located"; the "should be refused" wording is in F6(1)(a) and F7(2). Inspectors treat failure of either as decisive.

**Cases:** policies F7, F5; grouped by finding

**Framework text:**

> **F7(2)** Where development is proposed in a location known to be at risk from any form of flooding, now or in the future, it should be refused unless: a. Within the site, the most vulnerable development is located in areas of lowest flood risk, unless there are overriding reasons which justify a different arrangement; b. The development will be safe throughout its lifetime taking account of the vulnerability of its users; c. Any residual risk can be safely managed, and safe access and escape routes are included where appropriate, as part of an agreed emergency plan; d. The development is appropriately flood resistant and resilient such that, in the event of a flood, it could be quickly brought back into use without significant refurbishment; and e. It can be demonstrated that flood risk will not be increased elsewhere.

### N4(2): major development in a Protected Landscape `n4major` (judgement)

**Shown when:** Site constraints = "Within a National Park, National Landscape or the Broads"

**Asks:** Is this "major development" for the purposes of N4, judged on its nature, scale and setting and whether it could significantly harm the purposes for which the area is designated (footnote 59)?

- No
- Yes, but there are exceptional circumstances and it is in the public interest
- Yes, without exceptional circumstances

**Findings:**
- if N4(2): major development in a Protected Landscape = "Yes, without exceptional circumstances": *trigger* **N4(2)**: Major development in a Protected Landscape without exceptional circumstances "should be refused" (N4(2)).

**Cases:** policies N4; grouped by finding

**Framework text:**

> **N4(1)** Development proposals within Protected Landscapes should be limited in scale and extent and sensitively located and designed to avoid harm to the statutory purposes and special qualities of the Protected Landscape. Substantial weight should be placed on the importance of conserving and enhancing the natural beauty of these areas, and to conserving and enhancing wildlife and cultural heritage in National Parks and the Broads.
>
> **N4(2)** Proposals for major development within Protected Landscapes should be refused other than in exceptional circumstances, and where it can be demonstrated that the development is in the public interest.

### N4: harm to a Protected Landscape `n4harm` (judgement)

**Shown when:** Site constraints = "Within a National Park, National Landscape or the Broads"; or Site constraints = "Within the setting of a Protected Landscape"

**Asks:** Would the proposal harm the natural beauty or special qualities of the Protected Landscape?

- No
- Yes

**Findings:**
- if N4: harm to a Protected Landscape = "Yes": *harm* (substantial) **N4**: Harm to a Protected Landscape, whose natural beauty carries substantial weight (N4(1)).

**Cases:** policies N4; grouped by finding

**Framework text:**

> **N4(1)** Development proposals within Protected Landscapes should be limited in scale and extent and sensitively located and designed to avoid harm to the statutory purposes and special qualities of the Protected Landscape. Substantial weight should be placed on the importance of conserving and enhancing the natural beauty of these areas, and to conserving and enhancing wildlife and cultural heritage in National Parks and the Broads.
>
> **N4(4)** Development proposals within the setting of Protected Landscapes should be sensitively located and designed to avoid or minimise adverse impacts on the Protected Landscape.

### N6(2): irreplaceable habitats `n62` (judgement)

**Shown when:** Site constraints = "Ancient woodland, or ancient or veteran trees, affected"

**Asks:** Would the proposal cause loss or deterioration of irreplaceable habitat and, if so, are there wholly exceptional reasons and a suitable compensation strategy?

- No loss or deterioration
- Loss, with wholly exceptional reasons and compensation
- Loss without that justification, or not assessed

**Findings:**
- if N6(2): irreplaceable habitats = "Loss without that justification, or not assessed": *trigger* **N6(2)**: Loss or deterioration of irreplaceable habitat without wholly exceptional reasons "should be refused" (N6(2)).

**Guidance:**
- An unassessed mature tree may be veteran. If no one has assessed it, the question cannot be answered on the evidence.

**Cases:** policies N6; grouped by finding

**Framework text:**

> **N6(2)** Irrespective of a site's status in nature conservation terms, development proposals which would entail the loss or deterioration of irreplaceable habitats (such as ancient woodland and ancient or veteran trees) should be refused, unless there are wholly exceptional reasons and a suitable compensation strategy exists.

### N2(2): significant harm to biodiversity `n22` (judgement)

**Shown when:** Site constraints = "Habitats or protected species that could be significantly harmed"

**Asks:** Can any significant harm to biodiversity be avoided, adequately mitigated or, as a last resort, compensated for, on the evidence submitted?

- Yes
- No
- Cannot tell: surveys missing, out of date or out of season

**Findings:**
- if N2(2): significant harm to biodiversity = "No": *trigger* **N2(2)**: Significant harm to biodiversity that cannot be avoided, mitigated or compensated for: the proposal "should be refused" (N2(2)).
- if N2(2): significant harm to biodiversity = "Cannot tell: surveys missing, out of date or out of season": *trigger* **N2(2)**: Without adequate surveys, significant harm to biodiversity cannot be ruled out, and the gap cannot be filled by condition.

**Guidance:**
- Missing or out-of-season protected-species surveys cannot usually be left to a condition (Circular 06/2005 ¶99): e.g. 6012481, 6008404, 6010616 (nesting-bird survey "outside of the optimal period").

**Cases:** policies N2, N6; grouped by finding

**Framework text:**

> **N2(2)** If significant harm to biodiversity resulting from a development cannot be avoided (through locating on an alternative site with less harmful impacts), adequately mitigated or, as a last resort, compensated for, then the development should be refused.

### N2(1)(d): established trees and hedgerows `n21d` (judgement)

**Shown when:** Site constraints = "Established trees or hedgerows lost or cut back (including for visibility splays)"

**Asks:** Would established trees or hedgerows of visual, historic or nature-conservation value be lost, including any cleared for visibility splays, where retaining them was possible?

- No: they are retained
- Some loss, unavoidable and adequately replaced
- Yes: avoidable or unassessed loss

**Findings:**
- if N2(1)(d): established trees and hedgerows = "Yes: avoidable or unassessed loss": *harm* **N2(1)(d)**: Loss of established trees or hedgerows of value where retention was possible (N2(1)(d)).

**Guidance:**
- Splays can remove far more than the tree report assumes. At 6007807 (¶9–11) the arboricultural assessment ignored the splays; replanting "would take years to mature".
- Hedgerow in the highway lost to splays had "amenity value as part of the landscape character" even where biodiversity could be offset (6006819 ¶22).
- Counter-example: a replacement hawthorn hedge longer than the length lost was accepted (6007231).

**Cases:** policies N2, DP3; grouped by finding

**Framework text:**

> **N2(1)(d)** d. Conserve and enhance existing natural features of visual, historic or nature conservation value (such as established trees and hedgerows) where possible; and use appropriate landscaping to help create a well-designed place and integrate the development into its surroundings;

### DP3(2)(c): tree cover `dp32c` (judgement)

**Shown when:** Site constraints = "Established trees or hedgerows lost or cut back (including for visibility splays)"

**Asks:** Would the proposal reduce tree cover, rather than maintain and enhance it, without clear justification?

- No
- Yes

**Findings:**
- if DP3(2)(c): tree cover = "Yes": *trigger* **DP3(3)**: Loss of tree cover conflicts with DP3(2)(c) without clear justification, so DP3(3) says the proposal "should be refused".

**Guidance:**
- A conflict with DP3(2) principles without clear justification engages DP3(3) ("should be refused"). At 6005325 (¶23, ¶30–31) loss of a prominent tree did exactly that, and the benefits of one home were "substantially outweighed".

**Cases:** policies DP3; tags dp3-refuse-trigger; grouped by finding

**Framework text:**

> **DP3(2)(c)** c. Nature: incorporate and/or connect to a network of high quality, accessible, multi-functional green infrastructure to provide opportunities for recreation and healthy living, strengthen habitats, improve climate change resilience and improve air and water quality. This should include maintaining and enhancing tree cover and incorporating sustainable drainage systems in accordance with policies N3 and F8;
>
> **DP3(3)** Development proposals should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2, or with any explicit design standards set out in the development plan (including those in locally-specific policies, guides, codes or masterplans). Substantial weight should be given to compliance with relevant development plan policies when assessing the design quality of proposals.

### TR6(4): highway safety `tr64` (judgement)

**Shown when:** Site constraints = "New or altered vehicular access onto a public road"

**Asks:** After mitigation, would the access have an unacceptable impact on highway safety or a severe impact on the network? Can the visibility splays be delivered on land within the site or the highway?

- Acceptable: safe access, splays deliverable
- Not demonstrated: splays depend on third-party land or unassessed works
- Unacceptable impact on highway safety

**Findings:**
- if TR6(4): highway safety = "Unacceptable impact on highway safety": *trigger* **TR6(4)**: An unacceptable impact on highway safety: the proposal "should be refused" (TR6(4)).
- if TR6(4): highway safety = "Not demonstrated: splays depend on third-party land or unassessed works": *trigger* **TR6(4)**: A safe access is not shown to be deliverable, so an unacceptable impact on highway safety cannot be ruled out (TR6(4)).

**Guidance:**
- The safety limb stands alone: an impact need not be "severe" to be unacceptable (6006819 ¶20).
- Splays that depend on third-party land or unassessed hedge removal have failed (6009997 ¶14–15, 6012481 ¶37).
- An absence of recorded injury collisions is "not a reliable indicator" on its own (6009573 ¶23).

**Cases:** policies TR6(4); grouped by finding

**Framework text:**

> **TR6(4)** Development proposals should be refused if they would have a severe adverse impact on the transport network (in terms of capacity and congestion, including cumulative impacts), or an unacceptable impact on highway safety; taking into account any mitigation measures proposed as well as any wider network improvements, including measures to support sustainable patterns of movement. This applies both during the construction phase and following completion.

### DP3(3): what does the scheme conflict with? `dp3Conflicts` (question)

**Shown when:** always

**Asks:** Which of these does the proposal conflict with? Select all that apply. Leave all unticked if it responds well to its context and complies with the design policies — the next step then asks, for any conflict, whether there is a clear justification.

- DP3(1) context — does not respond to the history, character and features of the site and its setting, or fails to integrate with and enhance its surroundings
- An explicit design standard in the development plan — a Village Design Statement, design guide, code or masterplan
- DP3(2)(a) Liveability — mix, tenures, social interaction, robustness
- DP3(2)(b) Climate — layout, orientation, massing, materials; overheating and net zero
- DP3(2)(c) Nature — green infrastructure and habitats (tree cover is the separate DP3(2)(c) step above)
- DP3(2)(d) Movement — walking, wheeling, cycling and public-transport connections
- DP3(2)(e) Built form — streets, spaces, density and the pattern of buildings
- DP3(2)(f) Public space — safe, secure, inclusive, accessible spaces
- DP3(2)(g) Identity — attractive, distinctive, characterful development and local character

**Guidance:**
- DP3(3) gives national "should be refused" force to a conflict, without clear justification, with DP3(1) (context), the relevant DP3(2) principles, or an explicit design standard in the development plan. Substantial weight is given to compliance with relevant development-plan design policies.
- Tree-cover loss is picked up separately at the DP3(2)(c) step, so it is not repeated here. Design harm that falls short of a conflict is weighed under landscape and character instead.
- "Explicit design standards" includes a Village Design Statement, design guide, code or masterplan adopted through a development-plan policy (the clearest dataset example is 6010826).

**Framework text:**

> **DP3(1)** Development proposals should respond to their context (the history, character and features of their site and its setting), so that they integrate with and enhance their surroundings; such as through the arrangement of development plots and buildings, the use of materials and architectural features, and the restoration, reuse and integration of heritage assets.
>
> **DP3(3)** Development proposals should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2, or with any explicit design standards set out in the development plan (including those in locally-specific policies, guides, codes or masterplans). Substantial weight should be given to compliance with relevant development plan policies when assessing the design quality of proposals.

### DP3(3): is the conflict clearly justified? `dp3` (judgement)

**Shown when:** always

**Asks:** For any conflict identified above, is there a clear justification — or is there no conflict at all? Answer this on its own terms; it is stricter than the S4/S5 "substantially outweighed" test.

- No conflict
- Conflict, but clearly justified (state the reading)
- Conflict without clear justification

**Findings:**
- if DP3(3): is the conflict clearly justified? = "Conflict without clear justification": *trigger* **DP3(3)**: Conflicts with DP3(1) or (2), or with explicit local design standards, without clear justification: DP3(3) says it "should be refused".
- if DP3(3): is the conflict clearly justified? = "Conflict, but clearly justified (state the reading)": *note* **DP3(3)**: There is a design conflict, but it has a clear justification, so DP3(3) is not engaged.

**Guidance:**
- In a review of 157 appeals with design harm, 53 named DP3(3) and applied it, and about 20 made the clear-justification finding in so many words (e.g. 6008167 ¶21, 6006720 ¶34). It has beaten substantial housing weight (6008167 ¶21).
- Most other inspectors dismissed on the design harm without naming DP3(3), which reaches the result the policy points to. The error to avoid is the reverse: allowing a scheme with a design conflict after running only the S4/S5 "substantially outweighed" test, without asking whether there is clear justification (e.g. 6011253 ¶26; a council report did the same, stratford-26-00617-PIP).
- This step is not where a plan policy that conflicts with the Framework is handled: whether a development-plan policy keeps full weight, or is materially inconsistent with the Framework and reduced to very limited weight, is tested separately at the development-plan step (Annex A(2)) — and a conflict with a policy that has lost weight there carries correspondingly less force here. Neighbourhood-plan protection is dealt with under S6.

**Contested:** What counts as a "clear justification"? The Framework does not define it, and inspectors have read it two ways.
- *Necessity*: The conflict is justified only if it is needed to deliver the development: "there would be clear justification for the conflict with Framework Policy DP3" because the tree loss "would be necessary as part of the appeal development" (6008314 ¶43). Applied to refuse at a hearing: "I do not find the specific and significant harm to the character and appearance of the countryside to be necessary to achieve the substantial public benefits" (6007133 ¶59).
- *Level balance*: The conflict is justified if the benefits outweigh the harm: "There would, therefore, be clear justification for the harm that would arise, as is required by Policy DP3.3" (6009340 ¶22). At a hearing, "the substantial benefits are sufficient to provide clear justification for the conflict with Policy DP3", which caused limited harm (6008253 ¶86). The same reading has refused: substantial weight to two homes and significant weight to affordable housing "do not amount to the clear justification required by Policy DP3(3) to depart from explicit accessibility standards" (6005590 ¶46). Still stricter than the S4/S5 "substantially outweighed" test.

**Cases:** policies DP3(3), DP3(1); grouped by finding

**Framework text:**

> **DP3(1)** Development proposals should respond to their context (the history, character and features of their site and its setting), so that they integrate with and enhance their surroundings; such as through the arrangement of development plots and buildings, the use of materials and architectural features, and the restoration, reuse and integration of heritage assets.
>
> **DP3(3)** Development proposals should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2, or with any explicit design standards set out in the development plan (including those in locally-specific policies, guides, codes or masterplans). Substantial weight should be given to compliance with relevant development plan policies when assessing the design quality of proposals.

### Landscape and character `character` (judgement)

**Shown when:** always

**Asks:** How much harm would there be to landscape character and to the character and appearance of the area?

- None
- Limited
- Moderate
- Significant
- Substantial

**Findings:**
- if Landscape and character = "Limited": *harm* (limited) **N2(1)(a)**: Harm to landscape character and the character of the area, given limited weight.
- if Landscape and character = "Moderate": *harm* (moderate) **N2(1)(a)**: Harm to landscape character and the character of the area, given moderate weight.
- if Landscape and character = "Significant": *harm* (significant) **N2(1)(a)**: Harm to landscape character and the character of the area, given significant weight.
- if Landscape and character = "Substantial": *harm* (substantial) **N2(1)(a)**: Harm to landscape character and the character of the area, given substantial weight.

**Cases:** policies N2, DP3; tags landscape-harm; grouped by outcome

**Framework text:**

> **N2(1)(a)** a. Consider the environmental qualities of land proposed for development, including habitats, landscape character and the natural beauty of the countryside, and identify opportunities for those qualities to be conserved or enhanced (including through requirements for biodiversity net gain where these apply);
>
> **DP3(1)** Development proposals should respond to their context (the history, character and features of their site and its setting), so that they integrate with and enhance their surroundings; such as through the arrangement of development plots and buildings, the use of materials and architectural features, and the restoration, reuse and integration of heritage assets.

### S6: neighbourhood plan `s6` (judgement)

**Shown when:** Site constraints = "A neighbourhood plan covers the site (made, or approved at referendum)"

**Asks:** Was the neighbourhood plan made five years or less before the decision, does it allocate sites to meet its housing requirement, and does the proposal conflict with it?

- Yes to all three
- No: older than five years, no allocations, or no conflict

**Findings:**
- if S6: neighbourhood plan = "Yes to all three": *trigger* **S6(1)**: Conflicts with a recent neighbourhood plan that allocates for its housing requirement: the benefits are likely to be substantially outweighed (S6(1)).

**Guidance:**
- S6 applies to every proposal that provides housing, whatever the housing land supply position. A shortfall does not switch it off.
- "Made" means formally brought into force by the council after examination and referendum. S6(1)(a) counts five years from when the plan "became part of the development plan". Inspectors have counted from the date the plan was made (6007104 ¶29: made 23 June 2021, decided 24 August 2026, so S6(1)(a) failed). Under Annex B a plan is part of the development plan from its referendum, so the clock may start slightly earlier. No decision in the dataset has turned on the difference.
- The five years are measured to the date of the decision, not the application. A plan can drop out of S6 while an application or appeal is pending.
- Allocations still count while they are being delivered slowly, unless there is evidence they cannot be delivered (6007431 ¶21–23).
- Outside S6, a neighbourhood plan is still part of the development plan. Its policies keep their weight unless they are materially inconsistent with the Framework (Annex A(2), which includes policies in made neighbourhood plans). They are then ordinary conflicts in the balance, not an S6 trigger.

**Cases:** policies S6; grouped by finding

**Framework text:**

> **S6(1)** For development proposals involving the provision of housing, the benefits of approving development are likely to be substantially outweighed by the adverse effects where a proposal would conflict with a neighbourhood plan, provided the following apply: a. The neighbourhood plan became part of the development plan five years or less before the date on which the decision is made; and b. The neighbourhood plan contains allocations to meet its identified housing requirement (see policy HO2).

### Development plan `devPlan` (judgement)

**Shown when:** always

**Asks:** Does the proposal conflict with development plan policies that are not materially inconsistent with the Framework?

- No conflict
- Some conflict: limited weight
- Clear conflict with policies that keep their weight

**Findings:**
- if Development plan = "Some conflict: limited weight": *harm* (limited) **s38(6)**: Conflict with development plan policies, given limited weight.
- if Development plan = "Clear conflict with policies that keep their weight": *harm* (significant) **s38(6)**: Conflict with development plan policies that are not materially inconsistent with the Framework (Annex A(2)); the plan is the starting point (s38(6)).

**Guidance:**
- Only policies (or parts of policies) that are materially inconsistent with the national decision-making policies drop to very limited weight. Others should not lose weight simply because of their age.
- Locational policies that restrict housing outside settlement boundaries have commonly been held inconsistent with S5(1)(j) or GB7. Heritage, design and landscape policies have more often been held consistent (e.g. 6006475 ¶66, 6007541 ¶4), though practice varies.

**Contested:** Which local policies are "materially inconsistent", and can a consistent policy still lose weight? Inspectors have applied Annex A(2) in three ways, and not always with the very limited weight it prescribes. Across the 96 appeal letters to 30 Sep 2026 that weigh a plan policy against the Framework, spatial restrictions (settlement boundaries, countryside restraint) were cut in 30 of 45 letters, 16 for a named conflict with S4/S5 and 13 for housing supply; heritage, design, amenity and access policies kept their weight in 38 of 39.
- *Part by part: only the inconsistent part loses weight*: At 6005809 ¶76 the "restrictive elements" of two spatial policies were materially inconsistent with the Framework, while three related policies kept great weight (the inspector gave the restrictive parts limited, not very limited, weight). At 6001260 ¶28 only the aspects restricting development outside settlement boundaries were given very limited weight, and the conflict still counted.
- *Held consistent: full weight*: Design, heritage and landscape policies are commonly held consistent and keep full weight (6008359 ¶23, 6007541 ¶4, 6006475 ¶66).
- *Consistent, but reduced for housing supply*: The spatial strategy is found consistent, then given moderate weight "considering the lack of a 5-year housing land supply" (6008785 ¶38), or because it is "not delivering a sufficient supply of homes" (6007466 ¶25). The same route helped a hearing appeal succeed: "given that the housing land supply shortfall is substantial, I give conflict with the relevant policies limited weight" (6008253 ¶39). Annex A(2) gives no basis for this: its only ground for reduced weight is material inconsistency. The reduction follows the 2024 "out-of-date" approach. Conversely, one inspector found spatial policies materially inconsistent with S5 but gave the conflict "only moderate weight" rather than very limited (6007352 ¶25).

**Cases:** policies Transitional(2), AnnexA(2); grouped by finding

**Framework text:**

> **AnnexA(2)** Development plan policies (or parts of those policies) which are materially inconsistent with national decision-making policies in this Framework should be given very limited weight. The only exception to this is where they have been examined and adopted or made against this Framework. Other development plan policies should not be given reduced weight simply because they were adopted prior to the publication of this Framework.

## Benefits

### HO7(1): the benefit of new homes `homes` (info)

**Shown when:** always

**Asks:** Substantial weight is given to providing homes that contribute to evidenced accommodation needs.

**Findings:**
- *benefit* (substantial) **HO7(1)**: New homes towards evidenced needs attract substantial weight (HO7(1)).

**Guidance:**
- The weight for very small numbers is not settled. Some decisions have tempered it: five homes were given moderate weight, and only modest weight in the very special circumstances balance (6010313 ¶33, ¶38); three homes moderate weight (6011585 ¶17); one home limited weight (6010642 ¶26). Others give one home the full substantial weight under HO7 (6010097 ¶11; one secured self-build home at 6010020 ¶23).

**Cases:** policies HO7; grouped by outcome

**Framework text:**

> **HO7(1)** In applying the policies in this Framework, substantial weight should be given to the benefits of providing homes which will contribute towards meeting the evidenced accommodation needs of the community, as identified through needs assessments prepared for the area of the local planning authority and other relevant evidence.

### Other benefits `otherBenefits` (question)

**Shown when:** always

**Asks:** Which other benefits does the proposal secure? Select all that apply, or none. Weights shown are typical of decisions, not fixed.

- Affordable housing, secured by obligation → *benefit* HO7: Affordable housing, secured.
- Self-build or custom housing, secured by obligation → *benefit* HO7: Self-build or custom housebuilding, secured.
- Construction jobs and local spending → *benefit* E2: Short-term economic benefits of construction and occupation.
- Biodiversity gain beyond the statutory 10% → *benefit* N2: Biodiversity gain beyond the statutory requirement.
- Energy performance clearly beyond Building Regulations → *benefit* CC2: Energy performance beyond the regulatory minimum.

**Guidance:**
- At inquiry, affordable homes, homes for older people and custom self-build were each given substantial weight under HO7, as separate benefits (6008238 ¶139). Record a higher weight in your own reasons where the evidence supports it.

## The decision

### Route: inappropriate development in the Green Belt `routeGB6` (info)

**Shown when:** route = ""GB6(2)""

**Asks:** No GB7 category is met, so the proposal is inappropriate development. It can only be approved in very special circumstances.

**Findings:**
- *route* **GB6(2)**: Inappropriate development in the Green Belt, to be approved only in very special circumstances (GB6).

**Framework text:**

> **GB6(1)** Development in the Green Belt is inappropriate unless it falls within one of the categories in policy GB7.
>
> **GB6(2)** Inappropriate development is, by definition, harmful to the Green Belt and should not be approved except in very special circumstances. Such circumstances will not exist unless the potential harm to the Green Belt by reason of inappropriateness and any other harm resulting from the proposed development, is clearly outweighed by other considerations. In making this assessment, substantial weight should be given to the harm to the Green Belt which would be caused, including harm to its openness.

### Route: not inappropriate, so the S5(5) balance applies `routeS55` (info)

**Shown when:** route = ""S5(5)""

**Asks:** A GB7 category is met, so the proposal is not inappropriate. It should be approved unless the benefits are substantially outweighed by adverse effects, applying S5(2).

**Findings:**
- *route* **S5(5)**: Not inappropriate development in the Green Belt: approve unless the benefits are substantially outweighed (S5(5)).

**Framework text:**

> **S5(5)** This policy does not apply to development proposals in the Green Belt or on land designated as Local Green Space, which should instead be determined in accordance with policies HC8, GB6, GB7 and/or GB8 (as appropriate). However, where development would not be inappropriate in these locations (through the application of policies HC8 and GB7), proposals should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework, and applying paragraph 2 of this policy.
>
> **S5(2)** In applying this policy, the circumstances in which the benefits of approving development proposals are likely to be substantially outweighed by adverse effects include, but are not restricted to, situations where the development proposal would fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.

### Route: within a settlement, so S4 applies `routeS4` (info)

**Shown when:** route = ""S4""

**Asks:** Development within settlements should be approved unless the benefits are substantially outweighed by adverse effects.

**Findings:**
- *route* **S4**: Within a settlement: approve unless the benefits are substantially outweighed (S4(1)).

**Framework text:**

> **S4(1)** Development proposals within settlements should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework.
>
> **S4(2)(c)** In applying policy S4, the circumstances in which the benefits of approving development are likely to be substantially outweighed by adverse effects include (but are not restricted to) situations where the development proposal would: … c. Fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.

### Route: an S5(1) category outside settlements `routeS51` (info)

**Shown when:** route = ""S5(1)""

**Asks:** The proposal falls in an S5(1) category. It should be approved unless the benefits are substantially outweighed by adverse effects.

**Findings:**
- *route* **S5(1)**: Outside settlements, in an S5(1) category: approve unless the benefits are substantially outweighed (S5(1)).

**Framework text:**

> **S5(1)** Only certain forms of development should be approved outside settlements, as set out in the following list. These should be approved, unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework:
>
> **S5(2)** In applying this policy, the circumstances in which the benefits of approving development proposals are likely to be substantially outweighed by adverse effects include, but are not restricted to, situations where the development proposal would fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.

### Route: an isolated home `routeS53` (info)

**Shown when:** route = ""S5(3)""

**Asks:** Isolated homes should not be approved other than in accordance with HO11.

**Findings:**
- *route* **S5(3)**: An isolated home, decided under S5(3) and HO11.

**Framework text:**

> **S5(3)** Development proposals comprising isolated homes, which are those lying outside settlements or groups of houses, should not be approved other than in accordance with policy HO11.

### Route: outside the S5(1) categories `routeS54` (info)

**Shown when:** route = ""S5(4)""

**Asks:** The proposal is not in an S5(1) category, so it should be approved only in exceptional circumstances, where the benefits substantially outweigh the adverse effects.

**Findings:**
- *route* **S5(4)**: Outside settlements and outside the S5(1) categories: approve only in exceptional circumstances (S5(4)).

**Framework text:**

> **S5(4)** Development proposals which do not fall within one of the categories set out in this policy should only be approved in exceptional circumstances, where the benefits of the proposal would substantially outweigh the adverse effects, including to the character of the countryside and in relation to promoting sustainable patterns of movement.

### S3(2): the part inside the settlement, and the overall view `s32Overall` (info)

**Shown when:** Green Belt = "No", and Settlement = "Partly within, partly outside"

**Asks:** The route above is for the part of the site outside the settlement. The part inside is judged under S4: approve unless the benefits are substantially outweighed. Take both into account in the final balance, which is your overall view on the whole proposal.

**Framework text:**

> **S3(2)** Where a development proposal falls partly within and partly outside a settlement, policies S4 and S5 should be applied to the relevant parts which are inside or outside of the settlement boundary (as appropriate), before coming to an overall view on the proposal.
>
> **S4(1)** Development proposals within settlements should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework.

### Harm to the Green Belt `gbHarm` (info)

**Shown when:** route = ""GB6(2)""

**Asks:** Inappropriate development is harmful by definition. Substantial weight is given to that harm, including harm to openness.

**Findings:**
- *harm* (substantial) **GB6(2)**: Harm to the Green Belt by reason of inappropriateness, and to its openness, carries substantial weight (GB6(2)).

**Cases:** policies GB6(2); tags vsc-not-shown, vsc-shown; grouped by outcome

**Framework text:**

> **GB6(2)** Inappropriate development is, by definition, harmful to the Green Belt and should not be approved except in very special circumstances. Such circumstances will not exist unless the potential harm to the Green Belt by reason of inappropriateness and any other harm resulting from the proposed development, is clearly outweighed by other considerations. In making this assessment, substantial weight should be given to the harm to the Green Belt which would be caused, including harm to its openness.

### GB6(2): very special circumstances `vsc` (judgement)

**Shown when:** route = ""GB6(2)""

**Asks:** Is the harm to the Green Belt by reason of inappropriateness, and any other harm, clearly outweighed by other considerations? The findings so far are listed alongside.

- Yes: clearly outweighed, so very special circumstances exist
- No: very special circumstances do not exist
- Too finely balanced to call

**Guidance:**
- A housing shortfall alone has rarely been enough. At 6010313, five homes at a 1.97-year supply got only modest weight in this balance (¶38).
- An absence of other harm is neutral. It does not count in favour (6010313 ¶36).
- Heritage harm counts as "any other harm". A failed HE6(4) balance adds harm of considerable importance and weight that is not outweighed even by the public benefits.

**Cases:** policies GB6(2); tags vsc-shown, vsc-not-shown; grouped by outcome

**Framework text:**

> **GB6(2)** Inappropriate development is, by definition, harmful to the Green Belt and should not be approved except in very special circumstances. Such circumstances will not exist unless the potential harm to the Green Belt by reason of inappropriateness and any other harm resulting from the proposed development, is clearly outweighed by other considerations. In making this assessment, substantial weight should be given to the harm to the Green Belt which would be caused, including harm to its openness.

### The balance, with a "should be refused" policy failed `balanceTriggered` (judgement)

**Shown when:** (route = ""S4"" or route = ""S5(1)"" or route = ""S5(5)"" or route = ""S5(3)""), and not HO11: isolated homes = "No", and a trigger finding

**Asks:** The proposal fails at least one national policy that says development "should be refused". S4(2)(c) and S5(2) say the benefits are then likely to be substantially outweighed. Is there anything that displaces that?

- Yes: the benefits are substantially outweighed, so refuse
- No: the benefits are not substantially outweighed, so approve
- Too finely balanced to call

**Guidance:**
- In the dataset, decisions that found a trigger policy failed were dismissals or refusals, with no counter-examples (e.g. 6008167, 6005325).

**Cases:** policies S5(2), S4(2)(c); grouped by outcome

**Framework text:**

> **S5(2)** In applying this policy, the circumstances in which the benefits of approving development proposals are likely to be substantially outweighed by adverse effects include, but are not restricted to, situations where the development proposal would fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.
>
> **S4(2)(c)** In applying policy S4, the circumstances in which the benefits of approving development are likely to be substantially outweighed by adverse effects include (but are not restricted to) situations where the development proposal would: … c. Fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.

### The balance: substantially outweighed? `balancePlain` (judgement)

**Shown when:** (route = ""S4"" or route = ""S5(1)"" or route = ""S5(5)"" or route = ""S5(3)""), and not HO11: isolated homes = "No", and not (a trigger finding)

**Asks:** Weighing the adverse effects listed alongside against the benefits, are the benefits of approval substantially outweighed?

- Yes: the benefits are substantially outweighed, so refuse
- No: the benefits are not substantially outweighed, so approve
- Too finely balanced to call

**Guidance:**
- "Substantially outweighed" is a strong tilt towards approval. In some council decisions, harm given substantial weight did not substantially outweigh substantial housing benefit (stratford-26-00617-PIP, stratford-26-01458-FUL) (but see DP3(3): that report did not ask whether there was clear justification).
- A failed HE6(4) balance is not a "should be refused" trigger, but it is weighed here as harm of considerable importance and weight with no clear and convincing justification (HE6(3), HE4(2)). Inspectors who found HE6(4) failed went on to find the benefits substantially outweighed (6007221 ¶40, ¶51).
- Inspectors have found substantial housing weight substantially outweighed by heritage harm (6009545) and by design conflict (6008167).

**Cases:** policies S4(1), S5(1), S5(5); grouped by outcome

**Framework text:**

> **S4(1)** Development proposals within settlements should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework.
>
> **S5(1)** Only certain forms of development should be approved outside settlements, as set out in the following list. These should be approved, unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework:
>
> **S5(5)** This policy does not apply to development proposals in the Green Belt or on land designated as Local Green Space, which should instead be determined in accordance with policies HC8, GB6, GB7 and/or GB8 (as appropriate). However, where development would not be inappropriate in these locations (through the application of policies HC8 and GB7), proposals should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework, and applying paragraph 2 of this policy.

### S5(4): exceptional circumstances `exceptional` (judgement)

**Shown when:** route = ""S5(4)""

**Asks:** Would the benefits substantially outweigh the adverse effects, including to the character of the countryside and to sustainable patterns of movement?

- Yes: exceptional circumstances
- No
- Too finely balanced to call

**Cases:** policies S5(4); grouped by outcome

**Framework text:**

> **S5(4)** Development proposals which do not fall within one of the categories set out in this policy should only be approved in exceptional circumstances, where the benefits of the proposal would substantially outweigh the adverse effects, including to the character of the countryside and in relation to promoting sustainable patterns of movement.

## Outcomes (first match wins)

| Verdict | When | Title | Test |
| --- | --- | --- | --- |
| refuse | route = ""S5(3)"", and HO11: isolated homes = "No" | Refuse: an isolated home outside HO11 | Isolated homes should not be approved other than in accordance with HO11 (S5(3)). |
| refuse | GB6(2): very special circumstances = "No: very special circumstances do not exist" | Refuse: inappropriate development, no very special circumstances | The harm to the Green Belt and any other harm are not clearly outweighed (GB6(2)). |
| approve | GB6(2): very special circumstances = "Yes: clearly outweighed, so very special circumstances exist" | Approve: very special circumstances | The harm to the Green Belt and any other harm are clearly outweighed by other considerations (GB6(2)). |
| balanced | GB6(2): very special circumstances = "Too finely balanced to call" | Finely balanced: very special circumstances | Turns on whether the Green Belt harm and other harm are clearly outweighed (GB6(2)). |
| approve | S5(4): exceptional circumstances = "Yes: exceptional circumstances" | Approve: exceptional circumstances | The benefits substantially outweigh the adverse effects (S5(4)). |
| refuse | S5(4): exceptional circumstances = "No" | Refuse: outside the S5(1) categories, no exceptional circumstances | The benefits do not substantially outweigh the adverse effects (S5(4)). |
| balanced | S5(4): exceptional circumstances = "Too finely balanced to call" | Finely balanced: exceptional circumstances | Turns on whether the benefits substantially outweigh the adverse effects (S5(4)). |
| refuse | `balance` = "Yes: the benefits are substantially outweighed, so refuse", and a trigger finding | Refuse: fails a policy that says development "should be refused" | Failing a "should be refused" policy means the benefits are likely to be substantially outweighed (S4(2)(c), S5(2)), and they are. |
| refuse | `balance` = "Yes: the benefits are substantially outweighed, so refuse", and (a fail finding under HE6(4); or a fail finding under HE5(1)) | Refuse: unjustified heritage harm, benefits substantially outweighed | The heritage harm, of considerable importance and weight, has no clear and convincing justification (HE6(4), HE4(2)), and carried into the overall balance it substantially outweighs the benefits. |
| approve | `balance` = "No: the benefits are not substantially outweighed, so approve", and (a fail finding under HE6(4); or a fail finding under HE5(1)) | Approve, although the heritage harm is not justified | The benefits are not substantially outweighed, but the heritage harm has no clear and convincing justification (HE4(2)) and was not outweighed by public benefits (HE6(4)). A grant on this basis must explain how harm of considerable importance and weight (HE6(3)), and the section 66 duty for a listed building's setting, were weighed; decisions that omit that step are the ones most open to challenge. |
| refuse | `balance` = "Yes: the benefits are substantially outweighed, so refuse" | Refuse: benefits substantially outweighed | The benefits are substantially outweighed by the adverse effects, assessed against the national decision-making policies. |
| approve | `balance` = "No: the benefits are not substantially outweighed, so approve" | Approve: benefits not substantially outweighed | The benefits are not substantially outweighed by the adverse effects. |
| balanced | `balance` = "Too finely balanced to call" | Finely balanced | Turns on whether the benefits are substantially outweighed by the adverse effects. |
