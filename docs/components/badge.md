---
title: Badge
---

<script setup>
import BadgeBasic from "../demos/BadgeBasic.vue";
import BadgeColors from "../demos/BadgeColors.vue";
import BadgeOutline from "../demos/BadgeOutline.vue";
</script>

# Badge

<p class="bless-lead">Small label — NEW!, a count, a status word</p>

A cut plate like every other label, in a fill colour with white on it (or `on-light` for warning and success). It marks a thing: new, on sale, paid, episode 12. It is not interactive and never removable — that's [Chip](./chip) — and it doesn't sit on a corner of something else — that's [Indicator](./indicator).

`scaled` shrinks it to 0.8, the way the source site's `NEW!` sat beside a nav item; `BlessSidebarNav` and `BlessListItem` use it, everything else shouldn't. `variant="outline"` is the quiet version: border and text in the colour, no fill — for role and category tags that label rather than shout.

<Demo title="Basic">
  <BadgeBasic />
  <template #code>

<<< ../demos/BadgeBasic.vue

  </template>
</Demo>

<Demo title="Colors">
  <BadgeColors />
  <template #code>

<<< ../demos/BadgeColors.vue

  </template>
</Demo>

<Demo title="Outline">
  <BadgeOutline />
  <template #code>

<<< ../demos/BadgeOutline.vue

  </template>
</Demo>

## Usage

```ts
import { BlessBadge } from "blessing-ui";
```

## API

<PropsTable name="BlessBadge" />
