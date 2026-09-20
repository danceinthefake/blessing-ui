---
title: Gestures
---

# Gestures

Pointer-event composables — mouse, touch and pen alike. They attach to an element ref and do nothing on the server.

```ts
import { usePan, useSwipe, useLongPress, useTouchRepeat } from "blessing-ui";

usePan(el, ({ dx, dy, phase, event }) => {}); // start | move | end | cancel, with pointer capture
const { direction } = useSwipe(el, (dir) => {}, { threshold: 40, axis: "x" });
const { pressing } = useLongPress(el, (e) => {}, { ms: 500, tolerance: 8 });
useTouchRepeat(el, () => count++, { delay: 400, interval: 100 }); // ± steppers
```

Set `touch-action` on the element to tell the browser which scroll axes to keep: `pan-y` for a horizontal swipe target, `none` to take everything. `BlessSlideItem`, `BlessTabPanels`, `BlessPullToRefresh` and `BlessLayout` are built on these.
