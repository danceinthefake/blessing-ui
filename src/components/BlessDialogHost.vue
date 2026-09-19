<script setup lang="ts">
import BlessModal from "./BlessModal.vue";
import { dialogState, useDialog } from "../composables/useDialog";

defineOptions({ name: "BlessDialogHost" });
const { close } = useDialog();
</script>

<template>
  <BlessModal
    v-for="d in dialogState.items"
    :key="d.id"
    :model-value="d.open"
    :title="d.title"
    :size="d.size ?? 'md'"
    :dismissible="d.dismissible ?? true"
    @update:model-value="(v) => !v && close(d.id)"
  >
    <component
      :is="d.component"
      v-if="d.component"
      v-bind="d.props ?? {}"
      :close="(r: unknown) => close(d.id, r)"
    />
    <p v-else class="bless-dialog-host__text">{{ d.text }}</p>
  </BlessModal>
</template>

<style>
.bless-dialog-host__text {
  margin: 0;
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
}
</style>
