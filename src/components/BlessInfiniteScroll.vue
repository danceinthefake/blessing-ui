<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";
import { onBeforeUnmount, onMounted, ref, watch, computed } from "vue";
import BlessButton from "./BlessButton.vue";
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
    /** read while a page loads (the spinner is decorative) */
    loadingText?: string;
    labels?: Partial<{ more: string }>;
  }>(),
  { offset: 200, loadingText: "Loading more" },
);
const pack = useLabelPack("BlessInfiniteScroll");
const text = computed(() => ({
  more: "Load more",
  ...pack(),
  ...props.labels,
}));

const emit = defineEmits<{ load: [done: (finished?: boolean) => void] }>();
const sentinel = ref<HTMLElement>();
const loading = ref(false);
const finished = ref(false);
const manual = ref(false); // no IntersectionObserver: offer a button instead of never loading
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
  if (typeof IntersectionObserver === "undefined") return void (manual.value = true);
  io = new IntersectionObserver(([e]) => e?.isIntersecting && fire(), {
    root: props.root ?? null,
    rootMargin: `0px 0px ${props.offset}px 0px`,
  });
  io.observe(sentinel.value!);
});
onBeforeUnmount(() => io?.disconnect());
// disabling stops it; enabling again resumes
watch(
  () => props.disabled,
  (d) => (finished.value = d),
);
defineExpose({ reset: () => ((finished.value = false), (loading.value = false)) });
</script>

<template>
  <div class="bless-infinite">
    <slot />
    <div ref="sentinel" class="bless-infinite__sentinel" aria-hidden="true" />
    <div class="bless-infinite__status" role="status" aria-live="polite">
      <slot v-if="loading" name="loading"
        ><BlessSpinner size="sm" label="" /><span class="bless-infinite__sr bless-sr">{{
          loadingText
        }}</span></slot
      >
      <slot v-else-if="finished" name="done"
        ><span class="bless-infinite__done">{{ doneText ?? "" }}</span></slot
      >
    </div>
    <BlessButton
      v-if="manual && !loading && !finished"
      variant="outline"
      size="sm"
      class="bless-infinite__more"
      @click="fire"
      >{{ text.more }}</BlessButton
    >
  </div>
</template>

<style>
.bless-infinite__more {
  display: flex;
  margin: var(--bless-space-3) auto;
}
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
