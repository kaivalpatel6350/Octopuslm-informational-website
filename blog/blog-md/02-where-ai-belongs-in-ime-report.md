# Where AI Belongs in an IME Report — and Where It Doesn't

**Category:** Direct Counters  
**Target Audience:** IME Physicians, Medical Record Reviewers  
**Estimated Read Time:** 9 minutes

---

## The Line Nobody Wants to Draw

AI is here. It's extracting dates, summarizing records, even drafting chronologies. Some examiners are using it. Some are avoiding it. Most are somewhere in between — using it quietly, not sure what to admit, and hoping nobody asks.

Here's the problem: **nobody has drawn a clear line between where AI helps and where it creates liability.**

This post draws that line. Not based on fear. Not based on hype. Based on what's defensible under cross-examination.

---

## What AI Does Well (Use It Here)

### **1. Date Extraction and Normalization**

AI excels at:
- Pulling dates from unstructured text
- Converting "March 4, 2024" to "2024-03-04"
- Identifying date ranges in treatment notes

**Why it works:** This is pattern recognition. AI doesn't need clinical judgment. It needs consistency.

**How to use it:** Let AI extract and normalize dates. Then verify a sample (10-20%) manually. If the sample is accurate, the rest is likely fine.

### **2. Duplicate Detection**

AI can flag:
- Identical records with different formatting
- Near-duplicates (same content, different headers)
- Multiple versions of the same document

**Why it works:** AI compares content, not just filenames or headers.

**How to use it:** Use AI to flag duplicates. Then manually confirm which version is authoritative.

### **3. Gap Identification**

AI can identify:
- Missing treatment periods
- Gaps in diagnostic testing
- Lapses in follow-up

**Why it works:** AI can scan 1,000 pages faster than you can.

**How to use it:** Use AI to flag gaps. Then investigate whether they're explained (vacation, insurance authorization pending, non-compliance).

### **4. First-Draft Chronologies**

AI can build a preliminary timeline:
- Date, provider, record type, key findings
- Basic structure for you to refine

**Why it works:** AI can process large volumes quickly.

**How to use it:** Use AI for the first draft. Then manually verify every entry, add context, and refine the narrative.

---

## What AI Doesn't Do Well (Don't Use It Here)

### **1. Causation Opinions**

AI can identify correlations. It cannot determine causation.

**Example:**  
AI notes: "Plaintiff treated for cervical strain on 01/15/24. MRI on 01/20/24 shows C5-6 herniation."

AI might suggest: "Cervical strain caused the herniation."

**The problem:** That's a medical opinion requiring clinical judgment. AI doesn't know:
- Whether the herniation was pre-existing
- Whether the strain was sufficient to cause the herniation
- Alternative explanations

**The line:** AI can present facts. It cannot render opinions on causation.

### **2. Assessing Credibility**

AI can identify inconsistencies. It cannot assess whether they're meaningful.

**Example:**  
AI notes: "Plaintiff reports pain 8/10 on 02/15. Physiotherapy note same day: 'patient moving comfortably, no guarding.'"

AI might flag: "Inconsistency detected."

**The problem:** AI doesn't know:
- Whether the inconsistency is significant
- Whether it suggests symptom magnification
- Whether it's explained by context (e.g., plaintiff medicated at time of physio)

**The line:** AI can flag inconsistencies. You must interpret them.

### **3. Understanding Context**

AI doesn't understand:
- Why a gap in treatment might be explained
- Which provider is authoritative for a given issue
- Whether a finding is clinically significant

**Example:**  
AI notes: "No treatment from 02/10 to 02/28."

AI might flag: "Gap in treatment."

**The problem:** AI doesn't know the plaintiff was on vacation, or that insurance authorization was pending, or that the gap is irrelevant to the claim.

**The line:** AI can identify patterns. You must provide context.

### **4. Determining What's Missing**

AI can identify what's in the file. It cannot identify what's missing.

**Example:**  
AI reviews a 200-page file and finds no mention of:
- Pre-existing conditions
- Prior imaging
- Family history

