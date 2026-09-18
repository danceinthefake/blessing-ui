<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessMessageScroller" });

const props = withDefaults(
  defineProps<{
    /** px from bottom still counted as "at bottom" */
    threshold?: number;
    /** px from top that fires `reach-top` (history load) */
    topThreshold?: number;
    /** where to open: latest message or top of transcript */
    initial?: "bottom" | "top";
    jumpLabel?: string;
    height?: string;
  }>(),
  { threshold: 48, topThreshold: 80, initial: "bottom", jumpLabel: "↓ Latest", height: "400px" },
);
const emit = defineEmits<{ "reach-top": []; "at-bottom": [value: boolean] }>();

const viewport = ref<HTMLElement>();
const content = ref<HTMLElement>();
const atBottom = ref(true);
let topArmed = true;

function measure() {
  const el = viewport.value!;
  const was = atBottom.value;
  atBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight <= props.threshold;
  if (was !== atBottom.value) emit("at-bottom", atBottom.value);
  // only a real scroll-up near the top asks for history; a short transcript never does
  const scrollable = el.scrollHeight > el.clientHeight;
  if (scrollable && el.scrollTop <= props.topThreshold) {
    if (topArmed) {
      topArmed = false;
      emit("reach-top");
    }
  } else topArmed = true;
}

function scrollToBottom(behavior: ScrollBehavior = "auto") {
  const el = viewport.value;
  if (el) el.scrollTo({ top: el.scrollHeight, behavior });
}

/** scroll a message into view by its element id */
function scrollTo(id: string, behavior: ScrollBehavior = "smooth") {
  viewport.value
    ?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    ?.scrollIntoView({ behavior, block: "start" });
}

// ponytail: prepend anchoring relies on CSS overflow-anchor (Chrome/Firefox);
// Safari gets a manual restore in loadHistory().
async function loadHistory(insert: () => void | Promise<void>) {
  const el = viewport.value!;
  const before = el.scrollHeight;
  await insert();
  await nextTick();
  el.scrollTop += el.scrollHeight - before;
  topArmed = true;
}

let ro: ResizeObserver | undefined;
onMounted(() => {
  if (props.initial === "bottom") scrollToBottom();
  atBottom.value = props.initial === "bottom";
  // follow streamed / appended content while the user is at the bottom
  ro = new ResizeObserver(() => {
    if (atBottom.value) scrollToBottom();
  });
  if (content.value) ro.observe(content.value);
});
onBeforeUnmount(() => ro?.disconnect());

defineExpose({ scrollToBottom, scrollTo, loadHistory, atBottom });
</script>

<template>
  <div class="bless-message-scroller" :style="{ '--_h': height }">
    <div ref="viewport" class="bless-message-scroller__viewport" @scroll.passive="measure">
      <div ref="content" class="bless-message-scroller__content"><slot /></div>
    </div>
    <Transition name="bless-message-scroller__fade">
      <BlessButton
        v-if="!atBottom"
        size="sm"
        class="bless-message-scroller__jump"
        @click="scrollToBottom('smooth')"
      >
        <slot name="jump">{{ jumpLabel }}</slot>
      </BlessButton>
    </Transition>
  </div>
</template>

<style>
.bless-message-scroller {
  position: relative;
  height: var(--_h);
}
.bless-message-scroller__viewport {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--bless-color-text-muted) transparent;
}
.bless-message-scroller__content {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3);
  overflow-anchor: auto;
}
.bless-message-scroller__jump {
  position: absolute;
  bottom: var(--bless-space-3);
  left: 50%;
  translate: -50% 0;
  box-shadow: var(--bless-shadow-md);
}
.bless-message-scroller__fade-enter-active,
.bless-message-scroller__fade-leave-active {
  transition: opacity var(--bless-duration-base);
}
.bless-message-scroller__fade-enter-from,
.bless-message-scroller__fade-leave-to {
  opacity: 0;
}
</style>
