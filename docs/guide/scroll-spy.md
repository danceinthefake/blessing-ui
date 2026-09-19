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
const { active } = useScrollSpy(["news", "story"], { rootMargin: "0px 0px -60% 0px" });
```

`active` is the id of the topmost intersecting section. Pass a selector string instead of ids to observe every match; `root` (a ref) scopes it to a scroll container.
