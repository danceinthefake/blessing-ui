---
title: Badge
---

<script setup>
import BadgeBasic from "../demos/BadgeBasic.vue";
import BadgeColors from "../demos/BadgeColors.vue";
import BadgeOutline from "../demos/BadgeOutline.vue";
</script>

# Badge

<p class="bless-lead">Small label: NEW!, a count, a status word</p>

An upright plate like every other label: it is never attended to, so it never leans. Ink by default: color means chosen, and a NEW! marker is not a choice. `danger`, `warning`, `success` and `info` are for status. `badge` and `accent` follow the palette and are for something chosen. Fills carry white text (`on-light` on warning and success). It marks a thing: new, on sale, paid, episode 12. It is not interactive and never removable (that is [Chip](./chip)) and it does not sit on a corner of something else: that is [Indicator](./indicator).

`scaled` shrinks it to 0.8, the way the `NEW!` of the source site sat beside a nav item. `BlessSidebarNav` and `BlessListItem` use it. Everything else must not use it. `variant="outline"` is the quiet version: border and text in the color, no fill. Use it for role and category tags that label rather than shout. Warning and success outlines take a muted border, because their fills are too pale to draw a line.

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
