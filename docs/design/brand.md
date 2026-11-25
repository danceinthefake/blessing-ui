# Brand

The identity of Blessing UI is the design system itself. The logo needs nothing that a component does not already use. The [story](./story) tells where the system came from.

<div style="display:flex;align-items:center;gap:24px;margin:16px 0 8px">
  <img src="/logo.svg" width="96" height="96" alt="">
  <img src="/logo.svg" width="48" height="48" alt="">
  <img src="/logo.svg" width="24" height="24" alt="">
  <img src="/logo.svg" width="16" height="16" alt="">
</div>

## Six elements

| Element    | Value                                                                                                                                                                                                                             | Where you see it                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Name       | **Blessing**. It is a nod to a fictional software circle (see the [story](./story))                                                                                                                                               | wordmark, package name                                                                             |
| Moods      | three times of day: **Daylight** (sunlit warm porcelain `#F6F1EE`, ink `#241F26`), **Golden hour** (`data-theme="golden"`, `#F6E7D4`), and **Night** (`data-theme="dark"`, starry cobalt `#111525`). One accent at a time from six [palettes](../guide/palettes) | page paper, lifted sheets, sky-ribbon hero art, anything chosen, focus |
| Geometry   | calm soft corners (`--bless-radius: 14px` for cards, un-skewed `999px` pills for buttons, switches, chips, and badges, flat `0px` manuscript underlines for fields). `--bless-lean` (−10°) stays exclusively on rectangular brand tags, eyecatches, and speaker nameplates | every card, button, field, tag, and every petal of the mark |
| Type       | three voices: UI sans (`Plus Jakarta Sans` / `Inter`), editorial serif (`--bless-font-serif`, `Newsreader` / `Georgia`) for hero titles, `BlessNovelBox`, and long-form reading, and tabular monospace (`--bless-font-mono`). Sentence case everywhere | body, labels, headings, dialogue, timestamps, quiet italic watermarks |
| Elevation  | "Light, not lines": borderless raised `surface` sheets with warm ambient shadows (`--bless-shadow-sm`, `--bless-shadow-plate`, `--bless-shadow-art`) and a luminous top edge (`--bless-edge`). Accent color stays strictly for choices and focus | popovers, menus, tooltips, toasts, modals, sheets, cards, and cover shelves |
| Voice      | dual-mode hero frame (full-bleed media when cover art exists; *Fine*-inspired sky-ribbon with notched neutral petals and outline role chips otherwise) and frosted `BlessNovelBox` with optional portrait/emblem medallion, paired with built-in drawn icons (`BlessIcon`) | home hero, landing pages, dialogue boxes, and controls |

## Mark

The leaning flower. The fictional circle that gave Blessing its name has a five-petal flower for a logo, with one petal for each member (see the [story](./story)). Ours redraws it in the terms of the system. It has five teardrop petals around an empty middle. The petals are sharp at the center and soft outside. Each petal has the house −10° lean. The flower turns as if it just caught the wind. The five petals are five of the six [palettes](../guide/palettes). The sixth, Tomoya, is the founder of the circle. Tomoya belongs at the center that the mark leaves empty.

| File                              | Use                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [`logo.svg`](/logo.svg)           | any background: the five colors read on light and dark                                                                          |
| [`logo-mono.svg`](/logo-mono.svg) | one color for footers and print. When you inline it on a page with the tokens, the top petal takes the accent (ink, one chosen) |
| [`favicon.svg`](/favicon.svg)     | tab icon                                                                                                                        |
| [`og.png`](/og.png)               | 1200×630 social card, composed from the system (below). Regenerate it with `pnpm docs:shots`                                    |

<img src="/og.png" alt="The OG card: mark, wordmark, tagline, a browser-framed screenshot on a plate, the watermark behind" style="border: var(--bless-border-width) solid var(--bless-color-border); margin: 8px 0 24px">

### Don't

<div class="brand-dont">
  <figure><img src="/logo.svg" alt="" style="transform: skewX(10deg)"><figcaption>change the lean</figcaption></figure>
  <figure><img src="/logo.svg" alt="" style="filter: hue-rotate(150deg)"><figcaption>recolor</figcaption></figure>
  <figure><img src="/logo.svg" alt="" style="transform: rotate(36deg)"><figcaption>rotate</figcaption></figure>
  <figure><span class="brand-dont__centre"><img src="/logo.svg" alt=""><i></i></span><figcaption>add a center</figcaption></figure>
</div>

## Wordmark

The wordmark is `Blessing` in bold sentence-case sans (or thin weight in display uses), followed by a skewed −10° `UI` (or app) tag in **ink** at rest so accent color stays reserved for chosen states (*color means chosen*). The wordmark is built from tokens, not shipped as an image. The site nav uses `siteTitle` and CSS, the same recipe as below.

<p class="brand-wordmark">Blessing <span class="brand-wordmark__ui"><span>UI</span></span></p>

## Rules

- Keep the lean and the five. Do not straighten, outline, or re-space the petals. Do not swap the teardrop for a circle or a plate. Do not fill the center.
- Use one accent in the UI. The mark is the only place where the five palette colors sit together. Never recolor a petal.
- Clear space = half a petal's length on all sides.
- Minimum size 16px.
- Set the wordmark only in weight 100 or 300. Do not letterspace it.

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
  border-radius: var(--bless-radius-plate);
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font-size: 18px;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  vertical-align: middle;
  transform: skewX(var(--bless-lean));
}
.brand-wordmark__ui > span {
  display: inline-block;
  transform: skewX(calc(-1 * var(--bless-lean)));
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
  transform: skewX(var(--bless-lean));
}
</style>
