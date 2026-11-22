# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/right-investment/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Right Investment (Financial Adviser: Sachin Jagtap)
**Generated:** 2026-11-21 23:45:50 (Harmonized from `ui-ux-pro-max` baseline + `public/logo.png` + bilingual EN/MR & WCAG 2.1/2.2 requirements)
**Category:** Banking/Traditional Finance
**Design Dials:** Variance 3/10 (Centered / Minimal) | Motion 3/10 (Subtle) | Density 4/10 (Standard)
**Mode Support:** Light-first institutional surface (`#F8FAFC` canvas, `#FFFFFF` elevated cards) + Deep Royal Blue (`#0B2E8A`) authority bands

---

## Discovery Attribution (`ui-ux-pro-max`)

- **Product Profile (`--domain product`):** `Banking/Traditional Finance` (`Minimalism & Swiss Style + Accessible & Ethical`)
- **Landing Pattern (`--domain landing`):** `Trust & Authority + Conversion` (`trust-authority-conversion`)
- **Visual Style (`--domain style`):** `Minimalism & Swiss Style` (`minimalism-and-swiss-style`) + `Accessible & Ethical` (`accessible-and-ethical`)
- **Typography Pairing (`--domain typography` + `--domain google-fonts`):** `Financial Trust` (`IBM Plex Sans`) paired with `IBM Plex Sans Devanagari` (fallback: `Noto Sans Devanagari`)
- **Iconography (`--domain icons`):** `Phosphor` (`@phosphor-icons/react`, outline `weight="regular"`) primary, `Heroicons` fallback
- **Motion Preset (`--domain gsap`):** `Scroll Reveal` (`Subtle`)

---

## Global Rules

### 1. Color Palette (Logo-Harmonized Semantic Tokens)

Derived by harmonizing the official **Right Investment** logo (`public/logo.png`: `#0B2E8A`, `#38982B`, `#E8A817`, `#D61F1F`, `#FFFFFF`, `#111111`) with the `ui-ux-pro-max` `Banking/Traditional Finance` palette (Trust Navy + Gold on clean neutral surfaces). Raw saturated brand hex values are split into **Brand Accent/UI** tokens versus **WCAG AA/AAA Text** tokens.

| Role | Hex | CSS Variable | Usage & Restraint |
|------|-----|--------------|-------------------|
| Primary | `#0B2E8A` | `--color-primary` | Logo Deep Royal Blue; primary CTAs, authority hero/footer band, active nav state |
| Primary Hover | `#08236B` | `--color-primary-hover` | Hover/active state for primary actions |
| On Primary | `#FFFFFF` | `--color-on-primary` | Primary text/icons over `#0B2E8A` |
| On Brand Muted | `#DCE7FF` | `--color-on-brand-muted` | Supporting text/subtitles inside `#0B2E8A` authority bands |
| Primary Soft Tint | `#EEF3FF` | `--color-primary-soft` | Subtle active tab surface, credential tag background |
| Secondary / Ink | `#0A1628` | `--color-secondary` | Deep navy ink harmonized from `#111111` & banking navy; headings and body ink |
| On Secondary | `#FFFFFF` | `--color-on-secondary` | Text on `#0A1628` dark ink surfaces |
| Accent / Growth Brand | `#38982B` | `--color-growth-brand` | Logo Vibrant Growth Green; **UI ≥3:1 & chart/progress strokes ONLY** (never body text on white) |
| Growth Text (AA) | `#256F1C` | `--color-growth-text` | Accessible green for growth labels, verified checkmarks, and white-text badges |
| Growth Soft Tint | `#EBF7E9` | `--color-growth-soft` | Soft tint background for positive goal/SIP badges (`#ECFDF3` also supported) |
| Growth Pill Text | `#1F6117` | `--color-growth-pill-text` | High-contrast green text inside `--color-growth-soft` badges |
| Accent / Gold Brand | `#E8A817` | `--color-gold-brand` | Logo Warm Gold; **fill/highlight on dark `#0B2E8A` or paired with `#0A1628` dark ink ONLY** (never text on light surfaces) |
| Gold On Brand | `#F2C249` | `--color-gold-on-brand` | High-contrast gold highlights/eyebrows on `#0B2E8A` bands |
| Gold Text (AA) | `#926207` | `--color-gold-text` | Accessible dark amber/gold text on `#FFFFFF` |
| Gold Soft Tint | `#FEF9EC` | `--color-gold-soft` | Subtle warm credential/highlight surface |
| Gold Pill Text | `#8A5C06` | `--color-gold-pill-text` | High-contrast gold text inside `--color-gold-soft` |
| Wordmark Red (Restricted) | `#D61F1F` | `--color-brand-wordmark-red` | **STRICT LOGO-ONLY TOKEN:** Confined to `public/logo.png` wordmark; NEVER use for CTAs, badges, headers, or borders |
| Background | `#F8FAFC` | `--color-background` | Primary cool-neutral page canvas |
| Foreground | `#0A1628` | `--color-foreground` | Primary body copy on `--color-background` |
| Card | `#FFFFFF` | `--color-card` | Elevated content cards, form panels, modals |
| Card Foreground | `#0A1628` | `--color-card-foreground` | Text inside elevated cards |
| Muted | `#F1F5F9` | `--color-muted` | Subtle section contrast bands and compliance footers |
| Muted Foreground | `#475569` | `--color-muted-foreground` | Secondary copy, captions, regulatory footnotes |
| Structural Border | `#E2E8F0` | `--color-border` | Hairline dividers and card boundaries (non-interactive) |
| Input Border (WCAG 1.4.11) | `#64748B` | `--color-border-input` | Default form control/checkbox/radio boundaries (meets ≥3:1 non-text contrast) |
| Destructive / Error | `#B91C1C` | `--color-destructive` | Form validation errors & critical alerts ONLY (always paired with icon + text) |
| Destructive Soft Tint | `#FEF2F2` | `--color-destructive-soft` | Focusable error summary & field error alert background |
| On Destructive | `#FFFFFF` | `--color-on-destructive` | Text over `--color-destructive` |
| Focus Ring | `#0B2E8A` | `--color-ring` | Visible `2px`–`3px` keyboard focus indicator |

