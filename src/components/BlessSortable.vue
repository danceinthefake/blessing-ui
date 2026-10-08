<script setup lang="ts" generic="T">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { logicalKey } from "../composables/rtl";
import {
  joinGroup,
  membersOf,
  moveItem,
  restoreGroup,
  snapshotGroup,
  transfer,
  useSortable,
  type SortableMember,
} from "../composables/useSortable";

defineOptions({ name: "BlessSortable" });

const props = withDefaults(
  defineProps<{
    rowKey?: (item: T, index: number) => string | number;
    label?: string;
    /** lay the items out in this many equal columns (a grid); 1 is a list */
    columns?: number;
    /**
     * lists that share a group name take each other's items: drag across, or hold an item and
     * press Alt with ← / → to send it to the neighbouring list. Bind each list's own `v-model`.
     */
    group?: string;
    /** screen-reader wording; each message that carries numbers is a function of them */
    labels?: Partial<{
      grip: (index: number) => string;
      grabbed: (index: number, total: number) => string;
      moved: (position: number, total: number) => string;
      sent: (list: string, position: number, total: number) => string;
      dropped: (position: number, total: number) => string;
      cancelled: string;
      hint: string;
      groupHint: string;
      roleDescription: string;
    }>;
  }>(),
  { label: "Sortable", columns: 1 },
);
const text = computed(() => ({
  grip: (i: number) => `Reorder item ${i}`,
  grabbed: (i: number, n: number) =>
    `Grabbed item ${i} of ${n}. Arrow keys move it, Space drops it, Escape cancels.`,
  moved: (p: number, n: number) => `Moved to position ${p} of ${n}`,
  sent: (l: string, p: number, n: number) => `Moved to ${l}, position ${p} of ${n}`,
  dropped: (p: number, n: number) => `Dropped at position ${p} of ${n}`,
  cancelled: "Cancelled, order restored",
  hint: "Press Space to grab, arrow keys to move, Space to drop, Escape to cancel.",
  groupHint: "Alt with left or right arrow sends it to another list.",
  roleDescription: "sortable item",
  ...props.labels,
}));
const model = defineModel<T[]>({ default: () => [] });
const emit = defineEmits<{
  move: [from: number, to: number];
  /** the item at `from` left this list for another one of the group, landing at `to` there */
  transfer: [item: T, from: number, to: number];
}>();

const root = ref<HTMLElement>();
const live = ref("");
const hint = `${useId()}-hint`;
/** index of the item grabbed by keyboard, and the order to restore on Esc */
const held = ref<number | null>(null);
let snapshot: T[] = [];
let origin = 0;

function move(from: number, to: number) {
  if (from === to || to < 0 || to >= model.value.length) return;
  model.value = moveItem(model.value, from, to);
  emit("move", from, to);
  live.value = text.value.moved(to + 1, model.value.length);
}
const grips = () => root.value?.querySelectorAll<HTMLElement>(".bless-sortable__grip") ?? [];
const refocus = (i: number) => nextTick(() => grips()[i]?.focus());

// --- lists in the same group ---
const drop = ref<{ index: number; after: boolean } | null>(null);
const me: SortableMember = {
  root,
  list: () => model.value,
  set: (v) => (model.value = v as T[]),
  drop,
  vertical: () => props.columns === 1,
  label: () => props.label,
  adopt: (i) => {
    held.value = i;
    refocus(i);
  },
  focus: refocus,
  say: (m) => (live.value = m),
};
let leave: (() => void) | undefined;
const join = () => {
  leave?.();
  leave = props.group ? joinGroup(props.group, me) : undefined;
};
onMounted(join);
watch(() => props.group, join);
onBeforeUnmount(() => leave?.());
let originList: SortableMember = me;

function sendTo(from: number, to: SortableMember, at: number) {
  const total = to.list().length + 1; // `to` re-renders after this call, so count ahead
  const item = transfer(me, from, to, at) as T;
  emit("transfer", item, from, at);
  to.say(text.value.sent(to.label(), at + 1, total));
}
const sortable = useSortable(root, move, undefined, {
  name: () => props.group,
  self: me,
  onTransfer: sendTo,
});
const { drag, over } = sortable;

