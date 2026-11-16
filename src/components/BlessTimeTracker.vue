<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessTimeTracker" });
const pack = useLabelPack("BlessTimeTracker");

export interface BlessTimeEntry {
  id: string;
  task: string;
  /** the start and the end, in milliseconds since 1970 */
  start: number;
  end: number;
}

const props = withDefaults(
  defineProps<{
    locale?: string;
    /** an IANA time zone for the days and times; set it when you render on a server */
    timeZone?: string;
    labels?: Partial<{
      task: string;
      start: string;
      stop: string;
      remove: (task: string) => string;
      total: string;
      untitled: string;
      duration: (h: number, m: number) => string;
    }>;
  }>(),
  { locale: "en" },
);
const entries = defineModel<BlessTimeEntry[]>({ default: () => [] });
/** the task that runs now, if any; keep it in your store so a reload does not lose it */
const running = defineModel<{ task: string; start: number } | null>("running", { default: null });

const text = computed(() => ({
  task: "What are you working on?",
  start: "Start",
  stop: "Stop",
  remove: (t: string) => `Delete ${t}`,
  total: "Total",
  untitled: "No task name",
  duration: (h: number, m: number) => (h ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`),
  ...pack(),
  ...props.labels,
}));
const task = ref(running.value?.task ?? "");
const now = ref(Date.now());
let tick: ReturnType<typeof setInterval> | undefined;
const run = (on: boolean) => {
  clearInterval(tick);
  if (on) tick = setInterval(() => (now.value = Date.now()), 1000);
};
onMounted(() => watch(() => !!running.value, run, { immediate: true }));
onBeforeUnmount(() => clearInterval(tick));

function toggle() {
  const t = Date.now();
  now.value = t;
  if (!running.value) {
    running.value = { task: task.value.trim(), start: t };
    return;
  }
  const r = running.value;
  entries.value = [{ id: String(r.start), task: r.task, start: r.start, end: t }, ...entries.value];
  running.value = null;
  task.value = "";
}
const clock = computed(() => {
  const s = running.value ? Math.max(0, Math.floor((now.value - running.value.start) / 1000)) : 0;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${Math.floor(s / 3600)}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;
});
const dur = (ms: number) => {
  const m = Math.round(ms / 60000);
  return text.value.duration(Math.floor(m / 60), m % 60);
};
const dayFmt = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: props.timeZone,
    }),
);
const timeFmt = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: props.timeZone,
    }),
);
const days = computed(() => {
  const m = new Map<string, BlessTimeEntry[]>();
  for (const e of [...entries.value].sort((a, b) => b.start - a.start)) {
    const k = dayFmt.value.format(e.start);
    m.set(k, [...(m.get(k) ?? []), e]);
  }
  return [...m].map(([day, list]) => ({
    day,
    list,
    total: list.reduce((a, e) => a + e.end - e.start, 0),
  }));
});
const remove = (id: string) => (entries.value = entries.value.filter((e) => e.id !== id));
</script>

<template>
  <div class="bless-timetrack">
    <form class="bless-timetrack__bar" :class="{ 'is-on': running }" @submit.prevent="toggle">
      <input
        v-model="task"
        :aria-label="text.task"
        :placeholder="text.task"
        :readonly="!!running"
      />
      <span class="bless-timetrack__clock" role="timer">{{ clock }}</span>
      <button type="submit">
        <span aria-hidden="true">{{ running ? "■" : "▶" }}</span>
        {{ running ? text.stop : text.start }}
      </button>
    </form>
    <section v-for="d in days" :key="d.day" class="bless-timetrack__day" :aria-label="d.day">
      <div class="bless-timetrack__head">
        <strong>{{ d.day }}</strong>
        <span>{{ text.total }} {{ dur(d.total) }}</span>
      </div>
      <ul class="bless-timetrack__list" role="list">
        <li v-for="e in d.list" :key="e.id">
          <div class="bless-timetrack__entry">
            <span class="bless-timetrack__task">{{ e.task || text.untitled }}</span>
            <span class="bless-timetrack__range">
              {{ timeFmt.format(e.start) }}–{{ timeFmt.format(e.end) }}
            </span>
            <span class="bless-timetrack__dur">{{ dur(e.end - e.start) }}</span>
            <button
              type="button"
              :aria-label="text.remove(e.task || text.untitled)"
              @click="remove(e.id)"
            >
              ✕
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style>
.bless-timetrack {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 40rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-timetrack__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3);
  border: 2px solid var(--bless-color-border);
}
.bless-timetrack__bar.is-on {
  border-color: var(--bless-color-accent);
}
.bless-timetrack__bar input {
  flex: 1 1 12rem;
  min-inline-size: 0;
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-timetrack__clock {
  min-inline-size: 5.5rem;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  text-align: end;
}
.bless-timetrack__bar button {
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-4);
  border: 0;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-timetrack__bar.is-on button {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-timetrack :is(input, button):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-timetrack__day {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-timetrack__head {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
  padding-block-end: var(--bless-space-1);
  border-block-end: 2px solid var(--bless-color-text);
  font-variant-numeric: tabular-nums;
}
.bless-timetrack__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-timetrack__entry {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 6rem auto;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  font-variant-numeric: tabular-nums;
}
.bless-timetrack__task {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-timetrack__dur {
  font-weight: var(--bless-font-weight-bold);
  text-align: end;
}
.bless-timetrack__entry button {
  inline-size: 2rem;
  block-size: 2rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  cursor: pointer;
}
</style>