#### Verified WCAG 2.1 Contrast Ratios

| Pair | Ratio | Grade | Allowed Usage |
|------|-------|-------|---------------|
| `#0A1628` on `#FFFFFF` / `#F8FAFC` | `18.13:1` / `17.33:1` | AAA | Headings, primary copy, dark CTA text |
| `#0B2E8A` on `#FFFFFF` / `#F8FAFC` | `11.85:1` / `11.33:1` | AAA | Primary CTAs (`#FFFFFF` text), brand links, headings |
| `#08236B` on `#FFFFFF` | `14.35:1` | AAA | Primary hover state |
| `#475569` on `#FFFFFF` / `#F8FAFC` | `7.58:1` / `7.24:1` | AAA | Secondary text, labels, disclaimers |
| `#DCE7FF` on `#0B2E8A` | `9.55:1` | AAA | Supporting copy in hero/footer dark bands |
| `#F2C249` on `#0B2E8A` | `7.10:1` | AAA | Gold eyebrow/accent text on Deep Royal Blue |
| `#0A1628` on `#E8A817` | `8.67:1` | AAA | High-priority highlight badge or secondary gold button with dark ink |
| `#E8A817` on `#0B2E8A` | `5.67:1` | AA | Large accent/borders on Deep Royal Blue |
| `#E8A817` on `#FFFFFF` | `2.09:1` | **FAIL** | **Forbidden** as text or icon on light surfaces |
| `#38982B` on `#FFFFFF` | `3.69:1` | AA-Large/UI | Chart lines, progress bars, ≥3:1 UI graphics only (not normal text) |
| `#256F1C` on `#FFFFFF` / `#ECFDF3` | `6.23:1` / `5.91:1` | AA | Growth text, success messages, white-text badges |
| `#1F6117` on `#EBF7E9` | `6.84:1` | AA | Positive status pills |
| `#926207` on `#FFFFFF` | `5.29:1` | AA | Accessible gold text/numbers on white |
| `#8A5C06` on `#FEF9EC` | `5.53:1` | AA | Accessible gold pill text |
| `#B91C1C` on `#FFFFFF` / `#FEF2F2` | `6.47:1` / `5.91:1` | AA | Validation error text and alert summary |
| `#64748B` on `#FFFFFF` | `4.76:1` | AA | Form control borders (replaces `#CBD5E1` `1.48:1` / `#94A3B8` `2.56:1`) |

