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

Three variants, one job each: **solid** is the action, **outline** is the alternative beside it, and **ghost** is the tertiary thing that you otherwise make a link. Color means chosen. Every button is ink at rest and fills with the accent while pressed, so the main action stands out by being **solid**, not by color. Hover fades and leans. Focus leans with the accent ring. Pressing fills. `color="accent"` is for a button that shows something already chosen. For a choice that stays on, use [Toggle](./toggle), which carries `aria-pressed` and fills itself. Use `danger` for destructive actions. If you can undo the action, do it and offer Undo from a [Toaster](./toaster) instead of asking first. Use `text` (default) for the rest. `type` defaults to `button`, so a button inside a form does not submit by accident. For a submit button, say `type="submit"`.

`href` renders an `<a>` (or your [router's link](../guide/install#with-a-router)) with the same look. `disabled` on a link is enforced: no navigation, out of the tab order. `loading` shows a spinner, sets `aria-busy` and ignores clicks while keeping focus, so a keyboard user stays on the button they pressed. A disabled or loading button does not pass its click on to your `@click`. `block` fills the container. `icon` makes the padding square for an icon-only button. Give it an `aria-label`.

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
