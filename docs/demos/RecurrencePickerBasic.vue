<template>
  <div style="max-width: 560px">
    <BlessRecurrencePicker v-model="rule" />
    <BlessText as="p" size="sm" style="margin-top: 12px">
      For your calendar: <code>{{ rrule }}</code>
    </BlessText>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessRecurrencePicker, BlessText, toRRule, type BlessRecurrence } from "blessing-ui";

// a recording session every two weeks, on Monday and Thursday, ten times
const rule = ref<BlessRecurrence>({
  freq: "weekly",
  interval: 2,
  days: [0, 3],
  end: { type: "count", count: 10 },
});
const rrule = computed(() => toRRule(rule.value));
</script>
