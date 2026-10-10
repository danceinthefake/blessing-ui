---
title: Select
---

<script setup>
import SelectBasic from "../demos/SelectBasic.vue";
</script>

# Select

<p class="bless-lead">Styled native &lt;select&gt;</p>

One choice from a list too long for radios. It is the native `<select>`, so phones show their own picker and every keyboard and screen reader already knows it. To type and filter a long list, use [Combobox](./combobox). To keep the options visible, [Listbox](./listbox).

<Demo title="Basic">
  <SelectBasic />
  <template #code>

<<< ../demos/SelectBasic.vue

  </template>
</Demo>

- `placeholder` shows until a person picks something, and it reads as `undefined`. With `required`, an unpicked select fails validation. This is correct.
- Options can be grouped: `{ label, options: [...] }` becomes an `<optgroup>`.
- On Chrome 135+ the open list is styled too (`appearance: base-select`). Elsewhere the browser's own list opens.

## Usage

```ts
import { BlessSelect } from "blessing-ui";
```

## API

<PropsTable name="BlessSelect" />
