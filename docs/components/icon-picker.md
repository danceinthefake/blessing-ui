---
title: Icon picker
---

<script setup>
import IconPickerBasic from "../demos/IconPickerBasic.vue";
</script>

# Icon picker

<p class="bless-lead">A grid of your icons, with a search and arrow keys</p>

Lets a person choose an icon, for example for a show, a category, or a menu item. The library has no icon set. You give the icons. For an emoji, use the [emoji picker](./emoji-picker).

<Demo title="Basic">
  <IconPickerBasic />
  <template #code>

<<< ../demos/IconPickerBasic.vue

  </template>
</Demo>

- `icons` is a list of icons. Each icon has a `name`, the `path` data of its shape (or a list of paths), and optional `keywords`. The component draws the paths itself, so no SVG text goes into the page as raw HTML.
- `view-box` is the box of the path data (default `0 0 24 24`). `stroke` draws the paths as lines, for line icons.
- `v-model` is the name of the chosen icon. The chosen icon is a filled box.
- The search matches the names and the keywords. A status line says how many icons match.
- The grid is a group of native radio buttons, so the arrow keys move between icons. Each icon has its name for screen readers and as a tooltip.
- Change the words with `labels` or a [label pack](../guide/translating): `search`, `group`, `none`, and `count` (a function of the number).

## Usage

```ts
import { BlessIconPicker } from "blessing-ui";
```

## API

<PropsTable name="BlessIconPicker" />
