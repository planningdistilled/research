# Batch 3: candidate examples for the NPPF Navigator

Appeal decisions dated 1 and 2 October 2026. Each entry names the navigator node file and the point, the case and paragraph, a verbatim quote (machine-checked against the letter text), and why it is stronger than what the node cites now, or how it contradicts the node. All are Planning Inspectorate (PINS) appeal decisions on written representations. Policy codes are those of the National Planning Policy Framework (NPPF) of August 2026.

## Contradicts a point the graph makes

### 1. A visibility splay over third-party land left to the technical details stage (triggers.ts, `tr64` steps, `not-demonstrated` pointers and closeCall)
The node says: "Do not defer an undeliverable splay to a condition. Where third-party land may be needed, such a condition was held neither reasonable nor enforceable (6006496 ¶23)." Its closeCall says: "If the safety of the access depends on land or works not shown to be deliverable, the impact has not been shown to be acceptable."

- Case: PINS-6008177 ¶19 (Market Harborough, permission in principle (PIP) for 5 to 9 homes, allowed)
  Quote: "there is no certainty that the splays could be provided in the first instance or maintained for the lifetime of the development"
  Quote: "this would give rise to an unacceptable risk to highway safety for users of the B6047 without the provision of adequate visibility splays"
- Case: PINS-6008177 ¶21
  Quote: "these constraints do not appear to me to be so severe that there would be no possibility at all for this to be overcome as part of the future detailed site design at the technical details consent stage"
  Quote: "The land which is owned by a third party could be acquired, or a detailed management agreement be provided prior to the submission of a technical details consent application in the future."

Why it matters: the inspector found the risk unacceptable without 2.4 m x 160 m splays over land the appellant does not control, then allowed the appeal because there was not "no possibility at all" of overcoming the constraint later. That is the reverse of the node's rule, on the same splay requirement and road speed as 6006496. TR6(4) is not cited. The node should record this as an outlier at PIP stage and say how to answer it: location is fixed at the first stage, and an access that cannot be shown to be deliverable is a location matter. It also runs against propositions 7 and 14 in `data/decisions/analysis/patterns.md`.

### 2. A heritage evidence gap resolved in the appellant's favour (heritage.ts, `he5` help and closeCall)
The node says: "A failed assessment means harm cannot be ruled out; it counts against the proposal in the balance, and the burden of filling the gap is on the applicant."

- Case: PINS-6008177 ¶29 (Market Harborough, PIP, allowed; canal conservation area adjoining and ridge and furrow on the site)
  Quote: "there is potential for harm to both the CA and the NDHA through the loss of historic features"
  Quote: "given the limited information submitted in support of a permission in principle application, it is difficult to undertake a detailed assessment of the extent of any such harm"
- Case: PINS-6008177 ¶31
  Quote: "On the evidence before me, I therefore find no demonstrated harm to either heritage asset at this stage."
- Case: PINS-6008177 ¶35
  Quote: "Critically, there is no evidence at this stage to demonstrate the proposal would not meet these requirements."

Why it matters: the burden is placed on the council to show harm, and the assessment is deferred to the technical details stage. No degree of effect is identified under HE5(2), and no HE6(4) or HE7(2) balance is run. An applicant could cite this at PIP stage. The node should note it as a contrary reading, and that the amount of development (up to nine homes on the ridge and furrow) is fixed at the first stage.

## Stronger or gap-filling illustrations

### 3. A TR3 conflict found, then held to moderate weight by short car journeys (tr3.ts, `tr3` method step 5 and fail pointers)
The node asks "whether the alternatives are realistic for everyday trips, not merely possible in principle", and lists reliance on existing car use as a failing argument. `patterns.md` proposition 12 lists "short car trips" among the mitigation that failed.

- Case: PINS-6012202 ¶11 (Weeton, PIP for up to 2 homes on a kennels site, allowed under S5(1)(d))
  Quote: "future occupiers would have a heavy reliance on private vehicles to access services and facilities"
  Quote: "driving distances would be short to both Weeton and the larger settlement of Wesham, moderating the extent of harm"
