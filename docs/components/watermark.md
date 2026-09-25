---
title: Watermark
---

<script setup>
import WatermarkBasic from "../demos/WatermarkBasic.vue";
</script>

# Watermark

<p class="bless-lead">Giant faint word behind a block</p>

The giant, faint word behind a section — NEWS, STAFF — from the source site's look. Pure decoration: it's hidden from screen readers, so never put anything in it that isn't also said in the content.

<Demo title="Basic">
  <WatermarkBasic />
  <template #code>

<<< ../demos/WatermarkBasic.vue

  </template>
</Demo>

- It fills its nearest positioned parent (`position: relative`); `position` picks the corner. [Section](./section) draws one for you with `watermark`.

## Usage

```ts
import { BlessWatermark } from "blessing-ui";
```

## API

<PropsTable name="BlessWatermark" />
