# Stratford-on-Avon housing supply: what has been approved since the last calculation, and what is pending

Note of 6 October 2026. It answers three questions that come up whenever a Stratford-on-Avon District Council (SDC) report or appeal relies on the housing shortfall:

1. How many homes does SDC need in its pipeline to show a five-year housing land supply (5YHLS)?
2. How many homes have been approved since the council last counted?
3. How many more are in applications still pending?

The current numbers are in `summary.md`, which `tools/stratford_supply.py` regenerates. This file explains the method and what the numbers can and cannot support. Not legal advice.

## Why it matters under the August 2026 NPPF

Under the August 2026 National Planning Policy Framework (NPPF) a supply shortfall is no longer a switch that makes plan policies out of date. It is "evidenced unmet need": footnote 41 for the grey belt route, GB7(1)(g)(ii), and S5(1)(j) outside the Green Belt. Footnote 41 is met by "the lack of a five year supply of deliverable housing sites, including the relevant buffer where applicable", or by a Housing Delivery Test (HDT) result "below 75% of the housing requirement over the previous three years". So the size of the shortfall, and how quickly it is closing, decides how long those routes stay open in the district.

## The council's calculation

SDC's latest calculation has a base date of 31 March 2026 and was published in September 2026 (`sources:stratford-dc/SDC-5YHLS-calculation-at-31-March-2026.pdf`, Table 6). The figures are in `baseline.json`.

| | At 31 March 2025 | At 31 March 2026 |
|---|---|---|
| Local housing need, standard method, a year | 1,112 | 1,084 |
| Five-year requirement with 5% buffer | 5,838 | 5,691 |
| Supply counted | 2,577 | 2,764 |
| Deficit | 3,261 | 2,927 |
| Years of supply | 2.21 | 2.43 |

- The requirement is local housing need, not the Core Strategy figure of 730 a year, because Annex D(8) uses local housing need "where the development plan housing requirement is more than five years old".
- The buffer is 5% because the HDT result is 202% (2025 measurement, published August 2026). Below 85% it would be 20% (Annex D(9)(b), (12)(b)).
- The 2026 supply is 2,407 homes on identified sites, 324 for small windfall sites in years four and five, and 33 for older persons' accommodation.
- Completions have fallen each year: 1,573 in 2021/22, 1,431, 1,010, 895, then 626 in 2025/26 (Table 1 of the 2026 paper).
- The 2025 paper's Table 3 does not reconcile: its components add to 2,184, the stated total is 2,218 and the calculation uses 2,188. The 2026 paper reconciles.
- Reports written before the September 2026 paper quote 2.21 years. They were right when written. Anything new should quote 2.43 years with the base date.

## What the script counts

`tools/stratford_supply.py` reads the council's planning register through its open API and writes three files here.

- **`approved.tsv`**: every decision issued after the base date that grants homes, and every appeal allowed after it. One row per application.
- **`pending.tsv`**: every undecided application that proposes homes, and those refused or undetermined that are now at appeal.
- **`summary.md`**: the totals.

Method:

1. **Decisions.** The register is searched one day at a time by decision date, from the day after the base date. A row counts if its status is a grant: planning permission, outline permission, permission in principle (PIP), or prior approval for a change of use to homes.
2. **Appeals.** Appeals decided after the base date are searched separately. Allowed appeals are added with the appeal decision date.
3. **Pending.** Active applications of the types that can create homes are listed. "Pending Consideration" and "Pending Decision" count as pending.
4. **Homes.** The number is read from the proposal description: "up to 70 dwellings" is 70, and a range is counted at its top. A replacement dwelling, or the demolition of an existing one, takes one off the net figure.
5. **Hand checks.** Where the description cannot be read that way, `overrides.tsv` gives the count and the reason. The `basis` column says `override` for those rows and `auto` for the rest.
6. **Category.** Each row is given the Annex B "deliverable" category it would fall in. Category (a) is full permission, prior approval, and outline permission for fewer than ten homes. Category (b) is outline permission for ten or more, and PIP.

Not counted, and listed in the files with the reason:

- reserved matters approvals, which add detail to homes already permitted in outline;
- traveller pitches and care homes;
- the 3,100-home outline application at Long Marston Airfield (18/01892/OUT), undecided since 2018;
- 32 holiday lodges proposed for permanent occupation at Wixford (25/02584/FUL).

Variations of existing permissions (section 73 applications) and holiday lets are left out without a row.

## What the numbers do not show

The totals are a count of permissions and applications. They are not a five-year supply figure, and should not be presented as one.

- **Only expected completions count.** A site is deliverable only with "a realistic prospect that homes will be delivered on the site within five years" (Annex B). A large outline permission granted now may deliver few homes, or none, by March 2031.
- **Category (b) needs evidence.** Major outline permissions and PIPs count "only" where there is "clear evidence that homes will be delivered on-site within five years". SDC counted 409 homes from major outline sites and none from PIPs at March 2026.
- **Completions leave the supply.** Homes finished since the base date are no longer in the pipeline. The register does not record completions, so the script cannot net them off.
- **Windfalls overlap.** The council's figure already allows 324 homes for small unidentified sites in years four and five. Small approvals since the base date are partly what that allowance anticipated.
- **Counts are maximums.** Outline and PIP numbers are "up to" figures.
- **Double counting is possible.** A new application on a site that already has permission adds nothing. Rows that refer to an earlier permission carry a note; those checked by hand are in `overrides.tsv`. Overlapping sites among the pending applications have not been checked.
- **Major means homes here.** The script treats ten or more homes as major. The legal definition also catches sites of 0.5 hectares or more, which the register search does not give.
- **Resolutions to grant are pending.** A scheme approved by committee but waiting for its legal agreement shows as pending until the decision is issued.

## Updating

```bash
uv run tools/stratford_supply.py                    # fetch the register and rebuild (about two minutes)
uv run tools/stratford_supply.py --save-raw pull.json   # keep the pull
uv run tools/stratford_supply.py --from-raw pull.json   # rebuild offline after editing overrides.tsv
```

- After a run, read the rows with `basis` = `auto` that are new, and add an override for any that are wrong.
- The script lists overrides that no longer match a row. An application that has been decided moves from `pending.tsv` to `approved.tsv` and keeps its override.
- When SDC publishes a new calculation, save the paper in the sources repository, replace the figures in `baseline.json` and move the old ones to `previous`. The new base date restarts the count.

## Sources

- SDC, *5 Year Housing Land Supply calculation at 31st March 2026* (September 2026): `sources:stratford-dc/SDC-5YHLS-calculation-at-31-March-2026.pdf`; https://www.stratford.gov.uk/doc/215079/name/202609%205YHLS%20at%20310326.pdf
- SDC, *5 Year Housing Land Supply calculation at 31st March 2025* (March 2026): `sources:stratford-dc/SDC-5YHLS-calculation-at-31-March-2025.pdf`; https://www.stratford.gov.uk/doc/214391/name/202603%205YHLS%20calc%20at%20310325.pdf
- SDC five-year supply page: https://www.stratford.gov.uk/planning-building/five-year-housing-supply.cfm
- SDC planning register: https://apps.stratford.gov.uk/Eplanningv2/Home/AdvancedSearch (API notes in `DISTILLATION-GUIDE.md` §7)
- NPPF August 2026, footnote 41, Annex B ("Deliverable") and Annex D(8), (9), (12): `open:nppf/NPPF-August-2026.txt`
- How the shortfall is applied in decisions: `../green-belt.md` P8 and P12
