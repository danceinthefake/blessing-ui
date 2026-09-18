<script setup lang="ts">
import BlessSheet from "./BlessSheet.vue";

defineOptions({ name: "BlessDrawer" });

defineProps<{ title?: string; dismissible?: boolean; closeLabel?: string }>();
const open = defineModel<boolean>({ default: false });
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <BlessSheet
    v-model="open"
    side="bottom"
    handle
    :title
    :dismissible
    :close-label="closeLabel"
    class="bless-drawer"
    @close="emit('close')"
  >
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </BlessSheet>
</template>
