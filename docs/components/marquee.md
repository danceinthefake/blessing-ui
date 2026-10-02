---
title: Marquee
---

<script setup>
import MarqueeBasic from "../demos/MarqueeBasic.vue";
</script>

# Marquee

<p class="bless-lead">Seamless scrolling ticker that pauses</p>

A row of short items that drifts past forever — logos of the tools you use, a headline ticker, a strip of announcements. Use it sparingly: moving text is hard to read and hard to click. For a set of slides to step through, use [Carousel](./carousel).

<Demo title="Basic">
  <MarqueeBasic />
  <template #code>

<<< ../demos/MarqueeBasic.vue

  </template>
</Demo>

- Put anything in the slot. The content is rendered twice and slid by exactly one copy, so the loop has no jump; the second copy is hidden from screen readers and from the keyboard (`inert`), so nothing is read or tabbed twice.
- `speed` is px per second, so a longer row takes longer to loop and moves at the same pace. `reverse` runs the other way; under RTL the default direction flips with the page.
- It pauses while the pointer is over it or focus is inside (`:pause-on-hover="false"` to turn that off), so links in it can be read and clicked. The **Pause** button also stops it for good (`v-model:paused`); keep it when the ticker runs longer than five seconds, as WCAG 2.2.2 asks. `:controls="false"` hides it.
- With `prefers-reduced-motion` nothing moves: the items wrap in a normal row and the button is dropped.

## Usage

```ts
import { BlessMarquee } from "blessing-ui";
```

## API

<PropsTable name="BlessMarquee" />
