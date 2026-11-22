import { z } from 'zod';
import { SERVICE_TOPICS } from './compliance';

export const CALLBACK_SLOTS = ['morning', 'afternoon', 'evening'] as const;
export type CallbackSlot = (typeof CALLBACK_SLOTS)[number];

export function normalizeIndianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export const consultationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'nameRequired')
    .min(2, 'nameTooShort')
    .max(100, 'nameTooLong'),
  phone: z
    .string()
    .trim()
    .min(1, 'phoneRequired')
    .refine((val) => {
      const normalized = normalizeIndianPhone(val);
      return /^[6-9]\d{9}$/.test(normalized);
    }, 'phoneInvalid'),
  email: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'emailInvalid',
    ),
  topic: z.enum(SERVICE_TOPICS),
  preferredLanguage: z.enum(['en', 'mr']),
  callbackSlot: z.enum(CALLBACK_SLOTS),
  notes: z.string().trim().max(1000, 'notesTooLong'),
  consent: z.boolean().refine((v) => v === true, 'consentRequired'),
  website: z.string().max(200),
});

export type ConsultationFormValues = z.infer<typeof consultationSchema>;
