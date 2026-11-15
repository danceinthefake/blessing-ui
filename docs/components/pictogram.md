---
title: Pictogram
---

<script setup>
import PictogramBasic from "../demos/PictogramBasic.vue";
</script>

# Pictogram

<p class="bless-lead">A count as rows of icons, where one icon stands for a fixed number</p>

Shows counts in a way that a general audience reads at once, for example people in each city. One icon stands for the same number in every row. For exact comparison, use the [lollipop](./lollipop).

<Demo title="Basic">
  <PictogramBasic />
  <template #code>

<<< ../demos/PictogramBasic.vue

  </template>
</Demo>

- `data` is a list of items, each with a `label`, a `value`, and an optional `color`.
- `unit` is the number that one icon stands for. `noun` names what you count, for the line at the top, such as "One icon = 1,000 listeners".
- The last icon of a row shows the rest. For example, 0.4 of an icon is 40% in color.
- The default icon is a person. Put your own SVG in the `icon` slot to change it.
- Set the size of an icon with the `--bless-picto-size` CSS variable (default `18px`), and the width of the names with `--bless-picto-label` (default `7rem`).
- The icons are hidden from screen readers, and each row says its name and its value. `label` names the chart. Change the line at the top with `labels` or a [label pack](../guide/translating): `key` (a function of the unit and the noun).

## Usage

```ts
import { BlessPictogram } from "blessing-ui";
```

## API

<PropsTable name="BlessPictogram" />
