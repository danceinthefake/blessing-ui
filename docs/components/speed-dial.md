---
title: SpeedDial
---

<script setup>
import SpeedDialBasic from "../demos/SpeedDialBasic.vue";
</script>

# SpeedDial

<p class="bless-lead">FAB with fan-out actions</p>

A floating button that fans out a few (two to five) creation actions on a phone screen — new message, new photo. On wide screens, put the actions in the page instead.
<Demo title="Basic">
<SpeedDialBasic />
<template #code>

<<< ../demos/SpeedDialBasic.vue

  </template>
</Demo>

- The button says whether it's open; the actions are hidden (inert) until it is. Esc closes it and returns focus to the button, and so does leaving it with Tab.
- Each action needs a `label`: it names the button and shows as its tip. `direction` sets which way they fan; `inline` renders it in place.

## Usage

```ts
import { BlessSpeedDial } from "blessing-ui";
```

## API

<PropsTable name="BlessSpeedDial" />
