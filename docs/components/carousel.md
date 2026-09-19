---
title: Carousel
---

<script setup>
import CarouselBasic from "../demos/CarouselBasic.vue";
import CarouselPeek from "../demos/CarouselPeek.vue";
</script>

# Carousel

<p class="bless-lead">Scroll-snap slider</p>

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

## Usage

```ts
import { BlessCarousel } from "blessing-ui";
```

## API

<PropsTable name="BlessCarousel" />
