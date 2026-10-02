<script setup lang="ts">
import { computed, ref } from "vue";
import { diffLines, type DiffRow } from "../composables/diffLines";

defineOptions({ name: "BlessDiff" });

const props = withDefaults(
  defineProps<{
    /** the old text */
    a: string;
    /** the new text */
    b: string;
    mode?: "inline" | "split";
    /** unchanged lines kept around each change; the rest fold away. Leave out to show everything */
    context?: number;
    lineNumbers?: boolean;
    labelA?: string;
    labelB?: string;
    label?: string;
  }>(),
  { mode: "inline", lineNumbers: true, labelA: "Before", labelB: "After", label: "Changes" },
);

const rows = computed(() => diffLines(props.a, props.b));
const added = computed(() => rows.value.filter((r) => r.type === "add").length);
const removed = computed(() => rows.value.filter((r) => r.type === "del").length);

type Item =
  | { kind: "row"; row: DiffRow }
  | { kind: "pair"; left?: DiffRow; right?: DiffRow }
  | { kind: "fold"; id: number; count: number };

/** rows after folding long unchanged runs; `open` holds the folds the reader expanded */
const open = ref(new Set<number>());
const flat = computed(() => {
  const c = props.context;
  if (c == null) return rows.value.map((row) => ({ row, hide: false, id: -1 }));
  const out = rows.value.map((row) => ({ row, hide: false, id: -1 }));
  let i = 0;
  let id = 0;
  while (i < out.length) {
    if (out[i]!.row.type !== "same") {
      i++;
      continue;
    }
    let j = i;
    while (j < out.length && out[j]!.row.type === "same") j++;
    const from = i === 0 ? i : i + c;
    const to = j === out.length ? j : j - c;
    if (to - from > 1 && !open.value.has(id)) {
      for (let k = from; k < to; k++) ((out[k]!.hide = true), (out[k]!.id = id));
    }
    id++;
    i = j;
  }
  return out;
});
const items = computed<Item[]>(() => {
  const out: Item[] = [];
  const seen = new Set<number>();
  const pending = { del: [] as DiffRow[], add: [] as DiffRow[] };
  const flush = () => {
    if (props.mode === "inline") {
      for (const r of [...pending.del, ...pending.add]) out.push({ kind: "row", row: r });
    } else {
      const n = Math.max(pending.del.length, pending.add.length);
      for (let k = 0; k < n; k++)
        out.push({ kind: "pair", left: pending.del[k], right: pending.add[k] });
    }
    pending.del = [];
    pending.add = [];
  };
  for (const { row, hide, id } of flat.value) {
    if (hide) {
      flush();
      if (!seen.has(id)) {
        seen.add(id);
        out.push({
          kind: "fold",
          id,
          count: flat.value.filter((f) => f.id === id && f.hide).length,
        });
      }
    } else if (row.type === "del") pending.del.push(row);
    else if (row.type === "add") pending.add.push(row);
    else {
      flush();
      out.push(
        props.mode === "inline" ? { kind: "row", row } : { kind: "pair", left: row, right: row },
      );
    }
  }
  flush();
  return out;
});
const sign = { same: "", add: "+", del: "−" } as const;
const word = { same: "", add: "added", del: "removed" } as const;
const expand = (id: number) => (open.value = new Set(open.value).add(id));
const cols = computed(() => (props.mode === "inline" ? 4 : 4));
</script>

