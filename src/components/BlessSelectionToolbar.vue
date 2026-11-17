<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { useRovingFocus } from "../composables/useRovingFocus";

defineOptions({ name: "BlessSelectionToolbar" });
const pack = useLabelPack("BlessSelectionToolbar");

export interface BlessSelectionAction {
  id: string;
  label: string;
  /** an emoji or a short sign; with an icon, the label is the name for screen readers */
  icon?: string;
}
export interface BlessSelection {
  text: string;
  /** a copy of the selected range, for example to wrap it in a mark */
  range: Range;
}

const props = withDefaults(
  defineProps<{
    actions?: BlessSelectionAction[];
    /** the fewest letters a selection needs before the toolbar shows */
    minLength?: number;
    labels?: Partial<{ label: string }>;
  }>(),
  { actions: () => [], minLength: 1 },
);
const emit = defineEmits<{ action: [id: string, selection: BlessSelection] }>();

const text = computed(() => ({ label: "Text actions", ...pack(), ...props.labels }));
const area = ref<HTMLElement>();
const bar = ref<HTMLElement>();
useRovingFocus(bar);
const current = ref<BlessSelection>();
const at = ref({ x: 0, y: 0, below: false });

function read() {
  const sel = typeof getSelection === "function" ? getSelection() : null;
  // focus in the toolbar keeps the selection that it acts on
  if (bar.value?.contains(document.activeElement)) return;
  if (!sel || sel.isCollapsed || !sel.rangeCount || !area.value) return (current.value = undefined);
  const range = sel.getRangeAt(0);
  const t = sel.toString();
  if (!area.value.contains(range.commonAncestorContainer) || t.trim().length < props.minLength)
    return (current.value = undefined);
  current.value = { text: t, range: range.cloneRange() };
  place();
}
function place() {
  const r = current.value?.range.getBoundingClientRect();
  if (!r) return;
  // above the selection, or below it when there is no room at the top of the window
  const below = r.top < 56;
  at.value = { x: r.left + r.width / 2, y: below ? r.bottom + 8 : r.top - 8, below };
}
function hide(e: KeyboardEvent) {
  if (e.key !== "Escape" || !current.value) return;
  current.value = undefined;
  area.value?.focus?.();
}
function run(id: string) {
  if (!current.value) return;
  emit("action", id, current.value);
  current.value = undefined;
  getSelection()?.removeAllRanges();
}
onMounted(() => {
  document.addEventListener("selectionchange", read);
  addEventListener("scroll", place, true);
  addEventListener("resize", place);
});
onBeforeUnmount(() => {
  document.removeEventListener("selectionchange", read);
  removeEventListener("scroll", place, true);
  removeEventListener("resize", place);
});
</script>

<template>
  <div ref="area" class="bless-seltool" @keydown="hide">
    <slot />
    <!-- after the content, so Tab from the selected text reaches the toolbar next -->
    <div
      v-show="current"
      ref="bar"
      class="bless-seltool__bar"
      :class="{ 'bless-seltool__bar--below': at.below }"
      role="toolbar"
      :aria-label="text.label"
      :style="{ left: `${at.x}px`, top: `${at.y}px` }"
      @mousedown.prevent
    >
      <slot name="toolbar" :selection="current" :run>
        <button
          v-for="a in actions"
          :key="a.id"
          type="button"
          class="bless-seltool__btn"
          :aria-label="a.icon ? a.label : undefined"
          :title="a.icon ? a.label : undefined"
          @click="run(a.id)"
        >
          <span v-if="a.icon" aria-hidden="true">{{ a.icon }}</span>
          <template v-else>{{ a.label }}</template>
        </button>
      </slot>
    </div>
  </div>
</template>

<style>
.bless-seltool__bar {
  animation: bless-enter var(--bless-duration-voice) var(--bless-ease-snap);
  position: fixed;
  z-index: var(--bless-z-nav);
  display: flex;
  gap: 2px;
  padding: 2px;
  border-radius: var(--bless-radius-plate);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  translate: -50% -100%;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
}
.bless-seltool__bar--below {
  translate: -50% 0;
}
.bless-seltool__btn {
  min-inline-size: 2rem;
  padding: var(--bless-space-1) var(--bless-space-2);
  border: 0;
  border-radius: var(--bless-radius-plate);
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-seltool__btn:hover {
  background: color-mix(in srgb, var(--bless-color-bg) 20%, transparent);
}
.bless-seltool__btn:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
</style>
