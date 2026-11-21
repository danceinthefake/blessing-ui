<template>
  <div class="bless-coupon">
    <div v-if="applied" class="bless-coupon__chip">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M2 8.6V2.5h6.1L14 8.4 8.4 14z" />
        <circle cx="5" cy="5.5" r="1" />
      </svg>
      <span class="bless-coupon__code">{{ applied.code }}</span>
      <span v-if="applied.saving" class="bless-coupon__saving">{{ applied.saving }}</span>
      <button
        type="button"
        class="bless-coupon__remove"
        :aria-label="text.remove(applied.code)"
        :title="text.remove(applied.code)"
        @click="emit('remove', applied.code)"
      >
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
    <form v-else class="bless-coupon__form" @submit.prevent="submit">
      <BlessInput
        v-model="code"
        class="bless-coupon__field"
        :class="{ 'is-upper': uppercase }"
        :aria-label="text.label"
        :placeholder="text.label"
        :error
        autocomplete="off"
        spellcheck="false"
      />
      <BlessButton type="submit" variant="outline" :loading :disabled="!code.trim()">
        {{ text.apply }}
      </BlessButton>
    </form>
    <span class="bless-sr" role="status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessInput from "./BlessInput.vue";
import "./sr.css";

defineOptions({ name: "BlessCouponInput" });
const pack = useLabelPack("BlessCouponInput");

export interface BlessCoupon {
  code: string;
  /** what it saves, as text, for example "−$7.80" or "10% off" */
  saving?: string;
}

const props = withDefaults(
  defineProps<{
    /** the code that the shop took; with it, a chip shows in place of the field */
    applied?: BlessCoupon;
    /** why the shop did not take the code */
    error?: string;
    /** the shop is checking the code */
    loading?: boolean;
    /** write the code in capital letters */
    uppercase?: boolean;
    labels?: Partial<{
      label: string;
      apply: string;
      remove: (code: string) => string;
      applied: (code: string) => string;
    }>;
  }>(),
  { uppercase: true },
);
const emit = defineEmits<{ apply: [code: string]; remove: [code: string] }>();

const text = computed(() => ({
  label: "Discount code",
  apply: "Apply",
  remove: (c: string) => `Remove the code ${c}`,
  applied: (c: string) => `Code ${c} applied`,
  ...pack(),
  ...props.labels,
}));
const code = ref("");
const status = ref("");
watch(
  () => props.applied?.code,
  (c) => {
    status.value = c ? text.value.applied(c) : "";
    if (c) code.value = "";
  },
);
function submit() {
  const c = code.value.trim();
  if (c && !props.loading) emit("apply", props.uppercase ? c.toUpperCase() : c);
}
</script>

<style>
.bless-coupon {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-coupon__form {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
}
.bless-coupon__field {
  flex: 1;
  min-inline-size: 0;
}
.bless-coupon__field.is-upper input {
  text-transform: uppercase;
}
.bless-coupon__field.is-upper input::placeholder {
  text-transform: none;
}
.bless-coupon__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-1) var(--bless-space-1) var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) dashed var(--bless-color-text);
  background: color-mix(in srgb, var(--bless-color-success) 14%, var(--bless-color-bg));
}
.bless-coupon__chip > svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linejoin: round;
}
.bless-coupon__code {
  font-family: var(--bless-font-mono);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-coupon__saving {
  font-size: var(--bless-text-xs);
}
.bless-coupon__remove {
  display: inline-grid;
  place-items: center;
  inline-size: 1.6rem;
  block-size: 1.6rem;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}
.bless-coupon__remove svg {
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
}
.bless-coupon__remove:hover {
  background: var(--bless-color-surface-2);
}
.bless-coupon__remove:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
</style>
