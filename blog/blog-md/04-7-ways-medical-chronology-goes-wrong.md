# 7 Ways a Medical Chronology Goes Wrong (and How to Catch Them)

**Category:** Direct Counters  
**Target Audience:** IME Physicians, Legal Nurse Consultants, Medical Record Reviewers  
**Estimated Read Time:** 10 minutes

---

## The Chronology Is Your Foundation

A medical chronology isn't just a list of dates and events. It's the foundation of your entire report. Every opinion you render — on causation, on prognosis, on impairment — rests on that chronology.

If the chronology is wrong, everything built on it is wrong.

This post identifies the seven most common ways chronologies go wrong, and how to catch them before they catch you.

---

## 1. Wrong Date Format

**The problem:** One provider uses MM/DD/YYYY. Another uses DD/MM/YYYY. You assume consistency and get burned.

**Example:**
- Provider A: "03/04/2024" (March 4, 2024)
- Provider B: "04/03/2024" (March 4, 2024)
- Your chronology: "Treatment on April 3, 2024"

**How to catch it:**
- Normalize all dates to ISO 8601 (YYYY-MM-DD) before building the chronology.
- If a date is ambiguous, flag it and resolve it by context (e.g., "This note references the MVA on January 15, so 01/15/24 is January 15, not January 5").

**The fix:**
- Use AI to extract and normalize dates.
- Manually verify ambiguous dates.

---

## 2. Duplicate Records Treated as Separate Events

**The problem:** The same record appears multiple times in the file (from different sources, with different formatting). You enter it as separate events.

