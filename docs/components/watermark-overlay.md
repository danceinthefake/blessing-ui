---
title: WatermarkOverlay
---

<script setup>
import WatermarkOverlayBasic from "../demos/WatermarkOverlayBasic.vue";
</script>

# WatermarkOverlay

<p class="bless-lead">Tiled text watermark over content</p>

Marks what a thing is — DRAFT, SAMPLE, a viewer's name on a preview — across everything inside it. It is a label, not protection: the text underneath stays selectable, and a screenshot can be cropped or edited.

<Demo title="Basic">
  <WatermarkOverlayBasic />
  <template #code>

<<< ../demos/WatermarkOverlayBasic.vue

  </template>
</Demo>

- The layer is hidden from screen readers and lets clicks and selection through. If the mark matters (a draft), say it in the content as well.
- `color` defaults to the text colour, so it follows dark mode; pass any CSS colour, a token included (`var(--bless-color-danger-text)` for a warning mark). `opacity`, `angle`, `gap` and `fontSize` tune the tile.

## Usage

```ts
import { BlessWatermarkOverlay } from "blessing-ui";
```

## API

<PropsTable name="BlessWatermarkOverlay" />
