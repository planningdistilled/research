# Harvest log: corpus-nongb-b (Wave 2, slice nongb-B)

**Agent:** corpus-nongb-b. **Date:** 2026-09-23.
**Work list:** `harvest-log/slices/nongb-B.tsv` — 97 Planning-type PINS decisions (not Green Belt) dated 17 Aug–23 Sep 2026. The slice was selected because each letter cites S3–S6, HO10, HO11, Annex D or TR3.
**Source:** letter text in `data/open-sources/pins-corpus/<ref>.txt`, with PDF URLs from `docs.map`. No web searching was needed. Every letter had usable full text.

## Method
- Every letter was read in full and triaged into tier 1 (full case file) or tier 2 (short file with the `tier-2` tag), following BRIEF Wave 2.
- I split the list into three parts (A, B and C). Parts A and B each went to one forked sub-agent; I did part C myself.
- Before each write we checked whether a case file already existed. The index builder was then run and the WARN lines on our files were fixed. A YAML error in PINS-6012985 was fixed. The remaining WARN, PINS-6005963, belongs to corpus-rest-2, not to this slice.

## Counts
- 97 of 97 refs have a case file.
- **83 were written by corpus-nongb-b:** 47 tier 1 and 36 tier 2; 13 allowed and 70 dismissed.
- **13 were written by appeals-nongb**, which also worked some refs in this slice: 6010023, 6010557, 6010682, 6010826, 6010834, 6010973, 6011079, 6011150, 6011217, 6011373, 6011421, 6011458 and 6011498.
- **1 was written by sos-and-other:** 6011314.
- Those 14 files were left as their authors wrote them and are listed below for coverage.
- **Overlap incident 1.** Fork A overwrote PINS-6010023, which appeals-nongb had already written. appeals-nongb then restored its fuller version, keeping fork A's drafting-slip points.
- **Overlap incident 2.** Fork B's PINS-6010557 and PINS-6010682 were overwritten by appeals-nongb in a race at about 14:56. The appeals-nongb versions stand.

## Unusable letters or corrections to the corpus index
- None unusable.
- False-positive policy codes in the corpus index:
  - 6009442: "HO10" is Harrow Local Plan HO10 (HMOs).
  - 6009542: "S4" is Derbyshire Dales Local Plan S4. This letter was also decided under the Dec 2024 NPPF (transitional).
  - 6010310: "S4" comes from drawing numbers.
  - 6010429: "HO4" is a neighbourhood plan policy.
- One letter covering two appeals:
  - 6010765 and 6010767 are one letter covering the planning and LBC appeals. They have two cross-linked files.
  - 6010864's letter also decides advert appeal 6011686. 6010818's letter also decides advert appeal 6010823.
- **6011694 (Honeysuckle Bottom, Guildford) is a Green Belt site** that is in this non-GB slice. The inspector records a Green Belt openness benefit, but applies S5 and never GB6/GB7, contrary to S5(5). The case is tagged `green-belt-policy-not-applied`.

