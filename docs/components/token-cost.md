---
title: Token cost
---

# Token cost

<p class="bless-lead">The tokens of a request and what they cost</p>

Shows what one request to a language model costs, in a developer console, a usage page, or a debug panel. For how full the context window is, use the [context meter](./context-meter).

<Demo title="Basic">
  <TokenCostBasic />
  <template #code>

<<< ../demos/TokenCostBasic.vue

  </template>
</Demo>

- `usage` has the `input` and `output` tokens, and optional `cached` input tokens. Cached tokens are not part of `input`.
- `prices` are the prices for one million tokens of each kind. If `cached` has no price, it costs the same as input.
- The table shows the count, the price, and the cost of each kind, and the total in the footer.
- A cost that fits in cents shows as usual. A smaller cost keeps three digits that count, such as $0.0036, so it does not show as $0.00.
- `currency` (default USD) and `locale` format the money and the counts. `model` goes in the caption.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

The `tokenCost` function does the math. It is exported for your own views, such as a total for a month.

## Usage

```ts
import { BlessTokenCost } from "blessing-ui";
```

## API

<PropsTable name="BlessTokenCost" />

<script setup>
import TokenCostBasic from "../demos/TokenCostBasic.vue";
</script>
