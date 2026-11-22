'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { consultationSchema, normalizeIndianPhone } from '@/lib/validation';

export interface ConsultationActionResult {
  ok: boolean;
  referenceId?: string;
  mode?: 'email-sent' | 'demo-ready' | 'accepted';
  errorCode?: 'validation' | 'rateLimited' | 'serverError';
}

const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const rateBuckets = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (rateBuckets.get(key) ?? []).filter(
    (ts) => now - ts < RATE_WINDOW_MS,
  );
  if (timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    rateBuckets.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  rateBuckets.set(key, timestamps);
  return false;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function createReferenceId(): string {
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `RI-${stamp}${rand}`;
}

export async function submitConsultation(
  rawInput: unknown,
): Promise<ConsultationActionResult> {
  const parsed = consultationSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, errorCode: 'validation' };
  }

  const data = parsed.data;

  // Honeypot check: pretend success without sending email
  if (data.website && data.website.trim().length > 0) {
    return { ok: true, referenceId: 'RI-ACCEPTED', mode: 'accepted' };
  }

  const headerStore = await headers();
  const forwardedFor = headerStore.get('x-forwarded-for') ?? 'local';
  const clientIp = forwardedFor.split(',')[0]?.trim() || 'local';
  const normalizedPhone = normalizeIndianPhone(data.phone);

  if (isRateLimited(`${clientIp}:${normalizedPhone}`)) {
    return { ok: false, errorCode: 'rateLimited' };
  }

  const referenceId = createReferenceId();
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONSULTATION_TO_EMAIL;
  const fromEmail =
    process.env.CONSULTATION_FROM_EMAIL ||
    'Right Investment <onboarding@resend.dev>';

  if (resendKey && toEmail) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: data.email || undefined,
        subject: `[Right Investment] New Consultation Lead (${referenceId}) — ${data.topic}`,
        html: `
          <h2>New Consultation Request (${escapeHtml(referenceId)})</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
          <p><strong>Mobile / WhatsApp:</strong> +91 ${escapeHtml(normalizedPhone)}</p>
          <p><strong>Email:</strong> ${data.email ? escapeHtml(data.email) : 'Not provided'}</p>
          <p><strong>Topic:</strong> ${escapeHtml(data.topic)}</p>
          <p><strong>Preferred Language:</strong> ${data.preferredLanguage === 'mr' ? 'Marathi' : 'English'}</p>
          <p><strong>Preferred Callback Slot:</strong> ${escapeHtml(data.callbackSlot)}</p>
          <p><strong>Notes:</strong> ${data.notes ? escapeHtml(data.notes) : 'None'}</p>
        `,
      });
      return { ok: true, referenceId, mode: 'email-sent' };
    } catch {
      return { ok: false, errorCode: 'serverError' };
    }
  }

  console.info(
    `[Right Investment] Consultation lead captured in demo-ready mode (${referenceId}, topic=${data.topic})`,
  );
  return { ok: true, referenceId, mode: 'demo-ready' };
}
