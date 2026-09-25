---
title: Section
---

<script setup>
import SectionBasic from "../demos/SectionBasic.vue";
import SectionHanging from "../demos/SectionHanging.vue";
</script>

# Section

<p class="bless-lead">Titled block with giant skewed word</p>

A titled region of a page — News, Staff, Story — in the system's voice: a skewed label or a hanging headline, and optionally the giant faint word behind it. Use one per top-level part of a page; for a titled box inside a section, [Panel](./panel).

<Demo title="Basic">
  <SectionBasic />
  <template #code>

<<< ../demos/SectionBasic.vue

  </template>
</Demo>

<Demo title="Hanging headline">
  <SectionHanging />
  <template #code>

<<< ../demos/SectionHanging.vue

  </template>
</Demo>

Two headline voices. `label` (default) is the TV site: a small bold uppercase title with the pale skewed watermark behind. `headline="hanging"` is the film site: one big tracked title hung off the bottom edge of the `#band` slot — a key visual, a colour, anything 200px tall — with `subtitle` in tracked muted type under it. Without a band the hanging title simply sits in flow; the watermark is off in this mode.

## Usage

```ts
import { BlessSection, BlessWatermark } from "blessing-ui";
```

## API

### BlessSection

<PropsTable name="BlessSection" />

### BlessWatermark

<PropsTable name="BlessWatermark" />
