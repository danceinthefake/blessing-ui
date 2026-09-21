---
title: LoadingBar
---

<script setup>
import LoadingBarBasic from "../demos/LoadingBarBasic.vue";
</script>

# LoadingBar

<p class="bless-lead">Top-of-page progress via useLoadingBar()</p>

The thin bar along the top edge that says "something is on its way" without blocking anything — for route changes and background requests. Mount `<BlessLoadingBar />` once at the app root; drive it from anywhere with `useLoadingBar()`.

`track(promise)` is the usual call. `start()` / `stop()` count, so overlapping requests keep one bar up until the last one stops; a `start()` during the finish fade keeps it up. The bar trickles towards 90% on its own; `set(p)` shows real progress when you have it. With Vue Router:

```ts
const bar = useLoadingBar();
router.beforeEach(() => bar.start());
router.afterEach(() => bar.stop());
```

Nuxt ships `<NuxtLoadingIndicator>` for the same job; use that there. For a bar _inside_ content with a known length, [Progress](./progress); for "busy" on one element, [Spinner](./spinner) or [BlockUI](./block-ui).

<Demo title="Basic">
  <LoadingBarBasic />
  <template #code>

<<< ../demos/LoadingBarBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessLoadingBar } from "blessing-ui";
```

## API

<PropsTable name="BlessLoadingBar" />
