<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

defineOptions({ name: "BlessParallax" });
const props = withDefaults(
  defineProps<{
    src?: string;
    height?: string;
    /** 0 = fixed, 1 = scrolls with page */ speed?: number;
    alt?: string;
  }>(),
  {
    height: "320px",
    speed: 0.5,
    alt: "",
  },
);
const root = ref<HTMLElement>();
const y = ref(0);
let raf = 0;
function update() {
  const r = root.value?.getBoundingClientRect();
  if (!r) return;
  // offset relative to the viewport centre, scaled
  y.value = (r.top + r.height / 2 - innerHeight / 2) * (props.speed - 1) * -1;
}
function onScroll() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(update);
}
onMounted(() => {
  update();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
});
onBeforeUnmount(
  () => (
    removeEventListener("scroll", onScroll),
    removeEventListener("resize", onScroll),
    cancelAnimationFrame(raf)
  ),
);
</script>

<template>
  <div ref="root" class="bless-parallax" :style="{ height, '--_y': `${y}px` }">
    <div class="bless-parallax__media">
      <slot name="media"><img v-if="src" :src :alt /></slot>
    </div>
    <div class="bless-parallax__content"><slot /></div>
  </div>
</template>

<style>
.bless-parallax {
  position: relative;
  overflow: hidden;
  background: var(--bless-color-media-bg);
  color: #fff;
  font-family: var(--bless-font-sans);
}
.bless-parallax__media {
  position: absolute;
  inset: -40% 0;
  transform: translateY(var(--_y));
  will-change: transform;
}
.bless-parallax__media > * {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bless-parallax__content {
  position: relative;
  display: grid;
  place-items: center;
  height: 100%;
}
@media (prefers-reduced-motion: reduce) {
  .bless-parallax__media {
    transform: none;
    inset: 0;
  }
}
</style>
