---
title: useAnimateOnScroll
---

<script setup>
import AnimateOnScrollBasic from "../demos/AnimateOnScrollBasic.vue";
</script>

# useAnimateOnScroll

<p class="bless-lead">A <code>visible</code> ref that flips when the element enters the viewport — bring your own transition.</p>

<Demo title="Basic">
  <AnimateOnScrollBasic />
  <template #code>

<<< ../demos/AnimateOnScrollBasic.vue

  </template>
</Demo>

```ts
const { visible } = useAnimateOnScroll(elRef, { threshold: 0.15, rootMargin: "0px", once: true });
```

`once: false` flips back when it leaves. Without `IntersectionObserver` it is `true` immediately.
