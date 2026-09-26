---
title: Avatar
---

<script setup>
import AvatarBasic from "../demos/AvatarBasic.vue";
</script>

# Avatar

<p class="bless-lead">Image with initials fallback</p>

A square plate, like everything else — a circle would be the one shape here that can't lean (the [rule](../guide/conventions#shape)). `lean` skews the frame as well, like a plate; the image inside is counter-skewed so the face stays upright.

Initials are the first letter of the first two words of `name` (`Megumi Kato` → MK, `加藤 恵` → 加恵). They show when there is no `src`, or when the image fails to load. Without an image the avatar is `role="img"` named by `alt` or `name`; with neither it is decorative. Sizes: `xs` 24 · `sm` 32 · `md` 40 · `lg` 56 · `xl` 80 px.

<Demo title="Basic">
  <AvatarBasic />
  <template #code>

<<< ../demos/AvatarBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessAvatar } from "blessing-ui";
```

## API

<PropsTable name="BlessAvatar" />
