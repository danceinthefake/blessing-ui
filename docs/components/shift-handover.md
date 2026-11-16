---
title: Shift handover
---

<script setup>
import ShiftHandoverBasic from "../demos/ShiftHandoverBasic.vue";
</script>

# Shift handover

<p class="bless-lead">Notes from one shift to the next, with open issues</p>

Passes what matters from the team that leaves to the team that comes, on a shop floor, in a warehouse, or in a hospital ward.

<Demo title="Basic">
  <ShiftHandoverBasic />
  <template #code>

<<< ../demos/ShiftHandoverBasic.vue

  </template>
</Demo>

- `title` names the change of shift, and `by` says who wrote it and when.
- `facts` are key numbers of the shift, each with a `label` and a `value`. `notes` is free text, and line breaks stay.
- `v-model:issues` is the list of issues. Each issue has an `id`, a `text`, and a `level`. It can also have an `owner` and `closed`.
- The level is `stop`, `watch`, or `info`. It shows as a mark and a word, and stop issues come first in a red frame.
- Each issue has a check box that closes it. A closed issue is struck through and goes to the end. The status line counts the open issues.
- "Read and take over" emits `acknowledge`. After that, set `readBy`, and the button becomes a line such as "Taken over by Budi".
- Change the words with `labels` or a [label pack](../guide/translating): the three levels, `issues`, `acknowledge`, and the functions `open`, `close`, `readBy`, and `owner`.

## Usage

```ts
import { BlessShiftHandover } from "blessing-ui";
```

## API

<PropsTable name="BlessShiftHandover" />
