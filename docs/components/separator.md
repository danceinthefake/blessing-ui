---
title: Separator
---

<script setup>
import SeparatorBasic from "../demos/SeparatorBasic.vue";
</script>

# Separator

<p class="bless-lead">&lt;hr&gt; / vertical rule, optional label</p>

A rule between things. Horizontal, it is a real `<hr>` — a thematic break assistive tech announces — unless you say `decorative`, which is right for a line that only tidies a layout (between icons in a toolbar, under a header). Vertical needs a flex row with `align-items: stretch` to have a height. `label` puts a word in the middle — the "— or —" between two sign-in methods — as plain text between two hairlines.

Three colours: `border` (the hairline), `rule` (the text colour — the source site's heavy rules under section titles), `accent`. It comes with a little block margin; override it when the layout supplies its own. An inline dash in a line of text is [Dash](./dash).

<Demo title="Basic">
  <SeparatorBasic />
  <template #code>

<<< ../demos/SeparatorBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessSeparator } from "blessing-ui";
```

## API

<PropsTable name="BlessSeparator" />
