---
title: Gallery
---

<script setup>
import GalleryBasic from "../demos/GalleryBasic.vue";
</script>

# Gallery

<p class="bless-lead">Thumb grid + lightbox</p>

A grid of thumbnails that open one large image at a time — stills, key visuals, a photo set. For a single strip people swipe through in place, use a [Carousel](./carousel).

<Demo title="Basic">
  <GalleryBasic />
  <template #code>

<<< ../demos/GalleryBasic.vue

  </template>
</Demo>

- Give every item `alt` text; without it, thumbs and the viewer fall back to the caption or "Image 2 of 8".
- The viewer is a [Modal](./modal): ← / → (and the buttons) step through, the count is announced, Esc closes and focus returns to the thumb. `loop` wraps at the ends.

## Usage

```ts
import { BlessGallery } from "blessing-ui";
```

## API

<PropsTable name="BlessGallery" />
