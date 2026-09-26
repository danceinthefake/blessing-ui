---
title: Animate on scroll
---

<script setup>
import AnimateOnScrollBasic from "../demos/AnimateOnScrollBasic.vue";
</script>

# Animate on scroll

<p class="bless-lead"><code>useAnimateOnScroll()</code> — a <code>visible</code> ref that flips when the element enters the viewport; bring your own transition.</p>

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

The pattern is the one above: bind `visible` to a `data-visible` attribute (or a class) and put the transition in CSS. The composable never touches styles. Put the hidden state inside `@media (scripting: enabled)`, as the demo does: a server-rendered page ships with `visible` false, and without scripts — or before they load — content hidden by plain CSS would never appear. Motion must never be the only way to see something. For a list, call it once per item — or observe the list and stagger with `transition-delay: calc(var(--i) * 60ms)` on the children.

What a good reveal looks like in this system: opacity, `--bless-ease-out`, `--bless-duration-slower`, and at most a few pixels of travel — an appearance fades; only state changes move. Under `prefers-reduced-motion: reduce` the composable sets `visible` to `true` on mount and never creates an observer, so content simply appears; the durations are already `0s` there, so a plain CSS transition needs no extra handling. Without `IntersectionObserver` at all it is likewise `true` immediately.

Prefer `once` (the default). With `once: false` the element hides again whenever it leaves and fades back in on return — use it only when leaving means something, or the page turns into spectacle.
