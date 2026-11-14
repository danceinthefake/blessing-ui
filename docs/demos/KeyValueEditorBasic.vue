<script setup lang="ts">
import { ref } from "vue";
import { BlessField, BlessKeyValueEditor, type BlessKeyValue } from "blessing-ui";

const headers = ref<BlessKeyValue[]>([
  { key: "Accept", value: "application/json", enabled: true },
  { key: "X-Season", value: "2", enabled: false },
]);
const env = ref<BlessKeyValue[]>([{ key: "DATABASE_URL", value: "ecto://saekano@db/prod" }]);
</script>

<template>
  <div class="col" style="max-width: 36rem">
    <BlessField label="Request headers">
      <BlessKeyValueEditor v-model="headers" toggle />
    </BlessField>
    <BlessField label="Environment variables">
      <BlessKeyValueEditor v-model="env" secret />
    </BlessField>
    <code>{{ headers.filter((h) => h.enabled !== false && h.key).map((h) => h.key) }}</code>
  </div>
</template>
