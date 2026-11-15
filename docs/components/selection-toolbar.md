---
title: Selection toolbar
---

<script setup>
import SelectionToolbarBasic from "../demos/SelectionToolbarBasic.vue";
</script>

# Selection toolbar

<p class="bless-lead">Actions above the selected text</p>

A small toolbar that comes up when a person selects text in an area, for example to mark, quote, or comment on it. For a full text editor with its own toolbar, use the [editor](./editor).

<Demo title="Basic">
  <SelectionToolbarBasic />
  <template #code>

<<< ../demos/SelectionToolbarBasic.vue

  </template>
</Demo>

- Put the text in the default slot. The toolbar shows when the selection is inside the area and has at least `min-length` letters (default 1).
- `actions` is a list of `{ id, label, icon }`. A button with an icon uses the label as its name for screen readers and its tooltip. A click emits `action` with the id and `{ text, range }`, where `range` is a copy of the selection. Then the toolbar closes.
- The `toolbar` slot replaces the buttons. It gets the `selection` and a `run(id)` function.
- The toolbar goes above the selection, or below it near the top of the window. It moves when the page scrolls.
- A click on the toolbar keeps the selection. The toolbar comes after the text, so Tab from the selected text reaches it. The arrow keys move between its buttons, and Escape closes it.
- Change the name of the toolbar for screen readers with `labels` or a [label pack](../guide/translating): `label`.

## Usage

```ts
import { BlessSelectionToolbar, type BlessSelection, type BlessSelectionAction } from "blessing-ui";
```

## API

<PropsTable name="BlessSelectionToolbar" />
