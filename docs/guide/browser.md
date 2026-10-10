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

`useLoadingBar` counts calls. Each `start()` needs a `stop()`. When the count reaches zero, the bar hides. `track(promise)` wraps both calls. `BlessLayout` uses the `direction` value of `useScroll` to hide and show its header.

`useFullscreen().enter()` works only from a user action, for example a click or a key press. Browsers refuse fullscreen that a mount or a timer requests.

`reducedMotion()` reads the preference at the time of the call. Use it for a one-off decision before you scroll or start an animation. For a value that updates live, use `useMedia("(prefers-reduced-motion: reduce)")`, as the demo does. Both motion helpers help your own scripted motion keep the [care rules](./conventions#care).
