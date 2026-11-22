import type { AppLocale } from '@/i18n/routing';

export const SERVICE_TOPICS = [
  'mutual-funds',
  'financial-planning',
  'insurance',
  'tax-portfolio',
  'general',
] as const;

export type ServiceTopic = (typeof SERVICE_TOPICS)[number];

export function normalizeTopic(value: string | null | undefined): ServiceTopic {
  if (!value) return 'general';
  return (SERVICE_TOPICS as readonly string[]).includes(value)
    ? (value as ServiceTopic)
    : 'general';
}

/**
 * Central Brand, Contact & Indian Regulatory Configuration for Right Investment.
 * Update placeholder strings below once final registration IDs & office details are ready.
 */
export const ADVISER_CONFIG = {
  brandName: 'Right Investment',
  adviserName: 'Sachin Jagtap',
  phoneDisplay: '+91 95610 01821',
  phoneHref: 'tel:+919561001821',
  whatsappNumber: '919561001821',
  // Editable contact & office placeholders
  emailPlaceholder: 'advisory@rightinvestment.in',
  officeCityEn: 'Maharashtra, India (Online & In-Person Appointments)',
  officeCityMr: 'महाराष्ट्र, भारत (ऑनलाइन व प्रत्यक्ष भेट उपलब्ध)',
  officeHoursEn: 'Mon – Sat · 10:00 AM – 7:00 PM IST',
  officeHoursMr: 'सोमवार – शनिवार · स. १०:०० ते सायं. ७:००',
  // Editable Indian Regulatory Registration Placeholders
  amfiArnPlaceholder: 'ARN-XXXXXX (To be updated)',
  euinPlaceholder: 'E-XXXXXX (To be updated)',
  irdaiLicensePlaceholder: 'IRDAI / PoSP ID (To be updated)',
  sebiRiaPlaceholder: '', // Populate only if holding an active SEBI RIA registration
  // Official Grievance & Regulatory Redressal Links
  sebiScoresUrl: 'https://scores.sebi.gov.in/',
  smartOdrUrl: 'https://smartodr.in/',
  amfiUrl: 'https://www.amfiindia.com/',
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || '',
} as const;

export function getWhatsAppHref(locale: AppLocale, topic?: ServiceTopic): string {
  const topicTextEn: Record<ServiceTopic, string> = {
    'mutual-funds': 'Mutual Funds & SIP',
    'financial-planning': 'Financial Planning',
    insurance: 'Insurance Planning',
    'tax-portfolio': 'Tax Saving & Portfolio Review',
    general: 'a financial consultation',
  };

  const topicTextMr: Record<ServiceTopic, string> = {
    'mutual-funds': 'म्युच्युअल फंड आणि SIP',
    'financial-planning': 'आर्थिक नियोजन',
    insurance: 'विमा संरक्षण',
    'tax-portfolio': 'कर बचत आणि पोर्टफोलिओ पुनरावलोकन',
    general: 'आर्थिक सल्लामसलत',
  };

  const msg =
    locale === 'mr'
      ? `नमस्कार सचिन जी, मला Right Investment कडून ${topicTextMr[topic ?? 'general']} याबद्दल सल्लामसलत हवी आहे.`
      : `Hello Sachin, I would like to schedule a consultation with Right Investment regarding ${topicTextEn[topic ?? 'general']}.`;

  return `https://wa.me/${ADVISER_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}
