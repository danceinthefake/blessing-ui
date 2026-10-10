---
title: Animate on scroll
---

<script setup>
import AnimateOnScrollBasic from "../demos/AnimateOnScrollBasic.vue";
</script>

# Animate on scroll

<p class="bless-lead"><code>useAnimateOnScroll()</code> gives a <code>visible</code> ref that changes at the moment the element enters the viewport. You supply the transition.</p>

<Demo title="Basic">
  <AnimateOnScrollBasic />
  <template #code>

<<< ../demos/AnimateOnScrollBasic.vue

  </template>
</Demo>

```ts
const { visible } = useAnimateOnScroll(el, { threshold?, rootMargin?, once? });
// el: Ref<HTMLElement | undefined>  — the element to watch
// threshold: number                 — default 0.15 (fraction in view before it counts)
// rootMargin: string                — IntersectionObserver margin, e.g. "0px 0px -10% 0px"
// once: boolean                     — default true; false flips back when it leaves
// visible: Ref<boolean>
```

The pattern is the one above. Bind `visible` to a `data-visible` attribute (or a class) and put the transition in CSS. The composable never touches styles. Put the hidden state inside `@media (scripting: enabled)`, as the demo does. A server-rendered page ships with `visible` false. Without scripts, or before they load, content that plain CSS hides will never appear. Motion must never be the only way to see something. For a list, call the composable once per item. Or observe the list and stagger the children with `transition-delay: calc(var(--i) * 60ms)`.

A good reveal in this system uses opacity, `--bless-ease-out`, `--bless-duration-slower`, and at most a few pixels of travel. An appearance fades. Only state changes move. With `prefers-reduced-motion: reduce`, the composable sets `visible` to `true` on mount and never creates an observer, so the content appears at once. The durations are already `0s` there, so a plain CSS transition needs no extra handling. Without `IntersectionObserver`, `visible` is also `true` immediately.

Prefer `once` (the default). With `once: false`, the element hides again on leave and fades in again on return. Use this only if leaving means something. Otherwise the page turns into a spectacle.
