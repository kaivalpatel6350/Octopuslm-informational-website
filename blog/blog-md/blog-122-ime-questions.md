---
title: "122 Questions to Ask Any IME Medical File"
description: "The complete question library we use for independent medical examination record review — 73 universal questions plus specialty sets for psychiatry, neurosurgery, orthopaedics, and chiropractic. Free to copy and use."
pubDate: 2026-08-25
author: "OctopusLM"
tags: ["IME", "medical record review", "AI prompts", "independent medical examination"]
---

# 122 Questions to Ask Any IME Medical File

This is our entire question library, published in full.

It is what we load into OctopusLM by default: seventy-three questions that run on any independent medical examination file, plus specialty sets for psychiatry, neurosurgery and spine, orthopaedics, and chiropractic. Together they cover case setup, history, diagnosis, causation, apportionment, treatment, diagnostics, credibility, function, prognosis, and record integrity.

Copy them. Adapt them. Use them somewhere else if you want to.

We are giving the list away because the list was never the hard part. Anyone who has written a few hundred IME reports could reconstruct most of it. The hard part is running these against eleven hundred pages that arrived out of order, with duplicates, and getting an answer you can cite to a page number and defend six months later in a deposition.

## Four rules that decide whether any of this works

These prompts assume a specific configuration. Without it they produce fluent, confident, unusable output — and that failure mode is more dangerous than an obvious one, because it reads like a finished answer.

**Every fact carries a page citation.** Not *the record indicates a prior lumbar injury* but a citation in the form `[p.412]`, placed immediately after the fact it supports. A statement without a citation is not permitted. If you cannot click through and land on the page, the sentence cannot go into your report.

**No outside medical knowledge, ever.** The system answers only from the retrieved records. It does not know what usually accompanies a diagnosis, what a typical treatment course looks like, or what the mechanism probably was. Every one of those is a gap it must leave open rather than fill.

**Absence is stated, not explained.** When something is not in the file, the correct output is one line: *No record of [X] in this file.* No apology, no paragraph on limitations, no suggestion that the question was unanswerable, no offer of alternatives. A model that pads an absence into three hedged sentences is training you to skim.

**Nothing is inferred silently.** Where a value is derived rather than stated, it is labelled `INFERRED:` and the derivation is shown. Age at date of injury calculated from a birth date is a derivation. So is a diagnosis assembled from symptoms that no provider ever assembled that way.

There is a fifth that matters as much: **when two documents conflict, both appear.** Separate rows, each with document, date, provider, statement, and page, and no commentary about which is correct. Conflict resolution is the examiner's work. A tool that quietly picks the more frequent version has removed the exact thing you needed to see.

Most disappointing output from AI record review traces back to one of these five being absent, not to a badly worded prompt.

---

## Universal questions

These seventy-three run on any file regardless of specialty.

### Case Setup

Run these before you open the file properly. Seven questions tell you whose records these are, what period they cover, who generated them, and what is missing. The gap question is the one examiners skip and regret: a ninety-day silence in a treatment record is a finding, and it is easier to notice now than to explain later.

**1. Identify the examinee**
> Identify the examinee: full name, date of birth, age at date of injury, and sex. Cite the page for each. If a value is derived rather than stated, label it INFERRED and show the derivation.

**2. Date of injury / index event**
> State the date of the index event and describe how it is characterised in the record. If more than one date appears, list every date with its source document and page.

**3. Referral source and questions posed**
> Identify the referring party, client organisation, employer, insurer, or counsel named in this file, and any questions or instructions posed to an examiner. Cite pages.

**4. All providers in this file**
> List every treating or reviewing provider in this file. For each: name, credentials, specialty, facility, first and last date of contact, and number of documents. Sort by first date.

**5. All facilities in this file**
> List every facility, clinic, hospital, or imaging centre appearing in this file, with the date range of records from each.

**6. Record date range and gaps**
> State the earliest and latest dated record in this file. Then list every gap of 90 days or more in the treatment record, with start date, end date, and duration.

