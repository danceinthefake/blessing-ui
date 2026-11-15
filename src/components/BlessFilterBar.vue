<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessInput from "./BlessInput.vue";
import BlessPopover from "./BlessPopover.vue";
import BlessSelect from "./BlessSelect.vue";
import {
  noValue,
  opKey,
  opsFor,
  type BlessQueryField,
  type BlessQueryOp,
  type BlessQueryRule,
} from "./query";

defineOptions({ name: "BlessFilterBar" });
const pack = useLabelPack("BlessFilterBar");

const props = defineProps<{
  /** what people can filter by */
  fields: BlessQueryField[];
  disabled?: boolean;
  labels?: Partial<{
    label: string;
    add: string;
    clear: string;
    done: string;
    remove: string;
    op: string;
    value: string;
    eq: string;
    neq: string;
    contains: string;
    starts: string;
    lt: string;
    lte: string;
    gt: string;
    gte: string;
    empty: string;
    notEmpty: string;
    before: string;
    onOrBefore: string;
    after: string;
    onOrAfter: string;
  }>;
}>();
/** the filters, all of which must match; the same rules as `BlessQueryBuilder` */
const rules = defineModel<BlessQueryRule[]>({ default: () => [] });

const text = computed(() => ({
  label: "Filters",
  add: "Add filter",
  clear: "Clear all",
  done: "Done",
  remove: "Remove filter",
  op: "Operator",
  value: "Value",
  eq: "is",
  neq: "is not",
  contains: "contains",
  starts: "starts with",
  lt: "is less than",
  lte: "is at most",
  gt: "is more than",
  gte: "is at least",
  empty: "is empty",
  notEmpty: "is not empty",
  before: "is before",
  onOrBefore: "is on or before",
  after: "is after",
  onOrAfter: "is on or after",
  ...(pack() as Record<string, string>),
  ...props.labels,
}));
const words = computed(() => text.value as Record<string, string>);

const field = (name: string) => props.fields.find((f) => f.name === name);
const opText = (r: BlessQueryRule) => words.value[opKey(field(r.field), r.op)];
const valueText = (r: BlessQueryRule) => {
  if (noValue(r.op)) return "";
  const f = field(r.field);
  const v = f?.type === "select" ? f.options?.find((o) => o.value === r.value)?.label : r.value;
  return v || "…";
};

const editing = ref<number | null>(null);
const adding = ref(false);
const addBtn = ref<HTMLElement>();
function patch(i: number, p: Partial<BlessQueryRule>) {
  rules.value = rules.value.map((r, j) => (j === i ? { ...r, ...p } : r));
}
function add(f: BlessQueryField) {
  adding.value = false;
  rules.value = [...rules.value, { field: f.name, op: opsFor(f)[0]!, value: "" }];
  // the new filter opens, so the person sets its value next
  nextTick(() => (editing.value = rules.value.length - 1));
}
function remove(i: number) {
  editing.value = null;
  rules.value = rules.value.filter((_, j) => j !== i);
  nextTick(() => addBtn.value?.querySelector("button")?.focus());
}
</script>

<template>
  <div class="bless-filterbar" role="group" :aria-label="text.label">
    <ul v-if="rules.length" role="list" class="bless-filterbar__list">
      <li v-for="(r, i) in rules" :key="i" class="bless-filterbar__chip">
        <BlessPopover
          :open="editing === i"
          placement="bottom-start"
          :title="field(r.field)?.label ?? r.field"
          @update:open="editing = $event ? i : editing === i ? null : editing"
        >
          <template #trigger>
            <button type="button" class="bless-filterbar__edit" :disabled>
              <span class="bless-filterbar__field">{{ field(r.field)?.label ?? r.field }}</span>
              {{ opText(r) }}
              <strong v-if="!noValue(r.op)">{{ valueText(r) }}</strong>
            </button>
          </template>
          <div class="bless-filterbar__form">
            <BlessSelect
              :model-value="r.op"
              size="sm"
              :aria-label="text.op"
              :options="
                opsFor(field(r.field)).map((o) => ({
                  value: o,
                  label: words[opKey(field(r.field), o)]!,
                }))
              "
              @update:model-value="patch(i, { op: $event as BlessQueryOp })"
            />
            <template v-if="!noValue(r.op)">
              <BlessSelect
                v-if="field(r.field)?.type === 'select'"
                :model-value="r.value"
                size="sm"
                :aria-label="text.value"
                :placeholder="text.value"
                :options="field(r.field)?.options ?? []"
                @update:model-value="patch(i, { value: String($event) })"
              />
              <BlessInput
                v-else
                :model-value="r.value"
                size="sm"
                :type="field(r.field)?.type ?? 'text'"
                :aria-label="text.value"
                @update:model-value="patch(i, { value: String($event) })"
                @keydown.enter="editing = null"
              />
            </template>
            <div class="bless-filterbar__actions">
              <BlessButton variant="ghost" size="sm" color="danger" @click="remove(i)">{{
                text.remove
              }}</BlessButton>
              <BlessButton size="sm" @click="editing = null">{{ text.done }}</BlessButton>
            </div>
          </div>
        </BlessPopover>
        <button
          type="button"
          class="bless-filterbar__x"
          :disabled
          :aria-label="`${text.remove}: ${field(r.field)?.label ?? r.field}`"
          @click="remove(i)"
        >
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.75" />
          </svg>
        </button>
      </li>
    </ul>
    <span ref="addBtn">
      <BlessPopover v-model:open="adding" placement="bottom-start" :title="text.add">
        <template #trigger>
          <BlessButton variant="outline" size="sm" :disabled>+ {{ text.add }}</BlessButton>
        </template>
        <ul role="list" class="bless-filterbar__fields">
          <li v-for="f in fields" :key="f.name">
            <button type="button" class="bless-filterbar__pick" @click="add(f)">
              {{ f.label }}
            </button>
          </li>
        </ul>
      </BlessPopover>
    </span>
    <BlessButton v-if="rules.length" variant="ghost" size="sm" :disabled @click="rules = []">{{
      text.clear
    }}</BlessButton>
  </div>
</template>

<style>
.bless-filterbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-filterbar__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-filterbar__chip {
  display: inline-flex;
  align-items: stretch;
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-petal);
  background: var(--bless-color-surface-2);
  font-size: var(--bless-text-sm);
}
.bless-filterbar__edit,
.bless-filterbar__x {
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-filterbar__edit {
  padding-block: var(--bless-space-1);
  padding-inline: var(--bless-space-3) var(--bless-space-2);
}
.bless-filterbar__x {
  display: inline-grid;
  place-items: center;
  padding: 0 var(--bless-space-2);
  border-inline-start: var(--bless-border-width) solid var(--bless-color-border);
  color: var(--bless-color-text-muted);
}
.bless-filterbar__edit:hover,
.bless-filterbar__x:hover {
  color: var(--bless-color-text);
}
.bless-filterbar__edit:focus-visible,
.bless-filterbar__x:focus-visible,
.bless-filterbar__pick:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-filterbar__edit:disabled,
.bless-filterbar__x:disabled {
  cursor: not-allowed;
}
.bless-filterbar__form {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  min-inline-size: 14rem;
}
.bless-filterbar__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-filterbar__fields {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-filterbar__pick {
  inline-size: 100%;
  padding: var(--bless-space-1) var(--bless-space-2);
  border: 0;
  background: none;
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-sm);
  text-align: start;
  cursor: pointer;
}
.bless-filterbar__pick:hover {
  background: var(--bless-color-surface-2);
}
</style>
