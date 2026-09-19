<script setup lang="ts">
import { BlessTabs, BlessText } from "blessing-ui";
import { heroines } from "./_data";
</script>

<template>
  <BlessTabs :tabs="heroines.slice(0, 3)" color="text" activation="manual" style="max-width: 640px">
    <template #default="{ tab: t }">
      <BlessText as="p">manual activation, text colour — {{ t.label }}</BlessText>
    </template>
  </BlessTabs>
</template>
