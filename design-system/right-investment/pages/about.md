# About Page Overrides

> **PROJECT:** Right Investment
> **Generated:** 2026-11-21 23:45:50 (Refined for Adviser Authority, Credentials & Regulatory Transparency)
> **Page Type:** Adviser Profile & Credentials (`/[locale]/about`)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/right-investment/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** `1200px` (`max-w-[1200px]`)
- **Adviser Bio Grid:** Asymmetric 12-column Swiss split on desktop (`lg:grid-cols-12`, 5 columns official portrait + credentials card / 7 columns advisory story, philosophy & qualifications); cleanly stacked single-column at `375px` and `768px` (portrait + name/title first).

### Spacing Overrides

- No overrides — use Master spacing (`--space-3xl` between bands, `--space-lg` inside cards).

### Typography Overrides

- **Editorial Measure:** Restrict narrative biography paragraphs to `max-w-prose` (`65ch`) for comfortable long-form English and Marathi reading (`line-height: 1.75` in Marathi).

### Color Overrides

- **Credentials & Regulatory Verification Panel:** Uses `--color-primary-soft` (`#EEF3FF`) header strip or `--color-card` (`#FFFFFF`) with a `3px` left accent border in `--color-primary` (`#0B2E8A`) and verified checkmark badges in `--color-growth-text` (`#256F1C`).
- **Testimonial Quotes:** Background `--color-background` (`#F8FAFC`) or `--color-card` (`#FFFFFF`) with `--color-muted-foreground` (`#475569`) attribution text. Never use italicized Devanagari for long Marathi quotes (reduces Devanagari legibility; use clean regular weight with typographic quotation marks).

### Component Overrides

- **Portrait Image Container:** Must reserve explicit dimensions (`aspect-[4/5]`, `width`/`height` set, `object-cover object-top`) with a crisp `1px solid var(--color-border)` frame and zero Cumulative Layout Shift (`CLS < 0.01`).

---

## Page-Specific Components

1. **Sachin Jagtap Regulatory & Credentials Summary Card:**
   - Displays Registration Type & ID placeholder (`AMFI ARN / EUIN` and/or `SEBI RIA` and/or `IRDAI License` — pending user confirmation), Years of Experience, Languages Spoken (`English`, `मराठी`, `हिंदी`), and Service Coverage Area.
2. **3-Step Transparent Advisory Process Grid:**
   - Step 1: Discovery & Financial Health Check -> Step 2: Goal-Based Strategy & Asset Allocation -> Step 3: Ongoing Execution & Periodic Portfolio Review.
3. **Verified Client Testimonials Block:**
   - Default to a **static 3-card Swiss grid** (zero auto-rotation distraction, always readable for crawlers and reduced-motion users).
   - If a carousel is used later for >3 testimonials: must include keyboard-accessible Previous/Next buttons, Pause/Play toggle, stop rotation on hover/focus/`prefers-reduced-motion`, and `aria-live="polite"` slide announcement.

---

## Recommendations

- Only publish factual credentials, client counts, or AUM figures explicitly confirmed by Sachin Jagtap; never ship placeholder statistics as live claims.
- Keep the final section on `/about` focused on a calm, non-pushy invitation to book a 30-minute introductory review (`/consultation`).
