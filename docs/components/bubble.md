---
title: Bubble
---

<script setup>
import BubbleBasic from "../demos/BubbleBasic.vue";
</script>

# Bubble

<p class="bless-lead">Message bubble</p>

One message in a conversation — chat, comments, an assistant's reply. Put bubbles in a [Message](./message) for the avatar, name and time around them.
<Demo title="Basic">
<BubbleBasic />
<template #code>

<<< ../demos/BubbleBasic.vue

  </template>
</Demo>

- `align="end"` for the viewer's own messages. `collapsible` clamps a long message to `lines` with a Show more toggle that says whether it's open.
- `reactions` are pressed-state buttons (`@react`).

## Usage

```ts
import { BlessBubble } from "blessing-ui";
```

## API

<PropsTable name="BlessBubble" />
