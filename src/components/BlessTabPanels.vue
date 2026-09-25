<script setup lang="ts" generic="T extends string | number">
import { computed, ref, watch } from "vue";
import { usePan } from "../composables/useGesture";

defineOptions({ name: "BlessTabPanels" });

const props = withDefaults(
  defineProps<{
    /** panel keys, in order; pair with BlessTabs values */
    panels: T[];
    swipeable?: boolean;
    /** wrap from last to first */
    loop?: boolean;
    /** px to change panel */
    threshold?: number;
  }>(),
  { swipeable: true, threshold: 60 },
);
const model = defineModel<T>({ required: true });
const index = computed(() => Math.max(0, props.panels.indexOf(model.value)));
const root = ref<HTMLElement>();
const drag = ref(0);
const dir = ref<"next" | "prev">("next");
watch(index, (n, o) => (dir.value = n > o ? "next" : "prev"));

// role=group, not tabpanel: a tabpanel needs a tab that controls it, and these panels may have none
function go(d: 1 | -1) {
  let i = index.value + d;
  if (props.loop) i = (i + props.panels.length) % props.panels.length;
  if (i < 0 || i >= props.panels.length) return;
  model.value = props.panels[i];
}
usePan(root, (e) => {
  if (!props.swipeable) return;
  if (e.phase === "move") {
    if (Math.abs(e.dy) > Math.abs(e.dx)) return;
    drag.value = e.dx;
    if (Math.abs(e.dx) > 8) e.event.preventDefault();
  } else if (e.phase !== "start") {
    if (drag.value <= -props.threshold) go(1);
    else if (drag.value >= props.threshold) go(-1);
    drag.value = 0;
  }
});
defineExpose({ next: () => go(1), prev: () => go(-1) });
</script>

<template>
  <div
    ref="root"
    class="bless-tabpanels"
    :class="`bless-tabpanels--${dir}`"
    :style="{ '--_x': `${drag}px` }"
  >
    <Transition :name="`bless-tabpanels-${dir}`" mode="out-in">
      <div
        :key="String(model)"
        class="bless-tabpanels__panel"
        role="group"
        :aria-label="String(model)"
      >
        <slot :panel="model" :index />
      </div>
    </Transition>
  </div>
</template>

<style>
.bless-tabpanels {
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
}
.bless-tabpanels__panel {
  transform: translateX(var(--_x));
  transition: transform var(--bless-duration-fast);
}
.bless-tabpanels-next-enter-active,
.bless-tabpanels-next-leave-active,
.bless-tabpanels-prev-enter-active,
.bless-tabpanels-prev-leave-active {
  transition:
    transform var(--bless-duration-base) var(--bless-ease-out),
    opacity var(--bless-duration-base);
}
.bless-tabpanels-next-enter-from {
  transform: translateX(24px);
  opacity: 0;
}
.bless-tabpanels-next-leave-to {
  transform: translateX(-24px);
  opacity: 0;
}
.bless-tabpanels-prev-enter-from {
  transform: translateX(-24px);
  opacity: 0;
}
.bless-tabpanels-prev-leave-to {
  transform: translateX(24px);
  opacity: 0;
}
</style>
