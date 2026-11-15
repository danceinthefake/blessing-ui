---
title: Reasoning
---

<script setup>
import ReasoningBasic from "../demos/ReasoningBasic.vue";
</script>

# Reasoning

<p class="bless-lead">The thinking of a model, in a panel that folds</p>

Shows the reasoning of a model above its reply. While the model thinks, the panel is open and the head says "Thinking…". At the end, the panel closes and the head says how long the model thought. For a call to a tool, use the [tool call](./tool-call).

<Demo title="Basic">
  <ReasoningBasic />
  <template #code>

<<< ../demos/ReasoningBasic.vue

  </template>
</Demo>

- Give the text so far in `text`, or put your own content in the default slot. The text keeps its line breaks.
- Set `streaming` while the model thinks. A soft light runs over the head, and the body has `aria-busy`. If the reader asks for less motion, the light does not run.
- If the reader does not touch the panel, it opens when the model starts and closes at the end. A reader who opens or closes the panel keeps that choice.
- The time is the time that `streaming` was on. For a reply from the history, give the time in seconds with `duration`. With no time, the head says "Reasoning".
- `v-model:open` reads or sets the state of the panel.
- The panel is a native `details` element, so the keyboard and screen readers know it. Change the words with `labels` or a [label pack](../guide/translating): `thinking`, `thought` (a function of the seconds), and `done`.

## Usage

```ts
import { BlessReasoning } from "blessing-ui";
```

## API

<PropsTable name="BlessReasoning" />