function onKey(i: number, e: KeyboardEvent) {
  const k = logicalKey(e);
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    if (held.value == null) {
      held.value = i;
      snapshot = model.value.slice();
      origin = i;
      originList = me;
      if (props.group) snapshotGroup(props.group);
      live.value = text.value.grabbed(i + 1, model.value.length);
    } else {
      live.value = text.value.dropped(held.value + 1, model.value.length);
      held.value = null;
    }
  } else if (e.key === "Escape" && held.value != null) {
    e.preventDefault();
    if (props.group) restoreGroup();
    else model.value = snapshot;
    held.value = null;
    live.value = text.value.cancelled;
    originList.focus(origin);
  } else if (held.value != null && props.group && e.altKey && /^Arrow(Left|Right)$/.test(e.key)) {
    e.preventDefault();
    const lists = membersOf(props.group);
    const to = lists[lists.indexOf(me) + (k === "ArrowLeft" ? -1 : 1)];
    if (!to) return;
    const from = held.value;
    const at = Math.min(from, to.list().length);
    held.value = null;
    sendTo(from, to, at);
    to.adopt(at);
  } else if (held.value != null) {
    const d =
      k === "ArrowUp" || k === "ArrowLeft" ? -1 : k === "ArrowDown" || k === "ArrowRight" ? 1 : 0;
    if (!d) return;
    e.preventDefault();
    move(held.value, held.value + d);
    held.value = Math.min(Math.max(held.value + d, 0), model.value.length - 1);
    refocus(held.value);
  }
}
// a moved row can blur for a frame; only let go once focus really left the list
const release = () =>
  requestAnimationFrame(() => {
    if (held.value != null && !root.value?.contains(document.activeElement)) held.value = null;
  });
/** the marker for an item arriving from another list: before or after item `i` */
const incoming = (i: number) =>
  drop.value?.index === i ? (drop.value.after ? "after" : "before") : null;
const side = (i: number) =>
  over.value === i && drag.value != null && drag.value !== i
    ? i > drag.value
      ? "after"
      : "before"
    : null;
</script>

<template>
  <div
    ref="root"
    class="bless-sortable"
    :class="{
      'bless-sortable--group': group,
      'bless-sortable--receiving': drop && !model.length,
    }"
  >
    <ul
      class="bless-sortable__list"
      role="list"
      :aria-label="label"
      :style="columns > 1 ? { '--bless-sortable-cols': columns } : undefined"
      :class="{ 'bless-sortable__list--grid': columns > 1 }"
    >
      <li
        v-for="(item, i) in model"
        :key="rowKey ? rowKey(item, i) : i"
        data-sortable-item
        class="bless-sortable__item"
        :class="[
          { 'bless-sortable__item--drag': drag === i, 'bless-sortable__item--held': held === i },
          (side(i) ?? incoming(i)) && `bless-sortable__item--${side(i) ?? incoming(i)}`,
        ]"
      >
        <button
          type="button"
          class="bless-sortable__grip"
          :aria-label="text.grip(i + 1)"
          :aria-roledescription="text.roleDescription"
          :aria-pressed="held === i"
          :aria-describedby="hint"
          @pointerdown="sortable.grab(i, $event)"
          @pointermove="sortable.track"
          @pointerup="sortable.drop"
          @pointercancel="sortable.cancel"
          @keydown="onKey(i, $event)"
          @blur="release"
        >
          <span aria-hidden="true">⋮⋮</span>
        </button>
        <span class="bless-sortable__body"
          ><slot :item :index="i">{{ item }}</slot></span
        >
      </li>
    </ul>
    <span :id="hint" hidden>{{ text.hint }}{{ group ? ` ${text.groupHint}` : "" }}</span>
    <span class="bless-sortable__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-sortable {
  position: relative;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-sortable--group {
  min-height: 3rem;
}
.bless-sortable--receiving {
  outline: 2px dashed var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-sortable__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--bless-space-2);
}
.bless-sortable__list--grid {
  grid-template-columns: repeat(var(--bless-sortable-cols), minmax(0, 1fr));
}
.bless-sortable__item {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
.bless-sortable__item--drag {
  opacity: 0.4;
}
.bless-sortable__item--held {
  border-color: var(--bless-color-accent);
}
.bless-sortable__item--before {
  box-shadow: inset 0 2px 0 var(--bless-color-accent);
}
.bless-sortable__item--after {
  box-shadow: inset 0 -2px 0 var(--bless-color-accent);
}
.bless-sortable__list--grid .bless-sortable__item--before {
  box-shadow: inset 2px 0 0 var(--bless-color-accent);
}
.bless-sortable__list--grid .bless-sortable__item--after {
  box-shadow: inset -2px 0 0 var(--bless-color-accent);
}
[dir="rtl"] .bless-sortable__list--grid .bless-sortable__item--before {
  box-shadow: inset -2px 0 0 var(--bless-color-accent);
}
[dir="rtl"] .bless-sortable__list--grid .bless-sortable__item--after {
  box-shadow: inset 2px 0 0 var(--bless-color-accent);
}
.bless-sortable__grip {
  flex: none;
  padding: var(--bless-space-1) var(--bless-space-2);
  border: 0;
  background: transparent;
  color: var(--bless-color-text-muted);
  font: inherit;
  letter-spacing: -3px;
  cursor: grab;
  touch-action: none;
}
.bless-sortable__grip:active {
  cursor: grabbing;
}
.bless-sortable__grip:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
.bless-sortable__body {
  flex: 1;
  min-width: 0;
}
.bless-sortable__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
