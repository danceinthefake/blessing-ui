---
title: Scroll spy
---

<script setup>
import ScrollSpyBasic from "../demos/ScrollSpyBasic.vue";
</script>

# Scroll spy

<p class="bless-lead"><code>useScrollSpy()</code> shows which section is in view. It uses an <code>IntersectionObserver</code> over ids or a selector.</p>

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

`active` is the id of the intersecting section whose top edge is nearest the top of the viewport. If you pass a scroll container, `active` uses the top of `root` instead. The composable measures this on every change. A long section that just scrolled past does not outrank the section that arrives. With the default `rootMargin`, only the top 40% of the viewport counts. A section becomes active at the upper part of the screen, not at the bottom edge. When nothing intersects (above the first section, or in a gap), `active` keeps its last value. Before any scroll, it is the first observed id.

Pair it with `BlessSidebarNav :active` as above. Give sections a `scroll-margin-top` equal to whatever sticks at the top, so a click does not land under the bar. The composable creates the observer on mount, so it is safe to call in server-rendered components. It observes only the targets that exist at that moment. It does not pick up sections that render later, for example behind a `v-if` or after a fetch. To fix this, put a `:key` on the component that calls it and tie the key to the list. The composable then runs again after each change to the sections.
