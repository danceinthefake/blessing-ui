---
title: Parallax
---

<script setup>
import ParallaxBasic from "../demos/ParallaxBasic.vue";
</script>

# Parallax

<p class="bless-lead">Background that scrolls slower</p>

A background image that moves slower than the page as you scroll, behind a heading or a quote. It is decoration. Nothing can depend on it, and it holds still under reduced motion.

<Demo title="Basic">
  <ParallaxBasic />
  <template #code>

<<< ../demos/ParallaxBasic.vue

  </template>
</Demo>

- `speed` (0 fixed to 1 with the page). `height` of the band. `alt` stays empty unless the image says something that the text does not.

## Usage

```ts
import { BlessParallax } from "blessing-ui";
```

## API

<PropsTable name="BlessParallax" />
