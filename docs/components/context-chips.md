---
title: Context chips
---

# Context chips

<p class="bless-lead">The files and pages that go with a message, as chips that you can remove</p>

Shows above a [prompt input](./prompt-input) what the AI assistant gets with the next message, so the person knows what it can see.

<Demo title="Basic">
  <ContextChipsBasic />
  <template #code>

<<< ../demos/ContextChipsBasic.vue

  </template>
</Demo>

- `items` is the list. Each item has an `id`, a `label`, a `kind`, and an optional `detail`, such as the size or the number of tokens.
- The kind is `file`, `page`, `image`, `folder`, or `selection`. It shows as a word in front of the label.
- Each chip is a [chip](./chip) with a remove button. The button has the label in its name, as in "Remove launch-plan.pdf", and emits `remove` with the id.
- `addable` shows an "Add context" button that emits `add`. Open your file picker or page search from it.
- A long label is cut with an ellipsis. The full label stays in the name of the remove button.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessContextChips } from "blessing-ui";
```

## API

<PropsTable name="BlessContextChips" />

<script setup>
import ContextChipsBasic from "../demos/ContextChipsBasic.vue";
</script>
