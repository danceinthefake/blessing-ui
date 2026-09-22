---
title: Fieldset
---

<script setup>
import FieldsetBasic from "../demos/FieldsetBasic.vue";
</script>

# Fieldset

<p class="bless-lead">Legend group, toggleable</p>

One name for a set of controls — a radio or checkbox set, an address, notification preferences. The legend is announced together with each control inside, which a heading above a group is not. For a box around content rather than controls, use [Panel](./panel) or [Collapsible](./collapsible).

<Demo title="Basic">
  <FieldsetBasic />
  <template #code>

<<< ../demos/FieldsetBasic.vue

  </template>
</Demo>

- `disabled` disables every control inside — the native cascade, no prop-drilling.
- `toggleable` puts the legend on a button with `v-model:collapsed`. Collapsed content is hidden, not removed, so its fields still submit with the form.
- `#legend` slot for a legend with markup; the `legend` prop for plain text.

## Usage

```ts
import { BlessFieldset } from "blessing-ui";
```

## API

<PropsTable name="BlessFieldset" />
