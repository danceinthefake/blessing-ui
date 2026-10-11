<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { copyText } from "../composables/copyText";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessCopyButton" });

const props = withDefaults(
  defineProps<{
    /** the text to copy */
    value: string;
    variant?: "solid" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    /** ms the "Copied" state stays */
    timeout?: number;
    labels?: Partial<{ copy: string; copied: string; copiedLive: string }>;
  }>(),
  { variant: "outline", size: "md", timeout: 2000 },
);
const emit = defineEmits<{ copy: [value: string] }>();

const text = () => ({
  copy: "Copy",
  copied: "Copied",
  copiedLive: "Copied to clipboard",
  ...props.labels,
});
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
async function copy() {
  await copyText(props.value);
  emit("copy", props.value);
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), props.timeout);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <span class="bless-copy">
    <BlessButton :variant="variant" :size="size" @click="copy">
      <slot :copied="copied">{{ copied ? text().copied : text().copy }}</slot>
    </BlessButton>
    <span class="bless-copy__live" role="status" aria-live="polite">{{
      copied ? text().copiedLive : ""
    }}</span>
  </span>
</template>

<style>
.bless-copy {
  position: relative;
  display: inline-flex;
}
.bless-copy__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
