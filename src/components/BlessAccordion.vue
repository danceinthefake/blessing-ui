<script setup lang="ts">
import { provide, toRef, useId } from "vue";
import { accordionKey } from "./accordion";

defineOptions({ name: "BlessAccordion" });

const props = withDefaults(defineProps<{ type?: "single" | "multiple" }>(), { type: "single" });
const uid = useId();
provide(accordionKey, {
  name: toRef(() => (props.type === "single" ? `bless-acc-${uid}` : undefined)),
});
</script>

<template>
  <div class="bless-accordion"><slot /></div>
</template>

<style>
.bless-accordion {
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
</style>
