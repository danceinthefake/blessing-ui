<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { BlessButton, BlessCropper, BlessSelect, type BlessCropRect } from "blessing-ui";

const rect = ref<BlessCropRect | null>(null);
const aspect = ref("free");
const cropper = ref<InstanceType<typeof BlessCropper>>();
const result = ref("");

async function crop() {
  const blob = await cropper.value?.toBlob({ maxWidth: 480 });
  if (!blob) return;
  URL.revokeObjectURL(result.value);
  result.value = URL.createObjectURL(blob);
}
onBeforeUnmount(() => URL.revokeObjectURL(result.value));
</script>

<template>
  <div class="col" style="max-width: 520px">
    <BlessSelect
      v-model="aspect"
      :options="[
        { value: 'free', label: 'Free' },
        { value: '1', label: 'Square 1 : 1' },
        { value: '1.7778', label: 'Wide 16 : 9' },
      ]"
    />
    <BlessCropper
      ref="cropper"
      v-model="rect"
      src="/hero-light.png"
      :aspect="aspect === 'free' ? undefined : Number(aspect)"
    />
    <BlessButton @click="crop">Crop</BlessButton>
    <img v-if="result" :src="result" alt="Cropped result" style="max-width: 100%" />
    <small v-if="rect"
      >{{ rect.width }} × {{ rect.height }} px from {{ rect.x }}, {{ rect.y }}</small
    >
  </div>
</template>
