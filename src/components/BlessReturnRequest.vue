<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { moneyFormat } from "../composables/money";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessReturnRequest" });
const pack = useLabelPack("BlessReturnRequest");

export interface BlessReturnItem {
  id: string;
  name: string;
  /** how many the buyer bought */
  quantity: number;
  /** the price of one */
  price: number;
  image?: string;
}
export interface BlessReturnPayload {
  items: { id: string; quantity: number }[];
  reason: string;
  note: string;
}

const props = withDefaults(
  defineProps<{
    items: BlessReturnItem[];
    /** the reasons to choose from */
    reasons?: string[];
    currency?: string;
    locale?: string;
    labels?: Partial<{
      items: string;
      quantity: (name: string) => string;
      reason: string;
      pick: string;
      note: string;
      refund: string;
      submit: string;
      missing: string;
    }>;
  }>(),
  {
    reasons: () => ["Damaged or broken", "Not as described", "Wrong item", "No longer needed"],
    currency: "USD",
    locale: "en",
  },
);
const emit = defineEmits<{ submit: [payload: BlessReturnPayload] }>();

const text = computed(() => ({
  items: "What do you want to return?",
  quantity: (n: string) => `How many of ${n}`,
  reason: "Reason",
  pick: "Pick a reason",
  note: "Tell us more (optional)",
  refund: "Refund",
  submit: "Request the return",
  missing: "Pick at least one item and a reason.",
  ...pack(),
  ...props.labels,
}));
// how many of each item go back; 0 means the item stays
const back = reactive<Record<string, number>>({});
const reason = ref("");
const note = ref("");
const tried = ref(false);
const money = computed(() => moneyFormat(props.locale, props.currency));
const refund = computed(() => props.items.reduce((n, it) => n + (back[it.id] ?? 0) * it.price, 0));
const chosen = computed(() =>
  props.items
    .filter((it) => (back[it.id] ?? 0) > 0)
    .map((it) => ({ id: it.id, quantity: back[it.id]! })),
);
const ok = computed(() => chosen.value.length > 0 && reason.value !== "");
function submit() {
  tried.value = true;
  if (ok.value)
    emit("submit", { items: chosen.value, reason: reason.value, note: note.value.trim() });
}
</script>

<template>
  <form class="bless-return" novalidate @submit.prevent="submit">
    <fieldset class="bless-return__set">
      <legend class="bless-return__legend">{{ text.items }}</legend>
      <div
        v-for="it in items"
        :key="it.id"
        class="bless-return__item"
        :class="{ 'is-on': (back[it.id] ?? 0) > 0 }"
      >
        <label class="bless-return__check">
          <input
            type="checkbox"
            :checked="(back[it.id] ?? 0) > 0"
            @change="back[it.id] = ($event.target as HTMLInputElement).checked ? it.quantity : 0"
          />
          <img v-if="it.image" class="bless-return__img" :src="it.image" alt="" />
          <span class="bless-return__name">{{ it.name }}</span>
        </label>
        <select
          v-if="it.quantity > 1 && (back[it.id] ?? 0) > 0"
          v-model.number="back[it.id]"
          class="bless-return__qty"
          :aria-label="text.quantity(it.name)"
        >
          <option v-for="q in it.quantity" :key="q" :value="q">{{ q }}</option>
        </select>
        <span class="bless-return__price">{{
          money.format(it.price * Math.max(1, back[it.id] ?? 0))
        }}</span>
      </div>
    </fieldset>
    <label class="bless-return__field">
      <span class="bless-return__legend">{{ text.reason }}</span>
      <select
        v-model="reason"
        class="bless-return__input"
        :aria-invalid="tried && !reason ? 'true' : undefined"
      >
        <option value="" disabled>{{ text.pick }}</option>
        <option v-for="r in reasons" :key="r" :value="r">{{ r }}</option>
      </select>
    </label>
    <label class="bless-return__field">
      <span class="bless-return__legend">{{ text.note }}</span>
      <textarea v-model="note" class="bless-return__input" rows="3" />
    </label>
    <div class="bless-return__foot">
      <span class="bless-return__refund">
        {{ text.refund }}: <strong>{{ money.format(refund) }}</strong>
      </span>
      <BlessButton type="submit">{{ text.submit }}</BlessButton>
    </div>
    <p class="bless-return__error" role="alert">{{ tried && !ok ? text.missing : "" }}</p>
  </form>
</template>

<style>
.bless-return {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 36rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-return__set {
  display: grid;
  gap: var(--bless-space-2);
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-return__legend {
  margin-block-end: var(--bless-space-1);
  padding: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-return__item {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-return__item.is-on {
  border-color: var(--bless-color-text);
}
.bless-return__check {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--bless-space-3);
  min-inline-size: 0;
  cursor: pointer;
}
.bless-return__check input {
  flex: none;
  inline-size: 1.05rem;
  block-size: 1.05rem;
  accent-color: var(--bless-color-accent);
}
.bless-return__img {
  flex: none;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  object-fit: cover;
}
.bless-return__qty,
.bless-return__input {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-return__input {
  inline-size: 100%;
}
textarea.bless-return__input {
  padding: var(--bless-space-2);
  resize: vertical;
}
.bless-return__input[aria-invalid="true"] {
  border: 2px solid var(--bless-color-danger);
}
.bless-return__check input:focus-visible,
.bless-return__qty:focus-visible,
.bless-return__input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-return__price {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.bless-return__field {
  display: grid;
}
.bless-return__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-3);
}
.bless-return__refund {
  font-size: var(--bless-text-md);
  font-variant-numeric: tabular-nums;
}
.bless-return__error {
  margin: 0;
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-return__error:empty {
  display: none;
}
.bless-return__error {
  animation: bless-enter var(--bless-duration-voice) var(--bless-ease-snap);
}
.bless-return {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
