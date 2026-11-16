<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessFloorPlan" });
const pack = useLabelPack("BlessFloorPlan");

export interface BlessRoom {
  id: string;
  name: string;
  /** the place on the plan grid, in cells from the top left */
  x: number;
  y: number;
  /** the size in cells */
  w: number;
  h: number;
}
export interface BlessRoomDevice {
  id: string;
  name: string;
  room: string;
  on?: boolean;
  /** an emoji or a short text */
  icon?: string;
}

const props = withDefaults(
  defineProps<{
    rooms: BlessRoom[];
    devices?: BlessRoomDevice[];
    /** the number of grid columns of the plan */
    columns?: number;
    labels?: Partial<{ title: string; devices: (count: number, on: number) => string }>;
  }>(),
  { devices: () => [], columns: 12 },
);
/** the id of the open room */
const selected = defineModel<string>();

const text = computed(() => ({
  title: "Floor plan",
  devices: (n: number, on: number) =>
    n === 0 ? "No devices" : `${n} ${n === 1 ? "device" : "devices"}, ${on} on`,
  ...pack(),
  ...props.labels,
}));
const inRoom = (id: string) => props.devices.filter((d) => d.room === id);
const room = computed(() => props.rooms.find((r) => r.id === selected.value));
</script>

<template>
  <section class="bless-floorplan" :aria-label="text.title">
    <div class="bless-floorplan__grid" :style="{ '--_cols': columns }">
      <button
        v-for="r in rooms"
        :key="r.id"
        type="button"
        class="bless-floorplan__room"
        :aria-pressed="selected === r.id"
        :style="{ gridColumn: `${r.x + 1} / span ${r.w}`, gridRow: `${r.y + 1} / span ${r.h}` }"
        @click="selected = selected === r.id ? undefined : r.id"
      >
        <span class="bless-floorplan__name">{{ r.name }}</span>
        <span class="bless-floorplan__count">
          {{ text.devices(inRoom(r.id).length, inRoom(r.id).filter((d) => d.on).length) }}
        </span>
        <span class="bless-floorplan__icons" aria-hidden="true">
          <span v-for="d in inRoom(r.id)" :key="d.id" :class="{ 'is-on': d.on }">{{
            d.icon ?? "•"
          }}</span>
        </span>
      </button>
    </div>
    <div v-if="room && $slots.room" class="bless-floorplan__detail">
      <slot name="room" :room="room" :devices="inRoom(room.id)" />
    </div>
  </section>
</template>

<style>
.bless-floorplan {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-floorplan__grid {
  display: grid;
  grid-template-columns: repeat(var(--_cols), minmax(0, 1fr));
  grid-auto-rows: 3rem;
  gap: 0;
  padding: 3px;
  border: 3px solid var(--bless-color-text);
  background: var(--bless-color-surface-2);
}
/* walls are borders that touch, as on a drawn plan */
.bless-floorplan__room {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-inline-size: 0;
  margin: -1px;
  padding: var(--bless-space-2);
  overflow: hidden;
  border: 2px solid var(--bless-color-text);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-floorplan__room:hover {
  background: color-mix(in srgb, var(--bless-color-accent) 10%, var(--bless-color-bg));
}
.bless-floorplan__room[aria-pressed="true"] {
  background: color-mix(in srgb, var(--bless-color-accent) 16%, var(--bless-color-bg));
  box-shadow: inset 0 0 0 3px var(--bless-color-accent);
}
.bless-floorplan__room:focus-visible {
  position: relative;
  z-index: 1;
  outline: 3px solid var(--bless-color-accent);
  outline-offset: -3px;
}
.bless-floorplan__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-floorplan__count {
  font-size: var(--bless-text-xs);
}
.bless-floorplan__icons {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-block-start: auto;
}
.bless-floorplan__icons > span:not(.is-on) {
  filter: grayscale(1);
  opacity: 0.45;
}
</style>
