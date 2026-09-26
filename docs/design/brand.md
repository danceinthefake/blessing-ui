# Brand

Blessing UI's identity is the design system itself — nothing is added for the logo that a component doesn't already use. Where the system came from is the [story](./story).

<div style="display:flex;align-items:center;gap:24px;margin:16px 0 8px">
  <img src="/logo.svg" width="96" height="96" alt="">
  <img src="/logo.svg" width="48" height="48" alt="">
  <img src="/logo.svg" width="24" height="24" alt="">
  <img src="/logo.svg" width="16" height="16" alt="">
</div>

## Five elements

| Element  | Value                                                                                                                                                                                          | Where you see it                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Name     | **Blessing** — a nod to a fictional software circle; see the [story](./story)                                                                                                                  | wordmark, package name                                                                     |
| Colour   | one accent at a time — Megumi's `#e85078` by default, six by [palette](../guide/palettes). The mark carries the petal colours; a palette darkens where white text needs it                     | buttons, badges, the mark's top petal                                                      |
| Geometry | `--bless-lean`, −10°: upright at rest, taken on attention; big type and the mark lean always. One [shape](../guide/conventions#shape): the upright square plate; the teardrop only in the mark | every label, field, switch and chip; every petal of the mark                               |
| Type     | Roboto 100 oversized for the voice, 700 uppercase tracked for the UI                                                                                                                           | watermark, wordmark, labels                                                                |
| Motif    | the plate: a hard 1px accent hairline offset behind anything that floats — no blur                                                                                                             | every popover, menu, tooltip, toast, modal; the QR frame; the site's hero shot and OG card |

## Mark

The leaning flower. The fictional circle Blessing is named after has a five-petal flower for a logo, one petal per member — see the [story](./story). Ours redraws it in the system's terms: five teardrop petals, sharp at the centre and soft outside, around an empty middle, each at the house −10° lean, so the flower turns as if it just caught the wind. The five colours are the five [palettes](../guide/palettes), so the mark is literally the theme picker.

| File                              | Use                                                                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [`logo.svg`](/logo.svg)           | any background — the five colours read on light and dark                                                              |
| [`logo-mono.svg`](/logo-mono.svg) | one colour for footers and print; inlined on a page with the tokens, the top petal takes the accent — ink, one chosen |
| [`favicon.svg`](/favicon.svg)     | tab icon                                                                                                              |
| [`og.png`](/og.png)               | 1200×630 social card, composed from the system (below); regenerate with `pnpm docs:shots`                             |

<img src="/og.png" alt="The OG card: mark, wordmark, tagline, a browser-framed screenshot on a plate, the watermark behind" style="border: var(--bless-border-width) solid var(--bless-color-border); margin: 8px 0 24px">

### Don't

<div class="brand-dont">
  <figure><img src="/logo.svg" alt="" style="transform: skewX(10deg)"><figcaption>change the lean</figcaption></figure>
  <figure><img src="/logo.svg" alt="" style="filter: grayscale(1) contrast(4)"><figcaption>recolour</figcaption></figure>
  <figure><img src="/logo.svg" alt="" style="transform: rotate(36deg)"><figcaption>rotate</figcaption></figure>
  <figure><span class="brand-dont__centre"><img src="/logo.svg" alt=""><i></i></span><figcaption>add a centre</figcaption></figure>
</div>

## Wordmark

`Blessing` in Roboto 100 (300 in dark mode, like every thin text in the system) followed by `UI` set in a skewed label in the current palette's accent — it re-tints with the palette. It is built from tokens, not shipped as an image — the site nav is `siteTitle` + CSS, the same class as below.

<p class="brand-wordmark">Blessing <span class="brand-wordmark__ui"><span>UI</span></span></p>

## Rules

- Keep the lean and the five. Don't straighten, outline, or re-space the petals, and don't swap the teardrop for a circle or a plate; don't fill the centre.
- One accent in the UI. The mark is the only place the five palette colours sit together; never recolour a petal.
- Clear space = half a petal's length on all sides.
- Minimum size 16px.
- Don't set the wordmark in any weight other than 100/300, and don't letterspace it.

<style>
.brand-wordmark {
  margin: 16px 0;
  font-family: var(--bless-font-sans);
  font-size: 56px;
  font-weight: var(--bless-font-weight-thin);
  letter-spacing: var(--bless-tracking-tight);
  line-height: var(--bless-leading-none);
}
.brand-wordmark__ui {
  display: inline-block;
  position: relative;
  top: -0.15em;
  padding: var(--bless-space-2) var(--bless-space-3);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-size: 18px;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  vertical-align: middle;
  transform: skewX(var(--bless-skew));
}
.brand-wordmark__ui > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.brand-dont {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin: 8px 0 24px;
}
.brand-dont figure {
  margin: 0;
  text-align: center;
  position: relative;
}
.brand-dont img {
  width: 64px;
  height: 64px;
  display: block;
  margin: 0 auto 6px;
}
.brand-dont figure::before {
  content: "";
  position: absolute;
  left: 4px;
  right: 4px;
  top: 32px;
  height: 2px;
  background: var(--bless-color-danger);
  transform: rotate(-30deg);
}
.brand-dont figcaption {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.brand-dont__centre {
  position: relative;
  display: block;
}
.brand-dont__centre i {
  position: absolute;
  left: 50%;
  top: 32px;
  width: 10px;
  height: 7px;
  margin: -3px 0 0 -5px;
  background: #5870f8;
  transform: skewX(var(--bless-skew));
}
</style>
