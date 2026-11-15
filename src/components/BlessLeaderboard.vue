<script lang="ts">
export interface BlessLeader {
  id: string | number;
  name: string;
  score: number;
  avatar?: string;
  /** the place last time; with it, the row shows how far it moved */
  previous?: number;
}

/** Places by score, high first. Equal scores share a place, and the next place skips: 1, 2, 2, 4. */
export function rankLeaders<T extends { score: number }>(rows: T[]): (T & { rank: number })[] {
  const sorted = [...rows].sort((a, b) => b.score - a.score);
  let rank = 0;
  return sorted.map((r, i) => {
    if (!i || sorted[i - 1]!.score !== r.score) rank = i + 1;
    return { ...r, rank };
  });
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import { numberText } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessLeaderboard" });
const pack = useLabelPack("BlessLeaderboard");

const props = withDefaults(
  defineProps<{
    rows: BlessLeader[];
    /** the id of the reader's row: it stands out, and it shows even below the limit */
    me?: string | number;
    /** show only the first places; 0 shows all */
    limit?: number;
    /** text for a score, for example `(v) => v + " pts"` */
    format?: (v: number) => string;
    /** names the table for screen readers */
    label?: string;
    labels?: Partial<{
      rank: string;
      name: string;
      score: string;
      change: string;
      up: (places: number) => string;
      down: (places: number) => string;
      same: string;
      new: string;
      you: string;
    }>;
  }>(),
  { limit: 0, label: "Leaderboard" },
);

const text = computed(() => ({
  rank: "Place",
  name: "Name",
  score: "Score",
  change: "Change",
  up: (n: number) => `up ${n}`,
  down: (n: number) => `down ${n}`,
  same: "no change",
  new: "new",
  you: "you",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);

const ranked = computed(() => rankLeaders(props.rows));
const shown = computed(() => {
  const all = ranked.value;
  if (!props.limit || all.length <= props.limit) return { top: all, mine: undefined };
  const top = all.slice(0, props.limit);
  const mine = top.some((r) => r.id === props.me) ? undefined : all.find((r) => r.id === props.me);
  return { top, mine };
});
const move = (r: BlessLeader & { rank: number }) =>
  r.previous === undefined
    ? { dir: "new", text: text.value.new }
    : r.previous > r.rank
      ? { dir: "up", text: text.value.up(r.previous - r.rank) }
      : r.previous < r.rank
        ? { dir: "down", text: text.value.down(r.rank - r.previous) }
        : { dir: "same", text: text.value.same };
</script>

<template>
  <table class="bless-leaders">
    <caption class="bless-sr">
      {{ label }}
    </caption>
    <thead class="bless-sr">
      <tr>
        <th scope="col">{{ text.rank }}</th>
        <th scope="col">{{ text.name }}</th>
        <th scope="col">{{ text.change }}</th>
        <th scope="col">{{ text.score }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(group, g) in [shown.top, shown.mine ? [shown.mine] : []]" :key="g">
        <tr v-if="g === 1 && group.length" class="bless-leaders__gap" aria-hidden="true">
          <td colspan="4">⋯</td>
        </tr>
        <tr
          v-for="r in group"
          :key="r.id"
          class="bless-leaders__row"
          :class="{ 'is-me': r.id === me, [`is-top${r.rank}`]: r.rank <= 3 }"
          :aria-current="r.id === me ? 'true' : undefined"
        >
          <td class="bless-leaders__rank">{{ r.rank }}</td>
          <th scope="row" class="bless-leaders__name">
            <BlessAvatar :src="r.avatar" :name="r.name" alt="" size="sm" />
            <span>{{ r.name }}</span>
            <span v-if="r.id === me" class="bless-leaders__you">{{ text.you }}</span>
          </th>
          <td class="bless-leaders__move" :class="`is-${move(r).dir}`">
            <span aria-hidden="true">{{
              move(r).dir === "up"
                ? `▲ ${r.previous! - r.rank}`
                : move(r).dir === "down"
                  ? `▼ ${r.rank - r.previous!}`
                  : move(r).dir === "new"
                    ? "●"
                    : "–"
            }}</span>
            <span class="bless-sr">{{ move(r).text }}</span>
          </td>
          <td class="bless-leaders__score">{{ fmt(r.score) }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style>
.bless-leaders {
  inline-size: 100%;
  border-collapse: collapse;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-leaders__row td,
.bless-leaders__row th {
  padding: var(--bless-space-2) var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  font-weight: normal;
  text-align: start;
}
.bless-leaders__rank {
  inline-size: 2.5rem;
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  text-align: center !important;
}
/* the first three places get a filled box; the shade, not only the color, tells them apart */
.is-top1 .bless-leaders__rank,
.is-top2 .bless-leaders__rank,
.is-top3 .bless-leaders__rank {
  background-clip: content-box;
}
.is-top1 .bless-leaders__rank {
  background-color: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.is-top2 .bless-leaders__rank {
  background-color: color-mix(in srgb, var(--bless-color-text) 70%, var(--bless-color-bg));
  color: var(--bless-color-bg);
}
.is-top3 .bless-leaders__rank {
  background-color: var(--bless-color-surface-2);
}
.bless-leaders__name {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-leaders__you {
  padding: 0 var(--bless-space-1);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-leaders__row.is-me {
  background: var(--bless-color-accent-soft);
}
.bless-leaders__row.is-me .bless-leaders__name > span:not(.bless-leaders__you) {
  font-weight: var(--bless-font-weight-bold);
}
.bless-leaders__move {
  inline-size: 4rem;
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--bless-color-text-muted);
}
.bless-leaders__move.is-up {
  color: var(--bless-color-text);
}
.bless-leaders__move.is-down {
  color: var(--bless-color-danger-text);
}
.bless-leaders__score {
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  text-align: end !important;
}
.bless-leaders__gap td {
  padding: var(--bless-space-1);
  color: var(--bless-color-text-muted);
  text-align: center;
}
</style>
