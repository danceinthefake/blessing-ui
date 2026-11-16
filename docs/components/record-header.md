---
title: Record header
---

<script setup>
import RecordHeaderBasic from "../demos/RecordHeaderBasic.vue";
</script>

# Record header

<p class="bless-lead">The top of a record page: the name, the status, key facts, and the main actions</p>

Starts the page of one record in an ERP, a CRM, or an admin panel, such as an order, a customer, or a product. For a full list of fields, use the [descriptions](./descriptions) under it.

<Demo title="Basic">
  <RecordHeaderBasic />
  <template #code>

<<< ../demos/RecordHeaderBasic.vue

  </template>
</Demo>

- `title` is the name of the record. `code` is its number, in a mono font above the title. `level` sets the heading level (default 1).
- `status` is the state as a word. `tone` adds a mark and a look: `neutral` (default), `success`, `warning`, or `danger`. The word carries the meaning, not the look.
- `facts` is a list of key facts, each with a `label` and a `value`. They show as a native description list.
- Put the main buttons in the default slot.

## Usage

```ts
import { BlessRecordHeader } from "blessing-ui";
```

## API

<PropsTable name="BlessRecordHeader" />
