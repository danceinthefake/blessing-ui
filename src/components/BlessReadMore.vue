<template>
  <div class="bless-readmore">
    <div
      :id="`${uid}-text`"
      ref="content"
      class="bless-readmore__text"
      :class="{ 'bless-readmore__text--cut': !open }"
      :style="{ '--_lines': lines }"
    >
      <slot />
    </div>
    <button
      v-if="cut || open"
      type="button"
      class="bless-readmore__toggle"
      :aria-expanded="open"
      :aria-controls="`${uid}-text`"
      @click="open = !open"
    >
      {{ open ? text.less : text.more }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessReadMore" });
const pack = useLabelPack("BlessReadMore");

const props = withDefaults(
  defineProps<{
    /** lines shown while closed */
    lines?: number;
    labels?: Partial<{ more: string; less: string }>;
  }>(),
  { lines: 3 },
);
const open = defineModel<boolean>("open", { default: false });

const text = computed(() => ({ more: "Read more", less: "Show less", ...pack(), ...props.labels }));
const uid = useId();
const content = ref<HTMLElement>();
// the button shows only when the text is cut; measured in the browser, so the server renders none
const cut = ref(false);
function measure() {
  const el = content.value;
  if (el && !open.value) cut.value = el.scrollHeight > el.clientHeight + 1;
}
let ro: ResizeObserver | undefined;
onMounted(() => {
  measure();
  if (typeof ResizeObserver !== "undefined" && content.value) {
    ro = new ResizeObserver(measure);
    ro.observe(content.value);
  }
});
onBeforeUnmount(() => ro?.disconnect());
watch(() => props.lines, measure, { flush: "post" });
</script>

<style>
.bless-readmore {
  display: grid;
  justify-items: start;
  gap: var(--bless-space-1);
}
.bless-readmore__text {
  justify-self: stretch;
}
.bless-readmore__text--cut {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--_lines);
  line-clamp: var(--_lines);
  overflow: hidden;
}
.bless-readmore__toggle {
  padding: 0;
  border: 0;
  background: none;
  /* no accent at rest, as the more button of a bubble */
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  cursor: pointer;
}
.bless-readmore__toggle:hover {
  color: var(--bless-color-accent-text);
}
.bless-readmore__toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
