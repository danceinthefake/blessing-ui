---
title: useScrollSpy
---

<script setup>
import ScrollSpyBasic from "../demos/ScrollSpyBasic.vue";
</script>

# useScrollSpy

<p class="bless-lead">Which section is in view — an <code>IntersectionObserver</code> over ids or a selector.</p>

<Demo title="Basic">
  <ScrollSpyBasic />
  <template #code>

<<< ../demos/ScrollSpyBasic.vue

  </template>
</Demo>

```ts
const { active } = useScrollSpy(ids | selector, { rootMargin?, root? });
// ids: string[]           — element ids to observe
// selector: string        — or every element matching it
// rootMargin: string      — default "0px 0px -60% 0px"
// root: Ref<HTMLElement>  — a scroll container instead of the viewport
// active: Ref<string | undefined>
```

`active` is the id of the intersecting section whose top edge is nearest the top of the viewport — measured live on every change, so a long section that has just scrolled past doesn't outrank the one arriving. With the default `rootMargin` only the top 40% of the viewport counts, so a section becomes active as it reaches the upper part of the screen rather than the moment it enters at the bottom. When nothing intersects (above the first section, or in a gap) `active` keeps its last value; before any scroll it is the first observed id.

Pair it with `BlessSidebarNav :active` as above, and give sections `scroll-margin-top` equal to whatever sticks at the top, so a click doesn't land under the bar. The observer is created on mount, so the composable is safe to call in server-rendered components.
