---
title: Annotator
---

<script setup>
import AnnotatorBasic from "../demos/AnnotatorBasic.vue";
</script>

# Annotator

<p class="bless-lead">Draw boxes and drop pins on an image, and get the regions back</p>

For review, labelling and feedback: mark what is wrong in a screenshot, outline the objects in a photo, point at a spot in a plan. The result is a list of regions you can store and draw again at any size. To _show_ fixed pins with popovers use [Hotspots](./hotspots); to crop, [Cropper](./cropper).

<Demo title="Review marks">
  <AnnotatorBasic />
  <template #code>

<<< ../demos/AnnotatorBasic.vue

  </template>
</Demo>

- `v-model` is the marks: `{ id, x, y, w?, h?, label }`, every number a **fraction of the image** (0–1), so they fit the picture at any size. A mark with `w` and `h` is a box, without them a pin.
- Pick a tool (`v-model:tool`): **Box** drags out a rectangle (a tiny flick is ignored), **Pin** drops a pin where you click, **Select** only selects. A new mark is selected and focus goes to its **Name** field. Drag a mark to move it, the corner square to resize a box; they stop at the image edge.
- Keyboard: marks are focusable (one tab stop); **arrows** move by 1% (Shift: 5%), **Alt+arrows** resize a box, **Enter** goes to its name, **Delete** removes it and focus lands on a neighbour. **Add at centre** creates a mark with no pointer, and the list under the image selects any mark. Every change is announced.
- `:editable="false"` shows and selects but changes nothing. `labels` translates the wording and `regionName(kind, n, label)` writes each mark's spoken name.

## Usage

```ts
import { BlessAnnotator } from "blessing-ui";
```

## API

<PropsTable name="BlessAnnotator" />
