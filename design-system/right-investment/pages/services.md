# Services Page Overrides

> **PROJECT:** Right Investment
> **Generated:** 2026-11-21 23:45:50 (Refined for 4 Advisory Pillars + Accessible SIP Goal Illustrator)
> **Page Type:** Advisory Services & Educational Tools (`/[locale]/services`)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/right-investment/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** `1200px` (`max-w-[1200px]`), reading measure `65ch`–`75ch` inside service prose blocks.
- **Sticky Sub-Navigation (Section Jump Bar):** Horizontal pill/anchor bar directly below the main header on tablet/desktop (`flex-wrap gap-2`, never fixed-height clipping for longer Marathi labels) linking to the 4 service pillars:
  1. `#mutual-funds` — Mutual Funds & SIP
  2. `#financial-planning` — Financial Planning
  3. `#insurance` — Insurance
  4. `#tax-portfolio` — Tax Saving & Portfolio Review
- **Anchor Scroll Offset:** Each `#section` sets `scroll-margin-top: calc(var(--header-height, 76px) + 64px)` so sticky header + jump bar never obscure headings or focus targets (WCAG 2.2 AA `focus-not-obscured`).

### Spacing Overrides

- Alternating section backgrounds (`--color-card` `#FFFFFF` and `--color-background` `#F8FAFC`) separated by `1px solid var(--color-border)` with `64px` (`--space-3xl`) vertical section padding on desktop (`48px` on mobile).

### Typography Overrides

- Pillar titles use `h2` (`clamp(1.5rem, 2.5vw, 2rem)`); numeric examples (`₹5,000/month`, `80C`, tenure years) apply `.numeric-tabular` (`font-variant-numeric: tabular-nums`).

### Color Overrides

- **Pillar Icon Badges:** Use `--color-primary-soft` (`#EEF3FF`) with `--color-primary` (`#0B2E8A`) icons for Financial Planning & Tax/Portfolio, and `--color-growth-soft` (`#EBF7E9`) with `--color-growth-text` (`#256F1C`) icons for Mutual Funds & SIP / Insurance protection indicators.
- **Chart Series Colors:** Invested Principal (`#0B2E8A` solid line/bar) vs. Illustrative Wealth Value (`#38982B` dashed/textured series with direct value labels so color is never the sole differentiator).

### Component Overrides

- **Service Pillar Section Card:** Displays Who It's For, What's Included (3–4 concise bullet deliverables), Typical Horizon / Review Cadence, and a direct pre-filled CTA link (`/consultation?topic=<slug>`) so visitors jump straight into booking with context pre-selected.

---

## Page-Specific Components

1. **4-Pillar Jump Anchor Bar:** Wrap-safe (`flex-wrap gap-2`, `min-h-[44px]`), keyboard-navigable anchor links with clear active state.
2. **Educational SIP & Goal Compounding Illustrator (`#sip-illustrator`):**
   - Inputs: Monthly SIP (`₹`), Expected Annual Illustrative Rate (`%` — clearly labeled *Illustrative only, not guaranteed*), Horizon (Years).
   - Output: Accessible **Recharts** SVG area/bar comparison chart paired with an accessible **toggleable HTML Data Table** ("Show Year-by-Year Table" / "वर्षनिहाय तक्ता पहा") and screen-reader summary (`aria-live="polite"` polite summary on user update, never stealing focus).
   - Formatting: `Intl.NumberFormat('en-IN')` Indian Rupee (`₹`) Lakh/Crore notation.
   - Mandatory adjacent disclaimer in `--color-muted-foreground` (`#475569`): *"Illustrative mathematical projection only; not an assurance of returns. Mutual Fund investments are subject to market risks."* + Marathi equivalent.
3. **Consultation Pre-Fill CTA Strip:** Persistent conversion strip at the base of the services page linking to `/[locale]/consultation`.

---

## Recommendations

- Keep service jargon accessible in both English and Marathi: translate concepts naturally (`Systematic Investment Plan (SIP)` / `सिस्टेमॅटिक इन्व्हेस्टमेंट प्लॅन (SIP)`, `Term Life Insurance` / `टर्म लाइफ इन्शुरन्स (मुदत विमा)`), pairing familiar English acronyms where Marathi retail investors expect them.
- Avoid crowding mobile cards with multi-column tables; default mobile view of the SIP illustrator shows summary figures + chart with expandable yearly table.
