<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessDropdownMenu } from "blessing-ui";
import { menu } from "./_menu";
const checked = ref<Record<string, boolean>>({ grid: true });
const radios = ref<Record<string, string>>({ size: "s" });
const last = ref("");
</script>

<template>
  <div class="row">
    <BlessDropdownMenu
      :items="menu"
      v-model:checked="checked"
      v-model:radios="radios"
      @select="last = 'label' in $event ? $event.label : ''"
    >
      <template #trigger><BlessButton>Actions ▾</BlessButton></template>
    </BlessDropdownMenu>
    <BlessDropdownMenu :items="menu" placement="bottom-end" :checked :radios>
      <template #trigger><BlessButton variant="outline">end-aligned</BlessButton></template>
    </BlessDropdownMenu>
    <small>last: {{ last }} · checked: {{ checked }} · size: {{ radios.size }}</small>
  </div>
</template>
