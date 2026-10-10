---
title: Gestures
---

<script setup>
import GesturesBasic from "../demos/GesturesBasic.vue";
</script>

# Gestures

<p class="bless-lead">Four pointer-event composables for mouse, touch, and pen. They attach to an element ref and do nothing on the server.</p>

<Demo title="All four">
  <GesturesBasic />
  <template #code>

<<< ../demos/GesturesBasic.vue

  </template>
</Demo>

```ts
import { usePan, useSwipe, useLongPress, useTouchRepeat } from "blessing-ui";

usePan(el, ({ dx, dy, phase, event }) => {}, { pointerTypes? });
// dx/dy from the press point; phase: start | move | end | cancel; pointer capture is taken
// pointerTypes: ["touch"] to ignore mouse and pen

const { direction } = useSwipe(el, (dir, pan) => {}, { threshold?: 40, axis?: "x" | "y" | "both" });
// fires once, on release, when the dominant-axis distance exceeds threshold — not during the drag
// direction: Ref<"left" | "right" | "up" | "down" | undefined>

const { pressing } = useLongPress(el, (event) => {}, { ms?: 500, tolerance?: 8 });
// fires after ms held; cancelled if the pointer moves more than tolerance px

useTouchRepeat(el, () => {}, { delay?: 400, interval?: 100 });
// fires on press, again after delay, then every interval while held — the ± stepper
```

`BlessSlideItem`, `BlessTabPanels`, `BlessPullToRefresh`, `BlessInputNumber`, and the edge swipe of `BlessLayout` use these composables. The ref must be a DOM element. A `ref` on a Bless component is the component instance. Wrap the component in a `<span>` (as the demo does) or use the exposed element of the component.

## `touch-action`

The browser scrolls on touch unless you tell it otherwise, and it decides before your handler runs. Set `touch-action` on the element, so the two do not fight:

- `pan-y`: you take horizontal movement, and the page keeps vertical scroll (a swipe strip, a carousel)
- `pan-x`: the reverse (a vertical drawer handle)
- `none`: you take everything (a draggable plate, a signature pad)

Forgetting this is the usual reason a gesture "works with the mouse but not on the phone".

## Never the only way

A gesture is a shortcut, not the control. Swipe-to-delete also needs a visible delete button (`BlessSlideItem` shows its actions on tap). A long-press menu needs a button that opens the same menu. A pan-to-adjust value needs a field or arrow keys. Keyboard and assistive-technology users never see a gesture.

## Next

The platform helpers that are not gestures (resize, fullscreen, visibility, scroll, and the loading bar) are on [Browser composables](./browser).
