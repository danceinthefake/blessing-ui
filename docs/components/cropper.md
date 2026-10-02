---
title: Cropper
---

<script setup>
import CropperBasic from "../demos/CropperBasic.vue";
</script>

# Cropper

<p class="bless-lead">Crop and rotate an image, export the pixels</p>

Cut a picture down before it is uploaded — an avatar, a cover, a product shot. The user frames the part they want; you get the rectangle, or the cropped image itself. To send the result, hand the blob to [Uploader](./uploader); to just show an image, use [Img](./img).

<Demo title="Basic">
  <CropperBasic />
  <template #code>

<<< ../demos/CropperBasic.vue

  </template>
</Demo>

- Drag the frame to move it, a handle to resize it. With `aspect` set (`1`, `16 / 9`) the shape is locked and only the corner handles show; without it all eight do.
- Keyboard: focus the frame, **arrows** move it by 1% (**Shift** by 10%), **+** and **−** resize it around the centre. Each change is announced in pixels.
- The ↺ ↻ buttons turn the picture in 90° steps and reset the frame. `:controls="false"` hides them; the exposed `rotate(90)` / `rotate(-90)` do the same.
- `v-model` is the crop rectangle `{ x, y, width, height, rotation }` in pixels of the full-size image after rotation, so a server can repeat the crop exactly.
- The exposed `toBlob({ type, quality, maxWidth })` returns the cropped pixels at full resolution, or scaled down to `maxWidth`. An image from another origin needs CORS headers (`crossorigin="anonymous"`, the default) or the browser refuses to read it back.
- A frame that cannot load shows an error message and emits `error`; `ready` fires when the image is in.

## Usage

```ts
import { BlessCropper } from "blessing-ui";
```

## API

<PropsTable name="BlessCropper" />
