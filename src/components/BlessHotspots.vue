<script lang="ts">
export interface BlessHotspot {
  id: string | number;
  /** position in percent of the stage, 0 to 100 */
  x: number;
  y: number;
  /** names the pin for screen readers, and is the popover's text without a `#spot` slot */
  label: string;
}
</script>

<script setup lang="ts" generic="S extends BlessHotspot = BlessHotspot">
import { ref } from "vue";
import BlessPopover from "./BlessPopover.vue";

defineOptions({ name: "BlessHotspots" });

const props = withDefaults(
  defineProps<{
    /** an image to pin onto; leave out and use the default slot for a diagram or anything else */
    src?: string;
    alt?: string;
    /** click the stage to add a pin, drag to move one, Delete to remove it, arrows to nudge it */
    editable?: boolean;
    placement?: "top" | "bottom" | "left" | "right";
  }>(),
  { alt: "", placement: "top" },
);
const spots = defineModel<S[]>({ default: () => [] });
/** id of the pin whose popover is open */
const active = defineModel<S["id"] | null>("active", { default: null });
const emit = defineEmits<{ add: [spot: S]; remove: [spot: S] }>();

const stage = ref<HTMLElement>();
const clamp = (v: number) => Math.min(100, Math.max(0, v));
const pct = (e: PointerEvent | MouseEvent) => {
  const r = stage.value!.getBoundingClientRect();
  return {
    x: clamp(((e.clientX - r.left) / r.width) * 100),
    y: clamp(((e.clientY - r.top) / r.height) * 100),
  };
};
const patch = (i: number, p: Partial<BlessHotspot>) => {
  const next = spots.value.slice();
  next[i] = { ...next[i]!, ...p };
  spots.value = next;
};

let n = 0;
function addAt(e: MouseEvent) {
  if (!props.editable || (e.target as HTMLElement).closest(".bless-hotspots__spot")) return;
  const spot = {
    id: `spot-${Date.now()}-${n++}`,
    ...pct(e),
    label: `Spot ${spots.value.length + 1}`,
  } as S;
  spots.value = [...spots.value, spot];
  active.value = spot.id;
  emit("add", spot);
}

let drag: { i: number; x: number; y: number; moved: boolean } | null = null;
let swallow = false;
function down(i: number, e: PointerEvent) {
  if (!props.editable || e.button) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  drag = { i, x: e.clientX, y: e.clientY, moved: false };
}
function move(e: PointerEvent) {
  if (!drag) return;
  if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 4) return;
  drag.moved = true;
  patch(drag.i, pct(e));
}
function up() {
  swallow = !!drag?.moved; // the click that ends a drag must not toggle the popover
  drag = null;
}
function eat(e: MouseEvent) {
  if (!swallow) return;
  swallow = false;
  e.stopPropagation();
}
function onKey(i: number, e: KeyboardEvent) {
  if (!props.editable) return;
  const s = e.shiftKey ? 5 : 1;
  const d: Record<string, [number, number]> = {
    ArrowLeft: [-s, 0],
    ArrowRight: [s, 0],
    ArrowUp: [0, -s],
    ArrowDown: [0, s],
  };
  const spot = spots.value[i]!;
  if (d[e.key]) {
    e.preventDefault();
    patch(i, { x: clamp(spot.x + d[e.key]![0]), y: clamp(spot.y + d[e.key]![1]) });
  } else if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    spots.value = spots.value.filter((_, j) => j !== i);
    if (active.value === spot.id) active.value = null;
    emit("remove", spot);
  }
}
</script>

<template>
  <div
    ref="stage"
    class="bless-hotspots"
    :class="{ 'bless-hotspots--edit': editable }"
    @click="addAt"
  >
    <slot>
      <img v-if="src" :src :alt class="bless-hotspots__img" draggable="false" />
    </slot>
    <span
      v-for="(s, i) in spots"
      :key="s.id"
      class="bless-hotspots__spot"
      :style="{ left: `${s.x}%`, top: `${s.y}%` }"
      @click.capture="eat"
    >
      <BlessPopover
        arrow
        :placement
        :open="active === s.id"
        @update:open="(o: boolean) => (active = o ? s.id : active === s.id ? null : active)"
      >
        <template #trigger>
          <button
            type="button"
            class="bless-hotspots__pin"
            :class="{ 'bless-hotspots__pin--on': active === s.id }"
            :aria-label="s.label"
            :aria-keyshortcuts="editable ? 'Delete' : undefined"
            @pointerdown="down(i, $event)"
            @pointermove="move"
            @pointerup="up"
            @pointercancel="up"
            @keydown="onKey(i, $event)"
          >
            {{ i + 1 }}
          </button>
        </template>
        <slot name="spot" :spot="s" :index="i">{{ s.label }}</slot>
      </BlessPopover>
    </span>
  </div>
</template>

<style>
.bless-hotspots {
  position: relative;
  display: block;
  line-height: 0;
}
.bless-hotspots--edit {
  cursor: crosshair;
}
.bless-hotspots__img {
  display: block;
  width: 100%;
  height: auto;
}
.bless-hotspots__spot {
  position: absolute;
  transform: translate(-50%, -50%);
  line-height: normal;
}
.bless-hotspots__pin {
  box-sizing: border-box;
  min-width: 24px;
  height: 24px;
  padding: 0 var(--bless-space-1);
  border: 2px solid var(--bless-color-bg);
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font: inherit;
  font-size: var(--bless-text-xs);
  font-weight: 600;
  cursor: pointer;
  touch-action: none;
}
.bless-hotspots--edit .bless-hotspots__pin {
  cursor: grab;
}
.bless-hotspots__pin--on {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-hotspots__pin:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