- Case: PINS-6012202 ¶19
  Quote: "the adverse effects in terms of accessibility to services and facilities and in seeking to guide development towards sustainable locations carry no more than moderate weight"

Why it matters: the route was tested for all users and a TR3 conflict found, so the method is the node's. But short driving distances and the existing business's traffic were then used to hold the harm to moderate weight, and S5's support for redeveloping previously developed land was given as a further reason. This does not contradict the node's test, but it runs against proposition 12 as an argument that succeeded. The node could separate the two reasons: the existing use's trips are a baseline comparison, whereas short car trips is the argument other inspectors have rejected.

### 4. S5(1)(d) carries no "well-related to a settlement" test (countryside.ts, `d` steps)
The `e` method has the step "Do not add a 'well-related to a settlement' test; it appears only in S5(1)(h) and (j) (6009593 ¶16)". The `d` method has no equivalent.

- Case: PINS-6012202 ¶15 (Weeton, allowed)
  Quote: "Criterion d) of Policy S5 does not require that proposals for the redevelopment of PDL are physically well-related to a settlement, as that requirement only appears within criterions h) and j), with no indication that it is to be applied to the other forms of development listed."

Why it matters: the first letter to say this in terms for (d), in an allowed appeal where the site was "divorced" from any settlement.

### 5. Unauthorised hardstanding and use are not previously developed land (countryside.ts, `d` fail pointer "Unauthorised structures or hardstanding", which cites no case)
- Case: PINS-6008432 ¶17 (Higher Trevellas, Cornwall, PIP for 2 homes, dismissed)
  Quote: "In the absence of any planning permissions or lawful use, I cannot be certain that the hardstanding would be on the land permanently or the use continue given the potential for the Council to take enforcement action"
  Quote: "I find that for the purposes of this appeal, the appeal site is not PDL as defined within the Framework"

Why it matters: supplies the missing case for the pointer, and puts the burden on the appellant: the inspector notes at ¶18 that a lawful development certificate remains open. The same letter is a further example for the `j` fail pointer "Near only a hamlet or scattered houses that are not a settlement" (¶12-13, ¶31).

### 6. Annex A(2): a countryside policy cut because it has no previously developed land provision (triggers.ts, `devPlan` step 2 and the "Part by part" reading)
The node's examples of the inconsistent part are restrictions against S5(1)(j) and against limited infilling (6001260 ¶28, 6008773 ¶27).

- Case: PINS-6012202 ¶13 (Weeton, allowed)
  Quote: "Policy GD4 of the Local Plan is more restrictive than the criteria in Policy S5 of the Framework and does not have similar provisions relating to the development of previously developed land (PDL) outside of settlements. As such, I give Policy GD4, and by connection Policy S1 in relation to this matter, very limited weight."
- Case: PINS-6009363 ¶4 (Brigsley, dismissed; one policy split into parts)
  Quote: "This is generally consistent with the Framework and can be afforded full weight. Part 3 of the policy is inconsistent with the Framework and can be afforded very limited weight."

Why it matters: Weeton names the Framework policy and the missing provision, gives the prescribed very limited weight, and keeps the transport policies that are in line with TR3. It is the first S5(1)(d) example. Brigsley shows a single policy split, although the conflicting Framework policy is not named.

A further example of the "Consistent, but reduced for housing supply" reading, again from Cornwall:

- Case: PINS-6008432 ¶26 (dismissed)
  Quote: "The spatial strategy is therefore not delivering a sufficient supply of homes in accordance with the other aims of the Framework. Consequently, I can only afford moderate weight to the conflict with the development plan policies that govern the spatial location of housing."

