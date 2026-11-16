---
title: Report dialog
---

<script setup>
import ReportDialogBasic from "../demos/ReportDialogBasic.vue";
</script>

# Report dialog

<p class="bless-lead">Report a post or a person, with a reason and a note</p>

Lets a reader tell the moderators about harmful content. It opens in a [modal](./modal) from a menu or a button.

<Demo title="Basic">
  <ReportDialogBasic />
  <template #code>

<<< ../demos/ReportDialogBasic.vue

  </template>
</Demo>

- `v-model:open` opens and closes the dialog. Each time it opens, the form is empty.
- `subject` is what the reader reports, for the title, such as "this comment" (default "this post").
- `reasons` is the list of reasons. Each reason is a native radio button. The default list has five reasons.
- If no reason is chosen, the form shows "Pick a reason." Screen readers hear it at once, and the group is marked as not valid.
- A good report emits `report` with the reason and the note. Then the dialog thanks the reader and says that the person does not see who reported it.
- Change the words with `labels` or a [label pack](../guide/translating): `why`, `note`, `send`, `cancel`, `missing`, `thanks`, `thanksBody`, `close`, and `title` (a function). The reasons are your own text.

## Usage

```ts
import { BlessReportDialog } from "blessing-ui";
```

## API

<PropsTable name="BlessReportDialog" />