---

### 2. Typography (Bilingual English + Marathi)

- **English (Latin) Heading & Body:** `IBM Plex Sans` (`400; 500; 600; 700`)
- **Marathi (Devanagari) Heading & Body:** `IBM Plex Sans Devanagari` (`400; 500; 600; 700`), fallback `Noto Sans Devanagari`, `system-ui`, `sans-serif`
- **Mood:** Financial, trustworthy, institutional, crisp, dual-script harmonious
- **Google Fonts URL:** `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Devanagari:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap`
- **Implementation:** Load via `next/font/google` (`IBM_Plex_Sans`, `IBM_Plex_Sans_Devanagari`, `display: 'swap'`) on `<html>` with CSS variables `--font-latin` and `--font-devanagari`.

```css
/* Bilingual Typography Stack & Marathi Shaping Rules */
:root {
  --font-sans-en: var(--font-latin), 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
  --font-sans-mr: var(--font-devanagari), var(--font-latin), 'IBM Plex Sans Devanagari', 'Noto Sans Devanagari', sans-serif;
}

html[lang="en"] body {
  font-family: var(--font-sans-en);
  line-height: 1.6;
}

html[lang="mr"] body {
  font-family: var(--font-sans-mr);
  font-feature-settings: "locl" 1; /* Authentic Marathi Devanagari glyph forms */
  line-height: 1.75;               /* Vertical breathing room for matras/velanti/ukar */
  letter-spacing: 0;               /* NEVER use negative tracking on Devanagari */
}

html[lang="mr"] h1,
html[lang="mr"] h2,
html[lang="mr"] h3,
html[lang="mr"] h4 {
  line-height: 1.32;
  letter-spacing: 0;
}

/* Tabular figures for all INR (₹) amounts, SIP values, and stats */
.numeric-tabular {
  font-variant-numeric: tabular-nums;
}

/* Balanced short headings + overflow protection for long Marathi tokens */
.heading-balance {
  text-wrap: balance;
  max-inline-size: 22ch;
}

.bilingual-flow {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}
```

---

### 3. Spacing, Layout & Sticky Offsets

*Density: 4/10 — Standard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight micro-gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, minimum gap between adjacent touch targets |
| `--space-md` | `16px` / `1rem` | Standard card/input padding, mobile container gutters |
| `--space-lg` | `24px` / `1.5rem` | Card padding, grid gaps |
| `--space-xl` | `32px` / `2rem` | Component group spacing |
| `--space-2xl` | `48px` / `3rem` | Subsection rhythm |
| `--space-3xl` | `64px` / `4rem` | Section vertical padding (`96px` on desktop hero/feature sections) |

- **Container Max Width:** `1200px` (`max-w-[1200px]`), readable prose measure capped at `65ch`–`75ch` (`max-w-prose`).
- **Header Clearance (WCAG 2.2 AA Focus Not Obscured):**
```css
html {
  scroll-padding-top: calc(var(--header-height, 76px) + 16px);
}
```

### 4. Shadow Depths (Restrained Swiss Elevation)

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(10, 22, 40, 0.05)` | Subtle card resting elevation |
| `--shadow-md` | `0 4px 10px rgba(10, 22, 40, 0.08)` | Interactive card hover, dropdowns |
| `--shadow-lg` | `0 10px 20px rgba(10, 22, 40, 0.10)` | Modals, mobile navigation drawer |
| `--shadow-xl` | `0 20px 28px rgba(10, 22, 40, 0.12)` | Featured consultation panel |

---

## Component Specs

### Buttons (Minimum 44px Touch Target + Safe Wrapping)

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 12px 24px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: background-color 200ms ease, box-shadow 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 12px 24px;
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: background-color 200ms ease, color 200ms ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--color-primary-soft);
}
```

### Cards (Elevated White on Cool Canvas; `cursor: pointer` only on interactive cards)

```css
.card {
  background: var(--color-card);
  color: var(--color-card-foreground);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  border-color: #CBD5E1;
  box-shadow: var(--shadow-md);
}
```

### Form Controls & Validation UX (WCAG 2.2 AA + 1.4.11 Contrast)

