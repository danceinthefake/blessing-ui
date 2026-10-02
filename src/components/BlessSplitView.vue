<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import BlessResizable from "./BlessResizable.vue";

defineOptions({ name: "BlessSplitView" });

const props = withDefaults(
  defineProps<{
    /** under this width (px of the view itself) the panes stack: one at a time */
    breakpoint?: number;
    min?: number;
    max?: number;
    /** remember the divider in localStorage under this key */
    storageKey?: string;
    /** text of the button that goes back from the detail when stacked */
    backLabel?: string;
    label?: string;
  }>(),
  { breakpoint: 560, min: 20, max: 60, backLabel: "Back", label: "Resize list" },
);
/** master pane width in % */
const size = defineModel<number>({ default: 35 });
/** when stacked: is the detail showing (true) or the list (false)? */
const detail = defineModel<boolean>("detail", { default: false });
const emit = defineEmits<{ back: [] }>();

const root = ref<HTMLElement>();
const narrow = ref(false);
const detailEl = ref<HTMLElement>();
const masterEl = ref<HTMLElement>();

function measure() {
  narrow.value = (root.value?.clientWidth ?? Infinity) < props.breakpoint;
}
let ro: ResizeObserver | undefined;
onMounted(() => {
  if (props.storageKey) {
    try {
      const v = parseFloat(localStorage.getItem(props.storageKey) ?? "");
      if (v >= props.min && v <= props.max) size.value = v;
    } catch {
      /* private mode: keep the default */
    }
  }
  measure();
  if (typeof ResizeObserver !== "undefined" && root.value) {
    ro = new ResizeObserver(measure);
    ro.observe(root.value);
  }
});
onBeforeUnmount(() => ro?.disconnect());
watch(size, (v) => {
  if (!props.storageKey) return;
  try {
    localStorage.setItem(props.storageKey, String(v));
  } catch {
    /* ignore */
  }
});

// stacked: hand focus to the pane that just appeared, so keyboard and screen-reader users are not left on nothing
watch(detail, (d) => {
  if (!narrow.value) return;
  nextTick(() => {
    if (d) detailEl.value?.focus();
    else masterEl.value?.focus();
  });
});
function back() {
  detail.value = false;
  emit("back");
}
</script>

<template>
  <div ref="root" class="bless-split" :class="{ 'bless-split--stacked': narrow }">
    <template v-if="narrow">
      <div v-show="!detail" ref="masterEl" class="bless-split__pane" tabindex="-1">
        <slot name="master" :open="() => (detail = true)" :stacked="true" />
      </div>
      <div v-show="detail" ref="detailEl" class="bless-split__pane" tabindex="-1">
        <button type="button" class="bless-split__back" @click="back">
          <span aria-hidden="true">←</span> {{ backLabel }}
        </button>
        <slot name="detail" :stacked="true" />
      </div>
    </template>
    <BlessResizable v-else v-model="size" :min :max :label>
      <template #a><slot name="master" :open="() => (detail = true)" :stacked="false" /></template>
      <template #b><slot name="detail" :stacked="false" /></template>
    </BlessResizable>
  </div>
</template>

<style>
.bless-split {
  min-width: 0;
  height: 100%;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-split--stacked .bless-split__pane {
  height: 100%;
  overflow: auto;
}
.bless-split__pane:focus {
  outline: none;
}
.bless-split__pane:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-split__back {
  display: inline-flex;
  gap: var(--bless-space-1);
  margin: var(--bless-space-2);
  padding: var(--bless-space-1) var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-split__back:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
[dir="rtl"] .bless-split__back span {
  display: inline-block;
  transform: scaleX(-1);
}
</style>