**7. Document type inventory**
> List every document type present in this file (e.g. progress note, imaging report, operative report, therapy note, correspondence, billing) with the count of documents and total pages for each.

### History

Mechanism first, and every version of it. The instruction not to reconcile conflicting accounts is deliberate — a tool that quietly picks the most common version has destroyed the thing you needed to see. Three different mechanisms across three providers is a fact about the record, and it belongs in front of you, not resolved on your behalf.

**8. Mechanism of injury — every version**
> Describe the mechanism of the index event exactly as recorded. If the account differs between documents, list each version separately with its provider, date, and page. Do not reconcile the versions.

**9. Conflicting accounts of the event**
> Identify every point on which the record gives conflicting accounts of the index event — date, location, mechanism, body parts involved, or witnesses. Present the conflicting statements side by side with pages.

**10. First treatment contact after injury**
> Identify the first documented treatment contact after the index event: date, provider, setting, presenting complaint, and elapsed time from the index event.

**11. Personal and social history**
> Summarise all documented personal history: education, employment, marital status, children, living situation, and activities of daily living. Cite pages.

**12. Occupational history and job demands**
> Summarise the documented occupational history: employers, job titles, dates, and any description of physical or cognitive job demands.

**13. Substance use history**
> Summarise all documented substance use: alcohol, tobacco, cannabis, prescription, and illicit substances. Include quantities, dates, and any documented change over time.

**14. Prior injuries and claims**
> List every prior injury, accident, workers' compensation claim, disability claim, or litigation mentioned anywhere in this file, with dates and pages.

**15. Family medical history**
> Summarise all documented family medical history, including any condition relevant to the conditions at issue in this file.

**16. Social supports and relationships**
> Summarise what the record documents about the examinee's social relationships, support system, and any change in these since the index event.

**17. Review of systems**
> Summarise documented review-of-systems findings across the file, grouped by system, noting date and provider for any positive finding.

### Diagnosis

The diagnostic questions separate what was diagnosed from what was documented in support of it. A diagnosis entered once in a walk-in chart and carried forward through forty subsequent notes looks, in a record dump, exactly like a diagnosis established through examination and testing. Prompts 3, 5, and 8 in this group exist to tell them apart.

**18. All diagnoses with provider and page**
> List every diagnosis in this file. For each: diagnosis, ICD code if stated, date first recorded, provider name, provider credentials and specialty, and page. Sort chronologically.

**19. Conflicting or changed diagnoses**
> Identify every diagnosis that conflicts with another, changed over time, or was dropped without explanation. Show the competing entries with dates, providers, and pages.

**20. Clinical basis for each diagnosis**
> For each diagnosis in this file, state what the record documents as its basis: physical examination findings, objective testing, imaging, standardised instrument, or examinee self-report alone. If no basis is documented, say so explicitly.

**21. Pre-injury vs post-injury diagnoses**
> Separate the diagnoses in this file into those first documented before the index event and those first documented after it. Give the first documented date and page for each.

**22. Diagnoses never confirmed by a specialist**
> List any diagnosis recorded by a general practitioner, nurse practitioner, therapist, or other non-specialist that was never subsequently confirmed by a specialist in the relevant field.

**23. Acute, chronic, and pre-existing**
> Classify each documented condition as acute, chronic, or pre-existing, using only the characterisation given in the record. Cite the language and page relied on.

**24. First appearance of each symptom**
> List every symptom complaint in this file with the date it was first documented, the provider who recorded it, and whether that date precedes or follows the index event.

**25. Diagnoses carried forward without reassessment**
> Identify any diagnosis that appears repeatedly in later notes with no documented reassessment, new testing, or new examination supporting it. Give the first and last appearance with pages.

### Causation

Five questions, and they are the spine of most reports. Latency in days, every attribution statement a provider actually made, every alternative cause the record itself raises, every intervening event, and whether complaints ran continuously or stopped and restarted. Note that none of these asks the tool for an opinion on causation — they ask what the record says. The opinion is yours.

