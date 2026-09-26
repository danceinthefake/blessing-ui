---
title: AspectRatio
---

<script setup>
import AspectRatioBasic from "../demos/AspectRatioBasic.vue";
</script>

# AspectRatio

<p class="bless-lead">A box at a fixed ratio, so media doesn't jump the layout while it loads.</p>

`ratio` takes `16 / 9` or `"16 / 9"` — anything CSS `aspect-ratio` accepts. A bare `<img>`, `<video>` or `<iframe>` child fills the box. For an image or video, `fit="cover"` (default) crops to fill and `fit="contain"` letterboxes — for logos or screenshots that must not lose an edge; the bars are transparent, so give the box a `background`. Anything else you put inside is yours to size.

For images specifically, [Img](./img) already has `ratio` plus lazy loading and a placeholder; this is for the rest — video, embeds, a map, a chart.

<Demo title="Basic">
  <AspectRatioBasic />
  <template #code>

<<< ../demos/AspectRatioBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessAspectRatio } from "blessing-ui";
```

## API

<PropsTable name="BlessAspectRatio" />
