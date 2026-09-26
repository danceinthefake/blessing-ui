# Fonts

<script setup>
import FontsWeights from "../demos/FontsWeights.vue";
</script>

`--bless-font-sans` is

```
"Roboto", "Noto Sans JP", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", sans-serif
```

Four Roboto weights: **100** for the thin voice (watermark, wordmark, `BlessText weight="thin"`), **300**, **400**, **700**. `--bless-font-weight-thin` is 100 and dark mode redefines it to 300 — hairlines read thinner light-on-dark — so load both. Keep 100 for headline size and up — at body size its hairlines barely read; below that use 300 or heavier.

<Demo title="The four weights">
  <FontsWeights />
  <template #code>

<<< ../demos/FontsWeights.vue

  </template>
</Demo>

Nothing is bundled — load them yourself. No italic files are needed: the lean is a skew applied to the element, not an italic face.

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

The stack already falls through to Hiragino (macOS/iOS) and Meiryo (Windows), which every Japanese reader has. Noto Sans JP is there for Linux, Android and consistency. From Google Fonts it is cheap: the face is split into many small `unicode-range` slices and a page downloads only the ones its characters need. Self-hosted as whole files it is big — ~1–2 MB for the two weights — so either subset it or, if your audience is on Mac/Windows, drop it and let the system fonts carry the JP text; the thin Roboto is the only face the look actually depends on.

## Self-hosting

The shortest route is [Fontsource](https://fontsource.org), which packages each weight as a stylesheet with its files:

```sh
pnpm add @fontsource/roboto
```

```ts
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
```

The family is still called `"Roboto"`, so the token needs no change. By hand instead, serve the files and point the token at your face names:

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
