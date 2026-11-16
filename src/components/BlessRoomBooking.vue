<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessRoomBooking" });
const pack = useLabelPack("BlessRoomBooking");

export interface BlessMeetingRoom {
  id: string;
  name: string;
  seats?: number;
}
export interface BlessRoomSlot {
  room: string;
  /** "HH:MM" on the 24-hour clock */
  start: string;
  end: string;
  title?: string;
}

const props = withDefaults(
  defineProps<{
    rooms: BlessMeetingRoom[];
    bookings?: BlessRoomSlot[];
    /** the first and the last hour of the day, as whole hours */
    from?: number;
    to?: number;
    labels?: Partial<{
      caption: string;
      room: string;
      seats: (n: number) => string;
      free: (room: string, time: string) => string;
      busy: string;
      pick: string;
      chosen: (room: string, start: string, end: string) => string;
      book: string;
    }>;
  }>(),
  { bookings: () => [], from: 8, to: 18 },
);
/** the time that the person picks; a second click later in the same room makes it longer */
const picked = defineModel<BlessRoomSlot | null>({ default: null });
const emit = defineEmits<{ book: [slot: BlessRoomSlot] }>();

const text = computed(() => ({
  caption: "Rooms and times",
  room: "Room",
  seats: (n: number) => `${n} seats`,
  free: (r: string, t: string) => `${r}, ${t}, free`,
  busy: "Booked",
  pick: "Pick a free time.",
  chosen: (r: string, s: string, e: string) => `${r}, ${s}–${e}`,
  book: "Book",
  ...pack(),
  ...props.labels,
}));
const STEP = 30;
const min = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h! * 60 + (m ?? 0);
};
const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const hours = computed(() =>
  Array.from({ length: props.to - props.from }, (_, i) => hhmm((props.from + i) * 60)),
);
const slots = computed(() =>
  Array.from(
    { length: ((props.to - props.from) * 60) / STEP },
    (_, i) => props.from * 60 + i * STEP,
  ),
);
type Cell = { at: number; span: number; booking?: BlessRoomSlot };
const rows = computed(() =>
  props.rooms.map((room) => {
    const cells: Cell[] = [];
    for (let i = 0; i < slots.value.length;) {
      const at = slots.value[i]!;
      const b = props.bookings.find(
        (x) => x.room === room.id && min(x.start) <= at && min(x.end) > at,
      );
      const span = b ? Math.max(1, Math.ceil((min(b.end) - at) / STEP)) : 1;
      cells.push({ at, span: Math.min(span, slots.value.length - i), booking: b });
      i += span;
    }
    return { room, cells };
  }),
);
const busy = (room: string, a: number, b: number) =>
  props.bookings.some((x) => x.room === room && min(x.start) < b && min(x.end) > a);
const isPicked = (room: string, at: number) =>
  !!picked.value &&
  picked.value.room === room &&
  min(picked.value.start) <= at &&
  min(picked.value.end) > at;
function pick(room: string, at: number) {
  const p = picked.value;
  if (p && p.room === room && at >= min(p.end) && !busy(room, min(p.start), at + STEP)) {
    picked.value = { ...p, end: hhmm(at + STEP) };
  } else picked.value = { room, start: hhmm(at), end: hhmm(at + STEP) };
}
const roomName = (id: string) => props.rooms.find((r) => r.id === id)?.name ?? id;
</script>

<template>
  <div class="bless-rooms">
    <div class="bless-rooms__scroll" tabindex="0" role="group" :aria-label="text.caption">
      <table class="bless-rooms__table">
        <caption class="bless-sr">
          {{ text.caption }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.room }}</th>
            <th v-for="h in hours" :key="h" scope="col" colspan="2">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.room.id">
            <th scope="row">
              <span class="bless-rooms__name">{{ r.room.name }}</span>
              <span v-if="r.room.seats" class="bless-rooms__seats">{{
                text.seats(r.room.seats)
              }}</span>
            </th>
            <template v-for="c in r.cells" :key="c.at">
              <td v-if="c.booking" :colspan="c.span" class="bless-rooms__busy">
                <span class="bless-rooms__title">{{ c.booking.title || text.busy }}</span>
                <span class="bless-sr">{{ c.booking.start }}–{{ c.booking.end }}</span>
              </td>
              <td v-else class="bless-rooms__free">
                <button
                  type="button"
                  :aria-pressed="isPicked(r.room.id, c.at)"
                  :aria-label="text.free(r.room.name, hhmm(c.at))"
                  @click="pick(r.room.id, c.at)"
                />
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bless-rooms__foot">
      <span role="status">{{
        picked ? text.chosen(roomName(picked.room), picked.start, picked.end) : text.pick
      }}</span>
      <button v-if="picked" type="button" class="bless-rooms__book" @click="emit('book', picked)">
        {{ text.book }}
      </button>
    </div>
  </div>
</template>

<style>
.bless-rooms {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-rooms__scroll {
  overflow-x: auto;
}
.bless-rooms__scroll:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-rooms__table {
  border-collapse: collapse;
  table-layout: fixed;
  min-inline-size: 100%;
}
.bless-rooms__table th,
.bless-rooms__table td {
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-rooms__table thead th {
  min-inline-size: 3.5rem;
  padding: var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
  text-align: start;
}
.bless-rooms__table thead th:first-child {
  inline-size: 8rem;
}
.bless-rooms__table tbody th {
  padding: var(--bless-space-2);
  text-align: start;
  white-space: nowrap;
}
.bless-rooms__name {
  display: block;
}
.bless-rooms__seats {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-normal);
}
.bless-rooms__free button {
  display: block;
  inline-size: 100%;
  min-inline-size: 1.75rem;
  block-size: 2.75rem;
  border: 0;
  background: var(--bless-color-bg);
  cursor: pointer;
}
.bless-rooms__free button:hover {
  background: var(--bless-color-surface-2);
}
.bless-rooms__free button[aria-pressed="true"] {
  background: var(--bless-color-accent);
}
.bless-rooms__free button:focus-visible {
  outline: 3px solid var(--bless-color-text);
  outline-offset: -3px;
}
/* stripes mark a booked time by more than color */
.bless-rooms__table .bless-rooms__busy {
  padding: 0 var(--bless-space-2);
  background: repeating-linear-gradient(
    135deg,
    var(--bless-color-surface-2) 0 6px,
    var(--bless-color-bg) 6px 12px
  );
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bless-rooms__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-3);
  font-weight: var(--bless-font-weight-bold);
}
.bless-rooms__book {
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-4);
  border: 0;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font: inherit;
  cursor: pointer;
}
.bless-rooms__book:focus-visible {
  outline: 2px solid var(--bless-color-text);
  outline-offset: 2px;
}
</style>
