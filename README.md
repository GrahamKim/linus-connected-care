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

The operational home screen. Shows a prioritized patient worklist derived from payer-identified risk signals, sorted by risk tier (high first) and time since last contact. Each row shows outreach status, consent status, and assessment progress, with a context-aware action button that routes to the correct next step.

From a patient's outreach page, coordinators can log outreach attempts and preview site-branded message templates. All outreach language uses the clinical site's name — never Linus Health or the payer.

### Clinician
**Route:** `/clinician/report/:patientId`

The core clinical screen. Shows a one-page assessment report with:
- **Overall band** — a large green/amber indicator ("Within expected range" or "Below expected range — clinical follow-up suggested")
- **Domain profile** — five cognitive domains shown as colored band bars (Memory Recall, Processing Speed, Executive Function, Language & Naming, Attention & Concentration)
- **Confidence indicator** — High/Medium/Low based on assessment completeness
- **Routing panel** — two explicit buttons the clinician must click to document their decision

The research opt-in card is **hidden** until the clinician actively clicks "Recommend Clinical Follow-Up." It cannot appear before that action. This enforces a core product constraint: research routing is always clinician-initiated, never automatic.

No raw numeric scores appear anywhere in the report.

### Payer
**Route:** `/payer/dashboard`

Aggregate, de-identified funnel metrics only. No individual patient data is accessible. Shows:
- Summary stats (identified → contacted → assessed → research referred)
- Visual funnel chart
- Per-site breakdown table
- Demographic strata by age group and gender (equity monitoring)

A site selector lets the payer filter to a single site or view all sites combined.

### Life Sciences
**Route:** `/lifesciences/referrals`

Shows only patients who have provided explicit, separate research consent. Each referral packet includes patient contact info, a plain-language assessment summary, the cognitive domain profile, and consent dates. A banner on every page confirms that no patient appears here without an affirmative clinician-initiated opt-in and patient confirmation.

### Patient
**Route:** `/patient/summary/:patientId`

A plain-language results summary, site-branded. No clinical terminology — score bands are translated into plain English (e.g., "Your thinking and memory scores were in line with what we expect for someone your age"). Research information appears only if the patient has consented to research contact.

---

## Workflow walkthrough

The recommended demo path walks the complete end-to-end flow:

1. **Care Coordinator** → worklist → click "Start consent" on a high-risk patient (e.g., Dolores Vega)
2. Walk through the **3-step care consent** (Gate 1) — note the research disclaimer on step 1
3. See the **Assessment** view — simulated module completion
4. **Clinician** view → score bands, domain grid, confidence indicator for a completed patient (e.g., Margaret Chen)
5. Click **"Recommend Clinical Follow-Up"** → watch the research card appear below
6. Click through **Research consent** (Gate 2) — purple header, distinct from care consent
7. **Life Sciences** → see the referral packet with consent verification
8. **Payer** → aggregate funnel and demographic strata, no individual data

---

## Key design constraints enforced in code

| Constraint | How it's enforced |
|---|---|
| No raw numeric scores | `ScoreBand` is a string enum; no numeric fields exist in the type definitions |
| Two-gate consent separation | Separate routes, separate page components, separate context fields |
| Research only surfaces after clinician action | `ResearchOptInButton` renders only when `routingDecision === 'follow_up_suggested'` |
| No automated routing | Every workflow state change requires an explicit button click |
| Site-branded outreach | Templates use `{{site_name}}` tokens; pages pull from `ClinicalSite` data, never Linus/payer |
| No PHI to life sciences pre-consent | Referral list filters to `researchStatus === 'consented'` patients only |

---

## Project structure

```
src/
├── types/index.ts          # All shared TypeScript types
├── context/RoleContext.tsx # Active role, demo patient, patient state
├── data/
│   ├── patients.ts         # 10 mock patients across all workflow states
│   ├── assessments.ts      # Assessment results for 4 patients
│   ├── sites.ts            # 3 clinical sites with branding
│   ├── outreach.ts         # Outreach history and site-branded templates
│   ├── funnel.ts           # Payer aggregate metrics
│   └── referrals.ts        # Research referral packets
├── components/
│   ├── layout/             # TopNav (role switcher), PageShell
│   └── shared/             # Badge, ScoreBand, ConsentGate, ConfidenceIndicator
└── pages/
    ├── coordinator/        # WorklistPage, PatientOutreachPage
    ├── consent/            # CareConsentPage (Gate 1), ResearchConsentPage (Gate 2)
    ├── assessment/         # AssessmentPage (simulated)
    ├── clinician/          # ClinicalReportPage
    ├── payer/              # PayerDashboardPage
    ├── lifesciences/       # ReferralListPage, ReferralDetailPage
    └── patient/            # PatientSummaryPage
```

## Mock data

**10 patients** (P001–P010) cover all workflow state combinations — high/moderate/low risk, every outreach status, every consent state, and every assessment/routing/research status.

**P001 (Margaret Chen)** is the default demo patient — fully complete with research consent and a referral packet. Good for demonstrating the clinician report and life sciences views.

**3 clinical sites:** Riverside Neurology Associates (blue), Oakwood Primary Care Group (green), Valley Geriatrics Center (violet).

---

## Tech stack

- React 18 + TypeScript
- Vite
- React Router v6
- Tailwind CSS v3
- No backend, no external state management, no chart libraries
