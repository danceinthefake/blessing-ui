---
title: Carousel
---

<script setup>
import CarouselBasic from "../demos/CarouselBasic.vue";
import CarouselPeek from "../demos/CarouselPeek.vue";
</script>

# Carousel

<p class="bless-lead">Scroll-snap slider</p>

A row of slides people swipe or step through — key visuals, episode stills. Only the first slide is sure to be seen, so don't put anything essential after it; for a set people should browse, a [Gallery](./gallery) grid shows everything.

<Demo title="Basic">
  <CarouselBasic />
  <template #code>

<<< ../demos/CarouselBasic.vue

  </template>
</Demo>

<Demo title="Peek">
  <CarouselPeek />
  <template #code>

<<< ../demos/CarouselPeek.vue

  </template>
</Demo>

- Native scroll snapping underneath, so touch swipe and trackpads work as expected, including right-to-left pages. `arrows` and `dots` step through; each dot names its slide.

## Usage

```ts
import { BlessCarousel } from "blessing-ui";
```

## API

<PropsTable name="BlessCarousel" />
