---
title: Quota usage
---

<script setup>
import QuotaUsageBasic from "../demos/QuotaUsageBasic.vue";
</script>

# Quota usage

<p class="bless-lead">The limits of a plan as bars, with the use in words</p>

Shows how much of each limit of a plan a team uses, such as storage, seats, or minutes. Near the end of a limit, a bar warns. For parts of one total, use the [meter group](./meter-group).

<Demo title="Basic">
  <QuotaUsageBasic />
  <template #code>

<<< ../demos/QuotaUsageBasic.vue

  </template>
</Demo>

- `quotas` is a list of limits. Each limit has a `label`, the `used` amount, the `limit`, and an optional `unit`, such as "GB".
- At the `warn` share (default 0.8), the bar turns to the warning color and says "Almost full". At the limit, it turns to the danger color and says "Limit reached". A bar never goes past full, but the text shows the real use.
- `locale` sets the format of the numbers (default `en`).
- The `footer` slot holds a button or a link, for example to change the plan.
- Each bar is a meter for screen readers, with the use and the state in words. Change the words with `labels` or a [label pack](../guide/translating): `almost`, `full`, and `of` (a function of the use and the limit).

## Usage

```ts
import { BlessQuotaUsage } from "blessing-ui";
```

## API

<PropsTable name="BlessQuotaUsage" />
