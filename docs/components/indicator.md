---
title: Indicator
---

<script setup>
import IndicatorBasic from "../demos/IndicatorBasic.vue";
</script>

# Indicator

<p class="bless-lead">Count or dot badge anchored on any element</p>

A small petal pinned to a corner of whatever it wraps — a count on an inbox button, a presence dot on an avatar. `value` as a number shows the count (`max`, default 99, turns 120 into "99+"); `true` shows a dot; `0` or `false` hides it. `position` names a physical corner and stays put in RTL, like every side-named prop. `inline` is on by default for icons and buttons; turn it off to wrap a block.

Give it a `label` that says what the number means — "3 unread", "online" — and it becomes a `status` region with that name. Without one the badge is decorative and hidden from screen readers, because a bare "3" read after a button name means nothing. For a label that sits _in_ the text rather than on a corner, use [Badge](./badge).

<Demo title="Basic">
  <IndicatorBasic />
  <template #code>

<<< ../demos/IndicatorBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessIndicator } from "blessing-ui";
```

## API

<PropsTable name="BlessIndicator" />
