<template>
  <div class="col">
    <BlessField label="Broadcast starts">
      <BlessDateTimePicker
        v-model="starts"
        locale="en-GB"
        min="2026-11-14T18:00"
        max="2026-12-31T23:30"
        :step="30"
      />
    </BlessField>
    <p>Value: <code>{{ starts ?? "not set" }}</code></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessDateTimePicker, BlessField } from "blessing-ui";

const starts = ref<string | undefined>("2026-11-14T19:30");
</script>
