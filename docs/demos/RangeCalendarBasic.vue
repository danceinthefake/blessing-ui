<script setup lang="ts">
import { ref } from "vue";
import { BlessRangeCalendar } from "blessing-ui";

const days = ref<string[]>(["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-20"]);
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessRangeCalendar v-model="days" month="2026-10" label="Days I can host" />
  </div>
</template>
