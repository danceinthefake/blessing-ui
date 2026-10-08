---
title: Formula
---

<script setup>
import FormulaBasic from "../demos/FormulaBasic.vue";
</script>

# Formula

<p class="bless-lead">A calculation typed by hand, checked as they type</p>

An expression field for the places where a person writes a small calculation — a price rule, a derived column, a score. It shows the result as they type, says exactly what is wrong when it isn't, and offers the values they can use. For a plain number use [InputNumber](./input-number); for free text, [Input](./input).

<Demo title="Price rule">
  <FormulaBasic />
  <template #code>

<<< ../demos/FormulaBasic.vue

  </template>
</Demo>

- Supports `+ − × ÷ ^`, brackets, numbers, named values and functions (`sum min max avg abs sqrt floor ceil round`, plus your own in `functions`). It is parsed, never `eval`ed — the formula can only ever produce a number, and `constructor` or `toString(1)` are just unknown names.
- `variables` are `{ name, label?, value }`. The chips insert the name at the caret and keep focus in the field; a chip reads as pressed when the formula uses it, and shows `name = value` on hover.
- The line under the field is a polite live region: `= 52` when it works, otherwise what is wrong and where (`Unexpected “$” at position 7`, `A bracket is not closed`, `Division by zero`). A mistyped name gets "did you mean…?" and a button that fixes it in place. The input is `aria-invalid` while it is wrong.
- `result` emits the number, or `null` while it can't be calculated — disable your Save button on that. `labels.error(e)` receives `{ code, pos, length, name, suggestion }` to write the messages in your language; `evaluateFormula()` is exported from `blessing-ui` for server-side checks with the same rules.

## Usage

```ts
import { BlessFormula, evaluateFormula } from "blessing-ui";
```

## API

<PropsTable name="BlessFormula" />
