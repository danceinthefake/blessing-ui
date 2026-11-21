---
title: Bundle size
---

# Bundle size

Each component is its own file with its own stylesheet, so your app pays only for the components that it imports. The table shows what one component adds to an app when you import it alone.

<Demo title="Each component">
  <SizesTable />
  <template #code>

<<< ../demos/SizesTable.vue

  </template>
</Demo>

## How the numbers are made

- The check installs the packed package in a sample app, as you install it from npm.
- It bundles each component alone with Vite, minified, and gzips the JS and the CSS.
- Vue is not counted, because your app has it already. The design tokens (about 2 KB) are not counted either, because the app loads them once for all components.
- A component that uses other components counts them too. For example, `BlessDataTable` includes its pagination and its select.
- `BlessEditor`, `BlessChart`, and `BlessMarkdown` do not count Tiptap, Unovis, and marked, which you install yourself.

Two components that share a part pay for it once in your app, so the sum of two rows is more than their real cost together. The check runs on every push, so the table matches the current code. To see the cost of the whole library, read [Install](./install).

<script setup>
import SizesTable from "../demos/SizesTable.vue";
</script>
