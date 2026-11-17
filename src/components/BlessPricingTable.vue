<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessToggle from "./BlessToggle.vue";
import BlessToggleGroup from "./BlessToggleGroup.vue";

defineOptions({ name: "BlessPricingTable" });
const pack = useLabelPack("BlessPricingTable");

export interface BlessPricingPlan {
  id: string;
  name: string;
  description?: string;
  /** the price for one month and for one year; 0 is free */
  price: { monthly: number; yearly: number };
  features: string[];
  /** the plan that stands out, for example the one most people pick */
  featured?: boolean;
  /** the text of the button; default: the `choose` label */
  cta?: string;
}
export type BlessPricingPeriod = "monthly" | "yearly";

const props = withDefaults(
  defineProps<{
    plans: BlessPricingPlan[];
    /** an ISO 4217 code, for example `USD` or `IDR` */
    currency?: string;
    locale?: string;
    labels?: Partial<{
      period: string;
      monthly: string;
      yearly: string;
      perMonth: string;
      perYear: string;
      free: string;
      featured: string;
      choose: string;
      /** the most that yearly saves over twelve months, in percent */
      save: (pct: number) => string;
    }>;
  }>(),
  { currency: "USD", locale: "en" },
);
const emit = defineEmits<{ select: [plan: BlessPricingPlan, period: BlessPricingPeriod] }>();
const period = defineModel<BlessPricingPeriod>("period", { default: "monthly" });

const text = computed(() => ({
  period: "Billing period",
  monthly: "Monthly",
  yearly: "Yearly",
  perMonth: "/ month",
  perYear: "/ year",
  free: "Free",
  featured: "Most popular",
  choose: "Choose plan",
  save: (pct: number) => `Save ${pct}%`,
  ...pack(),
  ...props.labels,
}));
const money = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      style: "currency",
      currency: props.currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }),
);
// the best saving of a year over twelve months, for the yearly switch
const save = computed(() =>
  Math.max(
    0,
    ...props.plans
      .filter((p) => p.price.monthly > 0)
      .map((p) => Math.round((1 - p.price.yearly / (p.price.monthly * 12)) * 100)),
  ),
);
</script>

<template>
  <div class="bless-pricing">
    <div class="bless-pricing__switch">
      <BlessToggleGroup
        :model-value="period"
        :label="text.period"
        @update:model-value="$event && (period = $event as BlessPricingPeriod)"
      >
        <BlessToggle value="monthly">{{ text.monthly }}</BlessToggle>
        <BlessToggle value="yearly">{{ text.yearly }}</BlessToggle>
      </BlessToggleGroup>
      <span v-if="save > 0" class="bless-pricing__save">{{ text.save(save) }}</span>
    </div>
    <ul role="list" class="bless-stagger bless-pricing__plans">
      <li
        v-for="p in plans"
        :key="p.id"
        class="bless-pricing__plan"
        :class="{ 'bless-pricing__plan--featured': p.featured }"
      >
        <span v-if="p.featured" class="bless-pricing__badge">{{ text.featured }}</span>
        <p class="bless-pricing__name">{{ p.name }}</p>
        <p v-if="p.description" class="bless-pricing__desc">{{ p.description }}</p>
        <p class="bless-pricing__price">
          <template v-if="p.price[period] > 0">
            <strong>{{ money.format(p.price[period]) }}</strong>
            <span>{{ period === "monthly" ? text.perMonth : text.perYear }}</span>
          </template>
          <strong v-else>{{ text.free }}</strong>
        </p>
        <ul role="list" class="bless-pricing__features">
          <li v-for="f in p.features" :key="f">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
            {{ f }}
          </li>
        </ul>
        <BlessButton
          block
          :variant="p.featured ? 'solid' : 'outline'"
          :color="p.featured ? 'accent' : 'text'"
          @click="emit('select', p, period)"
        >
          {{ p.cta ?? text.choose }}
        </BlessButton>
      </li>
    </ul>
  </div>
</template>

<style>
.bless-pricing {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-6);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-pricing__switch {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--bless-space-3);
}
.bless-pricing__save {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text);
}
.bless-pricing__plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-pricing__plan {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  padding: var(--bless-space-6) var(--bless-space-4) var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius);
  background: var(--bless-color-bg);
}
.bless-pricing__plan--featured {
  border: 2px solid var(--bless-color-accent);
}
.bless-pricing__badge {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: var(--bless-space-4);
  translate: 0 -50%;
  padding: 2px var(--bless-space-2);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-pricing__name {
  margin: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-pricing__desc {
  margin: 0;
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-pricing__price {
  display: flex;
  align-items: baseline;
  gap: var(--bless-space-1);
  margin: 0;
}
.bless-pricing__price strong {
  font-size: var(--bless-text-headline);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}
.bless-pricing__price span {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-pricing__features {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-sm);
}
.bless-pricing__features li {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
}
.bless-pricing__features svg {
  flex: none;
  margin-block-start: 3px;
  color: var(--bless-color-success);
}
</style>
