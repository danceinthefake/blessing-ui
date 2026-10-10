---
title: Text
---

<script setup>
import TextBasic from "../demos/TextBasic.vue";
</script>

# Text

<p class="bless-lead">Typography helper</p>

Type from tokens without writing CSS: pick a size, a weight, tracking, and the element. The scale has these steps: `2xs` captions and ©, `xs` labels and meta (bold, `tracking="wider"`, `uppercase`), `sm` secondary text and dates, `md` body, `lg` titles, `xl` headings, `headline` the hanging page title, and `display` the watermark. Weights: `thin` is the voice (100, and 300 in dark), `bold` is the UI, and `light` and `normal` are in between.

`as` is the element and carries the meaning: `h2`, `p`, `dt`. `size` is only how it looks, so a `size="xl"` span is not a heading. Margins are stripped. Space with a `Stack` or a gap. `color="accent"` renders `accent-text`, the darkened accent that passes as small text: for link-like text and chosen things, not for emphasis at rest. `muted` is a shortcut for `color="muted"`.

<Demo title="Basic">
  <TextBasic />
  <template #code>

<<< ../demos/TextBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessText } from "blessing-ui";
```

## API

<PropsTable name="BlessText" />
