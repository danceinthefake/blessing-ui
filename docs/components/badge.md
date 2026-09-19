---
title: Badge
---

<script setup>
import BadgeBasic from "../demos/BadgeBasic.vue";
import BadgeColors from "../demos/BadgeColors.vue";
</script>

# Badge

<p class="bless-lead">Small pill</p>

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

## Usage

```ts
import { BlessBadge } from "blessing-ui";
```

## API

<PropsTable name="BlessBadge" />
