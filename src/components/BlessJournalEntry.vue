<script lang="ts">
export interface BlessJournalLine {
  id: string;
  /** the code of the account */
  account: string;
  debit?: number;
  credit?: number;
  memo?: string;
}
/**
 * Totals of a journal entry. In double-entry bookkeeping (as Luca Pacioli wrote it down in 1494),
 * the debits and the credits of an entry must be equal. Cents are rounded, so float sums compare well.
 */
export function journalTotals(lines: BlessJournalLine[]) {
  const cents = (n: number) => Math.round(n * 100);
  const debit = lines.reduce((n, l) => n + cents(l.debit ?? 0), 0);
  const credit = lines.reduce((n, l) => n + cents(l.credit ?? 0), 0);
  return {
    debit: debit / 100,
    credit: credit / 100,
    difference: (debit - credit) / 100,
    balanced: debit === credit && debit > 0,
  };
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { moneyFormat } from "../composables/money";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessJournalEntry" });
const pack = useLabelPack("BlessJournalEntry");

const props = withDefaults(
  defineProps<{
    accounts: { code: string; name: string }[];
    currency?: string;
    locale?: string;
    labels?: Partial<{
      title: string;
      account: string;
      debit: string;
      credit: string;
      memo: string;
      pick: string;
      add: string;
      remove: (row: number) => string;
      field: (what: string, row: number) => string;
      total: string;
      balanced: string;
      off: (amount: string, side: string) => string;
      post: string;
    }>;
  }>(),
  { currency: "USD", locale: "en" },
);
const lines = defineModel<BlessJournalLine[]>({ default: () => [] });
const emit = defineEmits<{ post: [lines: BlessJournalLine[]] }>();

const text = computed(() => ({
  title: "Journal entry",
  account: "Account",
  debit: "Debit",
  credit: "Credit",
  memo: "Memo",
  pick: "Pick an account",
  add: "Add a line",
  remove: (r: number) => `Remove line ${r}`,
  field: (w: string, r: number) => `${w}, line ${r}`,
  total: "Total",
  balanced: "Balanced",
  off: (a: string, side: string) => `Not balanced: ${a} more on the ${side} side`,
  post: "Post the entry",
  ...pack(),
  ...props.labels,
}));
const money = computed(() => moneyFormat(props.locale, props.currency));
const totals = computed(() => journalTotals(lines.value));
const ready = computed(
  () => totals.value.balanced && lines.value.filter((l) => l.account).length >= 2,
);
const status = computed(() =>
  totals.value.balanced
    ? text.value.balanced
    : text.value.off(
        money.value.format(Math.abs(totals.value.difference)),
        (totals.value.difference > 0 ? text.value.debit : text.value.credit).toLowerCase(),
      ),
);
const patch = (id: string, p: Partial<BlessJournalLine>) =>
  (lines.value = lines.value.map((l) => (l.id === id ? { ...l, ...p } : l)));
// a line is a debit or a credit: an amount in one column clears the other
function amount(id: string, side: "debit" | "credit", e: Event) {
  const v = Math.max(0, (e.target as HTMLInputElement).valueAsNumber || 0) || undefined;
  const other = side === "debit" ? "credit" : "debit";
  patch(id, v ? { [side]: v, [other]: undefined } : { [side]: undefined });
}
let seq = 0;
const add = () =>
  (lines.value = [...lines.value, { id: `j${Date.now().toString(36)}${seq++}`, account: "" }]);
const remove = (id: string) => (lines.value = lines.value.filter((l) => l.id !== id));
</script>

<template>
  <div class="bless-journal">
    <div class="bless-journal__scroll" role="region" :aria-label="text.title" tabindex="0">
      <table class="bless-journal__table">
        <thead>
          <tr>
            <th scope="col">{{ text.account }}</th>
            <th scope="col">{{ text.debit }}</th>
            <th scope="col">{{ text.credit }}</th>
            <th scope="col">{{ text.memo }}</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(l, i) in lines" :key="l.id">
            <td>
              <select
                :value="l.account"
                :aria-label="text.field(text.account, i + 1)"
                @change="patch(l.id, { account: ($event.target as HTMLSelectElement).value })"
              >
                <option value="" disabled>{{ text.pick }}</option>
                <option v-for="a in accounts" :key="a.code" :value="a.code">
                  {{ a.code }} · {{ a.name }}
                </option>
              </select>
            </td>
            <td>
              <input
                type="number"
                min="0"
                step="any"
                :value="l.debit ?? ''"
                :aria-label="text.field(text.debit, i + 1)"
                @change="amount(l.id, 'debit', $event)"
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                step="any"
                :value="l.credit ?? ''"
                :aria-label="text.field(text.credit, i + 1)"
                @change="amount(l.id, 'credit', $event)"
              />
            </td>
            <td>
              <input
                class="is-text"
                :value="l.memo ?? ''"
                :aria-label="text.field(text.memo, i + 1)"
                @change="patch(l.id, { memo: ($event.target as HTMLInputElement).value })"
              />
            </td>
            <td>
              <button
                type="button"
                class="bless-journal__x"
                :aria-label="text.remove(i + 1)"
                :title="text.remove(i + 1)"
                @click="remove(l.id)"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{{ text.total }}</th>
            <td>{{ money.format(totals.debit) }}</td>
            <td>{{ money.format(totals.credit) }}</td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="bless-journal__foot">
      <button type="button" class="bless-journal__add" @click="add">+ {{ text.add }}</button>
      <p class="bless-journal__status" :class="{ 'is-ok': totals.balanced }" role="status">
        <span aria-hidden="true">{{ totals.balanced ? "✓" : "≠" }}</span> {{ status }}
      </p>
      <BlessButton :disabled="!ready" @click="emit('post', lines)">{{ text.post }}</BlessButton>
    </div>
  </div>
</template>

<style>
.bless-journal {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-journal__scroll {
  overflow-x: auto;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-journal__table {
  inline-size: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.bless-journal__table th,
.bless-journal__table td {
  padding: var(--bless-space-1);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: end;
  white-space: nowrap;
}
.bless-journal__table :is(th, td):first-child,
.bless-journal__table :is(th, td):nth-child(4) {
  text-align: start;
}
.bless-journal__table thead th {
  background: var(--bless-color-surface-2);
  font-size: var(--bless-text-xs);
}
.bless-journal__table tfoot :is(th, td) {
  border-block: 2px solid var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-journal__table select,
.bless-journal__table input {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-journal__table input {
  inline-size: 8rem;
  text-align: end;
}
.bless-journal__table input.is-text {
  inline-size: 100%;
  min-inline-size: 10rem;
  text-align: start;
}
.bless-journal__table select:focus-visible,
.bless-journal__table input:focus-visible,
.bless-journal__x:focus-visible,
.bless-journal__add:focus-visible,
.bless-journal__scroll:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-journal__x {
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  cursor: pointer;
}
.bless-journal__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-3);
}
.bless-journal__add {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) dashed var(--bless-color-border);
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-journal__status {
  flex: 1;
  margin: 0;
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-journal__status.is-ok {
  color: var(--bless-color-text);
}
</style>
