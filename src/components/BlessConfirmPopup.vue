<script setup lang="ts">
import BlessButton from "./BlessButton.vue";
import BlessPopover from "./BlessPopover.vue";
import type { Placement } from "../composables/useFloating";

defineOptions({ name: "BlessConfirmPopup" });

withDefaults(
  defineProps<{
    message: string;
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    color?: "accent" | "danger" | "text";
    placement?: Placement;
  }>(),
  { confirmLabel: "Confirm", cancelLabel: "Cancel", color: "accent", placement: "bottom" },
);
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ confirm: []; cancel: [] }>();
function done(ok: boolean) {
  open.value = false;
  if (ok) emit("confirm");
  else emit("cancel");
}
</script>

<template>
  <BlessPopover v-model:open="open" :placement :title class="bless-confirm">
    <template #trigger><slot name="trigger" :open /></template>
    <p class="bless-confirm__msg">{{ message }}</p>
    <div class="bless-confirm__actions">
      <BlessButton size="sm" variant="outline" @click="done(false)">{{ cancelLabel }}</BlessButton>
      <BlessButton size="sm" :color @click="done(true)">{{ confirmLabel }}</BlessButton>
    </div>
  </BlessPopover>
</template>

<style>
.bless-confirm__msg {
  margin: 0 0 var(--bless-space-3);
  max-width: 32ch;
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
}
.bless-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--bless-space-2);
}
</style>
