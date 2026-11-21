<template>
  <BlessSheet
    v-model="open"
    side="bottom"
    handle
    :title
    :dismissible
    :labels="{ ...pack(), ...props.labels }"
    class="bless-drawer"
    @close="emit('close')"
  >
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </BlessSheet>
</template>

<script setup lang="ts">
import BlessSheet from "./BlessSheet.vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessDrawer" });
const pack = useLabelPack("BlessDrawer");

// dismissible defaults to true like Sheet's: an absent boolean prop is cast to false, which would
// otherwise be passed down and turn off Esc and the backdrop click
const props = withDefaults(
  defineProps<{ title?: string; dismissible?: boolean; labels?: Partial<{ close: string }> }>(),
  {
    dismissible: true,
  },
);
const open = defineModel<boolean>({ default: false });
const emit = defineEmits<{ close: [] }>();
</script>
