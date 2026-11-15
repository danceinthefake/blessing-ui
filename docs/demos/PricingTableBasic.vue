<script setup lang="ts">
import { ref } from "vue";
import {
  BlessPricingTable,
  BlessText,
  type BlessPricingPeriod,
  type BlessPricingPlan,
} from "blessing-ui";

const plans: BlessPricingPlan[] = [
  {
    id: "free",
    name: "Hobby",
    description: "Try it with one show",
    price: { monthly: 0, yearly: 0 },
    features: ["1 show", "2 hours of audio a month", "Basic stats"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For a weekly show",
    price: { monthly: 12, yearly: 120 },
    features: ["5 shows", "Unlimited audio", "Full stats", "Your own domain"],
    featured: true,
  },
  {
    id: "team",
    name: "Team",
    description: "For a network of shows",
    price: { monthly: 30, yearly: 324 },
    features: ["Unlimited shows", "5 seats", "Roles and approvals", "Priority help"],
    cta: "Talk to us",
  },
];
const period = ref<BlessPricingPeriod>("monthly");
const picked = ref("");
</script>

<template>
  <div>
    <BlessPricingTable
      v-model:period="period"
      :plans
      @select="(p, per) => (picked = `${p.name}, ${per}`)"
    />
    <BlessText v-if="picked" as="p" size="sm" style="margin-top: 12px"
      >Picked: {{ picked }}</BlessText
    >
  </div>
</template>
