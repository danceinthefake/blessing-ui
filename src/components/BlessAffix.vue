<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

// two root nodes: the probe and the sticky box. Attributes belong to the box.
defineOptions({ name: "BlessAffix", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** distance in px from the top edge where it sticks. The window scroll sets `stuck`. */
    offset?: number;
  }>(),
  { offset: 0 },
);
const stuck = defineModel<boolean>("stuck", { default: false });

// a 1px probe sits where the box rests: once it scrolls above the offset, the box is stuck
const probe = ref<HTMLElement>();
let io: IntersectionObserver | undefined;
onMounted(() => {
  if (!probe.value || typeof IntersectionObserver === "undefined") return;
  io = new IntersectionObserver(([e]) => (stuck.value = !e.isIntersecting), {
    rootMargin: `-${props.offset}px 0px 0px 0px`,
  });
  io.observe(probe.value);
});
onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <div ref="probe" class="bless-affix__probe" aria-hidden="true" />
  <div
    v-bind="$attrs"
    class="bless-affix"
    :class="{ 'bless-affix--stuck': stuck }"
    :style="{ top: `${offset}px` }"
  >
    <slot :stuck="stuck" />
  </div>
</template>

<style>
.bless-affix {
  position: sticky;
  z-index: var(--bless-z-nav);
}
.bless-affix__probe {
  height: 1px;
  margin-block-end: -1px;
  pointer-events: none;
}
</style>
