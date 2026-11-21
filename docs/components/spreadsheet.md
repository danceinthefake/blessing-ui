---
title: Spreadsheet
---

# Spreadsheet

<p class="bless-lead">A grid of cells that you edit with the keyboard and paste into</p>

Lets people type or paste rows of plain data, as in a spreadsheet app. For example, a list of episodes with their plays. It has no formulas: your code reads the cells and does the math. To show data with sort and filter, use the [data table](./data-table).

<Demo title="Basic">
  <SpreadsheetBasic />
  <template #code>

<<< ../demos/SpreadsheetBasic.vue

  </template>
</Demo>

- `v-model` is the cells, row by row, as text. `columns` names the columns. With no names, the columns are A, B, C, and so on. `min-columns` sets the number of columns of an empty sheet.
- The arrow keys move the active cell. Shift and an arrow key make a selection. Home and End go to the start and the end of the row. With Ctrl or ⌘, they go to the first and the last cell.
- To edit a cell, start to type, or press Enter or F2, or double-click it. In the edit, Enter saves and goes down, Tab saves and goes right, and Escape cancels. Enter on the last row adds a new row.
- Delete or Backspace clears the selected cells.
- Copy gives the selection as text with tabs, so a spreadsheet app can read it. Paste writes the cells from the active cell. If the sheet is too short, paste adds rows at the end. Cut copies and clears.
- A cell that holds a number aligns to the end. Set the width of a column with the `--bless-spreadsheet-column` CSS variable (default `7.5rem`).
- `readonly` keeps the moves, the selection, and copy, but stops all changes.
- The sheet is a `grid` for screen readers, with one tab stop. `label` names the grid.

## Usage

```ts
import { BlessSpreadsheet } from "blessing-ui";
```

## API

<PropsTable name="BlessSpreadsheet" />

<script setup>
import SpreadsheetBasic from "../demos/SpreadsheetBasic.vue";
</script>
