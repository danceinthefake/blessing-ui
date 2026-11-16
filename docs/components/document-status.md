---
title: Document status
---

<script setup>
import DocumentStatusBasic from "../demos/DocumentStatusBasic.vue";
</script>

# Document status

<p class="bless-lead">The states of a document, such as draft, approved, sent, and paid, with the next step</p>

Shows where an order, an invoice, or a contract is in its life in an ERP. For the people who approve a step, use the [approval flow](./approval-flow).

<Demo title="Basic">
  <DocumentStatusBasic />
  <template #code>

<<< ../demos/DocumentStatusBasic.vue

  </template>
</Demo>

- `states` is the list of states in order. Each state has an `id` and a `label`. `time` is optional: it says when the document reached the state.
- `v-model` is the id of the current state. It is filled, and it has `aria-current`. Done states have a tick, and states to come are dashed. Screen readers hear "done", "current state", or "not yet" after each name.
- The button moves the document to the next state, such as "Mark as Sent", and emits `advance` with its id. After the last state, the button goes away.
- `stopped` ends the chain with a word, such as "Cancelled". The states to come are struck through, and there is no button.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `done`, `current`, `next`, and `move` (a function).

## Usage

```ts
import { BlessDocumentStatus } from "blessing-ui";
```

## API

<PropsTable name="BlessDocumentStatus" />