### 7. L3(4) used as a "should be refused" policy for low density outside settlements (triggers.ts has no L3 node; balance.ts `balanceTriggered`)
The graph has no density step. Two letters by the same inspector, issued on the same day, apply L3(2)(b) to unallocated housing sites outside settlements and treat L3(4) as a refusal policy.

- Case: PINS-6009363 ¶9 (Brigsley, 9 homes on 1.3 ha at 6.8 dwellings per hectare gross, S5(1)(j) met, dismissed)
  Quote: "I am not persuaded that the provision of nine dwellings on this site represents an effective use of land or satisfies Framework Policy L3. In these circumstances, the policy is clear that the development should be refused."
- Case: PINS-6009363 ¶24
  Quote: "These conflicts, particularly but not limited to Framework Policy L3, represent the circumstances, set out in Framework Policy S5(2), in which the benefits of approving development proposals are likely to be substantially outweighed by the adverse effects."
- Case: PINS-6011337 ¶29 (Glentham, three over-55s homes, dismissed)
  Quote: "It therefore conflicts with Framework Policy L3(2b) which requires that development footprints should make the best use of a site’s development potential. In these circumstances, the policy indicates that the development should be refused."

Why it matters: at Brigsley the scheme passed S5(1)(j) and had substantial HO7 weight, and density was the trigger that engaged S5(2). The inspector raised L3 himself after consulting the parties on the new Framework (¶3). L3(2)(b) begins "Outside settlements, and on land at the edge of existing built-up areas which is allocated or has permission for development"; both letters take "Outside settlements" to cover unallocated land that relies on S5. A density check after the S5(1) category step, with this reading flagged as one inspector's so far, would close the gap.

### 8. HO7 weight for two homes: both readings in one week (benefits.ts, `homes` help)
- Case: PINS-6012202 ¶16 (Weeton, 2 homes at PIP stage, council with a shortfall, allowed)
  Quote: "The modest scale of the development does not diminish the weight I give these benefits."
- Case: PINS-6008432 ¶28 (Higher Trevellas, 2 homes at PIP stage, 3.8-year supply, dismissed)
  Quote: "due to the limited scale of the proposal for two dwellings this would be a modest benefit"
- Case: PINS-6011337 ¶28 (Glentham, 3 homes, five-year supply met)
  Quote: "As need has not been established, either generally or with regard to this specific form of specialist housing, only moderate weight is afforded to the additional provision of housing"

Why it matters: Weeton is the clearest statement that scale does not reduce HO7 weight. Higher Trevellas gives substantial weight in name and then calls the benefit modest. Glentham ties the weight to whether need is evidenced, which is HO7's own wording.

### 9. Connectivity Tool: a rural comparator does not lift a low score; bus stops need frequency evidence (tr3.ts, `tr3` method step 4 and fail pointers)
- Case: PINS-6011337 ¶24 (Glentham, dismissed)
  Quote: "The Connectivity Tool provides a particularly low score for connectivity. Whilst it is positive with regard to comparisons with other local sites and rural villages, it reflects the physical situation on the ground, including the local absence of services and the need to travel to access them."
- Case: PINS-6009363 ¶14 (Brigsley, dismissed)
  Quote: "as no evidence is provided with regard to bus frequency, it cannot be assumed that a convenient service would be available"

Why it matters: the first quote answers the rural-relative reading of the score that helped the appellant at 6011301. The second is a plain statement for the pointer "Bus service infrequent, or with no evidence of hours and destinations".

A caution from the same letter: Annex B defines reasonable walking distance for the station policies (S5, L3, GB7) and HC5, but it was used as the measure for walking to services.

- Case: PINS-6009363 ¶14
  Quote: "The Framework defines a reasonable walking distance as being around 800m. Distances from the site are prohibitive for walking to schools, shops and healthcare facilities."

### 10. DP3(3) at outline stage: character harm held not to be a clear DP3 conflict (triggers.ts, `dp3` option "No conflict" and `character` step 5)
- Case: PINS-6009363 ¶12 (Brigsley, outline with design reserved, dismissed)
  Quote: "the details of design are reserved matters and it would not result in clear conflict with Policy DP3 to the extent that it would trigger the requirement that it should be refused"