AI might not flag this because it's looking for what's present, not what's absent.

**The problem:** You know what should be there. AI doesn't.

**The line:** AI can summarize what's present. You must identify what's missing.

---

## The Defensibility Test

Before you include AI output in your report, ask:

**"If opposing counsel asks, 'Did you use AI for this section?' can I answer honestly and defend the output?"**

### **Scenario 1: Date Normalization**

- **Question:** "Did you use AI to normalize dates?"
- **Answer:** "Yes. I used AI to extract and normalize dates from the records. I manually verified a sample of entries and confirmed accuracy."
- **Defensible?** Yes.

### **Scenario 2: Causation Opinion**

- **Question:** "Did you use AI to determine causation?"
- **Answer:** "No. AI identified temporal relationships. I applied clinical judgment to determine causation."
- **Defensible?** Yes.

### **Scenario 3: Chronology**

- **Question:** "Did you use AI to build the chronology?"
- **Answer:** "Yes. AI provided a first draft. I manually verified every entry, added context, and refined the narrative."
- **Defensible?** Yes.

### **Scenario 4: Credibility Assessment**

- **Question:** "Did you use AI to assess the plaintiff's credibility?"
- **Answer:** "No. AI flagged inconsistencies. I interpreted them based on clinical judgment and the full record."
- **Defensible?** Yes.

---

## The AI Disclosure Question

Should you disclose AI use in your report?

**The emerging standard:**

- **Disclose when AI output is directly quoted or relied upon.**
- **Don't disclose when AI is used for administrative tasks (date normalization, duplicate detection).**

**Example disclosure:**

> "AI-assisted tools were used to extract and normalize dates from the medical records. All dates were manually verified. Clinical opinions are those of the examiner."

This is transparent without being defensive.

---

## The Workflow That Works

### **Step 1: Use AI for the First Pass**

- Extract dates
- Flag duplicates
- Identify gaps
- Build preliminary chronology

### **Step 2: Manually Verify Everything**

- Check a sample of dates (10-20%)
- Confirm which version of duplicates is authoritative
- Investigate gaps
- Verify every chronology entry

### **Step 3: Add Clinical Judgment**

- Interpret inconsistencies
- Assess causation
- Identify what's missing
- Provide context

### **Step 4: Document Your Process**

- Note where AI was used
- Note what was manually verified
- Be prepared to explain under cross-examination

---

## What This Looks Like in Practice

**AI-generated chronology entry:**

| Date | Provider | Finding |
|------|----------|---------|
| 2024-01-15 | City ER | MVA, cervical strain |

**After manual refinement:**

| Date | Provider | Record Type | Finding | Citation | Context |
|------|----------|--------------|---------|----------|---------|
| 2024-01-15 | City ER | ER Report | MVA, cervical strain, no radiculopathy | p. 1-8 | Mechanism: rear-end collision at 30 mph. No loss of consciousness. |

AI provided the structure. You added the clinical context.

---

## Key Takeaways

1. **AI belongs in date extraction, duplicate detection, gap identification, and first-draft chronologies.**
2. **AI doesn't belong in causation opinions, credibility assessments, context interpretation, or determining what's missing.**
3. **Always verify AI output manually.**
4. **Disclose AI use when it's directly relied upon.**
5. **Be prepared to defend your process under cross-examination.**

---

## What's Next?

In our next post, we'll tackle **"Speed vs. Defensibility: What You Can't Rush in a Medical File Review"** — the trade-offs that matter.

---

*This post is part of our series on medical record review for IME physicians. For more, see our [60 AI Prompts for IME Physicians Reviewing Medical Records](#).*

---

**Questions for Readers:**
- Where do you draw the line on AI use in your practice?
- Have you been asked about AI use under cross-examination?
- What's your verification process for AI output?

---

*Published: [Date]*  
*Author: [Your Name]*  
*Category: Medical Record Review*  
*Tags: AI in IME, medical record review, defensibility, IME report, AI disclosure*