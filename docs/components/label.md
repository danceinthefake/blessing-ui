---
title: Label
---

<script setup>
import LabelBasic from "../demos/LabelBasic.vue";
</script>

# Label

<p class="bless-lead">&lt;label&gt; with required mark and hint</p>

A label for a control that isn't in a form field — in a toolbar, or a layout of your own. In a form use [Field](./form): it renders this label and also wires the id, the description and the error.

<Demo title="Basic">
  <LabelBasic />
  <template #code>

<<< ../demos/LabelBasic.vue

  </template>
</Demo>

- `required` draws the `*` and nothing else — the mark is hidden from screen readers. Put `required` on the control, which is what gets announced and validated.
- `hint` is read as part of the label, so keep it to a word or two (`optional`, `max 3`). A sentence belongs in Field's `description`, which is read as a description instead.

## Usage

```ts
import { BlessLabel } from "blessing-ui";
```

## API

<PropsTable name="BlessLabel" />
