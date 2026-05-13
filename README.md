# Connected Care — Linus Health Prototype

A UI/UX prototype for the Connected Care platform, which connects payers, clinical sites, and life sciences partners to convert claims-based cognitive risk signals into clinical assessments and research referrals.

**This is a frontend-only prototype with mock data. No backend, no real integrations.**

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## What this demonstrates

Connected Care v1 is built around a single critical insight: **the clinical site is the bottleneck**. Payers can identify at-risk members from claims data, but they can't diagnose. Life sciences partners need qualified referrals, but they can't generate them. Both are downstream of whether a clinical site can screen patients efficiently, produce a clinician-trusted report, and generate a billable encounter.

This prototype shows the end-to-end workflow across all four stakeholder groups.

---

## Stakeholder views

Use the role switcher in the top bar to move between views.

### Care Coordinator
**Route:** `/coordinator/worklist`

The operational home screen. Shows a prioritized patient worklist derived from payer-identified risk signals. Each row displays outreach status, consent status, and assessment progress with a context-aware action button:

| Patient state | Action button |
|---|---|
| Not contacted or outreach attempted | View outreach |
| Reached but consent not obtained | Start consent |
| Consent obtained, assessment not started | Begin assessment |
| Assessment in progress | View assessment |
| Assessment complete | View report |
| Outreach or consent declined | Declined (disabled) |

**Sorting:** Click any column header — Risk, Outreach, Care Consent, Research Consent, or Assessment — to sort ascending; click again to reverse. Ties fall back to the default priority sort (risk tier → pending action → outreach → consent → assessment).

**Filtering:** Filter buttons above the table narrow the list to a single risk tier.

From a patient's outreach page, coordinators can log outreach attempts and preview site-branded message templates. All outreach language uses the clinical site's name — never Linus Health or the payer.

### Clinician
**Routes:** `/clinician` → `/clinician/report/:patientId`

The clinician home lists all patients at the active site with completed assessments, grouped into "Awaiting review" and "Previously reviewed."

The report screen mirrors the Linus DCR dashboard style:
- **Overall DCR score** — large numeric display on a 1–5 scale with a red-to-green gradient scale
- **Subscores** — Immediate Recall (0–3), Clock Drawing (0–100 with SVG arc visualization), Delayed Recall (0–3)
- **Domain profile** — five cognitive domains shown as colored band bars (Memory Recall, Processing Speed, Executive Function, Language & Naming, Attention & Concentration)
- **Confidence indicator** — High/Medium/Low based on assessment completeness
- **Routing panel** — two explicit buttons the clinician must click to document their decision

The research opt-in card is **hidden** until the clinician actively clicks "Recommend Clinical Follow-Up." It cannot appear before that action — research routing is always clinician-initiated, never automatic.

No raw numeric scores appear in the domain or band sections.

### Payer
**Route:** `/payer/dashboard`

Aggregate, de-identified funnel metrics only. No individual patient data is accessible. Shows:
- Summary stats (identified → contacted → assessed → research referred)
- Visual funnel chart (CSS-only, no chart library)
- Per-site breakdown table
- Demographic strata by age group and gender (equity monitoring)

A site selector lets the payer filter to a single site or view all sites combined.

### Life Sciences
**Routes:** `/lifesciences/referrals` → `/lifesciences/referrals/:id`

Shows only patients who have provided explicit, separate research consent. Each referral packet includes patient contact info, a plain-language assessment summary, the cognitive domain profile, consent dates, and a study ID. A banner on every page confirms that no patient appears here without an affirmative clinician-initiated opt-in and patient confirmation.

### Patient
**Route:** `/patient/summary/:patientId`

A plain-language results summary, site-branded. No clinical terminology — score bands are translated into plain English (e.g., "Your thinking and memory scores were in line with what we expect for someone your age"). Research information appears only if the patient has consented to research contact.

---

## Workflow walkthrough

The recommended demo path walks the complete end-to-end flow:

