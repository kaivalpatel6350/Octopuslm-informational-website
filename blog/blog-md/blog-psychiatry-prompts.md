---
title: "25 AI Prompts for Psychiatric IME Record Review"
description: "Twenty-five prompts for reviewing psychiatric records in an independent medical examination — history, diagnosis, treatment, psychometrics, credibility, function, and risk. Copy them as written."
pubDate: 2026-08-18
author: "OctopusLM"
tags: ["IME", "psychiatry", "medical record review", "AI prompts"]
---

# 25 AI Prompts for Psychiatric IME Record Review

A psychiatric IME file is rarely a clean narrative. It's a family physician's chart, three therapists with different note conventions, an emergency department visit, a pharmacy printout, and a disability insurer's correspondence — arriving out of order, often duplicated, sometimes containing pages that belong to a different patient.

The record has your answers in it. Finding them is the work.

These are twenty-five prompts for putting AI to that task. They're grouped the way a psychiatric review actually proceeds: history, diagnosis, treatment, testing, credibility, function, risk. Copy them as written or adapt them to your own report structure.

**One thing before the list.** These prompts assume a specific setup, and without it they'll produce fluent, unusable output.

## The four rules that make prompts like these work

**Every fact carries a page citation.** Not "the record indicates a history of depression" — `[p.412]`. A statement without a citation is not permitted. If you can't click through to the source page, you can't defend the sentence in your report.

**No outside medical knowledge.** The model answers only from the retrieved records. It doesn't know what usually accompanies a diagnosis, and it must not fill a gap with what's typical.

**Absence gets stated, not explained.** When something isn't there, the correct output is one line: *"No record of [X] in this file."* No apology, no paragraph about limitations, no suggestion that the question was unanswerable.

**Nothing is inferred silently.** If a value is derived rather than stated, it gets labelled `INFERRED:` with the derivation shown. Age at date of injury calculated from a birth date is a derivation, not a fact in the record.

Add these as standing instructions before you run anything below. Most disappointing output from AI record review traces back to their absence rather than to the prompt itself.

---

## History

**1. Past psychiatric history**
> Summarise all documented past psychiatric history: prior diagnoses, hospitalisations, emergency contacts, prior treating psychiatrists or therapists, and dates. Cite pages.

**2. Family psychiatric history**
> Summarise all documented family psychiatric history, including diagnoses, relationships, and any documented family history of substance use or suicide.

**3. Trauma history**
> Summarise all trauma history documented anywhere in this file, including the date it was first disclosed and to which provider.

**4. Developmental and childhood history**
> Summarise any documented developmental, childhood, or educational history, including learning difficulties or behavioural concerns.

**5. Delayed or late disclosure**
> Identify any significant information that appears late in the treatment record but not earlier — trauma, substance use, prior psychiatric history, or prior claims. Give the date of first disclosure, the provider, and what the earlier records had recorded instead.

That last one is worth running on every file. Late disclosure is a documented fact with a date attached — nothing more. It is not evidence of anything on its own, and a well-configured system should return it that way, without editorial framing. What you do with the timing is your judgment, not the tool's.

---

## Diagnosis

**6. All psychiatric diagnoses**
> List every psychiatric diagnosis in this file: diagnosis, DSM or ICD code if stated, date first recorded, provider, provider credentials, and page.

**7. Documented diagnostic criteria**
> For each psychiatric diagnosis, state what the record documents in support of it: specific criteria assessed, structured interview, standardised instrument, or self-report alone. State explicitly where no criteria are documented.

**8. Diagnoses by non-psychiatrists**
> List psychiatric diagnoses recorded by a family physician, nurse practitioner, therapist, counsellor, or other non-psychiatrist, and state whether a psychiatrist ever confirmed each one.

**9. Symptom onset relative to the event**
> For each psychiatric symptom documented, give the date first recorded and state whether it precedes or follows the index event, with the latency in days.

Prompts 7 and 8 do the heaviest lifting in a psychiatric IME. A diagnosis entered in a family practice chart and a diagnosis established through structured assessment carry different evidentiary weight, but they look identical in a record dump. Separating them is most of the diagnostic analysis.

Instruct the system to always state the recorder's credentials. Without that, the distinction collapses.

---

## Treatment

**10. All psychotropic medications**
> List every psychotropic medication: name, dose, start date, stop date, prescriber, documented indication, documented response, and reason for any change.

**11. All psychotherapy**
> List every course of psychotherapy or counselling: modality, provider, credentials, start and end date, sessions attended, sessions missed or cancelled, and documented outcome.

**12. Medication adherence**
> List every documented instance of medication non-adherence, self-discontinuation, dose alteration, or failure to fill, with date and page.

