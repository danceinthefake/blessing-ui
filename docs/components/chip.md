---
title: Chip
---

<script setup>
import ChipBasic from "../demos/ChipBasic.vue";
</script>

# Chip

<p class="bless-lead">Compact token — a tag, an active filter, a chosen value</p>

A small petal that names one thing: a tag on a post, a filter that's currently applied, a person (with `image`), a value picked in a multi-select. `removable` adds a × button — a real button, so it's in the tab order and reads as "Remove megumi"; pass `label` (not just the slot) when it's removable so that name exists.

A chip doesn't toggle. For filters that switch on and off use [Toggle](./toggle) / ToggleGroup — they carry `aria-pressed`; a chip with `color="accent"` only _looks_ selected. To type chips into a field, [InputTags](./input-tags) makes them for you.

<Demo title="Basic">
  <ChipBasic />
  <template #code>

<<< ../demos/ChipBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessChip } from "blessing-ui";
```

## API

<PropsTable name="BlessChip" />
