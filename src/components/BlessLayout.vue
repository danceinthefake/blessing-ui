<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useMedia } from "../composables/useMedia";
import { usePan } from "../composables/useGesture";

defineOptions({ name: "BlessLayout" });

const props = withDefaults(
  defineProps<{
    /** viewport width at and above which drawers sit beside the page instead of over it */
    breakpoint?: number;
    /** header hides on scroll down, shows on scroll up */
    reveal?: boolean;
    /** drawer widths */
    leftWidth?: string;
    rightWidth?: string;
    /** swipe from the screen edge opens a drawer on touch */
    swipe?: boolean;
    /** the drawer that swiping opens when both exist */
    edge?: number;
  }>(),
  {
    breakpoint: 1024,
    reveal: true,
    leftWidth: "280px",
    rightWidth: "280px",
    swipe: true,
    edge: 24,
  },
);
const left = defineModel<boolean>("left", { default: false });
const right = defineModel<boolean>("right", { default: false });
const slots = defineSlots<{
  header?: () => unknown;
  footer?: () => unknown;
  left?: () => unknown;
  right?: () => unknown;
  default?: () => unknown;
}>();

const narrow = useMedia(`(max-width: ${props.breakpoint - 1}px)`);
const hidden = ref(false);
const root = ref<HTMLElement>();
let lastY = 0;
function onScroll() {
  if (!props.reveal) return;
  const y = window.scrollY;
  hidden.value = y > 64 && y > lastY;
  lastY = y;
}
onMounted(() => addEventListener("scroll", onScroll, { passive: true }));
onBeforeUnmount(() => removeEventListener("scroll", onScroll));

// edge swipe on touch: open the drawer on that side, swipe back to close
let fromEdge: "left" | "right" | null = null;
usePan(
  root,
  (e) => {
    if (!props.swipe || !narrow.value) return;
    if (e.phase === "start") {
      const x = e.event.clientX;
      fromEdge =
        slots.left && x <= props.edge
          ? "left"
          : slots.right && x >= innerWidth - props.edge
            ? "right"
            : null;
    } else if (e.phase === "end") {
      if (fromEdge === "left" && e.dx > 60) left.value = true;
      else if (fromEdge === "right" && e.dx < -60) right.value = true;
      else if (left.value && e.dx < -60) left.value = false;
      else if (right.value && e.dx > 60) right.value = false;
      fromEdge = null;
    }
  },
  { pointerTypes: ["touch", "pen"] },
);
// Esc closes an overlay drawer
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && narrow.value) ((left.value = false), (right.value = false));
}
watch(narrow, (n) => !n && ((left.value = false), (right.value = false)));
</script>

<template>
  <div
    ref="root"
    class="bless-layout"
    :class="{
      'bless-layout--narrow': narrow,
      'bless-layout--hidden': hidden,
      'bless-layout--left': left,
      'bless-layout--right': right,
    }"
    :style="{ '--_lw': leftWidth, '--_rw': rightWidth }"
    @keydown="onKey"
  >
    <header v-if="$slots.header" class="bless-layout__header"><slot name="header" /></header>
    <div class="bless-layout__body">
      <aside
        v-if="$slots.left"
        class="bless-layout__drawer bless-layout__drawer--left"
        :inert="narrow && !left ? true : undefined"
        :aria-hidden="narrow && !left ? 'true' : undefined"
      >
        <slot name="left" />
      </aside>
      <main class="bless-layout__page"><slot /></main>
      <aside
        v-if="$slots.right"
        class="bless-layout__drawer bless-layout__drawer--right"
        :inert="narrow && !right ? true : undefined"
        :aria-hidden="narrow && !right ? 'true' : undefined"
      >
        <slot name="right" />
      </aside>
      <div
        v-if="narrow && (left || right)"
        class="bless-layout__backdrop"
        @click="((left = false), (right = false))"
      />
    </div>
    <footer v-if="$slots.footer" class="bless-layout__footer"><slot name="footer" /></footer>
  </div>
</template>

<style>
.bless-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  background: var(--bless-color-bg);
}
.bless-layout__header {
  position: sticky;
  top: 0;
  z-index: var(--bless-z-nav);
  padding-top: var(--bless-safe-top);
  background: var(--bless-color-bg);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  transition: transform var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-layout--hidden .bless-layout__header {
  transform: translateY(-100%);
}
.bless-layout__body {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}
.bless-layout__page {
  flex: 1;
  min-width: 0;
  padding-left: var(--bless-safe-left);
  padding-right: var(--bless-safe-right);
}
.bless-layout__drawer {
  flex: none;
  background: var(--bless-color-bg);
  overflow-y: auto;
  scrollbar-width: thin;
}
.bless-layout__drawer--left {
  width: var(--_lw);
  border-right: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-layout__drawer--right {
  width: var(--_rw);
  border-left: var(--bless-border-width) solid var(--bless-color-border);
}
/* narrow: drawers go off-canvas over the page */
.bless-layout--narrow .bless-layout__drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: var(--bless-z-modal);
  padding-top: var(--bless-safe-top);
  padding-bottom: var(--bless-safe-bottom);
  box-shadow: var(--bless-shadow-md);
  transition: transform var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-layout--narrow .bless-layout__drawer--left {
  left: 0;
  transform: translateX(-100%);
}
.bless-layout--narrow .bless-layout__drawer--right {
  right: 0;
  transform: translateX(100%);
}
.bless-layout--narrow.bless-layout--left .bless-layout__drawer--left,
.bless-layout--narrow.bless-layout--right .bless-layout__drawer--right {
  transform: none;
}
.bless-layout__backdrop {
  position: fixed;
  inset: 0;
  z-index: calc(var(--bless-z-modal) - 1);
  background: var(--bless-color-backdrop);
}
.bless-layout__footer {
  position: sticky;
  bottom: 0;
  z-index: var(--bless-z-nav);
  padding-bottom: var(--bless-safe-bottom);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
@media (prefers-reduced-motion: reduce) {
  .bless-layout__header,
  .bless-layout--narrow .bless-layout__drawer {
    transition: none;
  }
}
</style>
