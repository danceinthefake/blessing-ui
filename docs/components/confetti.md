---
title: Confetti
---

<script setup>
import ConfettiBasic from "../demos/ConfettiBasic.vue";
</script>

# Confetti

<p class="bless-lead">A burst of paper for the moment something goes right</p>

A short celebration for a finished task, a sent message, a first sale. It is fired from code — there is nothing on the page until you call `fire()` — so use it for one moment the reader has earned, not as decoration. For a message that has to be read, use [Toaster](./toaster) or [Alert](./alert); confetti carries no words.

<Demo title="Fire from a button">
  <ConfettiBasic />
  <template #code>

<<< ../demos/ConfettiBasic.vue

  </template>
</Demo>

- Put one `<BlessConfetti ref="confetti" />` in the page and call `confetti.fire(from?, angle?)`. `from` is an element to burst out of, a `{ x, y }` point in viewport pixels, or nothing for the lower middle of the window; `angle` points the cone (default 270°, straight up). Fire several times and the bursts overlap.
- It draws on one canvas over the page that lets every click through, and removes the pieces after `duration` — or when they leave the bottom of the window. `done` fires when the last piece is gone.
- With `prefers-reduced-motion` nothing is drawn and `done` fires at once. The canvas is hidden from screen readers, so say what happened in words too (an `aria-live` line, a toast); the burst is only the cheer.
- `colors` takes token names (`chart-2`, `warning`…) or CSS colours; `count`, `spread` (360 = all around), `power` and `gravity` shape the burst.

## Usage

```ts
import { BlessConfetti } from "blessing-ui";
```

## API

<PropsTable name="BlessConfetti" />
