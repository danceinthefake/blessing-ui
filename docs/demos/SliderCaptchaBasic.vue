<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessSliderCaptcha } from "blessing-ui";

const verified = ref(false);
const captcha = ref<InstanceType<typeof BlessSliderCaptcha>>();
const took = ref<number | null>(null);
</script>

<template>
  <div class="col" style="max-width: 360px">
    <BlessSliderCaptcha
      ref="captcha"
      v-model:verified="verified"
      src="/hero-light.png"
      @verify="took = $event.ms"
    />
    <BlessButton :disabled="!verified">Send</BlessButton>
    <small v-if="verified">Solved in {{ took }} ms.</small>
    <BlessButton v-if="verified" variant="ghost" size="sm" @click="captcha?.reset()"
      >Try again</BlessButton
    >
  </div>
</template>