**26. Injury-to-first-complaint timeline**
> Build a timeline from the index event to the first documented complaint of each condition at issue. For each condition give the latency in days and the page of first complaint.

**27. Every causation statement in the record**
> List every statement in this file in which a provider attributes a condition or symptom to a cause. For each: the provider, date, the attribution as recorded, and the page.

**28. Alternative causes documented**
> Identify any record attributing symptoms to a cause other than the index event, including degenerative change, prior injury, unrelated illness, or a later event.

**29. Intervening events after the injury**
> List every subsequent accident, fall, new injury, surgery, or significant illness documented after the index event, with date and page.

**30. Continuity of complaint**
> Trace each condition at issue chronologically through the record to show whether complaints were continuous or interrupted. Note every period with no documented complaint of that condition.

### Pre-existing & Apportionment

Apportionment turns on the pre-injury baseline, and the baseline is usually the thinnest part of the file. These six questions pull what exists: prior conditions, prior imaging of the same region, prior treatment of the same region, and what the record documents as having changed afterward. Where the answer is nothing, that is also worth knowing before the examination rather than during it.

**31. Pre-injury baseline**
> Describe the examinee's documented condition immediately before the index event: functional status, active diagnoses, current treatment, and medications. Cite pages.

**32. All pre-existing conditions**
> List every condition documented as existing before the index event, with the date first documented and the page.

**33. Documented change after the event**
> Identify what the record documents as changing after the index event with respect to each pre-existing condition: symptom frequency, severity, treatment intensity, or function.

**34. Aggravation or exacerbation statements**
> List every statement in the record using the language of aggravation, exacerbation, flare, or worsening of a pre-existing condition, with provider, date, and page.

**35. Pre-injury imaging and testing**
> List all imaging and diagnostic testing dated before the index event, with modality, body part, date, and the findings as reported.

**36. Pre-injury treatment for the same region**
> List all treatment documented before the index event for the same body region or condition now at issue, with provider, dates, and modality.

### Treatment

Nine questions covering what was prescribed, what was attended, what was skipped, and where the curve flattened. The distinction between sessions attended and sessions missed or cancelled recurs deliberately — a twenty-session course with eleven no-shows and twenty sessions completed both appear as twenty sessions unless you ask for the split.

**37. All medications**
> List every medication in this file: name, dose, route, frequency, start date, stop date, prescriber, and documented indication. Sort chronologically by start date.

**38. All treatment and therapy**
> List every treatment or therapy course: modality, provider, start and end date, number of sessions attended, sessions cancelled or missed, and documented outcome.

**39. Treatment gaps over 60 days**
> Identify every gap of 60 days or more between treatment contacts. For each: start date, end date, duration, and any documented explanation.

**40. Non-compliance and missed appointments**
> List every documented instance of non-compliance, missed appointment, declined treatment, discharge for non-attendance, or failure to fill a prescription, with date and page.

**41. Recommendations and whether followed**
> List every treatment recommendation made by any provider, and state whether the record shows it was followed, declined, or not addressed. Cite both the recommendation and the follow-up page.

**42. Procedures and surgeries**
> List every surgical or interventional procedure: procedure, date, surgeon or proceduralist, facility, indication, and documented outcome.

**43. Referrals and attendance**
> List every referral made in this file, with referring provider, date, specialty referred to, and whether the record shows the consultation occurred.

**44. Point at which treatment plateaued**
> Identify the point in the record after which treatment stopped producing documented change in the clinical picture. Support with the specific notes and dates relied on.

**45. Current treatment at most recent record**
> State the treatment in place as of the most recent dated record: active providers, medications, therapies, and planned next steps, with the date of that record.

### Diagnostics & Testing

Note prompt 2's instruction: summarise the findings in your own words rather than reproducing the report text. Radiology reports are the most-copied text in medico-legal work, and a chronology that reproduces them verbatim is both a copyright question and a weaker document. Prompt 4 — imaging findings that do not correspond to clinical findings — is the one that most often changes an opinion.

