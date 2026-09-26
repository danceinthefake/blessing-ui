---
title: Browser
---

<script setup>
import BrowserBasic from "../demos/BrowserBasic.vue";
</script>

# Browser

Small wrappers over platform APIs. All are SSR-safe (they attach on mount) and tear down on unmount.

<Demo title="Live — resize the box, scroll the page, switch tabs">
  <BrowserBasic />
  <template #code>

<<< ../demos/BrowserBasic.vue

  </template>
</Demo>

```ts
import {
  useResizeObserver,
  useFullscreen,
  useVisibility,
  useScroll,
  useLoadingBar,
  useMedia,
  useHash,
  reducedMotion,
  scrollBehavior,
} from "blessing-ui";

const { width, height } = useResizeObserver(el); // the element's box, live
const { active, enter, exit, toggle } = useFullscreen(el?); // document if no el
const { visible } = useVisibility(); // document.visibilityState === "visible"
const { x, y, direction } = useScroll(el?); // window if no el; direction: "up" | "down" | null
const { start, stop, set, track } = useLoadingBar(); // drives BlessLoadingBar; nested start/stop, track(promise)
const matches = useMedia("(min-width: 800px)"); // Ref<boolean>
const hash = useHash(); // Ref<string> of location.hash, two-way — what BlessModal `hash` uses
reducedMotion(); // boolean, read now: did the person ask for less motion?
el.scrollTo({ top: 0, behavior: scrollBehavior() }); // "smooth", or "auto" under reduced motion
```

`useLoadingBar` counts: every `start()` needs a `stop()`, the bar hides when the count reaches zero; `track(promise)` wraps both. `useScroll`'s `direction` is what `BlessLayout` uses to hide and reveal its header.

`useFullscreen().enter()` only works from a user action — a click or a key press; browsers refuse fullscreen requested on mount or from a timer.

`reducedMotion()` reads the setting when you call it — right for a one-off decision before scrolling or starting an animation; for a value that updates live, use `useMedia("(prefers-reduced-motion: reduce)")`, as the demo does. Both motion helpers exist so your own scripted motion keeps the [care rules](./conventions#care).
