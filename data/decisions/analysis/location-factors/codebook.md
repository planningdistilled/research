# Location factors: codebook and method

Which factors do inspectors and councils use to decide whether a site is a sustainable location, and which way does each cut? This folder holds the register that answers that question for every decision in the database, and the rules it was coded by.

| File | What |
| --- | --- |
| `register.tsv` | One row per decision screened (309 at 6 October 2026). Columns below. |
| `codes.tsv` | The one list of classes (single letter) and factor codes: code, label, and for each factor the wording the decision text must contain. `tools/location_factors.py` and the page builders read it. |
| `codebook.md` | This file. |

Published at `/research/england/sustainable-location/factors/` by `pages/england/sustainable-location/factors/build.mjs`. The main sustainable location page takes its "in decisions" figures from the same register.

## The question

For each decision: did the decision-maker assess whether the site is a sustainable or accessible location, meaning whether occupiers or users can reach services, facilities and jobs without depending on a car? If so, which factors came into that assessment, and which way did each cut?

The policies in play are TR3 (locating development in sustainable locations), GB7(1)(g)(iii) (the grey belt limb that refers to TR3), GB7(1)(h) and S5(1)(h) (land around a well-connected station), S5(1)(j) (housing outside settlements where there is unmet need), CC2 (climate mitigation), and the local-plan policies that do the same job.

## Which decisions were screened

A decision was screened if any of these held in its case file:

- a policy finding on TR3, GB7(1)(g)(iii), GB7(1)(h) or S5(1)(h);
- one of the tags `sustainable-location-fail`, `sustainable-location-pass`, `rural-lane-no-footway`, `connectivity-tool`, `car-dependence-moderate`;
- a main issue about a sustainable or suitable location, accessibility or access to services;
- two or more uses in the case file of phrases such as "sustainable location", "genuine choice", "car-dependent", "walking distance" or "public transport";
- a row coded A, B, C, D or F in the settlement-tier register (`../appeals-review/settlement-tier-usage.tsv`), meaning the settlement's tier played a part in the decision.

## Register columns

`case_id`, `engaged`, `finding`, `factors`, `decisive`, `other`, `note` (tab-separated, no quoting).

- **engaged**
  - `Y`: the sustainability or accessibility of the location was assessed with at least one stated factor.
  - `B`: it was only asserted or conceded in a bare statement ("sustainable location" listed as a benefit; "accessibility undisputed"), with no factors given.
  - `N`: not assessed. The decision was screened for another reason: for example "location" meant a town-centre sequential test or spatial strategy alone, or TR3 was cited only for highway safety. The other columns are empty.
- **finding**
  - `pass`: the location was found sustainable or acceptable on accessibility.
  - `fail`: found unsustainable, car-dependent or in conflict.
  - `mixed`: shortcomings were found but tolerated or given reduced weight, or the location passed one limb and failed another.
  - `unclear`: the decision does not reach a finding.
- **factors**: comma-separated factor codes, each followed by a sign.
  - `+` the decision-maker treated the factor as supporting a sustainable location.
  - `-` as counting against it.
  - `=` raised but expressly rejected, given no or little weight, or neutral.
  - A code appears at most once per decision. If it cut both ways, the sign is the way it finally counted.
- **decisive**: the one to three factors (with sign) that the case note presents as deciding the location finding. A subset of `factors`. Empty if none stands out.
- **other**: a factor that came into play but fits no code, as free text with its sign in square brackets.
- **note**: the gist of the location finding, in 25 words or fewer.

## What is not coded

- Highway safety at the site access, parking adequacy and traffic impact as such. They are coded only where they concern the safety or usability of the route people would walk or cycle to services.
- Flood "safe access", the accessibility of a building for disabled users, "access" as a reserved matter, ecological connectivity.
- Green Belt openness, character, heritage and other issues.
- Anything inferred. A factor is coded only if the case note states it.
- "Physically well-related" under S5(1)(j), or position in a spatial strategy, where the decision says nothing about reaching services. These are `N`, or the settlement codes are left out.

