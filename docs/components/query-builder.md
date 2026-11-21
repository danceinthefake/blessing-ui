---
title: QueryBuilder
---

# QueryBuilder

<p class="bless-lead">Filter rules in nested "all" and "any" groups</p>

Builds a filter that has more than one condition, for example "studio is A-1 Pictures, and the show has 12 episodes or aired after 2015". Use it for saved views, segments, and reports. For one search box, use an [input](./input). For filters on the columns of a table, use the filters of the [data table](./data-table).

<Demo title="Basic">
  <QueryBuilderBasic />
  <template #code>

<<< ../demos/QueryBuilderBasic.vue

  </template>
</Demo>

- `fields` lists what people can filter by: `{ name, label, type, options }`. The type is `text` (default), `number`, `date`, or `select`, and it sets the operators and the value control.
- `v-model` is plain data: `{ match: "all" | "any", rules }`. A rule is `{ field, op, value }`, and a rule can also be a group. The component does not filter anything. Turn the data into your query on the server, for example with Ecto's `dynamic/2`.
- The operators are `eq`, `neq`, `contains`, `starts`, `lt`, `lte`, `gt`, `gte`, `empty`, and `notEmpty`. A date field shows `lt` and `gt` as "is before" and "is after". `empty` and `notEmpty` take no value.
- The value is the text of its control, also for a number or a date (`"12"`, `"2015-01-01"`). Convert it where you build the query.
- When a rule changes to a field that does not have its operator, the operator goes to the field's first one, and the value clears.
- `maxDepth` sets how deep groups can go (default 2: groups in the top group, and no deeper). A group inside a group has a line on its start edge.
- After a remove, focus goes to the "Add rule" button of the same group, so the keyboard stays in place.
- Change the words with `labels` or a [label pack](../guide/translating): the buttons, the names of the controls, and each operator.

## Usage

```ts
import { BlessQueryBuilder, type BlessQueryField, type BlessQueryGroup } from "blessing-ui";
```

## API

<PropsTable name="BlessQueryBuilder" />

<script setup>
import QueryBuilderBasic from "../demos/QueryBuilderBasic.vue";
</script>
