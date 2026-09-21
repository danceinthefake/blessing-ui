---
title: Browser composables
---

# Browser composables

Small wrappers over platform APIs. All are SSR-safe (they attach on mount) and tear down on unmount.

```ts
import {
  useResizeObserver,
  useFullscreen,
  useVisibility,
  useScroll,
  useLoadingBar,
  useMedia,
  useHash,
} from "blessing-ui";

const { width, height } = useResizeObserver(el); // the element's box, live
const { active, enter, exit, toggle } = useFullscreen(el?); // document if no el
const { visible } = useVisibility(); // document.visibilityState === "visible"
const { x, y, direction } = useScroll(el?); // window if no el; direction: "up" | "down" | undefined
const { start, stop, set, track } = useLoadingBar(); // drives BlessLoadingBar; nested start/stop, track(promise)
const matches = useMedia("(min-width: 800px)"); // Ref<boolean>
const hash = useHash(); // Ref<string> of location.hash, two-way — what BlessModal `hash` uses
```

`useLoadingBar` counts: every `start()` needs a `stop()`, the bar hides when the count reaches zero; `track(promise)` wraps both. `useScroll`'s `direction` is what `BlessLayout` uses to hide and reveal its header.