## Coverage table
| ref | tier | outcome | determinative codes | written by |
|---|---|---|---|---|
| 6009228 | 1 | dismissed | HE6, DP3, TR6(4), S4(2)(c) | corpus-nongb-b |
| 6009237 | 1 | dismissed | N4, S5(1)(g), HO12 | corpus-nongb-b |
| 6009276 | 2 | dismissed | S4, P3, HE6, DP3 | corpus-nongb-b |
| 6009303 | 1 | dismissed | S5(1)(j), CC2, TR3, HO7 | corpus-nongb-b |
| 6009313 | 2 | dismissed | HE7, DP3, S4 | corpus-nongb-b |
| 6009357 | 1 | allowed | S4, HO7, TR3 | corpus-nongb-b |
| 6009409 | 1 | dismissed | S5(1)(c), S5(1)(d), S5(1)(j), S5(3), HO11, TR3 | corpus-nongb-b |
| 6009442 | 2 | allowed | Harrow LP HO10 | corpus-nongb-b |
| 6009463 | 2 | dismissed | S5(1)(c) | corpus-nongb-b |
| 6009474 | 1 | dismissed | S5(1)(e), S5(1)(h), S5(4), TR3, CC2, DP2, N2 | corpus-nongb-b |
| 6009486 | 1 | allowed | S5(1)(c), S3, HO9(1), HO7 | corpus-nongb-b |
| 6009503 | 1 | dismissed | HE6, S4, L2(1)(d)(i), DP3(1) | corpus-nongb-b |
| 6009541 | 1 | dismissed | P3(2), DP3(1), DP3(3), S4(2)(c), S4 | corpus-nongb-b |
| 6009542 | 2 | dismissed | HE7, HE6, TR6(4) | corpus-nongb-b |
| 6009588 | 1 | dismissed | S5(1)(j), N6, DP3(3), DM6 | corpus-nongb-b |
| 6009598 | 1 | dismissed | S5(1)(c), S5(2), F6, F7 | corpus-nongb-b |
| 6009618 | 1 | dismissed | S5(1)(e), S5(1)(j), TR6(4), TR3, HO7 | corpus-nongb-b |
| 6009626 | 2 | dismissed | S4, P3 | corpus-nongb-b |
| 6009632 | 1 | allowed | S5(1)(e), DP3(3), TR3 | corpus-nongb-b |
| 6009640 | 2 | dismissed | S4, DP3(1), DP3(3), L2(1)(d) | corpus-nongb-b |
| 6009718 | 1 | dismissed | S5(3), HO11, HE6, F5, F7, F8 | corpus-nongb-b |
| 6009738 | 2 | dismissed | S4, DP3, HC4 | corpus-nongb-b |
| 6009787 | 2 | dismissed | S4 | corpus-nongb-b |
| 6009818 | 2 | dismissed | S5(1)(a), DP3 | corpus-nongb-b |
| 6009838 | 1 | dismissed | S5(1)(j), S5(4), HE6, TR3 | corpus-nongb-b |
| 6009852 | 2 | dismissed | S4, DP3, P3 | corpus-nongb-b |
| 6009886 | 1 | dismissed | TR6(4), S4(2)(c), S4 | corpus-nongb-b |
| 6009917 | 1 | dismissed | S4(2)(a)(i), S4, HO7 | corpus-nongb-b |
| 6009929 | 2 | dismissed | S4, DP3 | corpus-nongb-b |
| 6009985 | 1 | dismissed | S5(3), HO11, S5(1)(j), TR3 | corpus-nongb-b |
| 6010023 | 1 | dismissed | TR4, S4(1) | appeals-nongb |
| 6010063 | 2 | dismissed | S4, P3 | corpus-nongb-b |
| 6010090 | 1 | dismissed | S5(1)(j), S5(3), HO11, S5(4), TR6(4) | corpus-nongb-b |
| 6010166 | 1 | dismissed | S5(1)(j), S5(4), S3 | corpus-nongb-b |
| 6010187 | 1 | dismissed | HO11(1)(a), S5(3), S5(1)(j) | corpus-nongb-b |
| 6010195 | 1 | allowed | S4(1), S3 | corpus-nongb-b |
| 6010197 | 1 | dismissed | S4(2)(c), DP3(1), DP3(3), HE4, HE6 | corpus-nongb-b |
| 6010223 | 2 | dismissed | P3, S4(1) | corpus-nongb-b |
| 6010228 | 1 | dismissed | S5(1)(b), S5(1), F4, F7, DP3, P3, N2 | corpus-nongb-b |
| 6010288 | 2 | dismissed | DP3(3), TR6(4), TR4(1)(c)(i), S4(1) | corpus-nongb-b |
| 6010310 | 2 | allowed | HE4 | corpus-nongb-b |
| 6010348 | 1 | dismissed | S5(1)(c), S5(1)(j), S5(4), N4, TR3 | corpus-nongb-b |
| 6010354 | 1 | dismissed | S5(1)(e), S5(4), DP3(3) | corpus-nongb-b |
| 6010362 | 2 | dismissed | S4(1), DP3, L2(1)(d)(ii) | corpus-nongb-b |
| 6010379 | 2 | dismissed | S4(1), TR6(4) | corpus-nongb-b |
| 6010391 | 2 | dismissed | HE6(4), DP3(3), S4(1) | corpus-nongb-b |
| 6010393 | 1 | dismissed | S4(1), L2(1)(d)(i), DP3(3), S5(1)(j) | corpus-nongb-b |
| 6010397 | 1 | allowed | S4(1), L2, CC2(2), TC2 | corpus-nongb-b |
| 6010401 | 1 | dismissed | S5(4), DP3 | corpus-nongb-b |
| 6010416 | 2 | dismissed | HE6, S4(1) | corpus-nongb-b |
| 6010429 | 2 | dismissed | S4(1) | corpus-nongb-b |
| 6010442 | 1 | dismissed | S5(1)(j), S5(1)(e), S5(4), TR3 | corpus-nongb-b |
| 6010501 | 2 | dismissed | S4(1), HO7, TR4, DP3 | corpus-nongb-b |
| 6010518 | 2 | dismissed | P3, S4(1) | corpus-nongb-b |
| 6010557 | 1 | dismissed | S4(1), L2(1)(d)(ii) | appeals-nongb |
| 6010619 | 1 | dismissed | S4(2)(a)(ii), L2(1)(d)(ii), DP3(3), HE7(2) | corpus-nongb-b |
| 6010682 | 1 | dismissed | F5, S5(2), S5(1) | appeals-nongb |
| 6010701 | 1 | dismissed | S4(2)(a)(ii), L2(1)(d), S4(2)(c), DP3(3), N2(1)(f) | corpus-nongb-b |
| 6010702 | 2 | dismissed | S4(1), P3, DP3, TR6(4) | corpus-nongb-b |
| 6010765 | 2 | dismissed | HE6, S4(1) | corpus-nongb-b |
| 6010767 | 2 | dismissed | HE6 | corpus-nongb-b |
| 6010783 | 2 | dismissed | HE6, S4(1) | corpus-nongb-b |
| 6010818 | 2 | dismissed | S4(1) | corpus-nongb-b |
| 6010822 | 2 | dismissed | DP3(1), DP3(2)(g), N2, S4(1) | corpus-nongb-b |
| 6010826 | 1 | dismissed | S3, S5(1)(j), S5(2), DP3 | appeals-nongb |
| 6010834 | 1 | dismissed | S5(1)(j), S5(4), S3 | appeals-nongb |
| 6010836 | 1 | dismissed | S4(1), S4(2)(c), DP3, L2(1)(d) | corpus-nongb-b |
| 6010848 | 1 | dismissed | N6, S5(1)(j)(i), TR3, S6 | corpus-nongb-b |
| 6010864 | 2 | dismissed | S4(1) | corpus-nongb-b |
| 6010905 | 2 | dismissed | DP3, S4(2)(c) | corpus-nongb-b |
| 6010909 | 1 | allowed | S4(1), S3, HO7 | corpus-nongb-b |
| 6010946 | 1 | dismissed | S4(1), HO1 | corpus-nongb-b |
| 6010973 | 1 | allowed | S5(1)(e), S3, TR3, HO7 | appeals-nongb |
| 6011045 | 1 | dismissed | S5(1)(c), S5(4) | corpus-nongb-b |
| 6011079 | 1 | dismissed | S5(1)(g), S5(4), HO12, F7, F4, TR4 | appeals-nongb |
| 6011088 | 1 | dismissed | S4(1), HO7, DP3(3) | corpus-nongb-b |
| 6011097 | 2 | allowed | TR6(4), TR3, TR4 | corpus-nongb-b |
| 6011137 | 1 | dismissed | S4(1), S4(2)(c), DP3(3), L2(1)(b) | corpus-nongb-b |
| 6011148 | 1 | allowed | S4(1), HO7, L2(1)(d) | corpus-nongb-b |
| 6011150 | 1 | dismissed | S5(1)(j)(i), S5(4), AnnexB:settlement, DP3(3), TR3 | appeals-nongb |
| 6011217 | 1 | allowed | S3, S5(1)(d), AnnexB:previously-developed-land, HO7 | appeals-nongb |
| 6011314 | 1 | dismissed | HE6(1), HE6(4), HE4(2), S5 | sos-and-other |
| 6011373 | 1 | dismissed | S4(1), S4(2)(c), DP3(1), DP3(3) | appeals-nongb |
| 6011375 | 2 | dismissed | TR6(4), S4(1) | corpus-nongb-b |
| 6011421 | 1 | dismissed | L2(1)(d)(ii), DP3 | appeals-nongb |
| 6011431 | 1 | dismissed | S5(1), TR3, CC2 | corpus-nongb-b |
| 6011458 | 1 | dismissed | S4(1), S4(2) | appeals-nongb |
| 6011498 | 1 | dismissed | DP3, DM6, S5(1), S5(2) | appeals-nongb |
| 6011521 | 1 | dismissed | HE6, S4(1), L2(1)(d)(i), DP3(1) | corpus-nongb-b |
| 6011522 | 2 | dismissed | TR6(4), TR4, TR3 | corpus-nongb-b |
| 6011694 | 1 | allowed | S5(1)(c), S5(1)(d), S5(3), HO11(c), S5(4), N6 | corpus-nongb-b |
| 6011786 | 1 | allowed | S4(1), HE7(4), HE9, N6 | corpus-nongb-b |
| 6011840 | 2 | dismissed | S4(1), N2 | corpus-nongb-b |
| 6011872 | 1 | dismissed | S5(1)(j), CC2, DP3, HO7 | corpus-nongb-b |
| 6012370 | 1 | allowed | S4(1), DM7, P5 | corpus-nongb-b |
| 6012542 | 2 | dismissed | HE6, TR4, S4(1) | corpus-nongb-b |
| 6012985 | 1 | dismissed | S5(1)(e), S5(1)(j), S5(3), HO11, S5(4) | corpus-nongb-b |

