---
title: Lightbox
---

# Lightbox

<p class="bless-lead">One image from a list, in full, with zoom and swipe</p>

Shows one image of a list over the page, so a person can look at it closely and go through the list. Open it from any control. For a grid of thumbs that opens it, use the [gallery](./gallery), which uses this lightbox.

<Demo title="Basic">
  <LightboxBasic />
  <template #code>

<<< ../demos/LightboxBasic.vue

  </template>
</Demo>

- `items` is a list of `{ src, alt, caption }`. Give every image `alt` text. Without it, the name is the caption, or "Image 2 of 8".
- `v-model` is the index of the open image, and -1 is closed. Set it to open the lightbox, and it goes back to -1 when the lightbox closes.
- The arrows, the ← and → keys, and a swipe to the side go to the previous and next image. In a right-to-left page, the keys and the swipe go the other way. `loop` (on by default) goes from the last image to the first.
- The zoom button or a double click enlarges the image by `zoom` (default 2). Drag to move a large image. A new image starts with no zoom.
- The lightbox is a [modal](./modal): Escape closes it, and focus goes back to the control that opened it. The count is announced when the image changes.
- Change the words with `labels` or a [label pack](../guide/translating): `prev`, `next`, `zoomIn`, `zoomOut`, and `image`.

## Usage

```ts
import { BlessLightbox, type BlessLightboxItem } from "blessing-ui";
```

## API

<PropsTable name="BlessLightbox" />

<script setup>
import LightboxBasic from "../demos/LightboxBasic.vue";
</script>
