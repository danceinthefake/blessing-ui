---
title: Document checklist
---

# Document checklist

<p class="bless-lead">The documents that a request needs, with an upload and a state for each</p>

Shows a person which papers to send for a permit, a loan, or a visa, and what happened to each one.

<Demo title="Basic">
  <DocumentChecklistBasic />
  <template #code>

<<< ../demos/DocumentChecklistBasic.vue

  </template>
</Demo>

- `docs` is the list. Each document has an `id`, a `name`, a `state`, and optional `hint`, `required`, `accept`, `file`, and `reason`.
- The state is `missing`, `uploaded`, `checking`, `accepted`, or `rejected`. It shows as a mark and words, with the file name.
- A rejected document gets a red frame and the `reason`, so the person knows what to fix.
- The Upload or Replace button opens the file picker of the device. It emits `upload` with the id and the file. You send the file and change the state. Screen readers hear the name of the document too, as in "Upload Lease".
- A sent document can be removed with the ✕ button, which emits `remove`. Documents that are accepted or being checked have no buttons.
- The status line on top counts the required documents that are sent and not rejected.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessDocumentChecklist } from "blessing-ui";
```

## API

<PropsTable name="BlessDocumentChecklist" />

<script setup>
import DocumentChecklistBasic from "../demos/DocumentChecklistBasic.vue";
</script>
