# Batch 4: candidate examples for the NPPF Navigator

Appeal decisions dated 23 to 30 September 2026. Each entry names the navigator node file and the point, the case and paragraph, a verbatim quote (machine-checked against the letter text), and whether it strengthens the node or contradicts it. All are Planning Inspectorate (PINS) appeal decisions on written representations. Node files are in `pages/england/nppf-navigator/graph/nodes/`.

## Contradicts a point the graph makes

### 1. Five to seven homes allowed against low conservation-area harm (heritage.ts, `he64` help and notice)
The node's help text says that no appeal since August 2026 in the dataset "allows 1 to 9 homes against" low, as opposed to very low, "harm to a designated asset". Its `not-outweighed` pointer is "One or a few homes against low or moderate harm, even with a supply shortfall". `patterns.md` repeats the point as an open question in section G and in propositions 19 and 20.

- Case: PINS-6010459 ¶18, ¶19, ¶29 (Hildenborough, permission in principle for 5 to 7 homes, 2.89 years supply, allowed)
  Quote (¶18): "This would be at the lower end of the scale of harm"
  Quote (¶19): "In giving substantial weight to the proposed new housing, whether that be 5 or 7 homes, together with the economic benefits of the development to which I give moderate weight, I find these outweigh the harm which would arise to the HCA."
  Quote (¶29): "The adverse impacts have been found to be low level heritage harm"

Why it matters: this is the first appeal in the dataset where a scheme of fewer than ten homes wins the HE6(4) balance against harm the inspector calls "low level", not very low. The method is orthodox: HE6(1) and HE6(3) are stated (¶18) and HE6(4) is run on its own before the Green Belt steps. Caveats for the node: it is a permission in principle, so the harm is confined to the principle of an access through a protected hedgerow, and the supply shortfall is large.

### 2. Golden Rules assumed, not secured, at permission-in-principle stage (greenbelt.ts, `gb8` closeCall and fail pointers)
The node says: "An improvement that is offered but not secured has been treated as not made (6006637 ¶44)", and lists as a fail factor "Contributions offered but with no signed obligation or condition to secure them".

- Case: PINS-6010459 ¶21 (Hildenborough, allowed)
  Quote: "Despite the absence of evidence on this matter, I see no strong reason that the required contributions could not reasonably be delivered by the scheme."
  Quote: "For the purposes of the green belt assessment at this stage I have therefore assumed they are capable of being met before full planning permission were granted."

Why it matters: GB7(1)(g)(iv) was passed with no evidence and nothing secured, because obligations cannot attach to a permission in principle. The node should say that at permission-in-principle stage an inspector has deferred GB8 to technical details consent. The same paragraph strengthens the node's first step: a 5 to 7 home scheme was major development because "the application form states the site has an area exceeding 0.5 hectares and the development would therefore fall under the definition of major development set out in Annex B of the Framework" (¶21).

### 3. A conversion that meets GB7(1)(b) can still be inappropriate because of its new garden (greenbelt.ts, `gb7b` step 5)
The node says: "If every condition is met, the proposal is not inappropriate. Openness is not then assessed separately (6010603 ¶16)."

- Case: PINS-6011889 ¶5, ¶7, ¶8 (Chalfont St Giles, stable to dwelling, dismissed)
  Quote (¶5): "There is no dispute between the main parties that the conversion and extension of the existing stable on the site would fall within the exception set out in Framework Policy GB7(1)(b)."
  Quote (¶7): "I have not been directed to any other exception in the Framework or the LP which would apply to this element of the proposal. As such, it would be inappropriate development."
  Quote (¶8): "The resultant domestication of the land and the introduction of visual clutter would fail to preserve the openness of the Green Belt in spatial and visual terms."

Why it matters: the building passed (b), but the garden and driveway were a residential change of use of open land, which the inspector held is outside GB7(1)(f)(iii) on the authority of the Kingston upon Thames judgment (¶7). The whole proposal was then inappropriate and openness was assessed. The node needs a step: check whether the scheme changes the use of land beyond the building, and test that element against the exceptions separately. This was the third dismissal on the same site for the same reason (¶10-11).

### 4. GB7(1)(g)(iii) passed in one sentence, with no route evidence (tr3.ts, `tr3` method)
The node says the walking route "usually decides this limb, not the distance", and tells the user to "Check the public transport on evidence: frequency, hours, destinations and reliability".

- Case: PINS-6010459 ¶20 (Hildenborough, allowed)
  Quote: "it is in a sustainable location being very close to services and facilities in Hildenborough as well as bus links providing onward public transport links"

Why it matters: another allowed Green Belt appeal that passes the location limb on proximity alone, with no distances, route description or bus frequencies, and without naming TR3. It joins Tarleton 6007484 and Newtown 6010537 as practice that differs from the node's method.

