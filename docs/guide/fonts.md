# Fonts

<script setup>
import FontsWeights from "../demos/FontsWeights.vue";
</script>

`--bless-font-sans` is

```
"Roboto", "Noto Sans JP", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", sans-serif
```

Load four Roboto weights: **100** for the thin voice (watermark, wordmark, `BlessText weight="thin"`), **300**, **400**, and **700**. `--bless-font-weight-thin` is 100, and dark mode redefines it to 300 because hairlines look thinner on a dark background. Load both weights. Use 100 only at headline size and up. At body size its hairlines are too thin to read, so use 300 or heavier.

<Demo title="The four weights">
  <FontsWeights />
  <template #code>

<<< ../demos/FontsWeights.vue

  </template>
</Demo>

The library bundles no fonts, so you must load them yourself. You do not need italic files. The lean is a skew that the library applies to the element. It is not an italic face.

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

The font stack already falls back to Hiragino (macOS and iOS) and Meiryo (Windows). Every Japanese reader has one of them. Noto Sans JP is for Linux, Android, and a consistent look. From Google Fonts it is cheap. The face is split into many small `unicode-range` slices, and a page downloads only the slices that its characters need. As whole self-hosted files it is big, about 1–2 MB for the two weights. Subset it. If your audience is on Mac or Windows, drop it and let the system fonts carry the Japanese text. The thin Roboto is the only face that the look depends on.

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
