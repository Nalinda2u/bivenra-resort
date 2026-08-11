# Bivenra Resort — one-page website

A static, one-page site for Bivenra Resort, Haragama, Kandy. Plain HTML, CSS and
vanilla JavaScript — no build step, no dependencies, no external requests.

Open `index.html` in a browser, or serve the folder with any static server.

---

## Structure

```
bivenra-resort-website/
├── index.html              The whole site — every section lives here
├── css/
│   ├── tokens.css          Design tokens. The only file with raw values
│   ├── fonts.css           @font-face rules for the self-hosted webfonts
│   ├── base.css            Reset, typography, layout primitives, utilities
│   ├── components.css      Reusable parts: buttons, tabs, accordion, carousel…
│   └── sections.css        Per-section layout, mobile first
├── js/
│   └── main.js             Header, menu, tabs, accordion, carousel, lightbox
└── assets/
    ├── fonts/              Poppins, Inter, Noto Sans Sinhala (woff2)
    ├── icons/              Masked SVG icons + placeholder favicon
    └── images/             Photography
```

## The design system

Everything visual is a token in `css/tokens.css`, grouped by job:

| Group | Examples |
| --- | --- |
| Brand colour | `--color-black`, `--color-forest`, `--color-gold` |
| Colour roles | `--surface-page`, `--text-secondary`, `--accent`, `--line` |
| Typeface | `--font-display` (Poppins), `--font-body` (Inter) |
| Type scale | `--size-display`, `--size-h2`, `--size-body`, `--size-label` |
| Space | `--space-3xs` … `--space-5xl`, `--space-section`, `--gutter` |
| Border & radius | `--border-hair`, `--radius-none`, `--radius-pill` |
| Shadow | `--shadow-none` — the design deliberately uses none |
| Motion | `--duration-base`, `--ease-out` |

No other file contains a hard-coded colour, size or spacing value. To re-skin
the site, edit `tokens.css` alone.

### Colour rules worth keeping

- Gold reads at 7.8:1 on matte black but only 2.4:1 on white. It is used for
  **text on dark surfaces only**; on light surfaces it appears solely as rules,
  dots and indicators, never as type.
- Forest green (10.9:1 on white) is the accent for links and focus rings on
  light surfaces, and the surface colour for the single booking panel.

## Replacing the logo

Two clearly marked slots are waiting for the real logo file, both flagged with a
`LOGO SLOT` comment in `index.html`:

1. **Header** — around line 36.
2. **Footer** — inside `.footer__top`.

In each, replace

```html
<span class="logo__slot" aria-hidden="true">Logo</span>
```

with

```html
<img src="assets/images/bivenra-logo.svg" alt="" width="40" height="40">
```

The dashed box, the `Bivenra / Resort` wordmark beside it and the note under the
footer logo are placeholders — delete the wordmark if the supplied file already
contains the type. The footer sits on matte black, so it needs a light version
of the mark.

`assets/icons/favicon.svg` is also a placeholder (gold mountain on black) and
should be regenerated from the real logo.

## Photography

Every picture is a **placeholder sourced from Unsplash** and downloaded into
`assets/images/`. They were chosen as visual direction for the real shoot:
mountain-top setting, infinity pool at dusk, timber cottages against green,
outdoor table settings, and food shot plainly. When the real photographs arrive,
drop them in with the same filenames and matching proportions.

Each file is listed with its Unsplash photo ID, so the original — and its
photographer — can be found at `https://unsplash.com/photos/<id>`.

| File | Stands in for | Unsplash photo ID |
| --- | --- | --- |
| `hero-pool-dusk.jpg` | Hero — the pool at dusk | `photo-1681225692736-da34da4c610c` |
| `cottage-interior.jpg` | Inside a cottage | `photo-1774280954999-9758f11f3d41` |
| `pool-mountain-dusk.jpg` | The pool and the ranges | `photo-1623217625019-d360bcbf94e0` |
| `party-table-garden.jpg` | A group table outdoors | `photo-1669385885258-3273b206836b` |
| `food-rice-curry.jpg` | Rice and curry | `photo-1742281095650-dd3c50c08772` |
| `food-short-eats.jpg` | Short eats | `photo-1578875858391-50798bc2ffee` |
| `guests-pool-greenery.jpg` | Guests in the pool | `photo-1764715978779-80e1d582b543` |
| `resort-aerial-pool.jpg` | The grounds from above | `photo-1567491634123-460945ea86dd` |
| `hills-mist.jpg` | Hill country in cloud | `photo-1687719850052-9fefca5bc428` |
| `hills-tea-mist.jpg` | Tea hills | `photo-1760532511219-c8b7566f90af` |
| `mountains-dusk.jpg` | Ranges at dusk | `photo-1749527834155-c174b504de84` |
| `valley-fog.jpg` | Fog over the valley | `photo-1690139534268-8182c6ed5f53` |
| `pool-edge-view.jpg` | The infinity edge | `photo-1761442663511-2558e561f15e` |
| `suite-window.jpg` | A suite | `photo-1776500587875-8a0653e9c10e` |
| `garden-pond.jpg` | The garden | `photo-1775476784013-5557b8ede70f` |
| `waterfall-jungle.jpg` | Water in the greenery | `photo-1773915950333-b7b183a8448a` |

The Unsplash licence does not require attribution on the page. If you want to
credit the photographers anyway, look each ID up first — the names were not
recorded here.

## Fonts

Poppins (400/500/600), Inter (variable 100–900) and Noto Sans Sinhala are
self-hosted as woff2 in `assets/fonts/`, latin and latin-ext subsets only. The
Sinhala face is loaded for one guest name in the reviews and is scoped by
`unicode-range`, so it only downloads when that text is on screen.

## Behaviour in `js/main.js`

Each block is self-contained and exits quietly if its markup is absent.

1. Footer year
2. Header light/dark state on scroll
3. Full-screen menu below 992px
4. Tabs in **What we offer** (arrow keys, Home/End, roving tabindex)
5. FAQ accordion
6. Reviews carousel (buttons, dots, arrow keys, swipe, height follows the slide)
7. Gallery lightbox (click, Escape, arrow keys, focus returned on close)
8. Reveal on scroll
9. Nav link marking for the section in view

All motion is disabled under `prefers-reduced-motion: reduce`.

## Content source

All business facts, prices, services and reviews come from `questionnaire.md` in
the parent folder. Guest reviews are reproduced exactly as written, including
spelling and emoji. Nothing on the page states a fact that is not in the
questionnaire.

## Before going live

- [ ] Drop in the real logo (header, footer, favicon)
- [ ] Swap the placeholder photographs for the real shoot
- [ ] Confirm the two phone numbers and the WhatsApp number
- [ ] Point the map link at the exact pin rather than a name search
- [ ] Add a real Open Graph image at 1200×630