<template>
  <figure class="bless-diff" :class="`bless-diff--${mode}`">
    <figcaption class="bless-diff__head">
      <span class="bless-diff__title">{{ label }}</span>
      <span class="bless-diff__count">
        <span class="bless-diff__plus">+{{ added }}</span>
        <span class="bless-diff__minus">−{{ removed }}</span>
        <span class="bless-diff__sr">{{ added }} lines added, {{ removed }} removed</span>
      </span>
    </figcaption>
    <div class="bless-diff__scroll" tabindex="0" role="region" :aria-label="label">
      <table class="bless-diff__table">
        <thead v-if="mode === 'split'" class="bless-diff__cols">
          <tr>
            <th v-if="lineNumbers" aria-hidden="true"></th>
            <th scope="col">{{ labelA }}</th>
            <th v-if="lineNumbers" aria-hidden="true"></th>
            <th scope="col">{{ labelB }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(it, n) in items" :key="n">
            <tr v-if="it.kind === 'fold'" class="bless-diff__fold">
              <td :colspan="cols">
                <button type="button" @click="expand(it.id)">
                  {{ it.count }} unchanged {{ it.count === 1 ? "line" : "lines" }}
                </button>
              </td>
            </tr>
            <tr
              v-else-if="it.kind === 'row'"
              :class="`bless-diff__row bless-diff__row--${it.row.type}`"
            >
              <td v-if="lineNumbers" class="bless-diff__no" aria-hidden="true">{{ it.row.a }}</td>
              <td v-if="lineNumbers" class="bless-diff__no" aria-hidden="true">{{ it.row.b }}</td>
              <td class="bless-diff__sign" :aria-label="word[it.row.type] || undefined">
                {{ sign[it.row.type] }}
              </td>
              <td class="bless-diff__text">{{ it.row.text }}</td>
            </tr>
            <tr v-else class="bless-diff__row">
              <template v-for="(side, k) in [it.left, it.right]" :key="k">
                <td v-if="lineNumbers" class="bless-diff__no" aria-hidden="true">
                  {{ k ? side?.b : side?.a }}
                </td>
                <td
                  class="bless-diff__text"
                  :class="
                    side && side.type !== 'same'
                      ? `bless-diff__cell--${side.type}`
                      : !side
                        ? 'bless-diff__cell--empty'
                        : ''
                  "
                  :aria-label="
                    side && side.type !== 'same' ? `${word[side.type]}: ${side.text}` : undefined
                  "
                >
                  {{ side?.text }}
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-diff {
  margin: 0;
  min-width: 0;
  max-width: 100%;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-diff__head {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
  background: var(--bless-color-surface);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-diff__count {
  display: inline-flex;
  gap: var(--bless-space-2);
  font-variant-numeric: tabular-nums;
}
.bless-diff__plus {
  color: var(--bless-color-text);
  font-weight: 600;
}
.bless-diff__minus {
  color: var(--bless-color-danger-text);
  font-weight: 600;
}
.bless-diff__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.bless-diff__scroll {
  overflow: auto;
}
.bless-diff__scroll:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-diff__table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-sm);
}
.bless-diff .bless-diff__cols th {
  padding: var(--bless-space-1) var(--bless-space-3);
  text-align: start;
  font-family: var(--bless-font-sans);
  font-weight: 600;
  color: var(--bless-color-text-muted);
}
/* cells carry the colours and spacing, so a host stylesheet that stripes <tr> or pads <td> cannot undo them */
.bless-diff .bless-diff__table :is(td, th) {
  padding: 0 var(--bless-space-2);
  border: 0;
  background: transparent;
  vertical-align: top;
}
.bless-diff .bless-diff__table tr {
  background: transparent;
}
.bless-diff__no {
  width: 1%;
  min-width: 3ch;
  text-align: end;
  color: var(--bless-color-text-muted);
  user-select: none;
}
.bless-diff__sign {
  width: 1%;
  user-select: none;
  font-weight: 700;
}
.bless-diff__text {
  white-space: pre;
}
.bless-diff .bless-diff__row--add > td,
.bless-diff .bless-diff__table td.bless-diff__cell--add {
  background: color-mix(in srgb, var(--bless-color-success) 24%, var(--bless-color-bg));
}
.bless-diff .bless-diff__row--del > td,
.bless-diff .bless-diff__table td.bless-diff__cell--del {
  background: color-mix(in srgb, var(--bless-color-danger) 18%, var(--bless-color-bg));
}
/* muted numbers fall under 4.5:1 on a tint: full-strength text there */
.bless-diff .bless-diff__row--add > .bless-diff__no,
.bless-diff .bless-diff__row--del > .bless-diff__no,
.bless-diff .bless-diff__table td.bless-diff__cell--add + .bless-diff__no {
  color: var(--bless-color-text);
}
.bless-diff .bless-diff__table td.bless-diff__cell--empty {
  background: var(--bless-color-surface);
}
.bless-diff--split .bless-diff__text {
  width: 50%;
  border-inline-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-diff .bless-diff__table .bless-diff__fold td {
  padding: var(--bless-space-1) var(--bless-space-3);
  background: var(--bless-color-surface);
  border-block: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-diff__fold button {
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-family: var(--bless-font-sans);
  cursor: pointer;
  text-decoration: underline;
}
.bless-diff__fold button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
</style>