```css
.input {
  width: 100%;
  min-height: 44px;
  padding: 10px 14px;
  background: var(--color-card);
  color: var(--color-foreground);
  border: 1.5px solid var(--color-border-input); /* 4.76:1 contrast on white */
  border-radius: 8px;
  font-size: 16px; /* Prevents iOS Safari zoom on focus */
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.input:focus-visible {
  border-color: var(--color-primary);
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.input[aria-invalid="true"] {
  border-color: var(--color-destructive);
}
```

### Iconography (`@phosphor-icons/react`)

- **Family:** `@phosphor-icons/react` (`weight="regular"` consistently across surfaces; Heroicons fallback only if missing).
- **Size Tokens:** `icon-sm` (`16px`), `icon-md` (`20px` UI/buttons), `icon-lg` (`24px` cards/pillars).
- **Accessibility Semantics:**
  - Decorative icon beside visible text: `aria-hidden="true"`.
  - Meaningful standalone icon: explicit text alternative (`aria-label` or `sr-only`).
  - Interactive icon control (language toggle, menu toggle, dialog close): accessible name + `aria-expanded` / `aria-pressed` state.

---

## Style Guidelines & Page Pattern

- **Style:** Minimalism & Swiss Style + Accessible & Ethical
- **Keywords:** Clean, spacious, crisp Swiss grid, functional whitespace, high contrast, tabular precision, trustworthy
- **Pattern Name:** `Trust & Authority + Conversion`
- **Section Order:** Hero (mission/credibility + consultation CTA) > Proof (regulatory credentials, experience, client-first pillars) > Solution Overview (4 Core Services + 3-step process + interactive SIP Goal Illustrator) > Social Proof & Adviser Profile > Clear Conversion CTA Path + Compliance Footer
- **Brand Logo Rules (`public/logo.png`):**
  - Asset verified at `public/logo.png` (`640×640` `1:1` circular seal RGBA PNG with crisp white inner disc and transparent outer corners).
  - Implement a dedicated `BrandLogo` component rendering the official `1:1` circular seal at **`44px × 44px`** (mobile header) / **`52px × 52px`** (desktop header) / **`56px × 56px`** (footer) with `aspect-square shrink-0 object-contain`, `>= 12px` clear space, and zero CLS — paired horizontally beside a crisp bilingual typographic wordmark (`Right Investment` in `#0B2E8A` bold + subtitle `Sachin Jagtap` in `#475569`, or `#FFFFFF` / `#DCE7FF` inside the `#0B2E8A` footer) so brand text remains effortlessly legible at `375px` mobile and desktop.
  - Because `public/logo.png` preserves its white circular inner seal with transparent outer corners, it sits cleanly on both `#FFFFFF`/`#F8FAFC` light surfaces and the `#0B2E8A` dark footer without a rectangular white box. Never distort aspect ratio, recolor, or crop.
  - Reuse `public/logo.png` for favicon, `apple-touch-icon`, and OpenGraph brand seal.

---

## Motion (Restrained & Accessible — GSAP + Lenis Standard)

**Engines:** `gsap` + `ScrollTrigger` + `@gsap/react` (`useGSAP()`), registered once in `src/lib/gsap.ts`, paired with **`lenis`** (`SmoothScrollProvider`) synced to `gsap.ticker` for crisp desktop wheel smooth scrolling (`lerp: 0.09`, native touch physics preserved on mobile).
**Implemented Micro-Animations:**
- **Bilingual Typing Accent (`TypingText`):** `Intl.Segmenter(locale, { granularity: 'grapheme' })` cycling the 4 service pillars under Hero `<h1>` with zero broken Devanagari glyphs, hover/focus pause, `CLS = 0`, and static `sr-only` readout.
- **Top Reading Progress Hairline (`ScrollProgressBar`):** `2.5px` compositor `scaleX` bar docked to the sticky header.
- **Hero Mount Entrance (`HeroMotion`) & Per-Card Stagger (`StaggerReveal`):** `y: 10–16px`, `duration: 0.38–0.4s`, `stagger: 0.06–0.08s`, `ease: 'power2.out'`, plus desktop `01 → 02 → 03` connector reveal.
- **Animated INR Counters (`AnimatedINR`):** Interruptible GSAP numeric tween (`duration: 0.35s`, `overwrite: 'auto'`) inside the SIP Goal Illustrator with `tabular-nums`.
- **Tactile Hover & Form Feedback:** `active:scale-[0.98]` button press, `group-hover:translate-x-1` arrow nudge, `-2px` restrained card hover lift, and `220ms` form alert/confirmation fade-slide.
**Scroll Reveal** (`Subtle`, `3/10`) — Trigger: scroll (`viewport enter`) | Duration: `300-400ms` | Easing: `power1.out` / `power2.out`

