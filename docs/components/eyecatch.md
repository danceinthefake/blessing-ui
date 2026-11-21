---
title: Eyecatch
---

<script setup>
import EyecatchBasic from "../demos/EyecatchBasic.vue";
</script>

# Eyecatch

<p class="bless-lead">Anime title card between two parts of a page</p>

The title card of TV anime at a break: a dark band with an accent slash, a small kicker, a large thin title, and a big number. The slash wipes across at the first view of the band. A band that is already in view at page load shows at once.

<Demo title="Basic">
  <EyecatchBasic />
  <template #code>

<<< ../demos/EyecatchBasic.vue

  </template>
</Demo>

- `accent` gives an accent ground with a dark slash. `headingLevel` sets the title tag. If the band opens the page in place of its `h1`, use `1`.
- The number is decoration. Screen readers skip it, so do not put information in it that the text does not also give.
- Calm and reduced motion reach the wipe through the motion tokens.

## Usage

```ts
import { BlessEyecatch } from "blessing-ui";
```

## API

<PropsTable name="BlessEyecatch" />