Why it matters: the inspector asked the DP3(3) question, declined to trigger it at outline stage, and weighed the landscape harm under N2(1)(a) at considerable weight instead. This is the separation the `character` node describes, but it also shows a threshold ("clear conflict") that the text of DP3(3) does not contain. For the trigger applied in full, by an appeal planning officer:

- Case: PINS-6009245 ¶17 (Bushby, replacement dwelling in a conservation area, dismissed)
  Quote: "DP3 states that development proposals should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles at paragraph 2."

### 11. HE6(4) energy efficiency: substantial weight under CC2(2), and still not enough (heritage.ts, `heBenefits` energy option and `he64` pointers)
- Case: PINS-6005177 ¶30 (Thorndon Hall, Grade I, double-glazed replacement sashes, listed building consent refused)
  Quote: "In accordance with policy CC2(2) of the Framework I give substantial weight to the benefits of improving the energy efficiency of existing buildings."
- Case: PINS-6005177 ¶15
  Quote: "there is no report provided by any timber specialist to confirm that the existing windows have been personally examined and neither repair nor splicing can be reasonably considered possible or viable"
- Case: PINS-6005177 ¶23
  Quote: "research by Historic England has shown that the use of secondary glazing with low emissivity coating can significantly reduce heat loss"

Why it matters: the node says the energy benefit "is discounted if it could be achieved with less harm". This letter names the CC2(2) weight, the missing evidence (a specialist's report that repair is not viable) and the less harmful route (secondary glazing), on a Grade I building.

### 12. A change of use alone can harm a conservation area (heritage.ts, `heEffect` steps and `harm-low` pointers)
The node's examples of harm are physical or setting effects.

- Case: PINS-6013769 ¶11 (56 St Giles', Oxford, bookshop to college common room, no physical works, dismissed)
  Quote: "the active retail use of the appeal property contributes positively to the character of this part of the city centre and, consequently, to the significance of the CA"
- Case: PINS-6013769 ¶16
  Quote: "It is noteworthy that even a low level of harm to the significance of a designated heritage asset carries considerable importance and weight."

Why it matters: the use itself was treated as part of the area's significance, the harm was graded low, and HE6(4) then failed against moderate public benefits. The Council had accepted the heritage effect (¶13).

### 13. N4(1): small, seasonal and removable is not enough; modest farm buildings are (triggers.ts, `n4harm` pointers)
- Case: PINS-6008892 ¶8 (Thurlestone, seasonal trailer beside the coast path in a National Landscape, dismissed although S5(1)(b) was met)
  Quote: "these measures would not overcome the fundamental issue arising from the siting of the trailer in this location"
- Case: PINS-6013634 ¶6 (Killington, barn and polytunnels in the Yorkshire Dales National Park, allowed)
  Quote: "it is reasonable to expect that agricultural or horticultural uses would have buildings associated with them in order that they can function"

Why it matters: a matched pair for the "yes" and "no" pointers. Thurlestone also shows an S5(1)(b) scheme refused in the S5(1) balance with no "should be refused" policy failed, on N4 substantial weight alone (¶15-16).

### 14. TR6(4): a substandard existing access found acceptable (triggers.ts, `tr64` acceptable pointers)
- Case: PINS-6013634 ¶12 (Killington, visibility of no more than 15.2 m at an existing access, allowed)
  Quote: "the likely low level of movements and the characteristics of the lane mean that the danger of collisions is acceptably small"
- Case: PINS-6013634 ¶13
  Quote: "As the proposal would not have an unacceptable impact on highway safety it does not fall within the type of development that should be refused in line with the Framework."

Why it matters: the node's acceptable pointers assume splays to standard. This shows the safety limb passed on the existing use of the access, light flows and the authority's lack of evidence of risk, with the TR6(4) wording applied.
