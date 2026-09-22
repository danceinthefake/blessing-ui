---
title: FloatLabel
---

<script setup>
import FloatLabelBasic from "../demos/FloatLabelBasic.vue";
</script>

# FloatLabel

<p class="bless-lead">Floating / in-field label wrapper</p>

For where a stacked label costs too much height — a sign-in card, a search bar, a filter row. A long form defaults to [Field](./form): it has description, error and required, this has a label.

<Demo title="Basic">
  <FloatLabelBasic />
  <template #code>

<<< ../demos/FloatLabelBasic.vue

  </template>
</Demo>

- The control inside takes the wrapper's id, so the label is associated without `for`/`id`. `for` is there for a control that already has one.
- `over` (default) is CSS-only and floats on focus or value via `:placeholder-shown`, so the control needs a placeholder — `placeholder=" "` will do; it is hidden. The wrapper reserves the room above for the floated label.
- `in` keeps the label inside the control, top-aligned, and never moves; no placeholder needed.

## Usage

```ts
import { BlessFloatLabel } from "blessing-ui";
```

## API

<PropsTable name="BlessFloatLabel" />
