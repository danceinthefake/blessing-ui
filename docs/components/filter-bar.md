---
title: Filter bar
---

<script setup>
import FilterBarBasic from "../demos/FilterBarBasic.vue";
</script>

# Filter bar

<p class="bless-lead">Filters as chips in a row</p>

A short row of filters above a list or a table, for example "Status is Live". Each filter is a chip that a person can change or remove. All the filters must match. For "any" rules and groups of rules, use the [query builder](./query-builder), which has the same data for a rule.

<Demo title="Basic">
  <FilterBarBasic />
  <template #code>

<<< ../demos/FilterBarBasic.vue

  </template>
</Demo>

- `fields` is a list of `{ name, label, type, options }`, as for the [query builder](./query-builder). The type (`text`, `number`, `date`, or `select`) sets the operators and the value control.
- `v-model` is a list of rules `{ field, op, value }`. All the rules must match. The value is the text of the control, so turn it into your query, for example on the server.
- Each chip says its rule in words, for example "Status is Live". A select field shows the label of its option, and a date field says "is before" and "is after".
- "Add filter" opens a list of the fields. The new filter opens its editor at once, so the person sets the value next. A click on a chip opens the editor again. Enter in the value closes it.
- The × on a chip removes the filter, and focus goes to "Add filter". "Clear all" removes all of them.
- Change the words with `labels` or a [label pack](../guide/translating): `label`, `add`, `clear`, `done`, `remove`, `op`, `value`, and the words of each operator.

## Usage

```ts
import { BlessFilterBar, type BlessQueryField, type BlessQueryRule } from "blessing-ui";
```

## API

<PropsTable name="BlessFilterBar" />
