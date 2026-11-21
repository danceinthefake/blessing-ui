<template>
  <BlessDowntimePicker
    v-model="reason"
    :reasons
    machine="Press 2"
    @save="(r, note) => (saved = note ? `${r}: ${note}` : r)"
  />
  <p v-if="saved" style="margin-top: 12px">Saved: {{ saved }}</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessDowntimePicker, type BlessDowntimeReason } from "blessing-ui";

const reasons: BlessDowntimeReason[] = [
  { id: "jam", label: "Material jam", icon: "⛔" },
  { id: "breakdown", label: "Breakdown", icon: "🔧" },
  { id: "material", label: "No material", icon: "📦" },
  { id: "quality", label: "Quality hold", icon: "🔍" },
  { id: "changeover", label: "Changeover", icon: "🔁", planned: true },
  { id: "break", label: "Break", icon: "☕", planned: true },
  { id: "cleaning", label: "Cleaning", icon: "🧽", planned: true },
];
const reason = ref<string>();
const saved = ref("");
</script>
