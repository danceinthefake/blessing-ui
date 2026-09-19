<script setup lang="ts">
import { ref } from "vue";
import { BlessTabs, BlessText } from "blessing-ui";
import { heroines } from "./_data";
const tab = ref("megumi");
</script>

<template>
  <BlessTabs v-model="tab" :tabs="heroines" label="Heroines" style="max-width: 640px">
    <template #default="{ tab: t }">
      <BlessText as="p" weight="bold">{{ t.label }}</BlessText>
      <BlessText as="p" size="sm" muted>arrow keys / Home / End · current: {{ tab }}</BlessText>
    </template>
  </BlessTabs>
</template>
