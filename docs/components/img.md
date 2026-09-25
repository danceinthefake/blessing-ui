---
title: Img
---

<script setup>
import ImgBasic from "../demos/ImgBasic.vue";
</script>

# Img

<p class="bless-lead">Lazy image with ratio, placeholder, error</p>

An image that reserves its space, shows a skeleton or a blurred placeholder while it loads, and a marked fallback if it fails. `alt` is required: describe what the image shows, or pass `alt=""` for decoration.

<Demo title="Basic">
  <ImgBasic />
  <template #code>

<<< ../demos/ImgBasic.vue

  </template>
</Demo>

- `ratio` holds the space before load, so nothing jumps. `loading="eager"` for the image at the top of the page.
- A broken image shows the error mark, named by `alt`, instead of the browser's broken-image icon.

## Usage

```ts
import { BlessImg } from "blessing-ui";
```

## API

<PropsTable name="BlessImg" />