**46. All imaging studies**
> List every imaging study: modality, body part, date, facility, ordering provider, and page of the report. Sort chronologically.

**47. Imaging findings summarised**
> For each imaging study, summarise the reported findings and impression in your own words. Do not reproduce the report text verbatim. Cite the page.

**48. All laboratory and diagnostic testing**
> List all laboratory work, electrodiagnostic studies, and other diagnostic testing, with test, date, result as reported, and page.

**49. Imaging vs clinical findings**
> Identify every instance where imaging findings and documented clinical findings do not correspond — objective findings without symptoms, or symptoms without corresponding findings.

**50. Degenerative or age-related findings**
> List every finding described in any study as degenerative, chronic, age-related, longstanding, or pre-existing, with study, date, and page.

**51. Serial imaging comparison**
> Where more than one study of the same body region exists, compare them chronologically and describe what the reports document as changed or unchanged.

### Credibility & Consistency

These ask for inconsistencies the record itself documents. Every one is framed around what a provider wrote down, with their name and the date attached. None asks the tool to assess whether the examinee is credible. That distinction is what keeps the output usable when the report is challenged, and it is the single most important line in this whole library.

**52. Reported vs observed function**
> Identify every documented inconsistency between what the examinee reported and what a provider observed or recorded, with both entries, dates, and pages.

**53. Provider notes questioning reliability**
> List every note in which a provider questions the examinee's reliability, effort, motivation, consistency, or symptom presentation. Quote no more than a short phrase; summarise the rest.

**54. Self-report vs documented activity**
> Compare the examinee's reported functional limitations against any activity documented elsewhere in the file — work, travel, recreation, driving, caregiving, or exercise.

**55. Validity and effort testing**
> List any symptom validity, effort, or consistency testing in this file, with instrument, date, administrator, and result as reported.

**56. Surveillance and third-party observation**
> Identify any surveillance material, activity log, employer report, or third-party observation in this file, with date, source, and what it documents.

**57. Inconsistent symptom reports across providers**
> Compare the symptoms reported to different providers on or near the same dates and identify every material discrepancy.

### Function & Work Capacity

Work status wants a timeline rather than a list. Off work, modified duty, full duty, each attempted return and how it ended, running from the index event to the most recent record — with gaps marked rather than smoothed over.

**58. All work notes and restrictions**
> List every return-to-work note, work restriction, modified duty authorisation, and off-work certificate: date, provider, restriction stated, and duration.

**59. Work absence and return attempts**
> Build a timeline of work status from the index event to the most recent record: off work, modified duty, full duty, and every documented attempt to return with its outcome.

**60. Documented functional limitations**
> List all documented functional limitations grouped by domain — mobility, self-care, household, social, cognitive, and occupational — with provider, date, and page.

**61. Functional capacity evaluations**
> List any functional capacity evaluation, work conditioning assessment, or similar formal functional testing, with date, evaluator, and results as reported.

**62. Job description and physical demands**
> Summarise any job description, physical demands analysis, or task listing in this file, with source and page.

**63. Current work status**
> State the examinee's work status as of the most recent dated record, with the date and page of that record.

### MMI & Prognosis

Four questions on plateau, prognosis, future care, and any rating already in the file. Prompt 1 asks for the wording used, not a conclusion about whether MMI was reached. Providers write around plateau in a dozen different phrasings and the exact language matters more than the paraphrase.

**64. MMI and plateau statements**
> List every statement in the record indicating maximum medical improvement, plateau, stability, or that no further improvement is expected. Give provider, date, wording used, and page.

**65. Prognostic statements**
> List every prognostic statement in this file, with provider, date, the prognosis as recorded, and the page.

**66. Future care recommendations**
> List every recommendation for future treatment, follow-up, monitoring, or care, with provider, date, and page.

**67. Existing impairment ratings**
> List any permanent impairment rating in this file: rating, body part, examiner, date, methodology or guide edition cited, and page.