## The factors

The labels are in `codes.tsv`. Notes on where the lines fall:

### A. Walking route quality
- `A1` footway or pavement presence and continuity on the route to services, including "no footway" and "verge only".
- `A2` footway width, surface or condition. A narrow *carriageway* is `A12`.
- `A3` street lighting.
- `A4` traffic speed or the speed limit on the route.
- `A5` traffic volume or type: a busy road, heavy goods vehicles, farm traffic, low flows.
- `A6` having to walk in the carriageway or on the verge; pedestrian safety; visibility on the route.
- `A7` crossings and severance: a main road to cross, no crossing point, a dual carriageway or railway as a barrier; a new or existing crossing.
- `A8` public rights of way, field paths, bridleways, towpaths and unmade tracks used as the walking route.
- `A9` topography and gradient.
- `A10` usability for all users and in all conditions: disabled people, wheelchairs, pushchairs, children, older people; darkness, winter, bad weather.
- `A11` the general attractiveness, directness or convenience of the walking route where none of the above is specified.
- `A12` a narrow or single-track lane.

### B. Distance and proximity
- `B1` distance or walking time to services, facilities or the settlement: any stated figure, or "close", "remote", "well separated".
- `B2` a distance benchmark applied: 800 metres, 400 metres, 2 kilometres, Chartered Institution of Highways and Transportation or Manual for Streets figures, the NPPF Annex B "reasonable walking distance", local-plan thresholds.
- `B3` the physical relationship to a settlement (adjoining, within the built-up area, edge of settlement, isolated, detached), used as an accessibility point.

### C. Services and facilities
- `C1` the range of day-to-day services nearby: adequate, limited or none.
- `C2` the need to travel on to a larger settlement for higher-order services, a secondary school, jobs or a main food shop.
- `C3` services provided on site or by the scheme.

### D. Bus and road public transport
- `D1` bus stops: whether they exist, how far away, and whether they can be reached.
- `D2` bus service level: frequency, hours, days, destinations.
- `D3` no evidence on bus services: no timetable, an unevidenced frequency, doubt whether a service will continue.
- `D4` demand-responsive, on-demand, ring-and-ride, community or school transport.
- `D5` "public transport" with the mode not stated.

### E. Rail
- `E1` distance or walking route to a railway, tram or metro station.
- `E2` rail service level, or whether the station is "well-connected".

### F. Cycling
- `F1` cycling as a realistic option: routes, safety on the roads, distances by bike, e-bikes, cycle storage.

### G. Car reliance and softening arguments
- `G1` an express overall finding on reliance on the private car.
- `G2` "short car journeys": services a short drive away.
- `G3` electric vehicles and charging.
- `G4` home working, broadband, home deliveries, online services.
- `G5` a car-free or low-car scheme, car club, parking restraint or controlled parking zone, as a location point.

### H. Scale and nature of the development
- `H1` the scale of the scheme and the movement it generates: few trips from a small scheme; "significant movement"; the TR3(1)(a) threshold.
- `H2` the nature of the use makes car travel inherent or the location specific: rural business, agriculture, equestrian use, tourism, a traveller site, solar.
- `H3` the rural context allowance: opportunities for sustainable transport vary between urban and rural areas; connectivity read "in the context of the area".
- `H4` the existing or fallback use and its trips: replacement dwelling, conversion, lawful use, extant permission, prior approval.
- `H5` the characteristics of the intended occupiers.

### I. Settlement hierarchy and plan position
- `I1` the settlement's tier or status in a council's settlement hierarchy.
- `I2` being inside or outside a settlement boundary, treated as answering or informing the location question.
- `I3` a local-plan accessibility policy or spatial strategy applied as the accessibility test.
- `I4` an allocation, or an emerging plan or council assessment that found the location suitable or unsuitable.
- `I5` the NPPF Annex B definition of "settlement", or "isolated", used in the location reasoning.

