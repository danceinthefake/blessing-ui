---
title: Contact picker
---

# Contact picker

<p class="bless-lead">Search people and pick one or more, with recent contacts</p>

Picks the people for a new chat, a share, or a meeting. For one person in a form field, use the [combobox](./combobox).

<Demo title="Basic">
  <ContactPickerBasic />
  <template #code>

<<< ../demos/ContactPickerBasic.vue

  </template>
</Demo>

- `contacts` is a list of people. Each person has an `id` and a `name`, and an optional `detail` and `avatar`. The detail shows under the name, such as an email or a role.
- `recent` is a list of ids. While the search is empty, these people show first under "Recent", and everybody shows under "All people" by name.
- The search looks at the name and the detail. If nobody matches, a status line says so.
- `v-model` is the list of chosen ids. With `multiple` (on by default), each person has a check box. Without it, each person has a radio button.
- The chosen people show as chips on top. The ✕ on a chip removes the person.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `search`, `recent`, `all`, `none`, `chosen`, and `remove`.

## Usage

```ts
import { BlessContactPicker } from "blessing-ui";
```

## API

<PropsTable name="BlessContactPicker" />

<script setup>
import ContactPickerBasic from "../demos/ContactPickerBasic.vue";
</script>