1. **Care Coordinator** → worklist → find a high-risk patient who hasn't been reached (e.g., Eleanor Walsh) → "View outreach" to log a contact attempt
2. Switch to a patient who has been reached but not consented → "Start consent"
3. Walk through the **3-step care consent** (Gate 1) — note the research disclaimer on step 1
4. See the **Assessment** view — simulated module completion
5. **Clinician** → select a completed patient (e.g., Margaret Chen) → view DCR score, subscores, domain grid, confidence indicator
6. Click **"Recommend Clinical Follow-Up"** → watch the research card appear below
7. Click through **Research consent** (Gate 2) — purple header, explicitly distinct from care consent
8. **Life Sciences** → see the referral packet with consent verification
9. **Payer** → aggregate funnel and demographic strata, no individual data

---

## Key design constraints enforced in code

| Constraint | How it's enforced |
|---|---|
| No raw numeric scores in clinical bands | `ScoreBand` is a string enum; domain cards accept only `band: ScoreBand`, no numeric field |
| Two-gate consent separation | Separate routes, separate page components, separate context fields (`careConsentStatus` / `researchStatus`) |
| Research only surfaces after clinician action | Research opt-in renders only when `routingDecision === 'follow_up_suggested'` |
| No automated routing | Every workflow state change requires an explicit button click |
| Site-branded outreach | Templates use `{{site_name}}` tokens; patient-facing pages pull from `ClinicalSite` data, never Linus or payer name |
| No PHI to life sciences pre-consent | Referral list filters to `researchStatus === 'consented'` patients only |

---

## Project structure

```
src/
├── types/index.ts          # All shared TypeScript types
├── context/RoleContext.tsx # Active role, demo patient, mutable patient state
├── data/
│   ├── patients.ts         # 34 mock patients across all workflow states and sites
│   ├── assessments.ts      # Assessment results (DCR scores + domain bands) for 12 patients
│   ├── sites.ts            # 3 clinical sites with branding colors
│   ├── outreach.ts         # Outreach attempt history and site-branded templates
│   ├── funnel.ts           # Payer aggregate metrics with demographic strata
│   └── referrals.ts        # Research referral packets for consented patients
├── components/
│   ├── layout/             # TopNav (role switcher + site branding bar), PageShell
│   └── shared/             # Badge, ScoreBandDisplay, ConsentGate, ConfidenceIndicator
└── pages/
    ├── coordinator/        # WorklistPage, PatientOutreachPage
    ├── consent/            # CareConsentPage (Gate 1), ResearchConsentPage (Gate 2)
    ├── assessment/         # AssessmentPage (simulated)
    ├── clinician/          # ClinicianWorklistPage, ClinicalReportPage
    ├── payer/              # PayerDashboardPage
    ├── lifesciences/       # ReferralListPage, ReferralDetailPage
    └── patient/            # PatientSummaryPage
```

---

## Mock data

**34 patients** (P001–P034) cover all workflow state combinations across three clinical sites. Each site has a full worklist with patients at every stage — uncontacted, outreach attempted, reached, consented, mid-assessment, complete (reviewed and unreviewed), declined, and withdrawn.

**P001 (Margaret Chen, Riverside Neurology)** is the default demo patient — fully complete with research consent and a referral packet. Good starting point for the clinician report and life sciences views.

**Notable patients for demo scenarios:**

| Patient | Site | Scenario |
|---|---|---|
| P001 Margaret Chen | Riverside | Complete, below expected, research consented — full journey |
| P003 Dolores Vega | Riverside | High risk, 3 outreach attempts, no response yet |
| P030 Martin Goldberg | Riverside | Complete, below expected, awaiting clinician review |
| P033 Louise Ferreira | Riverside | Complete, mildly below, follow-up recommended, research declined |
| P017 Patricia Okafor | Oakwood | Complete, mildly below expected, research offered but pending |
| P022 Leonard Shaw | Valley | Complete, below expected, research consented |
| P025 Dorothy Flynn | Valley | High risk, reached, care consent withdrawn |

**Assessment results** exist for 12 patients with realistic DCR scores and domain band profiles.

**Research referral packets** exist for 3 consented patients (P001, P015, P022) across two sites.

**3 clinical sites:**
- Riverside Neurology Associates (blue header) — 17 patients
- Oakwood Primary Care Group (teal header) — 8 patients
- Valley Geriatrics Center (violet header) — 9 patients

---

## Tech stack

- React 18 + TypeScript
- Vite
- React Router v6
- Tailwind CSS v3
- No backend, no external state management, no chart libraries
