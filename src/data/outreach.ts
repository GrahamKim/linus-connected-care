import { OutreachAttempt, OutreachTemplate } from '../types'

export const OUTREACH_ATTEMPTS: OutreachAttempt[] = [
  {
    id: 'OA-001',
    patientId: 'P001',
    attemptedAt: '2026-05-01',
    channel: 'phone',
    outcome: 'no_answer',
    note: 'Called main number, no answer, no voicemail.',
  },
  {
    id: 'OA-002',
    patientId: 'P001',
    attemptedAt: '2026-05-05',
    channel: 'phone',
    outcome: 'reached',
    note: 'Spoke with patient. Explained cognitive screening program. Patient agreed to schedule.',
  },
  {
    id: 'OA-003',
    patientId: 'P002',
    attemptedAt: '2026-05-04',
    channel: 'phone',
    outcome: 'reached',
    note: 'Patient receptive. Appointment scheduled for May 6.',
  },
  {
    id: 'OA-004',
    patientId: 'P003',
    attemptedAt: '2026-04-28',
    channel: 'phone',
    outcome: 'no_answer',
  },
  {
    id: 'OA-005',
    patientId: 'P003',
    attemptedAt: '2026-05-02',
    channel: 'mail',
    outcome: 'left_message',
    note: 'Sent site-branded letter per template LT-001.',
  },
  {
    id: 'OA-006',
    patientId: 'P003',
    attemptedAt: '2026-05-09',
    channel: 'phone',
    outcome: 'no_answer',
    note: 'Left voicemail.',
  },
  {
    id: 'OA-007',
    patientId: 'P006',
    attemptedAt: '2026-04-25',
    channel: 'phone',
    outcome: 'reached',
    note: 'Patient declined participation in screening program.',
  },
  {
    id: 'OA-008',
    patientId: 'P006',
    attemptedAt: '2026-05-01',
    channel: 'phone',
    outcome: 'declined',
    note: 'Patient confirmed they do not wish to be contacted again.',
  },
]

