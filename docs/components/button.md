---
title: Button
---

<script setup>
import ButtonBasic from "../demos/ButtonBasic.vue";
import ButtonSizes from "../demos/ButtonSizes.vue";
import ButtonStates from "../demos/ButtonStates.vue";
</script>

# Button

<p class="bless-lead">Button or anchor</p>

Three variants, one job each: **solid** is the action, **outline** the alternative beside it, **ghost** the tertiary thing you'd otherwise make a link. `color="accent"` for the one thing the screen is for, `danger` for destructive, `text` (default) for the rest. `type` defaults to `button`, so a button inside a form doesn't submit by accident — say `type="submit"` when it should.

`href` renders an `<a>` (or your [router's link](../guide/install#with-a-router)) with the same look; `disabled` on a link is enforced — no navigation, out of the tab order. `loading` shows a spinner, sets `aria-busy` and disables. `block` fills the container; `icon` makes the padding square for an icon-only button — give it an `aria-label`.

<Demo title="Basic">
  <ButtonBasic />
  <template #code>

<<< ../demos/ButtonBasic.vue

  </template>
</Demo>

<Demo title="Sizes">
  <ButtonSizes />
  <template #code>

<<< ../demos/ButtonSizes.vue

  </template>
</Demo>

<Demo title="States">
  <ButtonStates />
  <template #code>

<<< ../demos/ButtonStates.vue

  </template>
</Demo>

## Usage

```ts
import { BlessButton } from "blessing-ui";
```

## API

<PropsTable name="BlessButton" />
