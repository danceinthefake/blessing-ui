<script setup lang="ts">
import { computed } from "vue";
import {
  columnState,
  isOn,
  setCell,
  setColumn,
  type CheckMatrix,
} from "../composables/checkMatrix";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessNotificationPrefs" });
const pack = useLabelPack("BlessNotificationPrefs");

export interface BlessNotifyEvent {
  key: string;
  label: string;
  description?: string;
}
export interface BlessNotifyChannel {
  key: string;
  label: string;
}

const props = defineProps<{
  events: BlessNotifyEvent[];
  channels: BlessNotifyChannel[];
  /** names the table */
  label?: string;
  labels?: Partial<{
    title: string;
    event: string;
    all: (channel: string) => string;
    cell: (event: string, channel: string) => string;
  }>;
}>();
/** the channels that are on for each event, by key */
const prefs = defineModel<CheckMatrix>({ default: () => ({}) });

const text = computed(() => ({
  title: "Notifications",
  event: "Event",
  all: (c: string) => `All by ${c}`,
  cell: (e: string, c: string) => `${e} by ${c}`,
  ...pack(),
  ...props.labels,
}));
const keys = computed(() => props.events.map((e) => e.key));
</script>

<template>
  <div class="bless-notify">
    <table class="bless-notify__table">
      <caption class="bless-sr">
        {{ label ?? text.title }}
      </caption>
      <thead>
        <tr>
          <th scope="col" class="bless-notify__event">{{ text.event }}</th>
          <th v-for="c in channels" :key="c.key" scope="col" class="bless-notify__channel">
            <span>{{ c.label }}</span>
            <input
              type="checkbox"
              class="bless-notify__check"
              :checked="columnState(prefs, keys, c.key) === true"
              :indeterminate="columnState(prefs, keys, c.key) === 'mixed'"
              :aria-label="text.all(c.label)"
              @change="
                prefs = setColumn(prefs, keys, c.key, ($event.target as HTMLInputElement).checked)
              "
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in events" :key="e.key">
          <th scope="row" class="bless-notify__event">
            <span class="bless-notify__label">{{ e.label }}</span>
            <span v-if="e.description" class="bless-notify__desc">{{ e.description }}</span>
          </th>
          <td v-for="c in channels" :key="c.key" class="bless-notify__cell">
            <input
              type="checkbox"
              class="bless-notify__check"
              :checked="isOn(prefs, e.key, c.key)"
              :aria-label="text.cell(e.label, c.label)"
              @change="
                prefs = setCell(prefs, e.key, c.key, ($event.target as HTMLInputElement).checked)
              "
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.bless-notify {
  max-inline-size: 100%;
  overflow-x: auto;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-notify__table {
  inline-size: 100%;
  border-collapse: collapse;
}
.bless-notify__table th,
.bless-notify__table td {
  padding: var(--bless-space-2) var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-notify__event {
  text-align: start;
}
thead .bless-notify__event {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-notify__channel {
  inline-size: 6rem;
  text-align: center;
}
.bless-notify__channel > span {
  display: block;
  margin-block-end: var(--bless-space-1);
  font-size: var(--bless-text-xs);
}
tbody .bless-notify__event {
  font-weight: normal;
}
.bless-notify__label {
  display: block;
  font-weight: var(--bless-font-weight-bold);
}
.bless-notify__desc {
  display: block;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-notify__cell {
  text-align: center;
}
.bless-notify__check {
  inline-size: 1.1rem;
  block-size: 1.1rem;
  accent-color: var(--bless-color-accent);
  cursor: pointer;
}
.bless-notify__check:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