### 5. A heritage and design plan policy cut for lacking a balancing exercise (triggers.ts, `devPlan` help and "Held consistent" reading)
The node says: "Heritage, design and landscape policies have more often been held consistent", and its contested summary records that such policies kept their weight in 38 of 39 letters.

- Case: PINS-6010459 ¶14 (Hildenborough, allowed)
  Quote: "Policy SQ1, however, is not consistent with the Framework since it does not include the requirement for a balancing exercise which I return to below. Given this material inconsistency, and having regard to Annex A of the Framework, I give only limited weight to the conflict with policy SQ1."

Why it matters: a counter-example to the general pattern. A local-distinctiveness policy lost weight because it has no equivalent of the HE6(4) balance. The weight given was "limited", not the "very limited" that Annex A prescribes.

## Strengthens or extends a point the graph makes

### 6. DP3(3): an avoidable conflict has no clear justification, even against E2 substantial weight (triggers.ts, `dp3` necessity reading; `dp3Conflicts`)
- Case: PINS-6011983 ¶11, ¶12, ¶13 (Woodlesford, Leeds, outdoor seating deck, dismissed)
  Quote (¶11): "It also conflicts with Policy DP3(2) of the National Planning Policy Framework 2026 which seeks to create well-designed places that will function well over the lifetime of the development."
  Quote (¶12): "Framework Policy DP3(3) is clear that development proposals should be refused if, without clear justification, they conflict with relevant aspects of the principles in Policy DP3(2), which I have found to be the case."
  Quote (¶13): "Although there are matters that provide substantial weight in its favour, as it is likely that accessibility could be improved, without significant prejudice to the operation of the premises, it would conflict with the design expectations of the development plan and the Framework"

Why it is useful: a non-residential example of the necessity reading. The harm (a ramp below the local accessibility standard) could be avoided, so substantial economic weight under E2 did not justify it. It also gives `dp3Conflicts` an inclusive-access example under DP3(2), tied to a local supplementary planning document.

### 7. DP3(1) to DP3(3) to S4 for a householder materials condition (triggers.ts, `dp3Conflicts` "standards" option; balance.ts, `balanceTriggered`)
- Case: PINS-6007698 ¶14 (Sevenoaks, section 73, grey roof tiles, dismissed)
  Quote: "As the proposal would fail to respond to its context or adhere to a local design standard, it would fail to comply with Policy DP3(1) and in turn DP3(3) which is one of the national decision-making policies which state that development proposals should be refused."
  Quote: "While the Framework states that innovation or change should not be precluded in design terms, this is read among the context of a policy which requires development to respond to context so that it integrates with and enhances its surroundings, which would not be the case here."

Why it is useful: the smallest scale at which the full DP3(3) and S4 route has been run. A residential character area assessment, given force by a neighbourhood plan policy (¶12), is treated as a local design standard. The second quote shows how the DP3(1) proviso on innovation or change is read.

### 8. N2(2): moderate, localised harm with net gain nearby is not "significant harm" (triggers.ts, `n22`)
The node's examples are all about missing surveys. This one is about the threshold.

- Case: PINS-6006322 ¶15, ¶33 (Backworth, 37 homes partly on a local wildlife site, allowed)
  Quote (¶33): "the adverse effects of the proposal on biodiversity do not amount to significant harm that Policy N2 paragraph 2 seeks to avoid"
  Quote (¶15): "Compliance with the statutory BNG framework does not indicate that the proposal would accord with the development plan requirements outlined above"

Why it is useful: loss of part of a local wildlife site and a small priority-species population was "moderate localised harm" (¶23), in conflict with five local plan policies, yet below the N2(2) threshold. The second quote separates statutory biodiversity net gain from local plan habitat policies.

### 9. S4(2)(a)(ii): no node yet; three letters now apply it (new node candidate, triggers.ts or balance.ts)
The graph has no step for the S4(2)(a)(ii) circumstances (N6, N4, HC7, HC8 and L2(1)(d)). `patterns.md` has a watch-list item on L2(1)(d) not being run as an S4(2)(a)(ii) trigger at Pillerton Priors.

- Case: PINS-6006322 ¶36, ¶37 (Backworth; local wildlife site as an N6 area)
  Quote (¶36): "As a site of local importance, the appeal site is an area of particular importance for biodiversity and geodiversity for the purposes of Framework Policy N6 paragraph 1 c"
  Quote (¶37): "there is no substantive evidence that the proposal would have a significant adverse effect on the integrity of the LWS"
