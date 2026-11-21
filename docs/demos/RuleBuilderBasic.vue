<template>
  <BlessRuleBuilder v-model="rule" :triggers :conditions :actions @save="(r) => (saved = r)" />
  <pre v-if="saved" style="margin-top: 12px">{{ saved }}</pre>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessRuleBuilder, type BlessRule } from "blessing-ui";

const triggers = [
  { id: "door", label: "the studio door opens" },
  { id: "motion", label: "there is motion in the hall" },
  { id: "time", label: "it is 22:00" },
];
const conditions = [
  { id: "rec", label: "the on air sign is on" },
  { id: "away", label: "nobody is home" },
];
const actions = [
  { id: "notify", label: "send me a notice" },
  { id: "light", label: "turn on the hall light" },
  { id: "ac", label: "turn off the air conditioner" },
  { id: "lock", label: "lock the front door" },
];
const rule = ref<BlessRule>({ when: "door", if: ["rec"], then: ["notify"] });
const saved = ref<BlessRule>();
</script>