Tier column: "1" also covers the 14 files written by other agents, which are full files.

## LEADS NOT FOLLOWED
- **Costs decisions not read:**
  - 6009442 (Harrow)
  - 6009474 (Horsham PiP)
  - 6009486 (Tarleton)
  - 6009818 (Whitfield)
  - 6009886 (Croydon)
  - 6010197 (King's Lynn)
  - 6010557 (Leicester)
  - 6011097 (Bromsgrove)
  - 6011521 (Westminster)
  - 6011840 (Worcester)
- **Linked advert appeals decided in the same letters:**
  - 6009551 (with 6009738)
  - 6010823 (with 6010818)
  - 6011686 (with 6010864)
- **Cited earlier decisions:**
  - PINS 6005680 (Hollocombe, Torridge; cited in 6009632)
  - PINS 6000561, 6001897 and 6001401 (Torridge conversions)
  - PINS 6001094 (cited in 6012985)
  - Redbridge HMO appeals 6004750, 6005502, 6004591, 6005625, 6005078 and 6005192
  - APP/D3830/W/25/3361729 (Mid Sussex, 3.38-year supply)
  - APP/P2365/W/25/3361672 and APP/J2373/C/23/3325930 (children's homes)
  - APP/U5930/W/25/3365385 (earlier Hillcrest Road appeal)
  - APP/J0405/W/21/3276552 (Pitstone)
  - APP/Y3615/W/20/3251096 (8 Abbotswood Close)
  - APP/X5990/W/25/3358529 and APP/X5990/D/21/3288673 (Westminster mansards)
  - APP/D1835/W/24/3352502 (Worcester HMO parking)
- **Council decisions cited:**
  - Foxhole Farm DM/25/1129 (200 homes, Bolney)
  - Kirklees 2025/62/92414/W (92 Balmoral Avenue children's home)
  - Mid Devon 26/00489/PIP and 25/01580/PIP
  - South Cambridgeshire 23/03537/FUL

## OBSERVED PATTERNS
1. **S4 or S5 is decided on the ground as well as on the policies map.** Inspectors apply the Annex B "settlement" definition to the physical situation, but give a defined boundary heavy weight.
   - Hamlets, scattered clusters and ribbons with green gaps are not settlements (PINS-6009632 ¶13, PINS-6010442 ¶10, PINS-6010166, PINS-6012985 ¶9).
   - A plot just beyond the last house of an unbounded village is outside it (PINS-6009588 ¶23).
   - Adjoining development on three sides does not make a site "within" a settlement (PINS-6009618 ¶32).
   - A garden at the village edge was "likely" inside, with S5(1)(j) run in the alternative (PINS-6010393 ¶19, 23).
   - Where the local plan calls everything outside a boundary "isolated", Mid Devon inspectors disagreed on the same day. PINS-6011431 ¶7-8 did not follow the plan text (not isolated). PINS-6012985 ¶7, 10 held it "consistent with the Framework".
2. **S5(1)(j) is used a lot but almost never passes. Supply is not the barrier; location is.**
   - A 5YHLS shortfall on its own is treated as "evidenced unmet need" (PINS-6009588, -6009838, -6010187, -6010442, -6012985).
   - A self-build plot shortfall also counts where 5YHLS is shown (PINS-6011872 ¶19, 22; South Cambridgeshire, 5.5-5.6 years).
   - Failures come on "physically well-related". Examples:
     - a separating field or old railway (PINS-6009409);
     - a remote lane access (PINS-6009838);
     - about 700 m across fields (PINS-6009985);
     - about 400 m with green gaps and a steep hill (PINS-6012985);
     - severance by a four-lane road (PINS-6010442).
   - South Cambridgeshire inspectors read the (j)(i) "infrastructure" limb to include *access to services* (PINS-6009303, PINS-6011872 ¶26).
   - The only clear (j) pass in this slice was PINS-6010848 (Pitstone, 3.73 years, footways, lighting and regular buses). It was still dismissed, on N6.
3. **S5(1)(e) "limited infilling within groups of houses" is read strictly:**
   - there must be houses on both sides (PINS-6012985 ¶10);
   - the plot must be *within* the group, not at its edge (PINS-6010442 ¶20);
   - a mixed enclave with caravans, or a mobile home, is not a "group of houses" (PINS-6010354 ¶20-21);
   - a field that runs on into farmland is not infill (PINS-6009618).
   It passed once, for a non-linear group that included dwellings under construction (PINS-6009632). That was the same council and the same week as the -6009618 dismissal.
4. **S5(1)(b)/(c)/(d):**
   - (b) needs a positive case that the location is necessary (PINS-6010228 ¶9).
   - A (c) replacement is judged against the existing building, "irrespective of the size of the host plot" (PINS-6011045 ¶25). It must be for the same use, so a barn cannot become a house under (c) (PINS-6010348 ¶27, PINS-6009409).
   - (c) covers any lawful permanent building changing use, such as a house becoming a children's home (PINS-6009486).
   - Local "architectural merit" tests for re-use get limited weight (PINS-6009598).
   - Qualifying under (c)/(d) does not cure S5(3) isolation for new-build homes. Those still need HO11, failing which S5(4) applies (PINS-6011694 ¶25-28).
5. **S5(4) (exceptional circumstances) almost always fails.** Substantial HO7 weight against substantial movement or character harm is not "substantially outweighing" (PINS-6012985 ¶18-22, PINS-6011045 ¶27-28, PINS-6009838 ¶44-49, PINS-6010090 ¶19).
   - The one pass (PINS-6011694) needed a noisy, HGV-generating lawful sawmill as fallback, plus PDL, 20% BNG and "urgent" shortfall. That letter also misapplies the tilted-balance wording and ignores S5(5) (Green Belt).
   - Class Q or conversion fallbacks neutralise the car-dependence argument and move the fight onto character (PINS-6010401, -6010354, -6010348).
6. **"Substantially outweighed" is usually decided by a "should be refused" policy.** Inspectors treat several policies as S4(2)(c)/S5(2) triggers that defeat even multiple substantial-weight benefits:
   - DP3(3) (PINS-6009228, -6009541, -6009588, -6010197, -6010836, -6010905, -6011137);
   - TR6(4) (PINS-6009618, -6009886, -6011375);
   - N6 (PINS-6009588, -6010848);
   - F7 (PINS-6009598);
   - the flood sequential test (PINS-6010682, via S5(2) with no residual balance).

   PINS-6010836 dismissed despite substantial weight to HO7, E2 *and* TC2. Where no trigger policy was engaged, schemes usually won:
   - space-standard breach (PINS-6010195);
   - solar-panel shading (PINS-6010397);
   - service pressure (PINS-6010909, -6009486);
   - CA harm "very low" (PINS-6011786).

   Two framings of the test appear. PINS-6011148 ¶24 and PINS-6011786 ¶28 look for "substantial adverse effects". PINS-6011137 ¶11 notes the S4(2) list is "not a closed list".
7. **Benefit-side Framework policies are being turned into harms. Inspectors disagree on whether that is permissible.**
   - PINS-6011088 ¶21-22 applied HO7's substantial weight to the *loss* of a needed family home, and DP3(3)'s "substantial weight to compliance" as substantial weight *against* non-compliance with a local HMO space standard.
   - PINS-6010946 ¶30 used HO1 directly as the harm.
   - By contrast, PINS-6011521 ¶28 held HO1 "relates to plan-making and not decision making policies". PINS-6009486 and PINS-6009474 say plan-making policies cannot justify refusal.
   - PINS-6010909 ¶15 rejected "absence of local need is a substantial negative under HO7".
   - This conflict is worth tracking.
8. **L2 (effective use of land) cuts both ways, and S4(2)(a)(ii) is now a live refusal route for garden plots.**
   - The L2(1)(d) criteria decide it: street-scene consistency, footprint no more than double, 50% undeveloped area retained, and neighbour living standards.
   - Garden and backland plots failing those criteria were refused via S4(2)(a)(ii) (PINS-6010701 ¶33-34, PINS-6010619 ¶58-59).
   - A cul-de-sac-head plot meeting them got *substantial* L2 weight and was allowed as a PiP (PINS-6011148 ¶23).
   - L2 weight is "contingent" or "depends on acceptable living standards" (PINS-6010557 ¶24, PINS-6011137 ¶12).
   - Airspace and mansard support fails on L2(1)(d)(i) in a sensitive conservation area (PINS-6011521 ¶26-27).
9. **5YHLS findings.**
   - **No five-year supply:**
     - 1 year (Horsham)
     - 2.22 (Somerset)
     - 2.24 (Ribble Valley)
     - 2.4 (Mid Devon)
     - 2.55 (BCP)
     - 2.82 (Breckland)
     - 2.9 (Horsham traveller pitches)
     - 3.1 (Folkestone and Hythe)
     - 3.38 (Mid Sussex)
     - 3.73 (Buckinghamshire, Aylesbury Vale area)
     - 3.9 (Cornwall)
     - 4.61 (Torridge)
     - also unquantified shortfalls: Cornwall (Newquay), Solihull, Guildford
   - **Supply shown:** Greater Cambridge 5.5-5.6, Croydon, Lewisham (HDT 65%), and King's Lynn and West Norfolk.
   - **HO7 weight varies widely:**
     - Substantial for single homes where there is no 5YHLS (PINS-6009357, -6010848, -6012985).
     - "Considerable" for one home (PINS-6011786).
     - "Little" at a marginal 4.61 years (PINS-6009618 ¶28).
     - Limited or moderate where the homes do not match evidenced local need (PINS-6009409, -6010946, -6011088).
     - Limited for a PiP "up to 3", because only one might be built (PINS-6011431 ¶23).
10. **TR3 facts that decide rural cases.**
    - **Fails:**
      - unlit lanes with no footway, often at the national speed limit (PINS-6009409, -6009838, -6009985, -6010348, -6011694);
      - an unlit B-road footway at national speed limit over about 2 km (PINS-6011431 ¶12);
      - a narrow lane without pavement, a steep hill and a walk of 10+ minutes to the pub (PINS-6012985 ¶11-12);
      - discontinuous cycleway or lighting over 600 m to 1.2 km (PINS-6011872 ¶7);
      - an unsignalised four-lane crossing (PINS-6010442).
    - **Passes:** footways, street lighting and gentle topography with regular buses (PINS-6010848 ¶20), or hourly weekday buses with short walks (PINS-6009357).
    - **Rejected as answers to car dependence:**
      - bus stops without timetable or frequency evidence (PINS-6011431 ¶13, PINS-6011872 ¶7);
      - PROWs across fields ("recreational") (PINS-6011431 ¶11);
      - "short car journeys", EVs and homeworking (PINS-6011431 ¶16-17);
      - a bus every other hour (PINS-6012985 ¶11).
    - **Weight:** TR3 and CC2 conflict is increasingly given *substantial* weight (PINS-6011431 ¶24, PINS-6012985 ¶18), or significant weight (PINS-6011872 ¶23).
11. **Missing paperwork decides many small appeals.** Examples:
    - a SAC/SPA mitigation obligation not executed (PINS-6010848 — the scheme won on every planning point);
    - no biodiversity metric spreadsheet under DMPO Art 7(1A) (PINS-6011375);
    - an unenforceable overflow-parking letter (PINS-6011522);
    - weak self-build UUs (PINS-6011872, PINS-6009303);
    - an unpaid £304 habitats tariff (PINS-6009588).

    Conditions requiring an obligation are refused unless exceptional (PINS-6011375 ¶16, 41). Where the paperwork was complete, the scheme won (PINS-6011786).
12. **New decision-making policies are appearing in reasoning:**
    - DM7 (separate regimes): Ofsted and the Children's Homes Regulations handle safeguarding (PINS-6012370 ¶9).
    - P5 (security of vulnerable occupiers) (PINS-6012370 ¶7).
    - CC2(2) (neighbour's solar panels) (PINS-6010397).
    - W4 (septic tank replacement) (PINS-6010393).
    - DM6(2)(c): Green Belt openness is not "clear justification" to remove PD rights; ancient woodland is (PINS-6011694 ¶46).
    - PINS-6011137 ¶10 decided an appeal on the Framework *alone*, because the saved Basildon plan was not relied on.
13. **Drafting slips and transition handling.**
    - **Slips:**
      - S5 miscited as "S3(2)/(3)/Part 4" (PINS-6011694);
      - old "significantly and demonstrably" wording (PINS-6011694 ¶37, PINS-6010619 ¶56);
      - "S5 paragraph 2(c)" (PINS-6009598);
      - "P5" for S5 (PINS-6009474);
      - "four dwellings" for one (PINS-6011786 ¶22);
      - whitebeam/hornbeam (PINS-6011840).
    - **Transition:**
      - Most inspectors consulted the parties.
      - Appeal planning officer decisions and several tier-2 inspectors did not, saying the relevant policy was "largely unchanged". Examples: PINS-6011097, -6011522, -6010864, -6010905.
      - PINS-6009542 (17 Aug) applied the Dec 2024 NPPF.

---
# nongb-A (upper half)

This section covers a second assignment from the team lead: the 40 uncovered refs from 6007793 upward in `slices/nongb-A.tsv`. appeals-nongb kept the refs below 6007793. Two forked sub-agents did the work, with 20 refs each, and read every letter in full.

**Outcome:** all 40 now have a case file. corpus-nongb-b wrote 25: 18 tier 1 and 7 tier 2. appeals-nongb wrote the other 15. That agent was working the same refs in parallel despite the split, so there were several write races:
- appeals-nongb overwrote our versions of 6007807, 6007856, 6007871, 6009032 and 6009198. Their versions stand.
- 6008434, 6008436, 6008548 and 6008569 had already been written by appeals-nongb. Our unused drafts are in the scratchpad at `nongbB/forkA2/`.
- For 6008410 and 6009181, our write probably landed seconds after appeals-nongb's, so our letter-read version stands. appeals-nongb has been told.

No letters were unusable. The index builder shows no warnings.

## Coverage table (nongb-A upper half)
| ref | tier | outcome | determinative codes | written by |
|---|---|---|---|---|
| 6007793 | 2 | dismissed | HE6, HE9, S4(1) | corpus-nongb-b |
| 6007807 | 1 | dismissed | S5(1)(d), N4 | appeals-nongb |
| 6007856 | 2 | dismissed | 'S4(1)', 'DP3(1)' | appeals-nongb |
| 6007861 | 2 | dismissed | S4(1), HE6 | corpus-nongb-b |
| 6007871 | 1 | allowed | S4, L2(1)(b), DP3 | appeals-nongb |
| 6007941 | 1 | dismissed | F6(1)(b), S4(1), DP3(2) | corpus-nongb-b |
| 6008022 | 2 | allowed | S3(1)(c), DP3 | corpus-nongb-b |
| 6008115 | 1 | dismissed | S5(3), HO11(1)(c), DP3(1), DP3(2)(d) | corpus-nongb-b |
| 6008154 | 2 | dismissed | HE6, HE4, S4(1) | corpus-nongb-b |
| 6008160 | 1 | dismissed | S4(1), DP3(1), DP3(2), N6(1), N2, TR6(4), F7, F8, HE7(2) | corpus-nongb-b |
| 6008167 | 1 | dismissed | DP3(1), DP3(3), S4(2)(c) | corpus-nongb-b |
| 6008359 | 2 | dismissed | HE6, HE7, DP3, S4(1) | corpus-nongb-b |
| 6008410 | 1 | dismissed | DP3(1), DP3(3), S4(1), HC4 | corpus-nongb-b |
| 6008434 | 1 | dismissed | S5(1)(d), TR3, DP3(2)(d), N2, S3 | appeals-nongb |
| 6008436 | 2 | dismissed | HE4, HE6, HE9, 'S4(1)' | appeals-nongb |
| 6008439 | 2 | dismissed | HE6, DP3 | appeals-nongb |
| 6008500 | 1 | dismissed | F5, F5(2)(c), S5(1), S5(2), S5(4), DM6 | appeals-nongb |
| 6008548 | 1 | allowed | 'S5(1)(j)', HO7 | appeals-nongb |
| 6008555 | 2 | dismissed | S4(1), L2(1)(d) | appeals-nongb |
| 6008569 | 1 | dismissed | S5(1)(j)(i), N4, N2 | appeals-nongb |
| 6008634 | 1 | dismissed | S5(3), HO11(1)(c), S5(4), E2, E4 | corpus-nongb-b |
| 6008643 | 1 | allowed | S4(1), TR6(4), HO1, HO7 | corpus-nongb-b |
| 6008646 | 2 | dismissed | S4(1), P3, TR6(4) | corpus-nongb-b |
| 6008707 | 1 | dismissed | S4(1), DP3(2)(a), DP3(3), TR3 | corpus-nongb-b |
| 6008739 | 1 | dismissed | S5(1)(e), S5(1)(j), S5(4), DP3(3), TR3 | corpus-nongb-b |
| 6008742 | 1 | dismissed | S5(1), S5(3), HO11, S5(2), DP3(3), N4 | corpus-nongb-b |
| 6008785 | 1 | dismissed | S5(1)(j), S5(2), DP3(3), DP3(1) | corpus-nongb-b |
| 6008881 | 1 | dismissed | S5(1)(b), S5(1)(c), S5(2), F9, P3, TR4 | corpus-nongb-b |
| 6008944 | 1 | dismissed | HE6, HE7, S4(1), L2(1)(d)(i), DP3(1) | corpus-nongb-b |
| 6008977 | 2 | dismissed | S4(1), P3, DP3 | corpus-nongb-b |
| 6009032 | 2 | dismissed | DP3(1), DP3(3), DP4, S4 | appeals-nongb |
| 6009042 | 1 | dismissed | S5(1)(c), HO11(1)(c), S5(3), HE6, DP3(1) | corpus-nongb-b |
| 6009097 | 2 | dismissed | S3(1)(c), L2 | corpus-nongb-b |
| 6009098 | 1 | dismissed | F4, F7, S4 | appeals-nongb |
| 6009127 | 1 | dismissed | S4(1), DP3(3) | corpus-nongb-b |
| 6009181 | 1 | dismissed | S5(1)(j), S5(4), HO7 | corpus-nongb-b |
| 6009197 | 2 | allowed | S3, S4 | appeals-nongb |
| 6009198 | 2 | dismissed | HE6, HE9, L2(1)(d)(i), DP3, S4 | appeals-nongb |
| 6009211 | 2 | dismissed | DP3(3), S4(2) | corpus-nongb-b |
| 6009220 | 1 | dismissed | S6, S5, DP3 | appeals-nongb |

## LEADS NOT FOLLOWED (nongb-A upper half)
- **Linked advert appeals:** 6007795 (with 6007793) and 6008435 (with 6008436).
- **Costs decisions:** 6008160, 6008785, 6009098 and 6009198.
- **Cited appeals:**
  - APP/D0840/W/23/3332955 (Zoar Cottage)
  - APP/B1605/W/25/3361502 and APP/B1605/W/21/3273053 (Cheltenham)
  - APP/F2605/W/25/3370598
  - APP/Y3940/W/25/3367502, /24/3348998, /16/3154507 and /24/3352756 (Wiltshire "a few dwellings")
  - APP/J1915/W/25/3367102 (East Herts 5YHLS)
  - APP/N5660/W/24/3357257 (Park Tavern)
  - APP/M4320/Z/18/3202986 (Formby)
  - APP/U1430/W/25/3361201 (Rother holiday-let conversion)
  - APP/C1570/W/25/3375597 (Eastfield Stables)
  - APP/L3245/W/25/3362414 (Shropshire 3.81-year supply)
  - APP/B9506/C/21/3266195 (New Forest)
  - APP/F5540/W/17/3168826 and APP/F5540/C/17/3187009 (Hounslow HMOs)
  - APP/Q5300/W/25/3376841 (Enfield PiP)
- **Council decisions:** CB/25/00256/PAAD (Class Q) and Rother RR/2025/435/P.

## OBSERVED PATTERNS (nongb-A upper half)
These add to, and mostly confirm, the nongb-B patterns above.
1. **S5(1)(j) passes and still loses when a refusal-type policy applies.** Examples:
   - PINS-6008785: well-related at a lane edge, but DP3(3) through S5(2).
   - PINS-6008569: 2.69 years' supply and HDT 56%, but National Landscape harm under N4 at "very considerable weight".

   It won where there was an extant permission for the same homes and car reliance was "not unusual in rural areas" (PINS-6008548, 4.17 years).

   Failures on "well-related":
   - 400-500 m across fields (PINS-6009181);
   - the end of a hamlet (PINS-6008739);
   - 300 m of 60 mph lane with no footway (PINS-6008434).
2. **S5(1)(e) fails where the plot adjoins development on one side only.** A house across the road does not count (PINS-6008739 ¶8-9).
3. **Isolation (S5(3)) overrides S5(1)(c) re-use again.** A "group" of one other house still leaves a site isolated (PINS-6009042 ¶20). HO11(1)(c) needs the building to be genuinely redundant *and* the scheme to enhance its setting. A barn still in use fails (PINS-6008115 ¶24-29). So does a change of use with no enhancement (PINS-6008634 ¶10-11). S5(4) then fails even at 1.53 years' supply and a 48% HDT (New Forest, PINS-6008115), or at 2.63 years and a 35% HDT (Rother, PINS-6008634).
4. **DP3(3) keeps widening as a refusal trigger:**
   - DP3(2)(a) connectivity used against a low-PTAL HMO (PINS-6008707 ¶15) and a car-dependent National Park site (PINS-6008742);
   - DP3(2)(d) used for car dependence (PINS-6008115 ¶31, PINS-6008434 ¶33);
   - space standards treated as an "explicit design standard" (PINS-6009127 ¶19);
   - failure to engage before submitting treated as a DP4 conflict (PINS-6009032);
   - neighbour disturbance framed as DP3 liveability (PINS-6008410 ¶29).
5. **Local countryside policies lose weight where they conflict with S5(1).** New Forest DM20 got very limited weight (PINS-6008115 ¶21). Cheltenham JCS SD10 got "very little weight" as materially inconsistent (PINS-6008569 ¶28). Compare South Cambridgeshire policies, held consistent (PINS-6011872).
6. **HO1(2)(f) is plan-making only** (PINS-6008410 ¶27, consistent with PINS-6011521). HO1 family-housing harm needs evidence of a local shortage (PINS-6008643 ¶14). HC4 gives substantial weight to a children's home as "social care infrastructure" (PINS-6008410 ¶28).
7. **Five-year supply figures:**
   - New Forest DC 1.53 years (HDT 48%)
   - Wiltshire 2.42
   - Rother 2.63-2.79 (HDT 35%)
   - Cheltenham 2.69 (HDT 56%)
   - East Herts 3.4-3.7
   - Reading 3.55
   - Shropshire 3.81 or 4.61
   - Cornwall 3.9
   - Central Bedfordshire 3.93
   - Somerset (Sedgemoor) 4.17
   - Ashfield 4.39
   - Uttlesford 4.77

   Supply shown: Wychavon (20% Annex D buffer) and New Forest National Park.
8. **TR3 facts:**
   - The 91 bus runs 8 times a weekday, but is not safely reachable along a 60 mph lane with no footway, lighting or level verge (PINS-6008434 ¶16-17).
   - Bus stops more than 30 minutes' walk away (PINS-6008739).
   - A demand-responsive bus with no frequency evidence (PINS-6008785).
   - PTAL 1b, 1.4 km from a town centre (PINS-6008707).
   - TR3(1)(a) was held "not relevant" to a single dwelling, yet car reliance was still weighed (PINS-6008739 ¶37).
9. **Other new readings:**
   - HO5(1)(a)(i) displaces the 2016 small-sites affordable housing ruling (PINS-6009042 ¶31).
   - The small-site BNG exemption applies only to applications from 6 Aug 2026 (PINS-6009042 ¶34, PINS-6009097 ¶21).
   - F9 (coastal change area) acts as a trigger through S5(2) (PINS-6008881).
   - Underfloor voids are not floodplain compensation (PINS-6007941 ¶15-16).
   - N6(1) for Local Wildlife Sites uses a "clearly outweigh" test (PINS-6008160 ¶20).
   - CC2(2) gives substantial weight to Passivhaus (PINS-6009032).
   - BT Street Hubs keep losing in or near conservation areas despite substantial CO1 weight (PINS-6007793, -6008154, -6008436).
10. **Slips:**
    - old "significantly and demonstrably" wording (PINS-6009042 ¶41);
    - S4 not applied inside a settlement (PINS-6009097);
    - Framework dated "26 August" (PINS-6008881);
    - the "substantially outweighed" test applied after finding the scheme outside all S5 categories (PINS-6008742).
