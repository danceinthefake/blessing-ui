---
title: Chip
---

<script setup>
import ChipBasic from "../demos/ChipBasic.vue";
</script>

# Chip

<p class="bless-lead">Compact token — a tag, an active filter, a chosen value</p>

A small square plate that names one thing: a tag on a post, a filter that's currently applied, a person (with `image`), a value picked in a multi-select. `removable` adds a × button — a real button, so it's in the tab order and reads as "Remove megumi"; pass `label` (not just the slot) when it's removable so that name exists. The × is a 24px target. Removing a chip removes the focused button with it, so on `@remove` move focus to a neighbour — the demo hands it to the next chip, or the previous one at the end.

A chip doesn't toggle. For filters that switch on and off use [Toggle](./toggle) / ToggleGroup — they carry `aria-pressed`; a chip with `color="accent"` only _looks_ selected — keep it for a value already chosen, like the picks of a multi-select, never for a chip at rest. To type chips into a field, [InputTags](./input-tags) makes them for you.

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
