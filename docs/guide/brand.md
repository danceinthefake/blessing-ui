# Brand

Blessing UI's identity is the design system itself — nothing is added for the logo that a component doesn't already use. Where the system came from is the [story](./story).

<div style="display:flex;align-items:center;gap:24px;margin:16px 0 8px">
  <img src="/logo.svg" width="96" height="96" alt="">
  <img src="/logo.svg" width="48" height="48" alt="">
  <img src="/logo.svg" width="24" height="24" alt="">
  <img src="/logo.svg" width="16" height="16" alt="">
</div>

## Five elements

| Element  | Value                                                                         | Where you see it                                   |
| -------- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| Name     | **Blessing** — a nod to a fictional software circle; see the [story](./story) | wordmark, package name                             |
| Colour   | one accent, `#e85078`, on greys                                               | buttons, badges, the mark's front plate            |
| Geometry | `skewX(-10deg)` — never rounded, never rotated                                | every label, both plates of the mark, the `UI` tag |
| Type     | Roboto 100 oversized for the voice, 700 uppercase tracked for the UI          | watermark, wordmark, labels                        |
| Motif    | the hard-shadow plate: a second parallelogram offset behind                   | mark, `BlessQrCode frame`, `BlessScrollTop`        |

## Mark

Five skewed plates in a ring, one colour each. Each petal is the same parallelogram every label in the system uses, rotated 72° apart. It answers the name: the fictional circle Blessing is named after has a five-petal flower for a logo, one petal per member — see the [story](./story). Ours is re-drawn from the system's own geometry, no centre; the five colours are the five [palettes](./palettes), so the mark is literally the theme picker.

| File                              | Use                                                                  |
| --------------------------------- | -------------------------------------------------------------------- |
| [`logo.svg`](/logo.svg)           | any background — the accent works on light and dark                  |
| [`logo-mono.svg`](/logo-mono.svg) | inline `<svg>` where `currentColor` should drive it (footers, print) |
| [`favicon.svg`](/favicon.svg)     | tab icon                                                             |

## Wordmark

`Blessing` in Roboto 100 (300 in dark mode, like every thin text in the system) followed by `UI` set in an accent skewed label. It is built from tokens, not shipped as an image — the site nav is `siteTitle` + CSS.

<p style="font-size:56px;font-weight:var(--bless-font-weight-thin);letter-spacing:-1px;line-height:1;margin:16px 0">Blessing <span style="display:inline-block;background:var(--bless-color-accent);color:var(--bless-color-on-accent);font-size:18px;font-weight:700;letter-spacing:2px;padding:6px 12px;transform:skewX(-10deg);vertical-align:middle;position:relative;top:-8px"><span style="display:inline-block;transform:skewX(10deg)">UI</span></span></p>

## Rules

- Keep the skew and the five. Don't unskew, round, outline, or re-space the petals; don't add a centre.
- One accent in the UI. The mark is the only place the five palette colours sit together; never recolour a petal.
- Clear space = one petal width on all sides.
- Minimum size 16px.
- Don't set the wordmark in any weight other than 100/300, and don't letterspace it.
