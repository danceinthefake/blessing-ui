---
title: Saved form
---

# Saved form

<p class="bless-lead">A long form that saves a draft in the browser and offers to go on with it later</p>

Keeps the work of a person who fills a long form, such as a permit or a grant request, if they close the page or lose the connection.

<Demo title="Basic">
  <SavedFormBasic />
  <template #code>

<<< ../demos/SavedFormBasic.vue

  </template>
</Demo>

- Put your fields in the default slot. `v-model` holds all the values in one object.
- After each change and a wait of `delay` milliseconds (default 600), the form saves a draft in `localStorage` under `storage-key`. A status line says when.
- When the form opens and finds a draft that differs from the values, it asks: "Go on with the draft" or "Start again". It does not save until the person chooses.
- "Save and come back later" saves at once and emits `later`. Send emits `submit` and deletes the draft.
- If the browser blocks storage, as in some private windows, the form still works without drafts.

The draft stays on the device. Do not use it for secrets, such as passwords or card numbers. On a shared computer, the next person can see the draft. For a long form that people fill on many devices, save the draft on your server.

## Usage

```ts
import { BlessSavedForm } from "blessing-ui";
```

## API

<PropsTable name="BlessSavedForm" />

<script setup>
import SavedFormBasic from "../demos/SavedFormBasic.vue";
</script>
