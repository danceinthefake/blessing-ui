---
title: Context meter
---

<script setup>
import ContextMeterBasic from "../demos/ContextMeterBasic.vue";
</script>

# Context meter

<p class="bless-lead">How much of the context window the tokens use</p>

Shows, in a small ring, how full the context window of a model is. The context window is the number of tokens that a model can read at one time. A click on the ring opens a breakdown of the parts. Put it next to the [prompt input](./prompt-input).

<Demo title="Basic">
  <ContextMeterBasic />
  <template #code>

<<< ../demos/ContextMeterBasic.vue

  </template>
</Demo>

- `parts` is a list of the parts that use tokens. Each part has a `label`, a number of `tokens`, and an optional `color`. `max` is the size of the window in tokens.
- The ring and the share show the sum of the parts. At the `warn` share (default 0.8), the ring turns to the warning color. At 95%, it turns to the danger color.
- The breakdown shows a bar with the parts, the tokens of each part, the free tokens, and the sum. Numbers show in short form, such as 41.5K.
- The ring is a button. Its name says the use in words, for example "Context: 160K of 200K tokens used (80%)". Change the words with `labels` or a [label pack](../guide/translating): `title`, `free`, and `used` (a function of the used tokens, the window, and the share).

## Usage

```ts
import { BlessContextMeter } from "blessing-ui";
```

## API

<PropsTable name="BlessContextMeter" />