### Record Integrity

The group nobody else has, and the one that catches the problems that end up in cross-examination. Duplicates, pages belonging to another patient, illegible scans, unsigned documents, copy-forward text, and records referenced but absent. Prompt 2 in particular: wrong-patient pages arrive in large productions more often than anyone likes to admit, and citing one in a report is a bad afternoon.

**68. Duplicate documents**
> Identify documents appearing more than once in this file. Give the page ranges of each copy.

**69. Records for another patient**
> Identify any page or document that appears to belong to a person other than the examinee. Give the page and the identifying detail relied on.

**70. Illegible or unreadable pages**
> List pages that are illegible, blank, cut off, or where handwriting could not be resolved.

**71. Undated or unsigned documents**
> List every document with no date, no author, or no signature, with page range.

**72. Copy-forward text**
> Identify text repeated verbatim across multiple notes by the same or different providers, which may indicate copy-forward rather than fresh assessment. Give pages.

**73. Missing expected records**
> Given the treatment referenced in this file, identify records that are referred to but not present — imaging referenced without a report, consultations referenced without a note, or therapy billed without notes.

---

## Specialty questions

Layered on top of the universal set, not instead of it. An orthopaedic examiner runs seventy-nine questions: the seventy-three above plus the six below.

### Psychiatry (25)

Psychiatric files carry the widest spread of provider types — psychiatrists, family physicians, therapists, counsellors — recording the same diagnoses with very different evidentiary weight behind them. These twenty-five questions are built around telling those apart, and around reporting risk content flatly: date, provider, what was documented, what was done. No alarm language, no interpretation, no collapsing several entries into a characterisation.

*History*

**74. Past psychiatric history**
> Summarise all documented past psychiatric history: prior diagnoses, hospitalisations, emergency contacts, prior treating psychiatrists or therapists, and dates. Cite pages.

**75. Family psychiatric history**
> Summarise all documented family psychiatric history, including diagnoses, relationships, and any documented family history of substance use or suicide.

**76. Trauma history**
> Summarise all trauma history documented anywhere in this file, including the date it was first disclosed and to which provider.

**77. Developmental and childhood history**
> Summarise any documented developmental, childhood, or educational history, including learning difficulties or behavioural concerns.

**78. Delayed or late disclosure**
> Identify any significant information that appears late in the treatment record but not earlier — trauma, substance use, prior psychiatric history, or prior claims. Give the date of first disclosure, the provider, and what the earlier records had recorded instead.

*Diagnosis*

**79. All psychiatric diagnoses**
> List every psychiatric diagnosis in this file: diagnosis, DSM or ICD code if stated, date first recorded, provider, provider credentials, and page.

**80. Documented diagnostic criteria**
> For each psychiatric diagnosis, state what the record documents in support of it: specific criteria assessed, structured interview, standardised instrument, or self-report alone. State explicitly where no criteria are documented.

**81. Diagnoses by non-psychiatrists**
> List psychiatric diagnoses recorded by a family physician, nurse practitioner, therapist, counsellor, or other non-psychiatrist, and state whether a psychiatrist ever confirmed each one.

**82. Symptom onset relative to the event**
> For each psychiatric symptom documented, give the date first recorded and state whether it precedes or follows the index event, with the latency in days.

*Treatment*

**83. All psychotropic medications**
> List every psychotropic medication: name, dose, start date, stop date, prescriber, documented indication, documented response, and reason for any change.

**84. All psychotherapy**
> List every course of psychotherapy or counselling: modality, provider, credentials, start and end date, sessions attended, sessions missed or cancelled, and documented outcome.

**85. Medication adherence**
> List every documented instance of medication non-adherence, self-discontinuation, dose alteration, or failure to fill, with date and page.

**86. Substance use treatment**
> List any substance use treatment, detoxification, rehabilitation, or addiction counselling documented in this file, with dates, provider, and outcome.

*Diagnostics & Testing*

**87. All psychometric testing**
> List every standardised psychological or psychometric instrument administered: instrument name, date, administrator and credentials, scores as reported, and page.

