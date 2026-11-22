# Consultation Page Overrides

> **PROJECT:** Right Investment
> **Generated:** 2026-11-21 23:45:50 (Refined for High-Trust Low-Friction Lead Capture)
> **Page Type:** Conversion & Consultation Booking (`/[locale]/consultation`)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/right-investment/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** `1200px` (`max-w-[1200px]`)
- **Focused Conversion Grid:** Two-column desktop layout (`lg:grid-cols-12`, `gap-8`):
  - **Left 5 Columns (Trust & Guidance Column):** "What to Expect in Your 30-Minute Consultation" (3-step agenda), Sachin Jagtap direct contact options (Click-to-Call, WhatsApp quick-inquiry, optional Calendly/Cal.com slot, office hours/location), and "No-Spam / Zero-Obligation" privacy pledge.
  - **Right 7 Columns (Lead Capture Card):** Elevated `--color-card` (`#FFFFFF`) form panel with `--shadow-md` and `1px solid var(--color-border)`.
- **Distraction Reduction:** No secondary marketing carousels or unrelated outbound links inside the form region.

### Spacing Overrides

- Form field vertical stack uses `20px` gaps between `<Field>` groups so error messages and Marathi helper text never crowd adjacent inputs; adjacent action buttons maintain at least `8px` (`--space-sm`) gap.

### Typography Overrides

- Form labels: `15px`–`16px`, `font-weight: 500`, `--color-foreground` (`#0A1628`) — visible `<FieldLabel htmlFor="...">` above every control (never placeholder-only).
- Helper text & privacy consent: `14px`, `--color-muted-foreground` (`#475569`, `7.58:1` AAA on white).

### Color Overrides

- **Input Boundaries:** Strictly use `--color-border-input` (`#64748B`, `4.76:1` contrast) so inputs, selects, and consent checkboxes pass WCAG 1.4.11 non-text contrast.
- **Validation Error Summary & Field Errors:** Background `--color-destructive-soft` (`#FEF2F2`), text & icon `--color-destructive` (`#B91C1C`, `5.91:1` AA on tint).
- **Success Confirmation Panel:** Background `--color-growth-soft` (`#EBF7E9`), text & check icon `--color-growth-pill-text` (`#1F6117`, `6.84:1` AA).

### Component Overrides

- **Submit Button:** Full-width on mobile (`min-h-[48px]`), single primary action in `--color-primary` (`#0B2E8A`), shows loading spinner + disabled state + localized submitting label (`Submitting...` / `पाठवत आहे...`) during async submission.
- **Mobile Sticky Bottom CTA Rule:** Never show a sticky mobile CTA bar on `/consultation` (prevents obstructing form inputs or footer consent).

---

## Page-Specific Components

1. **Lean 5-Field Consultation Form (`ConsultationForm`):**
   - `fullName` (Text, `autocomplete="name"`, required)
   - `phone` (Tel, `inputMode="tel"`, `autocomplete="tel"`, Indian `+91` 10-digit validation, required)
   - `email` (Email, `inputMode="email"`, `autocomplete="email"`, optional or clearly marked)
   - `topic` (Select/Radio group pre-filled via `?topic=` query param: `Mutual Funds & SIP`, `Financial Planning`, `Insurance`, `Tax Saving & Portfolio Review`, `General Advisory`)
   - `preferredLanguageAndSlot` (Preferred consultation language `English` / `मराठी` + preferred callback window `Morning` / `Afternoon` / `Evening` + optional brief goal note + DPDP consent checkbox)
2. **WCAG 2.2 AA Validation & Error Summary:**
   - Validate individual fields on `blur` (never aggressively while typing on first visit).
   - On failed submit: render a focusable `<div role="alert" tabIndex={-1}>` error summary at the top of the form listing and linking (`href="#field-id"`) each invalid field, move focus to the summary, and retain inline `aria-describedby` errors under every invalid field.
3. **Bilingual Draft Preservation:**
   - Persist in-progress form values in `sessionStorage` so switching **EN ↔ मराठी** mid-form preserves user input seamlessly.

---

## Recommendations

- Include a hidden honeypot field and server-side rate limiting + Zod schema validation in the Server Action / API handler before sending notifications.
- Offer an immediate post-submit state with a reference summary, expected callback window, and direct "Message on WhatsApp" fallback link.
