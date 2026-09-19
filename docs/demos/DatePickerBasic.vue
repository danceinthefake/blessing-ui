<script setup lang="ts">
import { ref } from "vue";
import { BlessDatePicker, BlessLabel, BlessText } from "blessing-ui";
const picked = ref<string>();
const stay = ref<[string, string]>();
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessLabel for="d-dp">Release date</BlessLabel>
      <BlessDatePicker id="d-dp" v-model="picked" locale="en-US" />
      <small>{{ picked }}</small>
    </div>
    <div class="col">
      <BlessLabel for="d-dr">Stay</BlessLabel>
      <BlessDatePicker
        id="d-dr"
        v-model="stay"
        range
        placeholder="Check-in – check-out"
        locale="en-US"
      />
    </div>
    <div class="col">
      <BlessLabel>States</BlessLabel>
      <BlessDatePicker model-value="2019-09-25" invalid size="sm" />
      <BlessDatePicker disabled />
    </div>
  </div>
  <BlessText as="p" size="xs" muted
    >on touch devices (pointer: coarse) single mode renders a native &lt;input
    type=date&gt;</BlessText
  >
</template>
