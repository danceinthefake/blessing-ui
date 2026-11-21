<template>
  <div class="col">
    <div class="row">
      <BlessButton
        v-for="(expr, name) in presets"
        :key="name"
        size="sm"
        variant="outline"
        @click="schedule = expr"
      >
        {{ name }}
      </BlessButton>
    </div>
    <BlessField label="Backup schedule" description="Times are in your time zone.">
      <BlessCronInput v-model="schedule" />
    </BlessField>
    <code>{{ schedule }}</code>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessCronInput, BlessField } from "blessing-ui";

const schedule = ref("0 9 * * 1-5");
const presets = {
  "Every 15 minutes": "*/15 * * * *",
  "Weekdays at 09:00": "0 9 * * 1-5",
  "First of the month": "0 0 1 * *",
};
</script>
