<script setup lang="ts">
import { ref } from "vue";
import { BlessLabel, BlessTextarea } from "blessing-ui";
const bio = ref("");
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessLabel for="d-bio">Bio</BlessLabel>
      <BlessTextarea
        id="d-bio"
        v-model="bio"
        placeholder="A line or two about you"
        :maxlength="120"
        counter
      />
    </div>
    <div class="col">
      <BlessLabel>Fixed rows</BlessLabel>
      <BlessTextarea :rows="4" :autogrow="false" error="Required" aria-label="Fixed rows" />
    </div>
  </div>
</template>