export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: 'TMP-S1-P',
    name: 'Initial Phone Call Script',
    channel: 'phone',
    siteId: 'S1',
    body: `Hello, may I speak with {{patient_first_name}}?

Hi {{patient_first_name}}, this is [your name] calling from {{site_name}}. I'm reaching out because your care team has identified you for a brief cognitive wellness screening that we're now offering to some of our patients.

The screening takes about 10 minutes and can be done here at our office during a regular visit. It's a way for your doctor to get a clearer picture of your cognitive health — things like memory, attention, and processing.

This is completely voluntary, and participating won't change any other aspect of your care. Would you be open to scheduling a time to come in?

[If yes] → Proceed to scheduling.
[If questions about research] → "This is a clinical screening for your own care. If there are any research studies that might be relevant to you, your doctor would discuss that separately — it's completely optional."`,
  },
  {
    id: 'TMP-S1-L',
    name: 'Follow-Up Letter',
    channel: 'letter',
    siteId: 'S1',
    subject: 'A note from {{site_name}} about your cognitive wellness',
    body: `Dear {{patient_first_name}},

We recently tried to reach you by phone. We're writing to let you know that {{site_name}} is offering a brief cognitive wellness screening to patients like you.

This 10-minute, in-office assessment is a simple way for your care team to check in on memory, attention, and thinking — and it can be done during a regular visit.

Participation is entirely voluntary and free of charge. If you have questions or would like to schedule, please call us at {{site_phone}}.

Sincerely,
The Care Team at {{site_name}}`,
  },
  {
    id: 'TMP-S1-PR',
    name: 'Patient Portal Message',
    channel: 'portal',
    siteId: 'S1',
    subject: "We'd like to offer you a cognitive wellness screening",
    body: `Hi {{patient_first_name}},

Your care team at {{site_name}} is reaching out about a brief cognitive wellness screening.

This is a short, validated assessment (about 10 minutes) that helps your doctor understand how your memory, attention, and thinking are doing. It can be completed during a regular office visit.

This is optional and does not affect your other care. If you're interested, reply to this message or call {{site_phone}} to schedule.`,
  },
  {
    id: 'TMP-S2-P',
    name: 'Initial Phone Call Script',
    channel: 'phone',
    siteId: 'S2',
    body: `Hello, is this {{patient_first_name}}?

Hi {{patient_first_name}}, I'm calling from {{site_name}}. We're reaching out to some patients to offer a short cognitive health check — it's about 10 minutes, done right here in the office, and your doctor reviews the results with you.

It's something your care team thinks could be helpful to have on record. There's no cost to you, and it's completely up to you whether to participate.

Can I tell you a bit more, or would you like to go ahead and schedule?`,
  },
  {
    id: 'TMP-S2-L',
    name: 'Follow-Up Letter',
    channel: 'letter',
    siteId: 'S2',
    subject: 'Cognitive wellness screening available at {{site_name}}',
    body: `Dear {{patient_first_name}},

We're writing from {{site_name}} to let you know about a brief cognitive wellness screening we're now offering.

The screening is a 10-minute assessment your care team can review with you. It covers areas like memory and attention, and your doctor uses the results as one part of understanding your overall health.

If you'd like to learn more or schedule, please call us at {{site_phone}}. Participation is voluntary.

Warm regards,
{{site_name}}`,
  },
  {
    id: 'TMP-S2-PR',
    name: 'Patient Portal Message',
    channel: 'portal',
    siteId: 'S2',
    subject: 'Cognitive screening available — message from {{site_name}}',
    body: `Hello {{patient_first_name}},

Your care team at {{site_name}} would like to offer you a brief cognitive wellness screening.

This short assessment (about 10 minutes) gives your doctor a useful snapshot of your memory and thinking. It's done in-office and your results are reviewed with you by your provider.

Interested? Call {{site_phone}} or reply to schedule.`,
  },
  {
    id: 'TMP-S3-P',
    name: 'Initial Phone Call Script',
    channel: 'phone',
    siteId: 'S3',
    body: `Hello, may I please speak with {{patient_first_name}}?

Hello, this is [your name] from {{site_name}}. We're reaching out to offer a brief cognitive wellness assessment to some of our patients — it's part of how we're helping people stay on top of their overall brain health.

The assessment takes about 10 minutes and can be completed during a regular visit. Your doctor reviews everything with you personally.

This is completely optional. Would you have any interest in scheduling?`,
  },
  {
    id: 'TMP-S3-L',
    name: 'Follow-Up Letter',
    channel: 'letter',
    siteId: 'S3',
    subject: 'Cognitive wellness screening — a note from {{site_name}}',
    body: `Dear {{patient_first_name}},

We've tried to reach you by phone regarding a brief cognitive wellness screening available through {{site_name}}.

This 10-minute, clinically validated assessment helps your care team understand your cognitive health — areas like memory, attention, and thinking. Your doctor reviews results with you during a scheduled visit.

To schedule or ask questions, please contact us at {{site_phone}}. Participation is always your choice.

With care,
The Team at {{site_name}}`,
  },
  {
    id: 'TMP-S3-PR',
    name: 'Patient Portal Message',
    channel: 'portal',
    siteId: 'S3',
    subject: 'Message from your {{site_name}} care team',
    body: `Hi {{patient_first_name}},

Your care team at {{site_name}} is offering a brief cognitive wellness assessment to select patients.

It's a 10-minute check of memory, attention, and thinking — completed in-office with your doctor reviewing the results. Entirely optional, no cost to you.

To schedule, reply here or call {{site_phone}}.`,
  },
]

export function getOutreachAttempts(patientId: string): OutreachAttempt[] {
  return OUTREACH_ATTEMPTS.filter((a) => a.patientId === patientId)
}

export function getTemplatesForSite(siteId: string): OutreachTemplate[] {
  return OUTREACH_TEMPLATES.filter((t) => t.siteId === siteId)
}
