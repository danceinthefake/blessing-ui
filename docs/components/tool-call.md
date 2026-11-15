---
title: Tool call
---

<script setup>
import ToolCallBasic from "../demos/ToolCallBasic.vue";
</script>

# Tool call

<p class="bless-lead">One step of an assistant, with its input and output</p>

Shows a tool that an assistant uses while it works, for example a web search, and what the tool got and gave back. Put the steps in order between the [prompt input](./prompt-input) and the [streaming](./streaming-text) reply.

<Demo title="Basic">
  <ToolCallBasic />
  <template #code>

<<< ../demos/ToolCallBasic.vue

  </template>
</Demo>

- `name` is the name of the tool, and `summary` is a short line after it, for example the search words.
- `status` is `running` (a spinner), `done` (a check), or `error` (a cross). The status is also a word, so it does not depend on color.
- The step is closed by default. A click on the line opens it and shows `input` and `output`. It is a native `<details>`, so the keyboard and screen readers work with no script. `v-model:open` holds its state.
- `input` and `output` can be a text, or data that shows as formatted JSON. Leave one out and its part is not shown. The `input` and `output` slots replace each part, for example with a [code block](./code-block).
- Change the words with `labels` or a [label pack](../guide/translating): `running`, `done`, `error`, `input`, and `output`.

## Usage

```ts
import { BlessToolCall } from "blessing-ui";
```

## API

<PropsTable name="BlessToolCall" />
