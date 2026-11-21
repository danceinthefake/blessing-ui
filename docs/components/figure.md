---
title: Figure
---

# Figure

<p class="bless-lead">An image with a caption and a credit</p>

Puts a picture in the text of an article. For many pictures, use the [gallery](./gallery).

<Demo title="Basic">
  <FigureBasic />
  <template #code>

<<< ../demos/FigureBasic.vue

  </template>
</Demo>

- `src` and `alt` are required. The `alt` text says what the picture shows. The caption does not replace it, because the caption often adds context and not a description.
- `caption` is the text under the picture. For rich text, use the default slot.
- `credit` names who made the picture, such as "Photo: Ana Putri". With `creditHref`, it is a link to the source.
- `width` is `normal` (default), `wide`, or `full`. On wide screens, `wide` grows past the text column a little. On phones it stays in the column, so the page never scrolls sideways.
- The markup is a native `figure` with a `figcaption`.
- Change the words with `labels` or a [label pack](../guide/translating): `credit` (a function).

## Usage

```ts
import { BlessFigure } from "blessing-ui";
```

## API

<PropsTable name="BlessFigure" />

<script setup>
import FigureBasic from "../demos/FigureBasic.vue";
</script>
