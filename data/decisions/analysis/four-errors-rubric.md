# The four-errors rubric

The scoring rubric behind `stratford-officer-reports-four-errors.tsv` (44 Stratford-on-Avon reports, scored 13 October 2026), `other-councils-four-errors-2026-10.tsv` (99 reports from 22 other councils, scored 18 October 2026) and `other-councils-four-errors-sweep-2026-10.tsv` (144 reports from 17 councils fetched by the council sweep, scored 28 and 29 October 2026). The three tables share these columns and codes, and the published comparison at `/research/authority/officer-reports-compared/` computes every count from them. Not legal advice.

## What is scored

Officer reports (delegated and committee) on housing proposals decided, or reported to a committee, on or after 17 August 2026, the day the National Planning Policy Framework (NPPF) of August 2026 took effect. Housing means new homes, conversions to homes, subdivisions and replacements. Householder works, prior approvals, section 73 variations, approvals of details, certificates of lawfulness, listed building consent on its own, traveller sites, rural workers' dwellings, care homes and holiday accommodation are out of scope. A committee report written before 17 August 2026 is scored on what it says; the framework column records whether it was converted before the decision.

## Columns

`council`, `ref`, `place`, `type` (committee or delegated), `decided` (notice or meeting date), `outcome` (the decision, with the officer's recommendation in brackets where it differs), `homes` (the largest number the application proposes), `green_belt`, `washed_over`, `framework`, `template_weight`, then for each error a code and a note: `tier` and `tier_note`, `tr3`, `connectivity_tool` and `tr3_note`, `annexb`, `annexb_cited` and `annexb_note`, `dp33` and `dp33_note`, then `source_file` (a `sources:` path to the text extract) and `scored_in` (the set).

## The four errors and their codes

### 1. A village's tier used as the location test (`tier`)

The Framework's test is TR3(1)(a): development that could generate a significant amount of movement should be in a location that will limit the need to travel, particularly by private car, and offer a genuine choice of transport modes. GB7(1)(g)(iii) asks the same question for grey belt "with particular reference to policy TR3". A village's place in a settlement hierarchy, its development boundary, or a recital of its facilities does not answer it.

- `error`: the report's finding that the site is (or is not) a sustainable location rests on the tier, the boundary, or a list of facilities, with no route fact.
- `partial`: a tier or boundary finding with at least one transport fact beside it (a bus stop distance, a footway remark, a frequency), however thin.
- `ok`: the location is decided on the route and the transport choice, with facts, whether or not a tier is mentioned and whatever the decision.
- `na`: no location finding is made or needed: householder works, listed building consent, replacement dwellings and reconstructions, conversions decided under a reuse category, employment, and sites inside a town or city.

The rubric tests method, not result: a report that assesses the route and then approves against its own finding scores `ok`.

### 2. TR3 not assessed (`tr3`, `connectivity_tool`)

- `not-mentioned`: a text search for "TR3" finds nothing. A Local Plan policy that happens to be numbered TR3 does not count, and the note says so.
- `cited-only`: TR3 is named, listed or quoted but no limb of TR3(1) is applied to the site (a citation for highway safety or parking alone is cited-only).
- `dodged`: TR3(1)(a) is said not to apply because the scheme is small, and nothing else is run.
- `assessed`: at least one limb of TR3(1) is applied to the site with facts, or GB7(1)(g)(iii) is answered in TR3's terms.
- `na`: as for the tier, except that a report inside a town is still scored because TR3 applies there.

The count is also split by scheme size (six homes or more, against five or fewer), because officers and inspectors treat small schemes as below the TR3(1)(a) threshold, so "not mentioned" on a one-house scheme is a weaker finding than on a scheme of twenty.

`connectivity_tool`: `yes` where a score or band from the government's Connectivity Tool is given; `indirect` where the applicant's score is relied on; `no` otherwise, including where the Tool is mentioned and set aside. TR3(2) says the Tool "should be used alongside other relevant quantitative or qualitative evidence". It is one input, not a gate; the tables report it as a shared absence, not as one of the four errors.

### 3. Annex B and the Green Belt route (`annexb`, `annexb_cited`)

Annex B's definition of a settlement excludes "hamlets and scattered groups of houses located outside predominantly built-up areas" and, "for the purpose of this Framework", "villages which lie within and are defined as part of the Green Belt in the development plan". S5(5) says S5 "does not apply to development proposals in the Green Belt", which are determined under GB6, GB7 and GB8, with the S5(5) balance applied where development is not inappropriate.

The question arises for a Green Belt site, a hamlet or a cluster without a boundary, or a village whose status as a settlement the report has to decide.

- `error`: S4 or S5(1)(j) is applied in a village washed over by the Green Belt or in a hamlet; S5 is run on a Green Belt site that S5(5) sends to GB6 to GB8; or a boundary or a tier is used as the GB7(1)(g)(iii) test. A belt-and-braces run of S5 beside a full GB7 assessment still scores `error`, and the note says it did not change the result.
- `ok`: the Green Belt route is taken through GB6 and GB7 with S5(5) stated or implied, or a cluster is tested against the Annex B definition and S5 applied.
- `na`: a site inside a defined boundary that is not Green Belt; a replacement dwelling; a 2024 report that runs no S4 or S5 route.

`annexb_cited` records whether Annex B is cited, and for which definition (settlement, grey belt, well-connected station, reasonable walking distance).

### 4. DP3(3) not asked after a design conflict (`dp33`)

DP3(3): development proposals "should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2, or with any explicit design standards set out in the development plan". S4(2)(c) and S5(2) make a failure under such a policy a case where the benefits are likely to be substantially outweighed. The question arises for every proposal with design content.

- `error`: a conflict with DP3(1), a DP3(2) principle, a development plan design standard, or the character or landscape of the area is found and weighed in the balance, and the report does not ask whether it is clearly justified or run the S4(2)(c) or S5(2) trigger.
- `ok`: no such conflict is found; or the conflict is found and the DP3(3) test or the trigger is applied in terms (a refusal that quotes the test counts).
- `na`: the only harm is heritage harm under HE6; the consent is listed building consent; there are no external works.

Two readings are stated and applied the same way across the tables. A conflict with a landscape-character policy counts as a DP3 conflict (the broad reading; the narrow reading would weigh it under N2 instead, and some councils do). An error on a refusal where the conflict is itself a refusal reason is a formal slip that could not change the outcome, so errors are also split by what the officer recommended. The finding that can change an outcome is a recommendation to grant after a found conflict with no clear-justification question.

## The two further columns

`framework`: `2026`; `2024+note` where a 2024 report carries a conversion note or update report; `mixed` where 2026 policies are applied beside 2024 paragraph numbers or the 2024 "tilted balance" and "significantly and demonstrably" wording; `2024-unconverted` where a decision made after 17 August 2026 rests on a 2024 report with no conversion, including a notice issued after a legal agreement on an older resolution. Annex A(1) says the 2026 policies "must be taken into account in decision-making from the day of its publication".

`template_weight`: `yes` where the report cuts a settlement-hierarchy or countryside policy wholesale to limited, very limited or no weight on five-year-supply or age grounds, or as "materially inconsistent" without saying which part conflicts; `no` where Annex A(2) is quoted and applied to a named part of a policy with a reason, or no cut is made. Annex A(2) cuts weight only from policies "(or parts of those policies) which are materially inconsistent with national decision-making policies". The Stratford column is the template paragraph itself; the other tables record any wholesale cut.

## Rules that apply to every row

1. Every `error`, `partial`, `cited-only` and `dodged` code carries a page number and a verbatim quotation from the officer report. Every quotation in the three tables is checked by machine against the text extracted from the PDF (`tools/four_errors_sweep.py check <table>` for the sweep table; the page builder for all three), and a quotation that does not match stops the build.
2. Every `not-mentioned` is a text search for "TR3" with no hits, checked the same way.
3. Rates are given among the reports where the question arises; `na` rows are excluded from the denominator.
4. Committee and delegated reports are scored alike.
5. Page numbers are the PDF pages of the report file named in `source_file`.

## How the sets were read

The Stratford set and the hand-scored set of 99 were read report by report in full. The sweep set was first screened by machine for the mechanical facts (the TR3 search, the Connectivity Tool, Annex B, the Framework markers and the weight phrases: `tools/four_errors_sweep.py screen`), then each report was read through its keyed passages with page numbers (`tools/four_errors_sweep.py read`): the site description, every paragraph bearing on location and transport, on the S4, S5 and Green Belt route, on design and character, on weight, and the conclusion; where those passages left a judgement open, the report was searched again for the point. The judgement codes (tier, Annex B and DP3(3)) were given on that reading, and the quotations were taken from the collapsed text and checked back against the pages.
