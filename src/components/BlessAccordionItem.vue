<script setup lang="ts">
import { inject } from "vue";
import BlessCollapsible from "./BlessCollapsible.vue";
import { accordionKey } from "./accordion";

defineOptions({ name: "BlessAccordionItem" });

defineProps<{ title?: string; disabled?: boolean }>();
const open = defineModel<boolean>("open", { default: false });
const acc = inject(accordionKey, null);
</script>

<template>
  <BlessCollapsible
    v-model:open="open"
    :title
    :disabled
    :name="acc?.name.value"
    class="bless-accordion__item"
  >
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <slot />
  </BlessCollapsible>
</template>
