---
title: Swap
---

<script setup>
import SwapBasic from "../demos/SwapBasic.vue";
</script>

# Swap

<p class="bless-lead">Two-face toggle (icon swap)</p>

An on/off control drawn as two icons that trade places — play and pause, like, mute. It is a checkbox underneath, so it is announced as checked or not. For a toggle with a visible text label use [Switch](./switch) or [Toggle](./toggle).

<Demo title="Basic">
  <SwapBasic />
  <template #code>

<<< ../demos/SwapBasic.vue

  </template>
</Demo>

- `label` names the **on** state (`Playing`, `Liked`, `Muted`), because it is read with checked / not checked. "Play / pause" would be read as "Play / pause, checked" and mean nothing.
- `#on` and `#off` are hidden from screen readers; the label speaks for them.
- `effect`: `fade` (default), `rotate`, `flip`. All of them respect reduced motion.

## Usage

```ts
import { BlessSwap } from "blessing-ui";
```

## API

<PropsTable name="BlessSwap" />