**88. Symptom validity testing**
> List any symptom validity, performance validity, or effort measure in this file, with instrument, date, administrator, and result as reported.

**89. Cognitive testing**
> List any cognitive screening or neuropsychological testing, with instrument, date, administrator, domain scores as reported, and page.

*Credibility & Consistency*

**90. Documented symptom magnification**
> Identify every note documenting symptom magnification, exaggeration, over-endorsement, or inconsistent presentation, with provider, date, and page.

**91. Mental status inconsistencies**
> Compare documented mental status findings across providers and dates and identify material inconsistencies in mood, affect, cognition, insight, or behaviour.

**92. Reported vs observed psychiatric function**
> Compare reported psychiatric limitation against documented activity elsewhere in the file — employment, education, travel, social activity, caregiving, or recreation.

*Function & Work Capacity*

**93. Cognitive complaints and objective testing**
> List all documented cognitive complaints — concentration, memory, processing — and state for each whether any objective testing was performed and what it showed.

**94. Social and occupational functioning over time**
> Trace documented social and occupational functioning chronologically from before the index event to the most recent record.

**95. Psychiatric work restrictions**
> List every work restriction, accommodation, or off-work certificate issued on psychiatric grounds, with provider, date, restriction, and duration.

*Risk & Acuity*

**96. Suicidal and homicidal ideation**
> List every documented instance of suicidal ideation, self-harm, or homicidal ideation, with date, provider, what was documented, and any action taken. Report factually without interpretation.

**97. Hospitalisations and crisis contacts**
> List every psychiatric hospitalisation, emergency department visit, crisis line contact, or involuntary admission, with dates, facility, and documented reason.

**98. Psychosocial stressors**
> List all documented psychosocial stressors — financial, legal, relationship, housing, bereavement, or occupational — with date first documented and page.

### Neurosurgery and spine (10)

Spinal level notation is preserved exactly as recorded, and radicular symptoms are traced separately from axial ones throughout. Prompt 4 deserves particular attention: it presents the imaging level and the symptom level side by side and stops there. A tool that asserts correspondence between an imaging finding and a symptom has made a clinical judgment that is not its to make.

*History*

**99. Radicular vs axial symptoms over time**
> Trace documented radicular and axial symptoms separately over time, with dates, distribution as recorded, and pages.

*Treatment*

**100. Surgical history**
> List every spinal or neurosurgical procedure: procedure, level, approach, date, surgeon, facility, indication, and documented outcome.

**101. Surgical recommendations and decisions**
> List every documented surgical recommendation or opinion, whether it was accepted or declined, and the documented reason, with provider, date, and page.

**102. Post-operative course**
> For each procedure, summarise the documented post-operative course: complications, revisions, hardware issues, infection, and functional outcome, with dates.

**103. Injections and interventional procedures**
> List every epidural, facet, nerve root, or other interventional injection: type, level, date, proceduralist, and documented response.

*Diagnostics & Testing*

**104. Neurological examination by date**
> List all documented neurological examination findings chronologically: motor strength by myotome, sensory findings by dermatome, reflexes, and pathological signs, with provider, date, and page.

**105. Documented neurological deficits**
> Identify every documented objective neurological deficit, the date first recorded, whether it persisted, resolved, or progressed, and the last date it was documented.

**106. Spinal imaging level by level**
> For each spinal imaging study, list the findings level by level as reported, with modality, date, and page.

**107. Imaging level vs symptom level**
> Compare the spinal level of imaging findings against the level of documented clinical symptoms and examination findings, and identify every non-correspondence.

**108. Electrodiagnostic studies**
> List every EMG or nerve conduction study: date, performing provider, levels or nerves studied, and findings as reported.

### Orthopaedics (6)

Laterality is the recurring failure. Where the record omits which side, the correct output says so rather than guessing — an unmarked laterality is a defect in the record, not a detail to be filled in. Range of motion carries joint, plane, units, side, and date. Impairment ratings carry the guide edition and the tables cited, exactly as recorded.

