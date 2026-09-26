<script setup lang="ts">
import { ref } from "vue";
import {
  BlessBadge,
  BlessButton,
  BlessCard,
  BlessSeparator,
  BlessSwitch,
  BlessText,
} from "blessing-ui";

const yearly = ref(false);
const plans = [
  {
    name: "Circle",
    monthly: 0,
    blurb: "For a doujin circle of one.",
    features: ["1 project", "Community support", "Blessing tokens"],
  },
  {
    name: "Studio",
    monthly: 1200,
    blurb: "For a team shipping every Comiket.",
    features: ["Unlimited projects", "Priority support", "All palettes", "Shared components"],
    hot: true,
  },
  {
    name: "Publisher",
    monthly: 4800,
    blurb: "For the label behind the circles.",
    features: ["Everything in Studio", "SSO", "Audit log", "Dedicated contact"],
  },
];
const price = (m: number) =>
  m === 0 ? "¥0" : `¥${(yearly.value ? Math.round(m * 10) : m).toLocaleString("ja-JP")}`;
</script>

<template>
  <div class="pricing">
    <BlessText as="h1" size="lg" weight="light" class="pricing__title">Plans</BlessText>
    <div class="pricing__switch">
      <BlessSwitch v-model="yearly">Bill yearly <BlessBadge>2 months free</BlessBadge></BlessSwitch>
    </div>
    <div class="pricing__grid">
      <BlessCard
        v-for="p in plans"
        :key="p.name"
        :label="p.hot ? 'Recommended' : undefined"
        :bordered="p.hot"
        :surface="p.hot ? 'surface' : 'bg'"
      >
        <BlessText as="h2" weight="bold">{{ p.name }}</BlessText>
        <BlessText as="p" size="sm" muted>{{ p.blurb }}</BlessText>
        <p class="pricing__price">
          <BlessText size="xl" weight="light">{{ price(p.monthly) }}</BlessText>
          <BlessText size="xs" muted> / {{ yearly ? "year" : "month" }}</BlessText>
        </p>
        <BlessButton
          :variant="p.hot ? 'solid' : 'outline'"
          block
          :aria-label="`${p.monthly ? 'Start trial' : 'Get started'}: ${p.name}`"
          class="pricing__cta"
          >{{ p.monthly ? "Start trial" : "Get started" }}</BlessButton
        >
        <BlessSeparator />
        <ul role="list" class="pricing__features">
          <li v-for="f in p.features" :key="f"><span aria-hidden="true">✓</span> {{ f }}</li>
        </ul>
      </BlessCard>
    </div>
  </div>
</template>

<style scoped>
.pricing {
  padding: var(--bless-space-8) var(--bless-space-6);
}
.pricing__title,
.pricing__switch {
  text-align: center;
}
.pricing__switch {
  display: flex;
  justify-content: center;
  margin: var(--bless-space-4) 0 var(--bless-space-8);
}
.pricing__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--bless-space-4);
  padding-top: var(--bless-space-3);
}
.pricing__price {
  margin: var(--bless-space-4) 0;
}
.pricing__cta {
  margin-bottom: var(--bless-space-4);
}
.pricing__features {
  margin: var(--bless-space-4) 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-sm);
}
.pricing__features li {
  padding: var(--bless-space-1) 0;
}
.pricing__features span {
  font-weight: var(--bless-font-weight-bold); /* ink: a feature included isn't a choice */
}
</style>
