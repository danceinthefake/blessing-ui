---
title: Approval flow
---

<script setup>
import ApprovalFlowBasic from "../demos/ApprovalFlowBasic.vue";
</script>

# Approval flow

<p class="bless-lead">The steps of a request, with approvers and their decisions</p>

Shows who must sign off a request, in which order, and what each person decided. The reader can approve or reject when it is their turn. For steps that one person goes through, use the [stepper](./stepper).

<Demo title="Basic">
  <ApprovalFlowBasic />
  <template #code>

<<< ../demos/ApprovalFlowBasic.vue

  </template>
</Demo>

- `steps` is a list of steps in order. Each step has an `id`, a `title`, a list of `approvers`, and a `rule`.
- Each approver has a `name`, and an optional `avatar`, `decision`, `note`, and `time`. The decision is `approved`, `rejected`, or `pending`.
- With the rule `all` (default), every approver must approve. With `any`, one approval is enough. One rejection rejects the step.
- The current step is the first step that is not approved. The line at the top says what the flow waits for, or that it is done or stopped.
- `me` is the name of the reader. If the reader is a waiting approver of the current step, a note field and the Approve and Reject buttons show. A decision emits `decide` with the step id, the decision, and the note. Save it, then update `steps`.
- Each step and each decision has a mark and a word, so the state does not rest on the color. Change the words with `labels` or a [label pack](../guide/translating): `title`, `approved`, `rejected`, `pending`, `approve`, `reject`, `note`, `all`, `any`, `done`, `stopped`, and `waiting` (a function of the step).

## Usage

```ts
import { BlessApprovalFlow } from "blessing-ui";
```

## API

<PropsTable name="BlessApprovalFlow" />
