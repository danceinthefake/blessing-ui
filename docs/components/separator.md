---
title: Separator
---

<script setup>
import SeparatorBasic from "../demos/SeparatorBasic.vue";
</script>

# Separator

<p class="bless-lead">&lt;hr&gt; / vertical rule, optional label</p>

A rule between things. A horizontal separator is a real `<hr>` (a thematic break that assistive tech announces), unless you say `decorative`. `decorative` is right for a line that only tidies a layout (between icons in a toolbar, under a header). A vertical separator needs a flex row with `align-items: stretch` to have a height. `label` puts a word in the middle, for example the "or" between two sign-in methods, as plain text between two hairlines.

Three colors: `border` (the hairline), `rule` (the text color: the source site's heavy rules under section titles), and `accent`, which is only for a rule that marks something chosen: like every other part, a separator is never accent at rest. It comes with a little block margin. Override it when the layout supplies its own. An inline dash in a line of text is [Dash](./dash).

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
