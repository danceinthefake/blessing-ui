# Fonts

<script setup>
import FontsWeights from "../demos/FontsWeights.vue";
</script>

`--bless-font-sans` is

```
"Roboto", "Noto Sans JP", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", sans-serif
```

Four Roboto weights: **100** for the thin voice (watermark, wordmark, `BlessText weight="thin"`), **300**, **400**, **700**. `--bless-font-weight-thin` is 100 and dark mode redefines it to 300 — hairlines read thinner light-on-dark — so load both.

<Demo title="The four weights">
  <FontsWeights />
  <template #code>

<<< ../demos/FontsWeights.vue

  </template>
</Demo>

Nothing is bundled — load them yourself.

## Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700&family=Noto+Sans+JP:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

The two `preconnect` lines matter: without them the first paint waits on a cold connection to two hosts.

## Japanese

The stack already falls through to Hiragino (macOS/iOS) and Meiryo (Windows), which every Japanese reader has. Noto Sans JP is there for Linux, Android and consistency — and it is big (the two weights are ~1–2 MB before subsetting). If your audience is on Mac/Windows, drop it from the link and let the system fonts carry the JP text; the thin Roboto is the only face the look actually depends on.

## Self-hosting

Serve the files yourself and point the token at your face names:

```css
@font-face {
  font-family: "Roboto";
  font-weight: 100;
  font-display: swap;
  src: url("/fonts/roboto-thin.woff2") format("woff2");
}
/* …300, 400, 700 */

:root {
  --bless-font-sans: "Roboto", "Hiragino Kaku Gothic Pro", "Meiryo", sans-serif;
}
```

`font-display: swap` keeps text visible while the file arrives. Without any of this the stack falls through to the system sans, which is fine for everything except the thin type.
