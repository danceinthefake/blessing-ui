<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import BlessSpinner from "./BlessSpinner.vue";

defineOptions({ name: "BlessInfiniteScroll" });

const props = withDefaults(
  defineProps<{
    /** stop observing (no more pages) */
    disabled?: boolean;
    /** px before the end to fire */
    offset?: number;
    /** scroll container ref; default = nearest scrollable ancestor / viewport */
    root?: HTMLElement | null;
    doneText?: string;
  }>(),
  { offset: 200 },
);
const emit = defineEmits<{ load: [done: (finished?: boolean) => void] }>();
const sentinel = ref<HTMLElement>();
const loading = ref(false);
const finished = ref(false);
let io: IntersectionObserver | undefined;

function fire() {
  if (loading.value || finished.value || props.disabled) return;
  loading.value = true;
  emit("load", (end) => {
    loading.value = false;
    if (end) finished.value = true;
    // still in view (short page)? ask again
    requestAnimationFrame(() => io && sentinel.value && check());
  });
}
function check() {
  const r = sentinel.value?.getBoundingClientRect();
  const h = props.root ? props.root.getBoundingClientRect().bottom : window.innerHeight;
  if (r && r.top <= h + props.offset) fire();
}
onMounted(() => {
  if (typeof IntersectionObserver === "undefined") return;
  io = new IntersectionObserver(([e]) => e?.isIntersecting && fire(), {
    root: props.root ?? null,
    rootMargin: `0px 0px ${props.offset}px 0px`,
  });
  io.observe(sentinel.value!);
});
onBeforeUnmount(() => io?.disconnect());
watch(
  () => props.disabled,
  (d) => d && (finished.value = true),
);
defineExpose({ reset: () => ((finished.value = false), (loading.value = false)) });
</script>

<template>
  <div class="bless-infinite">
    <slot />
    <div ref="sentinel" class="bless-infinite__sentinel" aria-hidden="true" />
    <div class="bless-infinite__status" role="status" aria-live="polite">
      <slot v-if="loading" name="loading"><BlessSpinner size="sm" /></slot>
      <slot v-else-if="finished" name="done"
        ><span class="bless-infinite__done">{{ doneText ?? "" }}</span></slot
      >
    </div>
  </div>
</template>

<style>
.bless-infinite__sentinel {
  height: 1px;
}
.bless-infinite__status {
  display: grid;
  place-items: center;
  min-height: 40px;
  color: var(--bless-color-text-muted);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
}
</style>
