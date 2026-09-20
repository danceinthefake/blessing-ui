<script setup lang="ts">
import { ref } from "vue";
import { BlessInput, BlessStepper, useToast } from "blessing-ui";
const step = ref(0);
const { success } = useToast();
const steps = [{ label: "Account" }, { label: "Profile" }, { label: "Review" }];
</script>

<template>
  <div style="max-width: 560px">
    <BlessStepper v-model="step" :steps @finish="success('Done')">
      <template #default="{ index }">
        <div v-if="index === 0" class="col">
          <BlessInput placeholder="email" aria-label="Email" /><BlessInput
            placeholder="password"
            type="password"
            aria-label="Password"
          />
        </div>
        <div v-else-if="index === 1" class="col">
          <BlessInput placeholder="display name" aria-label="Display name" />
        </div>
        <p v-else>Everything looks good.</p>
      </template>
    </BlessStepper>
  </div>
</template>