**13. Substance use treatment**
> List any substance use treatment, detoxification, rehabilitation, or addiction counselling documented in this file, with dates, provider, and outcome.

Sessions *attended* versus sessions *missed or cancelled* is a deliberate distinction. A twenty-session course of therapy with eleven no-shows is a different treatment history than twenty sessions completed, and the file will report both as "twenty sessions" unless you ask for the breakdown.

---

## Psychometrics and testing

**14. All psychometric testing**
> List every standardised psychological or psychometric instrument administered: instrument name, date, administrator and credentials, scores as reported, and page.

**15. Symptom validity testing**
> List any symptom validity, performance validity, or effort measure in this file, with instrument, date, administrator, and result as reported.

**16. Cognitive testing**
> List any cognitive screening or neuropsychological testing, with instrument, date, administrator, domain scores as reported, and page.

Note the repeated phrase: **scores as reported**. The tool's job is to find the number and the page. It should not interpret a score, convert it, place it in a normative band, or comment on its meaning. Score interpretation is the examiner's work, and any system that volunteers it is doing something you'll have to undo.

---

## Credibility and consistency

**17. Documented symptom magnification**
> Identify every note documenting symptom magnification, exaggeration, over-endorsement, or inconsistent presentation, with provider, date, and page.

**18. Mental status inconsistencies**
> Compare documented mental status findings across providers and dates and identify material inconsistencies in mood, affect, cognition, insight, or behaviour.

**19. Reported vs observed psychiatric function**
> Compare reported psychiatric limitation against documented activity elsewhere in the file — employment, education, travel, social activity, caregiving, or recreation.

The wording matters here, and it's the same principle as prompt 5. Prompt 17 asks for notes *documenting* magnification — an observation a treating provider recorded, with their name against it. It does not ask the tool to assess credibility. That distinction is what keeps the output usable when the report is challenged.

When two documents say different things about the same fact, the right output is both, as separate rows with document, date, provider, statement, and page — and no commentary about which is correct. Conflicts are for the examiner to resolve.

---

## Function and work capacity

**20. Cognitive complaints and objective testing**
> List all documented cognitive complaints — concentration, memory, processing — and state for each whether any objective testing was performed and what it showed.

**21. Social and occupational functioning over time**
> Trace documented social and occupational functioning chronologically from before the index event to the most recent record.

**22. Psychiatric work restrictions**
> List every work restriction, accommodation, or off-work certificate issued on psychiatric grounds, with provider, date, restriction, and duration.

Prompt 21 should return a timeline, not a paragraph. Chronological, each entry carrying date, event, source, and page — with gaps flagged explicitly rather than left implicit. A twelve-month absence of records between the index event and the first psychiatric contact is a finding, and it should appear as one.

---

## Risk and acuity

**23. Suicidal and homicidal ideation**
> List every documented instance of suicidal ideation, self-harm, or homicidal ideation, with date, provider, what was documented, and any action taken. Report factually without interpretation.

**24. Hospitalisations and crisis contacts**
> List every psychiatric hospitalisation, emergency department visit, crisis line contact, or involuntary admission, with dates, facility, and documented reason.

**25. Psychosocial stressors**
> List all documented psychosocial stressors — financial, legal, relationship, housing, bereavement, or occupational — with date first documented and page.

Risk content demands the flattest possible reporting: date, provider, what was documented, what was done. No alarm language, no interpretation, no summarising several entries into a characterisation. Use the terms the record uses, and don't substitute a diagnostic label the record doesn't contain.

---

## Before you paste any of these into a general-purpose chatbot

Two limits are worth knowing in advance.

**Context.** A psychiatric IME file of eight hundred to two thousand pages will not fit in a chat window. Uploading a portion and prompting against it produces answers that are accurate about the fraction supplied and silent about everything else — which is worse than no answer, because it looks complete.

**Page numbers.** The citations are the point. A general chatbot working from pasted text has no page anchor, so `[p.412]` either doesn't appear or appears invented. If you can't click a citation and land on the page, the output can't go anywhere near your report.

These prompts assume retrieval across the full file with page-level anchoring underneath. That's the setup they were written for.

---

## Using this as a checklist

Run the twenty-five in order and you have a structured pre-examination picture: who diagnosed what and on what basis, what was tried and whether it was taken, what was tested and what it showed, where the record contradicts itself, and where the gaps are.

None of that is the opinion. The opinion is yours. But it means you walk into the examination knowing what the record already says — instead of discovering it afterward, at the point where changing your mind is expensive.

---

*OctopusLM turns unstructured medical files into page-cited, review-ready output for independent medical examiners. Every fact links back to the source page.*
