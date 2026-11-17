---
title: Run trace
---

<script setup>
import RunTraceBasic from "../demos/RunTraceBasic.vue";
</script>

# Run trace

<p class="bless-lead">The steps of an agent run with tools, inputs, outputs, and times</p>

Shows what an AI agent did and how long each step took, so a developer or a curious user can see why an answer came out as it did. For the plan before a run, use the [agent plan](./agent-plan).

<Demo title="Basic">
  <RunTraceBasic />
  <template #code>

<<< ../demos/RunTraceBasic.vue

  </template>
</Demo>

- `steps` is the tree of steps. Each step has an `id`, a `name`, a `kind`, a `status`, a `start` and a `duration` in milliseconds from the start of the run, and optional `input`, `output`, and `children`.
- The status is `ok`, `error`, or `running`. It shows as a mark and a word. An error also gets a striped bar.
- The bar of each step sits on a shared time line, so long steps and gaps are easy to see. Children are indented under their parent.
- A step opens to show its input and output. It uses the native details element, so the keyboard works without extra code.
- The top line counts the steps, the total time, and the errors.
- `locale` formats the times. Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessRunTrace } from "blessing-ui";
```

## API

<PropsTable name="BlessRunTrace" />
