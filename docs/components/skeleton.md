---
title: Skeleton
---

<script setup>
import SkeletonBasic from "../demos/SkeletonBasic.vue";
</script>

# Skeleton

<p class="bless-lead">Placeholder in the shape of what's coming</p>

Grey plates the size of the content that hasn't arrived, so the layout is already right when it does and nothing jumps. Size each one to the real thing: `width`/`height` for a block, `lines` for a paragraph (the last line stops at 60%), `avatar` for a face. They breathe — a slow opacity pulse, flat, no shimmer — and hold still under `prefers-reduced-motion`.

Skeletons are hidden from assistive tech; the _region_ should say it's loading: `aria-busy="true"` on the container, and a `role="status"` with a label if you want it announced (the [Page states](../blocks/states) block does both). For "busy" on something already there, [BlockUI](./block-ui); for busy with no shape to promise, [Spinner](./spinner).

<Demo title="Basic">
  <SkeletonBasic />
  <template #code>

<<< ../demos/SkeletonBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessSkeleton } from "blessing-ui";
```

## API

<PropsTable name="BlessSkeleton" />
