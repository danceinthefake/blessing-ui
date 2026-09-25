<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessSteps from "./BlessSteps.vue";
import type { BlessStep } from "./BlessSteps.vue";

defineOptions({ name: "BlessStepper" });

const props = withDefaults(
  defineProps<{
    steps: BlessStep[];
    orientation?: "horizontal" | "vertical";
    /** linear: the header only goes back to completed steps; off: any step can be jumped to */
    linear?: boolean;
    labels?: Partial<{ next: string; prev: string; finish: string }>;
  }>(),
  { orientation: "horizontal", linear: true },
);
const current = defineModel<number>({ default: 0 });
const emit = defineEmits<{ finish: [] }>();
const L = () => ({ next: "Next", prev: "Back", finish: "Finish", ...props.labels });
const last = () => current.value >= props.steps.length - 1;
const next = () => (last() ? emit("finish") : current.value++);
const prev = () => current.value > 0 && current.value--;
// a new step swaps the panel's content: move focus there so it is read, not silently replaced
const panel = ref<HTMLElement>();
watch(current, () => nextTick(() => panel.value?.focus()));
</script>

<template>
  <div class="bless-stepper" :class="`bless-stepper--${orientation}`">
    <BlessSteps
      v-model="current"
      :steps
      :orientation
      :clickable="linear ? true : 'all'"
      class="bless-stepper__head"
    />
    <div
      ref="panel"
      class="bless-stepper__panel"
      role="group"
      tabindex="-1"
      :aria-label="steps[current]?.label"
    >
      <slot :step="steps[current]" :index="current" :next :prev :last="last()" />
    </div>
    <div class="bless-stepper__actions">
      <slot name="actions" :next :prev :index="current" :last="last()">
        <BlessButton variant="outline" size="sm" :disabled="current === 0" @click="prev">{{
          L().prev
        }}</BlessButton>
        <BlessButton color="accent" size="sm" @click="next">{{
          last() ? L().finish : L().next
        }}</BlessButton>
      </slot>
    </div>
  </div>
</template>

<style>
/* focus lands here on a step change so it is read; it isn't a control, so no ring */
.bless-stepper__panel:focus {
  outline: none;
}
.bless-stepper {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-stepper--vertical {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--bless-space-4) var(--bless-space-8);
}
.bless-stepper--vertical .bless-stepper__head {
  grid-row: 1 / span 2;
}
.bless-stepper__panel {
  min-height: 80px;
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
}
.bless-stepper__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--bless-space-2);
}
</style>