```js
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from(el, {
      opacity: 0,
      y: 12,
      duration: 0.35,
      ease: 'power1.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
  return () => mm.revert();
}, { scope: containerRef });
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- ✅ Keep vertical translate subtle (`8–16px`) and animate 1–2 focal blocks per viewport max.
- ✅ Never hide SEO/crawler copy as `opacity: 0` without a progressive/no-JS visible fallback.
- ❌ No auto-scrolling logo marquees, bouncing badges, or continuous parallax.

---

## Anti-Patterns (Do NOT Use)

- ❌ **Overuse of Crimson Red (`#D61F1F`)** — Never apply to buttons, section headers, or borders (reads as financial loss or alert error); confine strictly to the official logo wordmark.
- ❌ **Playful / Crypto / Hype Aesthetic** — No neon/AI purple-pink gradients, floating glassmorphism cards, or aggressive pop-up timers.
- ❌ **Misleading Trust Signals** — No fake live market tickers, fabricated AUM/return numbers, or "guaranteed returns" claims.
- ❌ **Raw Gold (`#E8A817`) Text on Light Backgrounds** — Fails WCAG 4.5:1 (`2.09:1`); use `--color-gold-text` (`#926207`) or dark ink `#0A1628` on `#E8A817`.
- ❌ **Emojis as UI Icons** — Use `@phosphor-icons/react` SVGs exclusively.
- ❌ **Blanket Negative Letter-Spacing on Marathi** — Breaks the Devanagari *shirorekha* bar and reduces legibility.
- ❌ **Removing Focus Outlines (`outline: none`)** — Always render visible `:focus-visible` rings.
- ❌ **Hover-Only Tooltips or Truncated Marathi Labels** — Ensure keyboard/touch operability and fluid wrapping.

---

## Indian Financial-Advisory Compliance Slots

- **Regulatory Registration Slot:** Prominent ARN / EUIN (AMFI-Registered Mutual Fund Distributor) and/or SEBI RIA / IRDAI PoSP registration badges in the Hero Proof Bar, About Credentials Box, Consultation Page, and Footer — strictly matching Sachin Jagtap's confirmed legal registration.
- **Bilingual Mutual Fund Risk Disclaimer:** Rendered in English (`Mutual Fund investments are subject to market risks, read all scheme related documents carefully.`) and Marathi (`म्युच्युअल फंड गुंतवणूक ही बाजारपेठेतील जोखमीच्या अधीन आहे, योजनेशी संबंधित सर्व कागदपत्रे काळजीपूर्वक वाचा.`).
- **Grievance Redressal Links:** Direct footer/disclosure links to SEBI SCORES and SMART ODR portals, plus DPDP Act 2023 consent copy on the lead form.

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (`@phosphor-icons/react` SVG icons with proper `aria-hidden` / `aria-label` semantics)
- [ ] `public/logo.png` (`1:1` circular emblem + bilingual wordmark lockup) rendered with explicit dimensions, `object-contain`, clear space, and zero distortion
- [ ] `#D61F1F` absent from all UI controls/badges/borders outside `public/logo.png`; `#E8A817` never used as text on white
- [ ] Text contrast ≥4.5:1 normal / ≥3:1 large & UI boundaries (`#64748B` input borders) verified
- [ ] Bilingual EN + MR tested at `375px`, `768px`, `1024px`, `1440px` and 200% zoom with zero horizontal scroll or clipped buttons/labels
- [ ] `:lang(mr)` renders with `IBM Plex Sans Devanagari`, `"locl" 1`, `line-height: 1.75`, and `letter-spacing: 0`
- [ ] Visible `:focus-visible` ring on all interactive controls; sticky header `scroll-padding-top` verified
- [ ] Touch targets ≥44×44px with ≥8px spacing on mobile
- [ ] `prefers-reduced-motion` disables non-essential reveals cleanly
- [ ] Regulatory placeholders (ARN/EUIN/SEBI/IRDAI & disclaimers) visibly placed and audited
