# Fonts

Blessing UI uses three typographic voices:

1. **UI sans (`--bless-font-sans`)**: `"Plus Jakarta Sans", "Noto Sans JP", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", sans-serif`
2. **Editorial serif (`--bless-font-serif`)**: `"Newsreader", "Iowan Old Style", "Palatino Linotype", Georgia, serif` — used for hero headlines, article titles, pull quotes, and `BlessNovelBox` dialogue.
3. **Tabular monospace (`--bless-font-mono`)**: `ui-monospace, "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace` — used for timestamps, telemetry, and volume tags.

Load **Plus Jakarta Sans** (weights 400, 500, 600, 700) and **Newsreader** (regular 400 + italic 400). `--bless-font-weight-thin` shifts from 100 in Daylight to 300 in Night so ultra-light display watermarks stay legible on dark skies.

<Demo title="The three voices">
  <FontsWeights />
  <template #code>

<<< ../demos/FontsWeights.vue

  </template>
</Demo>

The library bundles no fonts, so you load them yourself (from Google Fonts or self-hosted with Fontsource).

## Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

The two `preconnect` lines matter: without them the first paint waits on a cold connection to two hosts.

## Japanese

The font stack already falls back to Hiragino (macOS and iOS) and Meiryo (Windows). Every Japanese reader has one of them. Noto Sans JP is for Linux, Android, and a consistent look. From Google Fonts it is cheap because the face is split into small `unicode-range` slices, so a page downloads only the slices its characters need. As whole self-hosted files it is about 1–2 MB for two weights—subset it, or let system fonts carry Japanese text on Mac and Windows.

## Self-hosting

The shortest route is [Fontsource](https://fontsource.org), which ships variable WOFF2 files with zero external network requests:

```sh
pnpm add @fontsource-variable/plus-jakarta-sans @fontsource-variable/newsreader
```

```ts
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/newsreader";
```

Then point the tokens at the variable family names (or keep the default names if you use non-variable `@fontsource/plus-jakarta-sans` and `@fontsource/newsreader`):

```css
:root {
  --bless-font-sans: "Plus Jakarta Sans Variable", "Plus Jakarta Sans", "Hiragino Kaku Gothic Pro", "Meiryo", sans-serif;
  --bless-font-serif: "Newsreader Variable", "Newsreader", Georgia, serif;
}
```

`font-display: swap` keeps text visible while the file arrives. Without custom fonts, the stack falls back gracefully to system sans and Georgia.

<script setup>
import FontsWeights from "../demos/FontsWeights.vue";
</script>
