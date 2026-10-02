// Verbatim extracts from the National Planning Policy Framework (August 2026).
// Footnote markers are removed. " … " marks an omission (a skipped limb or footnote). " ¦ " marks a page break or
// footnote block inside a sentence where nothing is omitted; the UI renders it as a space.
// The build verifies every text against `pdftotext -layout data/open-sources/nppf/NPPF-August-2026.pdf`.
import type { Quote } from '../src/engine/types';

export const quotes: Record<string, Quote> = {
  // ---- Presumption and principle
  'S3(1)': {
    code: 'S3(1)',
    title: 'Presumption in favour of sustainable development',
    text: 'Decisions on development proposals should apply a presumption in favour of sustainable development. This means: a. Policy S4 in this Framework should be applied when considering development proposals within settlements; b. Outside settlements, policy S5 should be applied; and c. In all locations, development proposals that accord with both an up-to-date development plan and the decision-making policies in this Framework should be approved without delay.',
  },
  'S3(2)': {
    code: 'S3(2)',
    title: 'Sites partly within a settlement',
    text: 'Where a development proposal falls partly within and partly outside a settlement, policies S4 and S5 should be applied to the relevant parts which are inside or outside of the settlement boundary (as appropriate), before coming to an overall view on the proposal.',
  },
  'S4(1)': {
    code: 'S4(1)',
    title: 'Development within settlements',
    text: 'Development proposals within settlements should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework.',
  },
  'S4(2)(c)': {
    code: 'S4(2)(c)',
    title: 'Failing a "should be refused" policy (within settlements)',
    text: 'In applying policy S4, the circumstances in which the benefits of approving development are likely to be substantially outweighed by adverse effects include (but are not restricted to) situations where the development proposal would: … c. Fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.',
  },
  'S5(1)': {
    code: 'S5(1)',
    title: 'Development outside settlements',
    text: 'Only certain forms of development should be approved outside settlements, as set out in the following list. These should be approved, unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework:',
  },
  'S5(1)(c)': {
    code: 'S5(1)(c)',
    title: 'Reuse, extension, alteration or replacement',
    text: 'c. The reuse, extension, alteration or replacement of an existing building, provided that the existing building is of permanent and substantial construction, is lawful in planning terms, and any extension or alteration will not result in a disproportionate increase in size compared to the existing building. In the case of proposals for a replacement building, it should be for the same use and not disproportionately larger than the one it replaces;',
  },
  'S5(1)(d)': {
    code: 'S5(1)(d)',
    title: 'Previously developed land',
    text: 'd. The redevelopment of previously developed land (including a material change of use to residential or mixed-use including residential);',
  },
  'S5(1)(e)': { code: 'S5(1)(e)', title: 'Limited infilling within groups of houses', text: 'e. Limited infilling within groups of houses;' },
  'S5(1)(f)': {
    code: 'S5(1)(f)',
    title: 'Exception sites and community orders',
    text: 'f. An exception site as provided for in policy HO10, or development brought forward under a Community Right to Build Order or Neighbourhood Development Order;',
  },
  'S5(1)(h)': {
    code: 'S5(1)(h)',
    title: 'Land around well-connected stations',
    text: 'h. Residential and mixed-use development which would: i. Be within reasonable walking distance of a well-connected station (applying the definitions in the glossary at Annex B); ii. Be physically well-related to the station or the settlement within which the station is located; iii. Be of a scale which can be accommodated taking into account the existing or proposed availability of infrastructure; and iv. Not prejudice any proposals for long-term comprehensive development in the same location.',
  },
  'S5(1)(i)': {
    code: 'S5(1)(i)',
    title: 'Allocated land',
    text: 'i. The development of land allocated for that purpose in the development plan (where this lies outside settlements); and',
  },
  'S5(1)(j)': {
    code: 'S5(1)(j)',
    title: 'Evidenced unmet need',
    text: 'j. Development which would address an evidenced unmet need (including, but not limited to, development proposals involving the provision of housing where the local planning authority cannot demonstrate a five year supply of deliverable housing sites or scores below 75% in the most recent Housing Delivery Test), and where the development would: i. Be physically well-related to an existing settlement (unless the nature of the development would make this inappropriate) and be of a scale which can be accommodated taking into account the existing or proposed availability of infrastructure; or',
  },
  'S5(2)': {
    code: 'S5(2)',
    title: 'Failing a "should be refused" policy (outside settlements)',
    text: 'In applying this policy, the circumstances in which the benefits of approving development proposals are likely to be substantially outweighed by adverse effects include, but are not restricted to, situations where the development proposal would fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.',
  },
  'S5(3)': {
    code: 'S5(3)',
    title: 'Isolated homes',
    text: 'Development proposals comprising isolated homes, which are those lying outside settlements or groups of houses, should not be approved other than in accordance with policy HO11.',
  },
  'S5(4)': {
    code: 'S5(4)',
    title: 'Development outside the listed categories',
    text: 'Development proposals which do not fall within one of the categories set out in this policy should only be approved in exceptional circumstances, where the benefits of the proposal ¦ would substantially outweigh the adverse effects, including to the character of the countryside and in relation to promoting sustainable patterns of movement.',
  },
  'S5(5)': {
    code: 'S5(5)',
    title: 'Green Belt and Local Green Space',
    text: 'This policy does not apply to development proposals in the Green Belt or on land designated as Local Green Space, which should instead be determined in accordance with policies HC8, GB6, GB7 and/or GB8 (as appropriate). However, where development would not be inappropriate in these locations (through the application of policies HC8 and GB7), proposals should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework, and applying paragraph 2 of this policy.',
  },
  'S6(1)': {
    code: 'S6(1)',
    title: 'Neighbourhood plans',
    text: 'For development proposals involving the provision of housing, the benefits of approving development are likely to be substantially outweighed by the adverse effects where a proposal would conflict with a neighbourhood plan, provided the following apply: a. The neighbourhood plan became part of the development plan five years or less before the date on which the decision is made; and b. The neighbourhood plan contains allocations to meet its identified housing requirement (see policy HO2).',
  },

  // ---- Green Belt
  'GB2(1)': {
    code: 'GB2(1)',
    title: 'Green Belt purposes',
    text: 'a. Check the unrestricted sprawl of large built-up areas; b. Prevent neighbouring towns merging into one another; c. Assist in safeguarding the countryside from encroachment; d. Preserve the setting and special character of historic towns; and e. Assist urban regeneration by encouraging the recycling of derelict and other urban land.',
  },
  'GB6(1)': {
    code: 'GB6(1)',
    title: 'Inappropriate development',
    text: 'Development in the Green Belt is inappropriate unless it falls within one of the categories in policy GB7.',
  },
  'GB6(2)': {
    code: 'GB6(2)',
    title: 'Very special circumstances',
    text: 'Inappropriate development is, by definition, harmful to the Green Belt and should not be approved except in very special circumstances. Such circumstances will not exist unless the potential harm to the Green Belt by reason of inappropriateness and any other harm resulting from the proposed development, is clearly outweighed by other considerations. In making this assessment, substantial weight should be given to the harm to the Green Belt which would be caused, including harm to its openness.',
  },
  'GB7(1)': {
    code: 'GB7(1)',
    title: 'Development which is not inappropriate',
    text: 'The following categories of development are not inappropriate in the Green Belt, and therefore should not be regarded as harmful to the Green Belt or be required to demonstrate very special circumstances:',
  },
  'GB7(1)(b)': {
    code: 'GB7(1)(b)',
    title: 'Reuse, extension, alteration or replacement',
    text: 'b. The reuse, extension, alteration or replacement of an existing building, provided that the existing building is of permanent and substantial construction, is lawful in planning terms, and any extension or alteration will not result in a disproportionate increase in size compared to the original building. In the case of proposals for a replacement building, it should be for the same use and not materially larger than the one it replaces;',
  },
  'GB7(1)(c)': { code: 'GB7(1)(c)', title: 'Limited infilling in villages', text: 'c. Limited infilling in villages lying within the Green Belt;' },
  'GB7(1)(d)': {
    code: 'GB7(1)(d)',
    title: 'Limited affordable housing',
    text: 'd. Limited affordable housing for local community needs under policies set out in this Framework or the development plan (for instance, on a rural exception site);',
  },
  'GB7(1)(e)': {
    code: 'GB7(1)(e)',
    title: 'Previously developed land',
    text: 'e. The redevelopment of previously developed land (including a material change of use to residential or mixed-use including residential), which would not cause substantial harm to the openness of the Green Belt;',
  },
  'GB7(1)(g)(i)': {
    code: 'GB7(1)(g)(i)',
    title: 'Grey belt',
    text: 'i. The development would utilise grey belt land and would not fundamentally undermine the purposes (taken together) of the remaining Green Belt across the area of the plan;',
  },
  'GB7(1)(g)(ii)': {
    code: 'GB7(1)(g)(ii)',
    title: 'Evidenced unmet need',
    text: 'ii. There is an evidenced unmet need for the type of development proposed',
  },
  'GB7-fn41': {
    code: 'GB7(1)(g)(ii)',
    title: 'Unmet need for housing (footnote)',
    text: 'Which, in the case of applications involving the provision of housing, means the lack of a five year supply of deliverable housing sites, including the relevant buffer where applicable, or where the Housing Delivery Test result was below 75% of the housing requirement over the previous three years',
  },
  'GB7(1)(g)(iii)': {
    code: 'GB7(1)(g)(iii)',
    title: 'Sustainable location',
    text: 'iii. The development would be in a sustainable location, with particular reference to policy TR3 of this Framework',
  },
  'GB7(1)(g)(iv)': {
    code: 'GB7(1)(g)(iv)',
    title: 'Golden Rules',
    text: 'iv. In the case of major development involving the provision of housing, the development proposed complies with policy GB8.',
  },
  'GB7(1)(h)': {
    code: 'GB7(1)(h)',
    title: 'Land around well-connected stations',
    text: 'h. Residential or mixed-use development which would: i. Be within reasonable walking distance of a well-connected station (applying the definitions in the glossary at Annex B); ii. Be physically well-related to the station or the settlement within which the station is located; iii. Be of a scale which can be accommodated taking into account the existing or proposed availability of infrastructure; iv. Not prejudice any proposals for long-term comprehensive development in the same location; and v. In the case of proposals for major development, comply with policy GB8.',
  },
  'GB8(1)': {
    code: 'GB8(1)',
    title: 'The Golden Rules',
    text: "Where major development involving the provision of housing is proposed on land released from the Green Belt through plan preparation or review, or on sites in the Green Belt subject to a planning application, all of the following contributions ('Golden Rules') should be made",
  },
  'GB8(2)': {
    code: 'GB8(2)',
    title: 'Weight to the Golden Rules',
    text: 'In considering applications for major development involving the provision of housing on land released from the Green Belt through plan preparation or review, or on sites in the Green Belt subject to a planning application, substantial weight should be given to the importance of complying with the Golden Rules.',
  },

  // ---- Annexes
  'AnnexB:heritage-asset': {
    code: 'AnnexB:heritage-asset',
    title: 'Heritage asset',
    text: 'Heritage asset: A building, monument, site, place, area or landscape identified as having a degree of significance meriting consideration in planning decisions, because of its heritage interest. It includes but is not limited to designated heritage assets and assets identified by the local planning authority (including local listing).',
  },
  'AnnexB:settlement': {
    code: 'AnnexB:settlement',
    title: 'Settlement (Annex B)',
    text: 'Includes cities, towns, villages and other predominantly built-up areas, including land which is allocated or has permission for development which will form part of the built-up area once the development is complete. This includes areas defined as a settlement in the development plan (whether using defined settlement boundaries or equivalent terms, or criteria for identifying settlement extents where boundaries have yet to be defined). Settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas, unless specifically defined as a settlement in the development plan. For the purpose of this Framework they also exclude villages which lie within and are defined as part of the Green Belt in the development plan.',
  },
  'AnnexB:grey-belt': {
    code: 'AnnexB:grey-belt',
    title: 'Grey belt (Annex B)',
    text: "For the purposes of plan-making and decision-making, 'grey belt' is defined as land in the Green Belt comprising previously developed land and/or any other land that, in either case, does not strongly contribute to any of purposes (a), (b), or (d) in policy GB2.",
  },
  'AnnexB:PDL': {
    code: 'AnnexB:PDL',
    title: 'Previously developed land (Annex B)',
    text: 'Land which has been lawfully developed and is or was occupied by a permanent structure and any fixed surface infrastructure associated with it, including the curtilage of the developed land (although it should not be assumed that the whole of the curtilage should be developed). It also includes land comprising large areas of fixed surface infrastructure such as large areas of hardstanding which have been lawfully developed. Previously developed land excludes: land that is or was last occupied by agricultural or forestry buildings; land that has been developed but where provision for restoration has been made through development management procedures (including development related to minerals extraction, waste disposal by landfill and renewable and low carbon energy development, where provision for restoration exists); land in built-up areas such as residential gardens, parks, recreation grounds and allotments; and land that was previously developed but where the remains of the permanent structure or fixed surface structure have blended into the landscape.',
  },
  'AnnexB:well-connected-station': {
    code: 'AnnexB:well-connected-station',
    title: 'Well-connected station (Annex B)',
    text: 'Railway stations and underground, tram and light rail stops located within a top 80 Travel to Work Area located partially or fully within England by Gross Value Added (GVA) and which, in the normal weekday timetable, are served (or have a reasonable prospect of being served due to planned upgrades or through agreement with the rail operator) throughout the daytime by at least four trains or trams per hour overall, or at least two trains or trams per hour in any one direction.',
  },
  'AnnexB:reasonable-walking-distance': {
    code: 'AnnexB:reasonable-walking-distance',
    title: 'Reasonable walking distance (Annex B)',
    text: "For the purpose of policies S5, L3, GB7 (relating to land around well-connected stations), this should be considered to be around 800 metres, or around 10 minutes' walk time if topography, route availability and quality or physical barriers would prevent or discourage walking from up to 800 metres away.",
  },
  'AnnexB:major-development': {
    code: 'AnnexB:major-development',
    title: 'Major development (Annex B)',
    text: 'For housing, development where 10 or more homes will be provided, or the site has an area of 0.5 hectares or more.',
  },
  'AnnexB:setting': {
    code: 'AnnexB:setting',
    title: 'Setting of a heritage asset (Annex B)',
    text: 'The surroundings in which a heritage asset is experienced. Its extent is not fixed and may change as the asset and its surroundings evolve. Elements of a setting may make a positive or negative contribution to the significance of an asset, may affect the ability to appreciate that significance or may be neutral.',
  },
  'AnnexE(3)': {
    code: 'AnnexE(3)',
    title: 'Purpose (a): large built-up areas (Annex E)',
    text: 'This purpose relates to the sprawl of large built-up areas. Villages should not be considered large built-up areas.',
  },
  'AnnexE(4)': { code: 'AnnexE(4)', title: 'Purpose (b): towns merging (Annex E)', text: 'This purpose relates to the merging of towns, not villages.' },
  'AnnexE(5)': { code: 'AnnexE(5)', title: 'Purpose (d): historic towns (Annex E)', text: 'This purpose relates to historic towns, not villages.' },
  'AnnexA(2)': {
    code: 'AnnexA(2)',
    title: 'Weight to development plan policies',
    text: 'Development plan policies (or parts of those policies) which are materially inconsistent with national decision-making policies in this Framework should be given very limited weight. The only exception to this is where they have been examined and adopted or made against this Framework. Other development plan policies should not be given reduced weight simply because they were adopted prior to the publication of this Framework.',
  },

  // ---- Transport
  'TR3(1)(a)': {
    code: 'TR3(1)(a)',
    title: 'Sustainable locations',
    text: 'a. Development proposals which could generate a significant amount of movement, in the context of the area within which they would be situated, should be in locations that are sustainable (or which can be made so, taking into account planned improvements, including any provided for as part of the development itself). This means the location should limit the need to travel, particularly by private car, and offer a genuine choice of transport modes for residents and users, unless the nature of the development would make this impractical;',
  },
  'TR3(1)(e)': {
    code: 'TR3(1)(e)',
    title: 'Rural areas',
    text: 'e. In rural areas, opportunities to improve walking, wheeling, cycling and public transport and enhance the connectivity of an area should be taken where they exist and can be supported by the development proposed.',
  },
  'TR3(2)': {
    code: 'TR3(2)',
    title: 'Connectivity Tool',
    text: 'The Connectivity Tool (Connectivity Tool - GOV.UK) should be used alongside other relevant quantitative or qualitative evidence in assessing the connectivity of particular locations proposed for development.',
  },
  'TR4(1)(c)': {
    code: 'TR4(1)(c)',
    title: 'Safe, inclusive routes',
    text: 'c. Ensure that the arrangement of streets and other routes help to create places that are safe, inclusive and attractive for all users (particularly for women and girls, for other groups who may be vulnerable to crime or the fear of crime, and for those with limited mobility).',
  },
  'TR4(1)(a)': {
    code: 'TR4(1)(a)',
    title: 'Priority to walking, wheeling and cycling',
    text: 'To contribute to creating well-designed places, transport considerations should be integral to the design of development, proposals for which should: a. Give priority first to walking, wheeling and cycle movements, both within the scheme and with neighbouring areas; and second – so far as possible – to facilitating easy access to high quality public transport, with layouts and densities which maximise the catchments for bus or other public transport services;',
  },
  'TR4(1)(c)(ii)': {
    code: 'TR4(1)(c)(ii)',
    title: 'Needs of disabled people, older people and children',
    text: 'This includes reflecting relevant aspects of policy DP3(2), as well as employing measures to: … ii. Meet the needs of disabled people, older people and children in relation to all modes of transport, and',
  },
  'TR6(4)': {
    code: 'TR6(4)',
    title: 'Highway safety and network impact',
    text: 'Development proposals should be refused if they would have a severe adverse impact on the transport network (in terms of capacity and congestion, including cumulative impacts), or an unacceptable impact on highway safety; taking into account any mitigation measures proposed as well as any wider network improvements, including measures to support sustainable patterns of movement. This applies both during the construction phase and following completion.',
  },

  // ---- Heritage
  'HE4(2)': {
    code: 'HE4(2)',
    title: 'Clear and convincing justification',
    text: 'Any harm to, or loss of, the significance of a designated heritage asset (including from development within its setting) should have a clear and convincing justification in accordance with the policies in this chapter.',
  },
  'HE5(1)': {
    code: 'HE5(1)',
    title: 'Assessment of significance',
    text: 'Development proposals affecting heritage assets should be accompanied by an assessment of the significance of the assets affected (including any contribution made by their setting) and of the potential effect of the proposal on their significance.',
  },
  'HE5(2)': {
    code: 'HE5(2)',
    title: 'Categories of effect',
    text: 'Assessments of the potential effects of development proposals on the significance of heritage assets (including through effects on their setting) should identify whether proposals would be likely to: a. Have a positive effect, which is where the significance of a heritage asset would be enhanced, or better revealed; or b. Have no effect on the significance of a heritage asset; or c. Result in harm to the significance of a heritage asset, either from work affecting the asset itself or from development within its setting. The degree of harm should be identified: substantial harm would occur where the development proposal would seriously affect a key element of the asset\'s significance; or d. Cause the total loss of the significance of a heritage asset.',
  },
  'HE5(3)': {
    code: 'HE5(3)',
    title: 'Significance, not scale',
    text: "In making this assessment it is the effect on a heritage asset's significance rather than the scale of the development which should be considered.",
  },
  'HE5(4)': {
    code: 'HE5(4)',
    title: 'Accuracy of assessments',
    text: 'Decision-makers should be satisfied that assessments accurately reflect the effects on heritage assets caused by development proposals.',
  },
  'HE6(1)': {
    code: 'HE6(1)',
    title: 'Substantial weight to conservation',
    text: "When considering the potential effect of a development proposal on the significance of a designated heritage asset, substantial weight should be given to the asset's conservation (and the more important the asset, the greater the weight should be). This is irrespective of whether any potential effect amounts to a positive effect, harm, substantial harm, or total loss of its significance.",
  },
  'HE6(3)': {
    code: 'HE6(3)',
    title: 'Considerable importance and weight',
    text: 'Any harm to a designated heritage asset will be a matter of considerable importance and weight, which should be dealt with in accordance with paragraphs 4 to 6 of this policy.',
  },
  'HE6(4)': {
    code: 'HE6(4)',
    title: 'Harm weighed against public benefits',
    text: 'Where a development proposal would harm the significance of a designated heritage asset the effect on the asset and its significance should be weighed against any public benefits resulting from the proposal. Important public benefits can include securing the long-term reuse of a vacant or underused listed building, and enabling energy efficiency and low carbon heating measures to be employed.',
  },
  'HE6(5)': {
    code: 'HE6(5)',
    title: 'Substantial harm or total loss',
    text: 'Where a development proposal would cause substantial harm to, or the total loss of, the significance of a designated heritage asset, consent should be refused unless it can be demonstrated that the harm is necessary to achieve substantial public benefits that outweigh the harm or loss, or if all of the following apply: a. The nature of the heritage asset would otherwise prevent all reasonable uses of the site; b. No suitable use for the heritage asset itself can be found in the medium term through appropriate marketing that will enable its conservation; c. Conservation by grant-funding or some form of not for profit, charitable or public ownership is not possible; and d. The harm or loss is outweighed by the benefit of bringing the asset back into use.',
  },
  'HE7(2)': {
    code: 'HE7(2)',
    title: 'Non-designated heritage assets',
    text: 'Where a development proposal would harm the significance of a non-designated heritage asset, this should be weighed against the benefits of the proposal and a balanced judgement made, having regard to the scale of any harm or loss and the significance of the non-designated heritage asset.',
  },

  // ---- Design
  'DP3(1)': {
    code: 'DP3(1)',
    title: 'Responding to context',
    text: 'Development proposals should respond to their context (the history, character and features of their site and its setting), so that they integrate with and enhance their surroundings; such as through the arrangement of development plots and buildings, the use of materials and architectural features, and the restoration, reuse and integration of heritage assets.',
  },
  'DP3(2)(c)': {
    code: 'DP3(2)(c)',
    title: 'Nature and tree cover',
    text: 'c. Nature: incorporate and/or connect to a network of high quality, accessible, multi-functional green infrastructure to provide opportunities for recreation and healthy living, strengthen habitats, improve climate change resilience and improve air and water quality. This should include maintaining and enhancing tree cover and incorporating sustainable drainage systems in accordance with policies N3 and F8;',
  },
  'DP3(3)': {
    code: 'DP3(3)',
    title: 'Design: should be refused',
    text: 'Development proposals should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2, or with any explicit design standards set out in the development plan (including those in locally-specific policies, guides, codes or masterplans). Substantial weight should be given to compliance with relevant development plan policies when assessing the design quality of proposals.',
  },

  // ---- Natural environment and flood
  'N2(1)(a)': {
    code: 'N2(1)(a)',
    title: 'Environmental qualities and landscape',
    text: 'a. Consider the environmental qualities of land proposed for development, including habitats, landscape character and the natural beauty of the countryside, and identify opportunities for those qualities to be conserved or enhanced (including through requirements for biodiversity net gain where these apply);',
  },
  'N2(1)(d)': {
    code: 'N2(1)(d)',
    title: 'Established trees and hedgerows',
    text: 'd. Conserve and enhance existing natural features of visual, historic or nature conservation value (such as established trees and hedgerows) where possible; and use appropriate landscaping to help create a well-designed place and integrate the development into its surroundings;',
  },
  'N2(2)': {
    code: 'N2(2)',
    title: 'Significant harm to biodiversity',
    text: 'If significant harm to biodiversity resulting from a development cannot be avoided (through locating on an alternative site with less harmful impacts), adequately mitigated or, as a last resort, compensated for, then the development should be refused.',
  },
  'N4(1)': {
    code: 'N4(1)',
    title: 'Protected Landscapes',
    text: 'Development proposals within Protected Landscapes should be limited in scale and extent and sensitively located and designed to avoid harm to the statutory purposes and special qualities of the Protected Landscape. Substantial weight should be placed on the importance of conserving and enhancing the natural beauty of these areas, and to conserving and enhancing wildlife and cultural heritage in National Parks and the Broads.',
  },
  'N4(2)': {
    code: 'N4(2)',
    title: 'Major development in Protected Landscapes',
    text: 'Proposals for major development within Protected Landscapes should be refused other than in exceptional circumstances, and where it can be demonstrated that the development is in the public interest.',
  },
  'N4(4)': {
    code: 'N4(4)',
    title: 'Setting of Protected Landscapes',
    text: 'Development proposals within the setting of Protected Landscapes should be sensitively located and designed to avoid or minimise adverse impacts on the Protected Landscape.',
  },
  'N6(2)': {
    code: 'N6(2)',
    title: 'Irreplaceable habitats',
    text: "Irrespective of a site's status in nature conservation terms, development proposals which would entail the loss or deterioration of irreplaceable habitats (such as ancient woodland and ancient or veteran trees) should be refused, unless there are wholly exceptional reasons and a suitable compensation strategy exists.",
  },
  'F7(2)': {
    code: 'F7(2)',
    title: 'Flood risk from any source',
    text: 'Where development is proposed in a location known to be at risk from any form of flooding, now or in the future, it should be refused unless: a. Within the site, the most vulnerable development is located in areas of lowest flood risk, unless there are overriding reasons which justify a different arrangement; b. The development will be safe throughout its lifetime taking account of the vulnerability of its users; c. Any residual risk can be safely managed, and safe access and escape routes are included where appropriate, as part of an agreed emergency plan; d. The development is appropriately flood resistant and resilient such that, in the event of a flood, it could be quickly brought back into use without significant refurbishment; and e. It can be demonstrated that flood risk will not be increased elsewhere.',
  },

  // ---- Housing
  'HO7(1)': {
    code: 'HO7(1)',
    title: 'Weight to housing',
    text: 'In applying the policies in this Framework, substantial weight should be given to the benefits of providing homes which will contribute towards meeting the evidenced accommodation needs of the community, as identified through needs assessments prepared for the area of the local planning authority and other relevant evidence.',
  },
};
