<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import { nextTick, ref, useId, watch, computed } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessModal from "./BlessModal.vue";

defineOptions({ name: "BlessAlertDialog" });

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    /** confirm button color */
    color?: "text" | "accent" | "danger";
    loading?: boolean;
    labels?: Partial<{ confirm: string; cancel: string }>;
  }>(),
  { color: "danger" },
);
const pack = useLabelPack("BlessAlertDialog");
const text = computed(() => ({
  confirm: "Confirm",
  cancel: "Cancel",
  ...pack(),
  ...props.labels,
}));

const open = defineModel<boolean>({ default: false });
const emit = defineEmits<{ confirm: []; cancel: [] }>();
const cancelBtn = ref<InstanceType<typeof BlessButton>>();
// the question itself describes the dialog, so it is read with the title
const descId = `${useId()}-desc`;

// focus lands on the safe action
watch(
  open,
  (o) =>
    o && nextTick(() => nextTick(() => (cancelBtn.value?.$el as HTMLElement | undefined)?.focus())),
);

let confirmed = false;
function onConfirm() {
  confirmed = true;
  emit("confirm");
}
function onClose() {
  if (!confirmed) emit("cancel");
  confirmed = false;
}
</script>

<template>
  <BlessModal
    v-model="open"
    :title
    :dismissible="false"
    size="sm"
    class="bless-alert-dialog"
    role="alertdialog"
    :aria-describedby="description ? descId : undefined"
    @close="onClose"
  >
    <p v-if="description" :id="descId" class="bless-alert-dialog__desc">{{ description }}</p>
    <slot />
    <template #footer>
      <BlessButton ref="cancelBtn" variant="outline" @click="open = false">{{
        text.cancel
      }}</BlessButton>
      <BlessButton :color :loading @click="onConfirm">{{ text.confirm }}</BlessButton>
    </template>
  </BlessModal>
</template>

<style>
.bless-alert-dialog .bless-modal__close {
  display: none;
}
.bless-alert-dialog .bless-modal__header {
  padding-inline-end: var(--bless-space-6);
}
.bless-alert-dialog__desc {
  margin: 0;
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
  color: var(--bless-color-text-muted);
}
</style>