### J. Evidence, tools and other parties
- `J1` a Connectivity Tool score or band, including its absence being noted.
- `J2` the highway authority's position, relied on or discounted for the location question.
- `J3` a transport statement, travel plan, accessibility audit or survey: present, or its absence held against a party.
- `J4` comparator decisions: earlier appeals, nearby permissions, the site's own history.
- `J5` existing residents' behaviour: "others already walk it"; existing houses are equally car-reliant.
- `J6` the point was conceded, agreed or undisputed.
- `J7` the decision-maker's own observation of the route on the site visit.
- `J8` a Public Transport Accessibility Level (PTAL), the Transport for London measure.
- `J9` the accident record.

### K. Mitigation and improvements
- `K1` a new or improved footway, path link, crossing or lighting.
- `K2` a bus service contribution, new stop, travel vouchers, travel plan measures or car club.
- `K3` whether the mitigation is secured and deliverable.
- `K4` a speed-limit change or traffic calming.
- `K5` no improvements offered, including under TR3(1)(e).

## How it was coded

1. **From the case files.** Seven coders each read 43 case files (the policy findings, key facts and the body) against this codebook and recorded the factors. The case files are our own notes on each decision, written from the decision letter or council report.
2. **Reconciled.** Factors the coders recorded as free text were folded into five codes added afterwards: `A12`, `D5`, `J8`, `J9` and `K5`. Thirty-one one-off points stay in the `other` column.
3. **Reconciled with the settlement-tier register.** That register is quote-checked and records every decision that uses a tier label. `I1` now follows it: a decision it codes A, C or F carries `I1+` (decisive for A), B carries `I1=`, D carries `I1-`, and E (descriptive only) carries `I1=` if the coders had recorded the tier at all. Against the 170-row register this added `I1` to 38 decisions and changed it in 4; six decisions the screening rules had missed were added from it, and Battle 6007272 moved from `B` to `Y`. The tier register grew to 203 rows on 6 October 2026, which added `I1` to 10 more decisions and two more rows. Eleven D-coded decisions are `N`: the hierarchy counted against the site as a spatial-strategy conflict, with no finding on whether the location is sustainable. When the tier register changes, repeat this step.
4. **Checked against the decision text.** `tools/location_factors.py` checks every coded factor against the text of the decision itself (the Planning Inspectorate letter, or the council report, notice or minutes). The text must contain wording for that factor; the patterns are in `codes.tsv`. Sixteen factors failed the first run. Fourteen were worded differently in the letter and the patterns were widened; two were removed from the register (`A1` at Brenzett 6007677 and `A8` at Bodmin 6007179).

## Limits

- **The counts are floors.** A factor the case note left out is not counted, so a factor may have been used in more decisions than the register shows.
- **The text check is a check of presence.** It shows the decision mentions the factor. It does not show the factor was part of the location reasoning or which way it cut. For broad codes such as `I3` and `J4` the wording is common, so the check is weak.
- **The signs are approximate at the margin.** The coders differed on whether a shortcoming that was found and then tolerated is `-` or `=`, and whether a favourable fact overridden by another factor is `+` or `=`. The count of decisions in which a factor came into play is firmer than the split between for, against and set aside.
- **`A12` and `J8` are probably undercounted**, because they were not in the codebook the coders worked from. The other class I codes (`I2` to `I5`) may be too: the coders left out plan-position points made only as a spatial-strategy conflict, and the reconciliation above shows how many tier references that rule missed.
- **"Decisive" is a reading of the case note**, not a quotation from the decision.

## Updating

Add a row for each new decision that meets the screening rules, then run:

```bash
python3 tools/location_factors.py --list     # must report every factor supported
node pages/england/sustainable-location/factors/build.mjs
node pages/england/sustainable-location/build.mjs
```

The builders compute every figure from the register and stop if a sentence on the page no longer holds.
