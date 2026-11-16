<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessMachineBoard" });
const pack = useLabelPack("BlessMachineBoard");

export type BlessMachineState = "running" | "idle" | "setup" | "down" | "offline";
export interface BlessMachine {
  id: string;
  name: string;
  state: BlessMachineState;
  /** minutes in this state */
  minutes?: number;
  /** what it makes now */
  job?: string;
  /** a short reading, for example "92 pcs/h" */
  reading?: string;
}

const props = withDefaults(
  defineProps<{
    machines: BlessMachine[];
    /** put the machines that need help first */
    sort?: boolean;
    labels?: Partial<
      Record<BlessMachineState, string> & {
        title: string;
        since: (time: string) => string;
        time: (h: number, m: number) => string;
        summary: (parts: string) => string;
      }
    >;
  }>(),
  { sort: true },
);
const emit = defineEmits<{ select: [id: string] }>();

const text = computed(() => ({
  title: "Machines",
  running: "Running",
  idle: "Idle",
  setup: "Setup",
  down: "Down",
  offline: "Offline",
  since: (t: string) => `for ${t}`,
  time: (h: number, m: number) => (h ? `${h} h ${m} min` : `${m} min`),
  summary: (p: string) => p,
  ...pack(),
  ...props.labels,
}));
const ORDER: BlessMachineState[] = ["down", "offline", "setup", "idle", "running"];
const MARK: Record<BlessMachineState, string> = {
  running: "▶",
  idle: "❚❚",
  setup: "◐",
  down: "✕",
  offline: "–",
};
const list = computed(() =>
  props.sort
    ? [...props.machines].sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state))
    : props.machines,
);
const summary = computed(() =>
  text.value.summary(
    ORDER.slice()
      .reverse()
      .map((s) => [s, props.machines.filter((m) => m.state === s).length] as const)
      .filter(([, n]) => n > 0)
      .map(([s, n]) => `${n} ${text.value[s].toLowerCase()}`)
      .join(", "),
  ),
);
const span = (m: number) => text.value.time(Math.floor(m / 60), m % 60);
</script>

<template>
  <section class="bless-machines" :aria-label="text.title">
    <p class="bless-machines__summary" role="status">{{ summary }}</p>
    <ul class="bless-machines__grid" role="list">
      <li v-for="m in list" :key="m.id">
        <button
          type="button"
          class="bless-machines__tile"
          :class="`is-${m.state}`"
          @click="emit('select', m.id)"
        >
          <span class="bless-machines__name">{{ m.name }}</span>
          <span class="bless-machines__state">
            <span aria-hidden="true">{{ MARK[m.state] }}</span> {{ text[m.state]
            }}<template v-if="m.minutes !== undefined"
              >{{ " " }}{{ text.since(span(m.minutes)) }}</template
            >
          </span>
          <span v-if="m.job" class="bless-machines__job">{{ m.job }}</span>
          <span v-if="m.reading" class="bless-machines__reading">{{ m.reading }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style>
.bless-machines {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-machines__summary {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-machines__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-machines__tile {
  display: grid;
  align-content: start;
  gap: 2px;
  inline-size: 100%;
  block-size: 100%;
  padding: var(--bless-space-3);
  border: 2px solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-machines__tile:focus-visible {
  outline: 3px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-machines__name {
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-machines__state {
  font-weight: var(--bless-font-weight-bold);
}
.bless-machines__job,
.bless-machines__reading {
  font-size: var(--bless-text-xs);
}
.bless-machines__reading {
  font-variant-numeric: tabular-nums;
}
/* each state has a mark, a word, and an edge; down is the loudest */
.bless-machines__tile.is-running {
  border-inline-start: 6px solid var(--bless-color-success);
}
.bless-machines__tile.is-idle {
  border-style: dashed;
}
.bless-machines__tile.is-setup {
  border-inline-start: 6px solid var(--bless-color-warning);
}
.bless-machines__tile.is-down {
  border: 3px solid var(--bless-color-danger);
  background: color-mix(in srgb, var(--bless-color-danger) 10%, var(--bless-color-bg));
}
/* red text is too faint on the red tint; the frame and the mark carry the alarm */
.bless-machines__tile.is-down .bless-machines__state {
  color: var(--bless-color-text);
  text-transform: uppercase;
}
.bless-machines__tile.is-offline {
  border-style: dotted;
  color: var(--bless-color-text-muted);
}
</style>
