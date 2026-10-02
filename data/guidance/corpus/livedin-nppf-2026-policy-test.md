---
slug: livedin-nppf-2026-policy-test
title: "NPPF 2026 policy test: see which routes any site passes"
url: https://livedin.co.uk/nppf-2026/policy-test
publisher: Livedin
publisher_type: independent
date: unknown (live tool, retrieved 2026-10-02)
audience: landowners, self-builders, architects, developers
is_training: false
about_draft: false
local_copy: sources:guidance/livedin-nppf-2026-policy-test-engine-strings.txt
verification: local-text
retrieved_on: 2026-10-02
category: press-commentary
---

## Summary

An interactive "policy test" that models every housing route in the August 2026 National Planning Policy Framework (NPPF): S4 (within settlements), the S5(1) categories outside settlements, the S5(4) exceptional-circumstances fallback, the Green Belt GB7 limbs, and constraint screens (flooding, heritage, biodiversity, station density). Each limb is graded "met", "matter of judgement", "unanswered" or "fails", and judgement calls (infilling, isolation, highway harm, efficient use of land) are flagged rather than decided. The page HTML is only the form; the reasoning text lives in the JavaScript engine, which was downloaded and its strings extracted to the local copy (the page text is in `livedin-nppf-2026-policy-test.txt`, the engine in `livedin-engine-yDGMj4vF.js`). The tool cites individual appeal decisions (Sevenoaks 3351517, Dacorum 3345435, Waverley 3352194) to support its readings, so it is a close comparator to our NPPF Navigator and our decision-route method.

## What it tells officers/decision-makers to do

- Decide first where the site sits: within a settlement, outside, straddling, in the Green Belt, a village lying within the Green Belt, or Local Green Space; this picks the policy family.
- Treat a village lying within the Green Belt as not a settlement for S4, so the S4 "default yes" is unavailable.
- Outside settlements, claim every S5(1) limb the facts support (they are alternatives, not a hierarchy); without one, S5(4) requires exceptional circumstances, "a high bar".
- In the Green Belt, a GB7 limb makes development not inappropriate, but the S5(5) balance still has to be run; without a GB7 limb, very special circumstances are "rarely met".
- Footnote 41 (grey belt unmet need) is read strictly as five-year supply or Housing Delivery Test (HDT) below 75%; self-build need alone is "arguable rather than excluded".
- Flag development-plan policies materially inconsistent with the Framework for checking: they carry very limited weight unless examined against the new Framework; the tool says most restrictive rural housing policies now fall here.
- Reasonable walking distance to a station is about 800 metres, or about 10 minutes where topography, poor routes or barriers apply.

## Positions against our propositions

- **SH2 (agrees):** "A village lying within the Green Belt is not a settlement for S4 purposes, so the S4 default yes is unavailable however built-up the frontage looks." (engine text for the "Village lying within the Green Belt" location answer)
- **S5 (agrees):** "S5(4): approval only in exceptional circumstances, where the benefits substantially outweigh the adverse effects" and "Falling within any S5(1) limb means approval unless the benefits are substantially outweighed." (outside-settlement route text)
- **SUP (agrees):** "The supply shortfall gets you through the door on its own." (self-build / unmet-need limb, plain-English text). Gate-opening language; the balance still follows.
- **GB (agrees):** "Without one of those routes you would have to show very special circumstances, which is a high bar and rarely met." and "Where a GB7 limb is made out the development is not inappropriate, no very special circumstances are needed, and S5(5) then applies the balance." (Green Belt route text)
- **A2 (qualifies):** "Two exceptions: policies examined and adopted or made against this Framework keep their weight, and a policy is not downgraded simply for predating the Framework. Most restrictive rural housing policies adopted under earlier editions now sit here." (Annex A "materially inconsistent" check, flagged "for checking rather than established"; plain-English text: "Where a local policy clashes with the new national rules it carries very limited weight, unless the plan was examined against the new rules.") A screening generalisation, not a contrary reading: it says restrictive rural housing policies are often inconsistent with S5, which matches the "cut" side of our finding (about 13 cut), and it asks the user to "identify the specific policies and the specific inconsistency". It is silent on whether the whole policy or only the offending clause loses weight, and does not address spatial-preference, heritage, design or access policies. Difference is emphasis: it presents restrictive rural policies as usually down-weighted, where our appeal evidence shows the spatial preference often keeps weight and losing the restrictive clause rarely rescues a scheme.
- **METH (agrees):** "no decision has had to decide the point, because a supply shortfall was present in every appeal read" (footnote 41 self-build limb). The tool reads appeal decisions as the evidence of how a limb is applied, as we do, but uses them as cited authorities rather than counted outcomes.

## Leads

- Livedin companion page: https://livedin.co.uk/nppf-2026 (terminology page already in corpus as livedin-nppf-2026-terminology).
- Appeals cited: Sevenoaks 3351517 (hearing, para 15), Dacorum 3345435 (inquiry, paras 154, 188), Waverley 3352194 (para 19); check against our decisions database.
- Compare Livedin's limb-by-limb grading ("met / judgement / fails") with the NPPF Navigator routes.
