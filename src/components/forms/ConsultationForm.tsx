'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle,
  CircleNotch,
  WarningCircle,
  WhatsappLogo,
} from '@phosphor-icons/react';
import { Controller, useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import type { AppLocale } from '@/i18n/routing';
import {
  getWhatsAppHref,
  normalizeTopic,
  SERVICE_TOPICS,
  type ServiceTopic,
} from '@/lib/compliance';
import { formatINR } from '@/lib/formatters';
import {
  CALLBACK_SLOTS,
  consultationSchema,
  type ConsultationFormValues,
} from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Field, FieldError, FieldHint, FieldLabel } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { submitConsultation } from './actions';

const DRAFT_STORAGE_KEY = 'right-investment-consultation-draft-v1';

type FieldAnchorMap = {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  consent: string;
};

const FIELD_ELEMENT_IDS: FieldAnchorMap = {
  fullName: 'field-fullName',
  phone: 'field-phone',
  email: 'field-email',
  notes: 'field-notes',
  consent: 'field-consent',
};

export function ConsultationForm() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations('consultationPage.form');
  const searchParams = useSearchParams();

  const urlTopic = searchParams.get('topic');
  const urlSip = searchParams.get('sip');
  const urlYears = searchParams.get('years');
  const urlNote = searchParams.get('note');

  const initialTopic = normalizeTopic(urlTopic);
  const prefilledNote = React.useMemo(() => {
    if (urlNote && urlNote.trim().length > 0) {
      return urlNote.trim().slice(0, 800);
    }
    if (!urlSip) return '';
    const sipNum = Number(urlSip);
    const yrNum = Number(urlYears);
    if (!Number.isFinite(sipNum) || sipNum <= 0) return '';
    if (locale === 'mr') {
      return Number.isFinite(yrNum) && yrNum > 0
        ? `दरमहा ${formatINR(sipNum)} ची SIP आणि ${yrNum} वर्षांच्या उद्दिष्टाबद्दल चर्चा करायची आहे.`
        : `दरमहा ${formatINR(sipNum)} च्या SIP बद्दल चर्चा करायची आहे.`;
    }
    return Number.isFinite(yrNum) && yrNum > 0
      ? `Interested in discussing a monthly SIP of ${formatINR(sipNum)} over ${yrNum} years.`
      : `Interested in discussing a monthly SIP of ${formatINR(sipNum)}.`;
  }, [locale, urlNote, urlSip, urlYears]);

  const [submitState, setSubmitState] = React.useState<{
    status: 'idle' | 'success' | 'serverError' | 'rateLimited';
    referenceId?: string;
    mode?: 'email-sent' | 'demo-ready' | 'accepted';
    submittedName?: string;
    submittedTopic?: ServiceTopic;
    submittedSlot?: string;
  }>({ status: 'idle' });

  const [showErrorSummary, setShowErrorSummary] = React.useState(false);
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<ConsultationFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      topic: initialTopic,
      preferredLanguage: locale,
      callbackSlot: 'morning',
      notes: prefilledNote,
      consent: false,
      website: '',
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Restore saved draft across EN <-> MR language switch
  React.useEffect(() => {
    try {
      const savedRaw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw) as Partial<ConsultationFormValues>;
        if (parsed.fullName) setValue('fullName', parsed.fullName);
        if (parsed.phone) setValue('phone', parsed.phone);
        if (parsed.email) setValue('email', parsed.email);
        if (urlTopic) {
          setValue('topic', initialTopic);
        } else if (parsed.topic) {
          setValue('topic', normalizeTopic(parsed.topic));
        }
        if (parsed.preferredLanguage === 'en' || parsed.preferredLanguage === 'mr') {
          setValue('preferredLanguage', parsed.preferredLanguage);
        }
        if (
          parsed.callbackSlot &&
          (CALLBACK_SLOTS as readonly string[]).includes(parsed.callbackSlot)
        ) {
          setValue('callbackSlot', parsed.callbackSlot);
        }
        if (parsed.notes && !prefilledNote) {
          setValue('notes', parsed.notes);
        }
        if (typeof parsed.consent === 'boolean') {
          setValue('consent', parsed.consent);
        }
      }
    } catch {
      // Ignore storage access errors in restricted contexts
    }
  }, [initialTopic, prefilledNote, setValue, urlTopic]);

  // Persist draft live
  React.useEffect(() => {
    const subscription = watch((values) => {
      try {
        window.sessionStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            fullName: values.fullName ?? '',
            phone: values.phone ?? '',
            email: values.email ?? '',
            topic: values.topic ?? 'general',
            preferredLanguage: values.preferredLanguage ?? locale,
            callbackSlot: values.callbackSlot ?? 'morning',
            notes: values.notes ?? '',
            consent: Boolean(values.consent),
          }),
        );
      } catch {
        // Ignore storage write errors
      }
    });
    return () => subscription.unsubscribe();
  }, [locale, watch]);

  const translateError = (code?: string): string | undefined => {
    if (!code) return undefined;
    const knownKeys = [
      'nameRequired',
      'nameTooShort',
      'nameTooLong',
      'phoneRequired',
      'phoneInvalid',
      'emailInvalid',
      'notesTooLong',
      'consentRequired',
    ] as const;
    if ((knownKeys as readonly string[]).includes(code)) {
      return t(`errors.${code as (typeof knownKeys)[number]}`);
    }
    return t('errors.serverError');
  };

  const errorEntries = (
    ['fullName', 'phone', 'email', 'notes', 'consent'] as const
  )
    .map((key) => ({
      key,
      id: FIELD_ELEMENT_IDS[key],
      message: translateError(errors[key]?.message),
    }))
    .filter((item): item is { key: keyof FieldAnchorMap; id: string; message: string } =>
      Boolean(item.message),
    );

  const onInvalid = () => {
    setShowErrorSummary(true);
    requestAnimationFrame(() => {
      errorSummaryRef.current?.focus();
    });
  };

  const onSubmit = async (values: ConsultationFormValues) => {
    setShowErrorSummary(false);
    const result = await submitConsultation(values);

    if (!result.ok) {
      setSubmitState({
        status: result.errorCode === 'rateLimited' ? 'rateLimited' : 'serverError',
      });
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
      return;
    }

    try {
      window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore
    }

    setSubmitState({
      status: 'success',
      referenceId: result.referenceId,
      mode: result.mode,
      submittedName: values.fullName,
      submittedTopic: values.topic,
      submittedSlot: values.callbackSlot,
    });
  };

  if (submitState.status === 'success') {
    const topicLabel = t(
      `topics.${submitState.submittedTopic ?? 'general'}`,
    );
    const slotLabel = t(
      `slots.${(submitState.submittedSlot as (typeof CALLBACK_SLOTS)[number]) ?? 'morning'}`,
    );

    return (
      <Card
        role="status"
        aria-live="polite"
        className="animate-subtle-enter border-[var(--color-growth-text)]/30 bg-[var(--color-growth-soft)] p-6 sm:p-8"
      >
        <div className="flex items-start gap-3">
          <CheckCircle
            size={28}
            weight="fill"
            className="mt-0.5 shrink-0 text-[var(--color-growth-pill-text)]"
            aria-hidden="true"
          />
          <div className="bilingual-flow">
            <h2 className="text-xl font-bold text-[var(--color-growth-pill-text)]">
              {t('success.title')}
            </h2>
            <p className="mt-2 text-base text-[var(--color-secondary)]">
              {t('success.description', {
                name: submitState.submittedName ?? '',
                topic: topicLabel,
                slot: slotLabel,
              })}
            </p>
            {submitState.referenceId && (
              <p className="numeric-tabular mt-3 inline-block rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-[var(--color-secondary)] border border-[var(--color-border)]">
                {t('success.referenceLabel')}: {submitState.referenceId}
              </p>
            )}
            {submitState.mode === 'demo-ready' && (
              <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
                {t('success.demoNote')}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="primary" size="default">
                <a
                  href={getWhatsAppHref(locale, submitState.submittedTopic)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappLogo size={18} weight="regular" aria-hidden="true" />
                  <span>{t('success.whatsappFallback')}</span>
                </a>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="default"
                onClick={() => {
                  reset({
                    fullName: '',
                    phone: '',
                    email: '',
                    topic: initialTopic,
                    preferredLanguage: locale,
                    callbackSlot: 'morning',
                    notes: '',
                    consent: false,
                    website: '',
                  });
                  setSubmitState({ status: 'idle' });
                }}
              >
                {t('success.anotherRequest')}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8 shadow-[var(--shadow-md)]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--color-secondary)] sm:text-2xl">
          {t('cardTitle')}
        </h2>
        <p className="mt-1.5 text-sm text-[var(--color-muted-foreground)]">
          {t('cardSubtitle')}
        </p>
      </div>

      {/* Focusable Error Summary */}
      {(showErrorSummary && errorEntries.length > 0) ||
      submitState.status === 'serverError' ||
      submitState.status === 'rateLimited' ? (
        <div
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="consultation-error-summary-title"
          className="animate-subtle-enter mb-6 rounded-xl border border-[var(--color-destructive)]/35 bg-[var(--color-destructive-soft)] p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-destructive)]"
        >
          <div className="flex items-start gap-2.5">
            <WarningCircle
              size={20}
              weight="fill"
              className="mt-0.5 shrink-0 text-[var(--color-destructive)]"
              aria-hidden="true"
            />
            <div>
              <h3
                id="consultation-error-summary-title"
                className="text-sm font-bold text-[var(--color-destructive)]"
              >
                {submitState.status === 'rateLimited'
                  ? t('errors.rateLimited')
                  : submitState.status === 'serverError'
                    ? t('errors.serverError')
                    : t('errorSummaryTitle')}
              </h3>
              {errorEntries.length > 0 && (
                <ul className="mt-2 list-disc pl-4 text-sm text-[var(--color-destructive)]">
                  {errorEntries.map((entry) => (
                    <li key={entry.key}>
                      <a
                        href={`#${entry.id}`}
                        className="underline underline-offset-2 hover:no-underline"
                      >
                        {entry.message}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="flex flex-col gap-5"
      >
        {/* Honeypot anti-spam field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="field-website">Website</label>
          <input
            id="field-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>

        {/* 1. Full Name */}
        <Field>
          <FieldLabel htmlFor={FIELD_ELEMENT_IDS.fullName}>
            {t('fullNameLabel')}
          </FieldLabel>
          <Input
            id={FIELD_ELEMENT_IDS.fullName}
            autoComplete="name"
            placeholder={t('fullNamePlaceholder')}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            {...register('fullName')}
          />
          <FieldError
            id="fullName-error"
            message={translateError(errors.fullName?.message)}
          />
        </Field>

        {/* 2. Mobile / WhatsApp + 3. Optional Email */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={FIELD_ELEMENT_IDS.phone}>
              {t('phoneLabel')}
            </FieldLabel>
            <Input
              id={FIELD_ELEMENT_IDS.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t('phonePlaceholder')}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone ? 'phone-hint phone-error' : 'phone-hint'
              }
              {...register('phone')}
            />
            <FieldHint id="phone-hint">{t('phoneHelper')}</FieldHint>
            <FieldError
              id="phone-error"
              message={translateError(errors.phone?.message)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={FIELD_ELEMENT_IDS.email}>
              {t('emailLabel')}
            </FieldLabel>
            <Input
              id={FIELD_ELEMENT_IDS.email}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            <FieldError
              id="email-error"
              message={translateError(errors.email?.message)}
            />
          </Field>
        </div>

        {/* 4. Advisory Topic */}
        <Field>
          <FieldLabel htmlFor="field-topic">{t('topicLabel')}</FieldLabel>
          <Select id="field-topic" {...register('topic')}>
            {SERVICE_TOPICS.map((topicSlug) => (
              <option key={topicSlug} value={topicSlug}>
                {t(`topics.${topicSlug}`)}
              </option>
            ))}
          </Select>
        </Field>

        {/* 5. Preferred Language + Callback Window */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="field-preferredLanguage">
              {t('preferredLanguageLabel')}
            </FieldLabel>
            <Select
              id="field-preferredLanguage"
              {...register('preferredLanguage')}
            >
              <option value="en">English</option>
              <option value="mr">मराठी (Marathi)</option>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="field-callbackSlot">
              {t('callbackSlotLabel')}
            </FieldLabel>
            <Select id="field-callbackSlot" {...register('callbackSlot')}>
              {CALLBACK_SLOTS.map((slotKey) => (
                <option key={slotKey} value={slotKey}>
                  {t(`slots.${slotKey}`)}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Optional Note */}
        <Field>
          <FieldLabel htmlFor={FIELD_ELEMENT_IDS.notes}>
            {t('notesLabel')}
          </FieldLabel>
          <Textarea
            id={FIELD_ELEMENT_IDS.notes}
            placeholder={t('notesPlaceholder')}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? 'notes-error' : undefined}
            {...register('notes')}
          />
          <FieldError
            id="notes-error"
            message={translateError(errors.notes?.message)}
          />
        </Field>

        {/* DPDP Consent Checkbox */}
        <Field>
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <div className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3.5">
                <Checkbox
                  id={FIELD_ELEMENT_IDS.consent}
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={
                    errors.consent ? 'consent-error' : undefined
                  }
                  className="mt-0.5"
                />
                <label
                  htmlFor={FIELD_ELEMENT_IDS.consent}
                  className="cursor-pointer text-sm leading-relaxed text-[var(--color-foreground)]"
                >
                  {t('consentLabel')}
                </label>
              </div>
            )}
          />
          <FieldError
            id="consent-error"
            message={translateError(errors.consent?.message)}
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-1 w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <CircleNotch
                size={18}
                weight="bold"
                className="motion-safe:animate-spin"
                aria-hidden="true"
              />
              <span>{t('submittingButton')}</span>
            </>
          ) : (
            <span>{t('submitButton')}</span>
          )}
        </Button>
      </form>
    </Card>
  );
}
