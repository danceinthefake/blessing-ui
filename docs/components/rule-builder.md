---
title: Rule builder
---

# Rule builder

<p class="bless-lead">An automation rule: when something happens, if a condition holds, then do an action</p>

Makes a rule for a smart home or a workflow tool. For a filter with many fields and operators, use the [query builder](./query-builder).

<Demo title="Basic">
  <RuleBuilderBasic />
  <template #code>

<<< ../demos/RuleBuilderBasic.vue

  </template>
</Demo>

- `triggers`, `conditions`, and `actions` are the lists to pick from. Each option has an `id` and a `label`. Write each label so that it reads well in a sentence, such as "the studio door opens".
- `v-model` is the rule: `when` is one trigger id, `if` is a list of condition ids, and `then` is a list of action ids. All the conditions must hold.
- Each part is a fieldset of native menus. "Add a condition" and "Add an action" add a row. The ✕ button removes a row, and its name says what it removes. A rule keeps at least one action row.
- A line under the form reads the rule as one sentence. The demo shows an example.
- "Save the rule" emits `save` with the rule, without empty rows. It is off until the rule has a trigger and an action.
- Without `conditions`, the "Only if" part does not show.
- Change the words with `labels` or a [label pack](../guide/translating): `when`, `if`, `then`, `pick`, `addIf`, `addThen`, `save`, `preview`, `and`, and the functions `remove` and `sentence`.

## Usage

```ts
import { BlessRuleBuilder } from "blessing-ui";
```

## API

<PropsTable name="BlessRuleBuilder" />

<script setup>
import RuleBuilderBasic from "../demos/RuleBuilderBasic.vue";
</script>