**Example:**
- ER report appears on page 12 (from hospital EMR).
- Same ER report appears on page 234 (from family doctor's file).
- Same ER report appears on page 312 (from insurance packet).
- Your chronology lists three ER visits.

**How to catch it:**
- Build a duplicate detection step into your workflow.
- Compare content, not just headers or dates.
- Flag duplicates explicitly in the chronology: "ER report (duplicate - see also p. 234, p. 312)."

**The fix:**
- Use AI to flag duplicates.
- Manually confirm which version is authoritative.

---

## 3. Gaps Mischaracterized as Non-Compliance

**The problem:** You see a gap in treatment. You assume the plaintiff didn't follow through.

**Example:**
- Treatment from 01/15/24 to 02/10/24.
- No treatment from 02/11/24 to 02/28/24.
- Treatment resumes 03/01/24.
- Your chronology: "Gap in treatment - non-compliance."

**The reality:** The plaintiff was on vacation. Or insurance authorization was pending. Or the plaintiff was asymptomatic.

**How to catch it:**
- Before characterizing a gap, investigate:
  - Is there an explanation in the records?
  - Is there a note from the provider?
  - Is there a letter from counsel?
- If you can't find an explanation, note that: "Gap in treatment - no explanation in records."

**The fix:**
- Don't assume. Investigate.
- If the gap is unexplained, say so. Don't characterize it as non-compliance without evidence.

---

## 4. Inconsistencies Not Flagged or Interpreted

**The problem:** You see an inconsistency between the plaintiff's self-report and objective findings. You note it but don't interpret it.

**Example:**
- Plaintiff reports pain 8/10 on 02/15/24.
- Physiotherapy note same day: "Patient moving comfortably, no guarding."
- Your chronology: "Pain 8/10. Physiotherapy: moving comfortably."

**The problem:** You've raised a question without answering it. Opposing counsel will ask: "What does this mean?"

**How to catch it:**
- Flag inconsistencies explicitly: "Inconsistency: self-reported pain 8/10 vs. objective observation of comfortable movement."
- Interpret the inconsistency: "This may suggest symptom magnification, or may be explained by medication timing."

**The fix:**
- Don't just note inconsistencies. Interpret them.
- If you're not sure what the inconsistency means, say so: "Inconsistency noted. Significance unclear without additional context."

---

## 5. Missing Records Not Identified

**The problem:** You review what's in the file. You don't ask what's missing.

**Example:**
- File includes ER report, family doctor notes, and physiotherapy notes.
- No imaging reports.
- No specialist consults.
- Your chronology doesn't note the absence.

**The problem:** You've rendered an opinion on an incomplete file. Opposing counsel will ask: "Did you request the MRI? Did you request the pain management consult?"

**How to catch it:**
- Before finalizing the chronology, compare the file against what should be there:
  - Imaging studies?
  - Specialist consults?
  - Prior records?
- If records are missing, note it: "Imaging reports not provided. Specialist consults not provided."

**The fix:**
- Build a "missing records" section into your chronology template.
- List what you expected to see but didn't.

---

## 6. Citations Wrong or Missing

**The problem:** You cite a finding to a page number. The citation is wrong. Or you don't cite at all.

**Example:**
- Your chronology: "MRI shows C5-6 herniation (p. 45)."
- The reality: The MRI report is on page 47. Page 45 is a physiotherapy note.

**The problem:** One wrong citation undermines every citation. Opposing counsel will question your entire chronology.

**How to catch it:**
- Verify every citation before finalizing the chronology.
- Use Bates numbers if available.
- If you're unsure, flag it: "Citation needs verification."

**The fix:**
- Build a citation verification step into your workflow.
- Use AI to extract citations, but verify manually.

---

## 7. Chronology Built by Provider, Not by Date

**The problem:** You build separate chronologies for each provider. You don't cross-reference by date.

**Example:**
- Family doctor chronology: 01/15, 01/20, 02/10, 03/05.
- Physiotherapy chronology: 01/22, 01/29, 02/05, 02/12, 02/19, 02/26, 03/04.
- You don't see that the plaintiff was seeing both providers simultaneously.

**The problem:** You miss overlaps, contradictions, and gaps that only appear when you view the file chronologically.

**How to catch it:**
- Build a single, unified chronology sorted by date.
- Each entry should show: date, provider, record type, finding, citation.

**The fix:**
- Don't build separate chronologies by provider.
- Build one chronology, sorted by date, with provider as a column.

---

## The Chronology Checklist

Before you finalize any chronology, run through this checklist:

| Check | Done? |
|-------|-------|
| All dates normalized to one format? | ☐ |
| Duplicates flagged? | ☐ |
| Gaps investigated and explained? | ☐ |
| Inconsistencies flagged and interpreted? | ☐ |
| Missing records identified? | ☐ |
| All citations verified? | ☐ |
| Chronology sorted by date, not by provider? | ☐ |

---

## What This Looks Like in Practice

**Before (broken chronology):**

| Date | Provider | Finding |
|------|----------|---------|
| 03/04/2024 | Dr. Smith | Follow-up |
| 04/03/2024 | ABC Physio | Treatment |
| 03/05/2024 | Dr. Smith | Follow-up |

**After (properly constructed):**

| Date | Provider | Record Type | Finding | Citation | Notes |
|------|----------|--------------|---------|----------|-------|
| 2024-03-04 | Dr. Smith | Progress Note | Follow-up, pain improved | p. 15 | |
| 2024-03-04 | ABC Physio | Treatment Note | ROM improved, pain 4/10 | p. 52 | Duplicate - see also p. 234 |
| 2024-03-05 | Dr. Smith | Progress Note | Follow-up, referred to specialist | p. 16 | |

---

## Key Takeaways

1. **Wrong date formats create confusion. Normalize to ISO 8601.**
2. **Duplicates treated as separate events inflate the record. Flag them.**
3. **Gaps mischaracterized as non-compliance create liability. Investigate.**
4. **Inconsistencies not interpreted raise questions. Answer them.**
5. **Missing records not identified undermine opinions. List them.**
6. **Wrong citations undermine credibility. Verify them.**
7. **Chronologies built by provider miss overlaps. Build by date.**

---

## What's Next?

In our next post, we'll tackle **"Handwritten Clinical Notes: What OCR Misses in Medical Records"** — the gaps in digitization and how to fill them.

---

*This post is part of our series on medical record review for IME physicians. For more, see our [60 AI Prompts for IME Physicians Reviewing Medical Records](#).*

---

**Questions for Readers:**
- What's the most common chronology error you've seen?
- How do you catch errors before they become liabilities?
- What's your verification process?

---

*Published: [Date]*  
*Author: [Your Name]*  
*Category: Medical Record Review*  
*Tags: medical chronology, record review, IME, common errors, verification*