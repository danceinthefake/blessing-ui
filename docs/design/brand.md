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
| Moods      | three times of day: **Daylight** (warm paper `#EDE6E1`, violet-black ink `#262228`), **Golden hour** (`data-theme="golden"`), and **Night** (`data-theme="dark"`). One accent at a time from six [palettes](../guide/palettes)    | page paper, sheets, hero art, anything chosen (pressed button, current tab, checked box), focus    |
| Geometry   | soft corners (`--bless-radius` for cards, `--bless-radius-plate` for fields, `--bless-radius-pill` for buttons and chips) and `--bless-lean`, −10°, taken on attention. The teardrop lives in the mark                            | every card, button, field, switch, and chip, and every petal of the mark                           |
| Type       | Roboto in weights 400 to 600, sentence case, no tracked uppercase labels. Weight 100 stays only for the single overflow word of a screen                                                                                          | body, labels, headings, watermark                                                                  |
| Elevation  | soft, wide shadows tinted with the warm ink (`--bless-shadow-sm`, `--bless-shadow-plate`). In Night, raised surfaces use a lighter fill and a faint top edge (`--bless-edge`). The accent stays for choices and focus only        | popovers, menus, tooltips, toasts, modals, sheets, and cards                                       |
| Voice      | a hero frame with abstract mood art (sky gradient, light leak, petals) and `BlessNovelBox` for the voice of an app, paired with built-in drawn icons (`BlessIcon`)                                                                | home hero, landing pages, dialogue boxes, and controls                                             |

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

The wordmark is `Blessing` in Roboto 100 (300 in dark mode, like every thin text in the system). `UI` follows it, set in a skewed label in the accent of the current palette, and it re-tints with the palette. The wordmark is built from tokens. It is not shipped as an image. The site nav uses `siteTitle` and CSS, the same recipe as below.

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
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
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
