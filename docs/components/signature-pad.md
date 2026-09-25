---
title: SignaturePad
---

<script setup>
import SignaturePadBasic from "../demos/SignaturePadBasic.vue";
</script>

# SignaturePad

<p class="bless-lead">Draw a signature on canvas</p>

A drawn signature, for a delivery receipt, a consent form, a sign-off. It can only be drawn with a pointer, so always offer another way: a typed full name, or a checkbox that says the same thing.
<Demo title="Basic">
<SignaturePadBasic />
<template #code>

<<< ../demos/SignaturePadBasic.vue

  </template>
</Demo>

- `v-model` is a data URL of the drawing (`type` sets PNG, JPEG or WebP), empty while blank. `@end` fires after each stroke.
- The drawing survives a resize (a phone turning, a sidebar opening). Clear with the button, the Delete key, or `ref.clear()`.
- Strokes take the text colour unless `color` is set. `hint` and `clearLabel` set the copy.

## Usage

```ts
import { BlessSignaturePad } from "blessing-ui";
```

## API

<PropsTable name="BlessSignaturePad" />
