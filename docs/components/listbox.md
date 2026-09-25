---
title: Listbox
---

<script setup>
import ListboxBasic from "../demos/ListboxBasic.vue";
</script>

# Listbox

<p class="bless-lead">Single / multi select list, role=listbox</p>

A choice where the options should stay visible — a short list in a sidebar, a filter panel, a settings pane. When space is tight use [Select](./select); for a handful of single choices [RadioGroup](./radio-group) is simpler; to type and filter, [Combobox](./combobox).

<Demo title="Basic">
  <ListboxBasic />
  <template #code>

<<< ../demos/ListboxBasic.vue

  </template>
</Demo>

- One tab stop. Arrows move, Home/End jump, Space or Enter picks, and typing letters jumps to a matching label. Focus starts on the selected option.
- `multiple` toggles each option; `rows` caps the height and scrolls.
- Inside a [Field](./form) the field's label names it. `name` submits one value per selected option.

## Usage

```ts
import { BlessListbox } from "blessing-ui";
```

## API

<PropsTable name="BlessListbox" />
