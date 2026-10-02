---
title: Loupe
---

<script setup>
import LoupeBasic from "../demos/LoupeBasic.vue";
</script>

# Loupe

<p class="bless-lead">Magnifier over an image on hover or touch</p>

A lens that shows the detail under the pointer — a product photo, a map, a screenshot with small text. For flipping through full-size pictures, use [Gallery](./gallery); for comparing two versions, [Compare](./compare).

<Demo title="Basic">
  <LoupeBasic />
  <template #code>

<<< ../demos/LoupeBasic.vue

  </template>
</Demo>

- The lens is a square centred on the pointer, showing the spot at `zoom` times (default 2.5) in a box of `size` px (default 140). It stays inside the picture, and the picture itself does not move.
- On touch, press and drag. The lens rides above the finger so the finger does not cover what is being looked at, and it goes away when you lift. Vertical swipes still scroll the page.
- With the keyboard, focus the picture: the lens appears in the middle, **arrow keys** move it (**Shift** for bigger steps) and **Esc** hides it.
- The lens reads the same file. Pass `zoomSrc` with a larger version so the enlarged view is sharp instead of a blown-up copy.
- The lens is purely visual and hidden from screen readers; `alt` describes the picture as usual, so put anything the lens reveals that matters (a label, a number) in the text around it as well.

## Usage

```ts
import { BlessLoupe } from "blessing-ui";
```

## API

<PropsTable name="BlessLoupe" />