- Case: PINS-6007730 ¶17 (Hesketh Bank, permission in principle for up to 4 homes, allowed; L2(1)(d))
  Quote: "At this stage therefore, I have no reason to consider that there would be a substantial adverse impact in the context of Framework policy L2(1)(d)."
- Case: PINS-6008883 ¶17 (Westwoodside, one home in a side curtilage, allowed; L2(1)(d))
  Quote: "The only relevant circumstance in this case, would relate to Policy L2(1)(d)) regarding development within residential curtilages but the proposal satisfies the three requirements of part d."

Why it is useful: all three inspectors treat S4(2)(a)(ii) as a step to be checked before applying the S4 presumption. Hesketh Bank shows that missing the L2(1)(d)(iii) half-curtilage measure is not in itself a substantial adverse impact, because the policy's own proviso on harm to the overall character of the area is applied first.

### 10. S5(1)(e): houses on one side of the lane only (countryside.ts, `e` fail pointers)
- Case: PINS-6006961 ¶32 (Henfield, permission in principle for up to 9 self-build homes, dismissed)
  Quote: "the appeal site is located on a section of West End Lane which is characterised by predominantly open land to the north of the road, with only sporadic development present. Consequently, I do not consider that the site is located within a group of houses"

Why it is useful: a further example for "Houses on one side only". The same paragraph records that the appellant argued no other S5(1) category, so S5(1)(j) was not tested despite a supply shortfall, and the case fell to S5(4).

### 11. HO7 weight for small schemes: three more data points (benefits.ts, `homes` help)
- Case: PINS-6006961 ¶34 (Henfield, up to 9 self-build homes)
  Quote: "These benefits attract substantial weight in favour of the development. However, given the scale of the proposed development, the benefits would be small in scale. Consequently, I attach moderate weight to them."
- Case: PINS-6011889 ¶23 (Chalfont St Giles, one home, Green Belt)
  Quote: "in line with Framework Policy HO7, I attribute substantial weight to the benefits of providing a home which could contribute towards meeting evidenced housing needs"
- Case: PINS-6010459 ¶19 (Hildenborough, 5 to 7 homes)
  Quote: "In giving substantial weight to the proposed new housing, whether that be 5 or 7 homes"

Why it is useful: the split the node describes continues. One home gets full substantial weight; nine self-build homes are cut to moderate for scale; and a permission-in-principle range of 5 to 7 is given substantial weight at either end of the range.

### 12. Annex A(2): Green Belt policy requiring openness to be preserved (triggers.ts, `devPlan` part-by-part reading)
- Case: PINS-6012303 ¶8 (Bromley, padel courts, GB7(1)(f)(iv), allowed)
  Quote: "Policy 49 of the BLP however requires such development to preserve the openness of the Green Belt and not conflict with the purposes of including land in it. It is therefore inconsistent with the Framework in this regard."
- Case: PINS-6011889 ¶4 (Chalfont St Giles)
  Quote: "LP Policy GB11 is more restrictive than the Framework and so, in line with Annex A, paragraph 2 of the Framework, this policy is given very limited weight."
- Case: PINS-6006961 ¶30 (Henfield; held consistent)
  Quote: "Policies relating to character and appearance are also consistent with the Framework’s emphasis on development that responds to its context and enhances its surroundings. As such, I afford them due weight."

Why it is useful: Bromley names a new kind of inconsistency. GB7(1)(f) asks for the impact on openness to be "minimised" and for no "significant conflict" with the purposes; a plan policy that asks for openness to be preserved is stricter. Henfield is a contrast on spatial policies: the same Horsham policies that were cut to limited weight at 6007104 were here held not materially inconsistent, in an appeal where S5(1)(j) was not argued.

### 13. GB7(1)(f) has no category in the tool (greenbelt.ts, `gb7cat`)
The category question offers (b), (c), (d), (e), (h) and (g) only.

- Case: PINS-6012303 ¶20 (Bromley, padel courts, allowed)
  Quote: "I am satisfied that the impact on openness would be minimised and there would not be a significant conflict with the Green Belt purposes. I therefore find that the proposal would fall within the exception set out under Policy GB7(f)(iv) of the Framework."

Why it is useful: a worked example for a possible (f) step. The letter goes through each source of openness impact in turn (courts, enclosures, floodlights, buildings and activity, ¶10-14) and each of the five purposes (¶16-19). Chalfont St Giles (item 3) gives the limit of (f)(iii).

### 14. S6: the five-year clock, confirmed for Henfield (triggers.ts, `s6` help)
- Case: PINS-6006961 ¶36
  Quote: "the provisions of Policy S6 (previously paragraph 14) of the Framework are no longer applicable as of June 2026, 5 years after the adoption of the HNP"

Why it is useful: a second inspector counts from the plan's adoption to the decision date, as at 6007104 ¶29.
