# Brand

Blessing UI's identity is the design system itself — nothing is added for the logo that a component doesn't already use. Where the system came from is the [story](./story).

<div class="row" style="align-items:center;gap:24px;margin:16px 0 8px">
  <img src="/logo-mono.svg" width="96" height="96" alt="" style="color:var(--bless-color-text)">
  <img src="/logo-mono.svg" width="48" height="48" alt="" style="color:var(--bless-color-text)">
  <img src="/logo-mono.svg" width="24" height="24" alt="" style="color:var(--bless-color-text)">
  <img src="/logo-thin.svg" width="96" height="96" alt="">
</div>

## Five elements

| Element  | Value                                                                         | Where you see it                                   |
| -------- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| Name     | **Blessing** — a nod to a fictional software circle; see the [story](./story) | wordmark, package name                             |
| Colour   | one accent, `#ff0054`, on greys                                               | buttons, badges, the mark's front plate            |
| Geometry | `skewX(-10deg)` — never rounded, never rotated                                | every label, both plates of the mark, the `UI` tag |
| Type     | Roboto 100 oversized for the voice, 700 uppercase tracked for the UI          | watermark, wordmark, labels                        |
| Motif    | the hard-shadow plate: a second parallelogram offset behind                   | mark, `BlessQrCode frame`, `BlessScrollTop`        |

## Mark

Two skewed plates, the back one in the text colour, the front in the accent, with a bold counter-skewed **B**. Legible at 16px (favicon). The hero variant knocks a Roboto Thin B out of a single plate and is for large sizes only (≥ 96px).

| File                              | Use                                                |
| --------------------------------- | -------------------------------------------------- |
| [`logo.svg`](/logo.svg)           | light backgrounds                                  |
| [`logo-dark.svg`](/logo-dark.svg) | dark backgrounds (muted back plate)                |
| [`logo-mono.svg`](/logo-mono.svg) | inline `<svg>`/`<img>` where `currentColor` is set |
| [`logo-thin.svg`](/logo-thin.svg) | hero / OG only                                     |
| [`favicon.svg`](/favicon.svg)     | tab icon                                           |

## Wordmark

`Blessing` in Roboto 100 (300 in dark mode, like every thin text in the system) followed by `UI` set in an accent skewed label. It is built from tokens, not shipped as an image — the site nav is `siteTitle` + CSS.

<p style="font-size:56px;font-weight:var(--bless-font-weight-thin);letter-spacing:-1px;line-height:1;margin:16px 0">Blessing <span style="display:inline-block;background:var(--bless-color-accent);color:var(--bless-color-on-accent);font-size:18px;font-weight:700;letter-spacing:2px;padding:6px 12px;transform:skewX(-10deg);vertical-align:middle;position:relative;top:-8px"><span style="display:inline-block;transform:skewX(10deg)">UI</span></span></p>

## Rules

- Keep the skew. Don't unskew, rotate, round, or outline the plates.
- One accent. No gradients, no second colour; the back plate is always a grey from the text scale.
- Clear space = the height of the front plate's offset (8px at 64px) on all sides.
- Minimum size 16px for the mark, 96px for the thin variant.
- Don't set the wordmark in any weight other than 100/300, and don't letterspace it.