*Treatment*

**109. Surgical procedures and hardware**
> List every orthopaedic procedure: procedure, joint or bone, date, surgeon, hardware implanted, and documented outcome including any removal or revision.

**110. Physical therapy course**
> List all physical or occupational therapy: provider, start and end date, sessions attended, sessions missed, documented objective progress, and discharge status.

*Diagnostics & Testing*

**111. Orthopaedic examination by date**
> List all documented orthopaedic examination findings chronologically: range of motion, strength, stability, swelling, deformity, and special tests, by joint, with provider, date, and page.

**112. Range of motion over time**
> Extract every recorded range of motion measurement by joint and date and present them chronologically so change over time is visible.

**113. Fractures and structural injuries**
> List every fracture, dislocation, ligament tear, or other structural injury documented, with date, mechanism, imaging confirmation, and treatment.

*MMI & Prognosis*

**114. Impairment rating detail**
> For any impairment rating in this file, extract the rating, body part, guide and edition cited, tables or methodology referenced, examiner, date, and page.

### Chiropractic (8)

Range of motion measurements are the data here, and they are worth nothing without units, method, side, and date preserved exactly as recorded. The passive-versus-active care split and the month-by-month visit frequency are what make a treatment curve visible — whether care intensified, plateaued, or tapered, and whether anyone recommended transitioning to self-management.

*Pre-existing & Apportionment*

**115. Pre-existing spinal findings**
> List all degenerative, congenital, or pre-existing spinal findings documented in any imaging or note, with study, date, level, and page.

*Treatment*

**116. Chiropractic treatment course**
> List all chiropractic treatment: modality, spinal region treated, provider, date range, total visits, and visit frequency by month.

**117. Treatment frequency and tapering**
> Show visit frequency by month across the treatment course and identify whether frequency increased, plateaued, or tapered, with dates.

**118. Documented response to treatment**
> List every documented response to manipulation or chiropractic treatment — improvement, no change, or worsening — with date, provider, and page.

**119. Passive vs active care**
> Classify the treatment course into passive care and active care over time, and identify any documented recommendation to transition to active care or self-management.

*Diagnostics & Testing*

**120. Spinal examination findings by date**
> List all documented spinal examination findings chronologically: range of motion measurements, palpation findings, orthopaedic tests, and neurological screening, with provider, date, and page.

**121. Range of motion over time**
> Extract every recorded range of motion measurement by region and date, and present them chronologically so change over time is visible.

**122. Non-organic findings**
> List any documented Waddell signs, non-organic findings, inconsistent examination results, or give-way weakness, with provider, date, and page.

---

## Before you paste these into a general-purpose chatbot

Two limits, both worth knowing in advance.

**Context.** An IME file of eight hundred to two thousand pages does not fit in a chat window. Upload a portion and prompt against it and you get answers that are accurate about the fraction supplied and silent about everything else — which is worse than no answer, because it looks complete.

**Page numbers.** The citations are the entire point. A general chatbot working from pasted text has no page anchor, so `[p.412]` either does not appear or appears invented. An invented citation in an IME report is a serious problem, and it is the failure mode most likely to survive your own review, because it looks exactly like a real one.

These questions assume retrieval across the complete file with page-level anchoring underneath it. That is the setup they were written for.

## Using the library as a checklist

Run the universal set and your specialty overlay and you have a structured picture before the examination: who diagnosed what and on what basis, what was tried and whether it was taken, what was tested and what it showed, where the record contradicts itself, where the gaps sit, and which pages should not be in the file at all.

None of that is the opinion. The opinion is yours, and no part of this library is designed to produce one. But it means you walk in knowing what the record already says, rather than discovering it afterward — at the point where changing your mind is expensive.

---

*OctopusLM turns unstructured medical files into page-cited, review-ready output for independent medical examiners. Every fact links back to the source page. The 122 questions above are preloaded and editable, and you can add your own.*
