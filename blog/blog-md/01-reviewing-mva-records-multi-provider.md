# Reviewing MVA Records: Why Multi-Provider Files Break Chronologies

**Category:** Direct Counters  
**Target Audience:** IME Physicians, Legal Nurse Consultants, Medical Record Reviewers  
**Estimated Read Time:** 8 minutes

---

## The Problem Nobody Talks About

You've received a 400-page MVA file. The plaintiff treated with their family doctor, two physiotherapy clinics, a chiropractor, a pain management specialist, and had two ER visits. Each provider kept their own records. Each used different date formats. Each had their own numbering system.

You build your chronology. You sign your report.

Then opposing counsel points out that you missed the three-week gap in treatment that coincided with a documented vacation. Or you cited the wrong provider for a critical entry. Or you attributed a finding to the wrong date because one provider used MM/DD/YYYY and another used DD/MM/YYYY.

**This isn't a carelessness problem. It's a structure problem.**

---

## Why Multi-Provider Files Break Down

### 1. **Inconsistent Date Formats**

Provider A: "03/04/2024"  
Provider B: "04/03/2024"  
Provider C: "March 4, 2024"

When you're scanning 400 pages, your brain stops checking. You assume consistency. The record doesn't reward that assumption.

### 2. **Duplicate Records with Variations**

The ER note appears in the file three times:
- Once from the hospital's EMR printout
- Once from the plaintiff's family doctor (who received the consult letter)
- Once from the insurance adjuster's packet

Each version has slightly different formatting. One has a handwritten addendum. One is missing the second page. You cite the wrong version.

### 3. **Overlapping Treatment Periods**

Physiotherapy notes say "patient attended 12 sessions from January 15 to March 20."  
Chiropractic notes say "patient treated weekly from January 10 to March 25."

Did they overlap? Did they conflict? Did the plaintiff double-book? The chronology needs to show this clearly, not bury it.

### 4. **Missing Cross-Referrals**

The family doctor refers to the pain specialist. The pain specialist sends a letter back. The letter is filed under the pain specialist's tab, not the family doctor's. When you're reading chronologically by provider, you miss the connection.

---

## How to Catch These Issues Before They Catch You

### **Step 1: Build a Provider Inventory First**

Before you read a single clinical note, create a table:

| Provider | Date Range | Record Type | Page Count | Key Gaps |
|----------|-----------|-------------|------------|----------|
| Dr. Smith (Family) | 01/15/24 - 06/20/24 | Progress notes, consult letters | 45 pages | 02/10-02/28 (vacation noted) |
| ABC Physiotherapy | 01/20/24 - 03/20/24 | Treatment notes | 32 pages | 02/15-02/22 (no shows) |
| City ER | 01/15/24 | ER report | 8 pages | N/A |

This inventory becomes your map. You'll see gaps before you start reading.

### **Step 2: Normalize All Dates to One Format**

Pick one format (ISO 8601: YYYY-MM-DD is unambiguous). Convert every date in your chronology to this format. If a record is unclear, flag it: "Date unclear: appears to be 03/04 or 04/03 - context suggests March 4."

### **Step 3: Cross-Reference by Date, Not by Provider**

Build your chronology by date, not by provider. Each entry should show:
- Date
- Provider
- Record type
- Key findings
- Page citation (Bates number or provider page)

This reveals overlaps, gaps, and contradictions.

### **Step 4: Flag Duplicates Explicitly**

When you see the same record twice, note it:
- "ER report (duplicate - see also p. 234, p. 312)"

This prevents you from citing the wrong version and shows you've done your due diligence.

### **Step 5: Document Gaps and Explain Them**

A gap isn't necessarily suspicious. But an unexplained gap is a vulnerability.

- "No treatment from 02/10 to 02/28 - plaintiff's counsel notes vacation during this period."
- "No physiotherapy from 03/01 to 03/15 - clinic notes indicate insurance authorization pending."

---

## What This Looks Like in Practice

**Before (broken chronology):**

| Date | Provider | Finding |
|------|----------|---------|
| 01/15/24 | ER | MVA, cervical strain |
| 01/20/24 | Dr. Smith | Follow-up, referred to physio |
| 01/22/24 | ABC Physio | Initial assessment |
| 02/10/24 | Dr. Smith | Follow-up |
| 03/05/24 | ABC Physio | Treatment ongoing |

**After (properly constructed):**

| Date | Provider | Record Type | Finding | Citation | Notes |
|------|----------|--------------|---------|----------|-------|
| 2024-01-15 | City ER | ER Report | MVA, cervical strain, no radiculopathy | p. 1-8 | Duplicate at p. 234, 312 |
| 2024-01-20 | Dr. Smith | Progress Note | Follow-up, referred to ABC Physio | p. 12 | |
| 2024-01-22 | ABC Physio | Initial Assessment | Cervical ROM limited, pain 6/10 | p. 45 | |
| 2024-02-10 | Dr. Smith | Progress Note | Follow-up, pain improved | p. 15 | |
| 2024-02-11 to 2024-02-28 | — | — | No treatment documented | — | Plaintiff on vacation (counsel letter, p. 400) |
| 2024-03-05 | ABC Physio | Treatment Note | ROM improved, pain 4/10 | p. 52 | |

---

## The AI Question Everyone Asks

"Can't AI just do this for me?"

AI can help. But AI can also make this worse if you're not careful.

**What AI does well:**
- Extracting dates and normalizing formats
- Identifying duplicate records
- Flagging gaps in treatment

**What AI doesn't do well:**
- Understanding context (is a gap suspicious or explained?)
- Cross-referencing across providers
- Knowing which version of a duplicate is authoritative

**The right approach:**
Use AI to build the first draft. Then verify every entry. Then add the context AI missed.

---

## Key Takeaways

1. **Multi-provider files break chronologies because of structure, not carelessness.**
2. **Build a provider inventory before you read a single note.**
3. **Normalize all dates to one unambiguous format.**
4. **Cross-reference by date, not by provider.**
5. **Flag duplicates explicitly.**
6. **Document gaps and explain them.**
7. **Use AI for the first draft, but verify everything.**

---

## What's Next?

In our next post, we'll tackle **"Where AI Belongs in an IME Report — and Where It Doesn't"** — the line between efficiency and defensibility.

---

*This post is part of our series on medical record review for IME physicians and legal nurse consultants. For more, see our [60 AI Prompts for IME Physicians Reviewing Medical Records](60-ai-prompts-ime-physicians.html).*

---

**Questions for Readers:**
- What's the most common chronology error you've seen in multi-provider files?
- How do you handle date format inconsistencies in your practice?
- What's your process for flagging duplicates?

---

*Published: [Date]*  
*Author: [Your Name]*  
*Category: Medical Record Review*  
*Tags: MVA records, medical chronology, IME, multi-provider files, record review*