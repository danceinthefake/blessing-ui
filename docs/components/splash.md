---
title: Splash
---

<script setup>
import SplashBasic from "../demos/SplashBasic.vue";
</script>

# Splash

<p class="bless-lead">First-visit overlay</p>

A brief welcome over the first load — a key visual, a logo moment. It delays people, so keep it short, skippable and rare (`once`).
<Demo title="Basic">
<SplashBasic />
<template #code>

<<< ../demos/SplashBasic.vue

  </template>
</Demo>

- It takes focus onto Skip, so Enter or Esc leaves at once, and it is skipped entirely under reduced motion.
- `duration` auto-dismisses (0 = only Skip closes it); `once` remembers it was seen; `label` names it.

## Usage

```ts
import { BlessSplash } from "blessing-ui";
```

## API

<PropsTable name="BlessSplash" />
