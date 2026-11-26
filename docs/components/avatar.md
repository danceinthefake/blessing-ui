---
title: Avatar
---

# Avatar

<p class="bless-lead">Image with initials fallback</p>

A circular frame (`--bless-radius-pill`) for people and authors, pairing softly with pill buttons and rounded cards. `color` is `surface` (default) or `text`. `accent` marks a chosen person, like the selected assignee, and never one at rest. `lean` adds an optional hover/focus lean when you want the portrait plate to tilt on attention.

Initials are the first letter of the first two words of `name` (`Megumi Kato` → MK, `加藤 恵` → 加恵). They show when there is no `src`, or when the image fails to load: including a failure that happens before the page hydrates. Without an image the avatar is `role="img"` named by `alt` or `name`. With neither it is decorative. Sizes: `xs` 24 · `sm` 32 · `md` 40 · `lg` 56 · `xl` 80 px.

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

<script setup>
import AvatarBasic from "../demos/AvatarBasic.vue";
</script>
