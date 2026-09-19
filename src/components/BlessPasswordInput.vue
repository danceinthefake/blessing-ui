<script setup lang="ts">
import { ref } from "vue";
import BlessInput from "./BlessInput.vue";
import BlessPasswordMeter from "./BlessPasswordMeter.vue";

defineOptions({ name: "BlessPasswordInput", inheritAttrs: false });

withDefaults(
  defineProps<{
    /** show the strength meter under the field */
    meter?: boolean;
    showLabel?: string;
    hideLabel?: string;
  }>(),
  { showLabel: "Show password", hideLabel: "Hide password" },
);
const model = defineModel<string>({ default: "" });
const shown = ref(false);
</script>

<template>
  <div class="bless-password">
    <BlessInput
      v-bind="$attrs"
      v-model="model"
      :type="shown ? 'text' : 'password'"
      autocomplete="current-password"
    >
      <template #suffix>
        <button
          type="button"
          class="bless-password__toggle"
          :aria-label="shown ? hideLabel : showLabel"
          :aria-pressed="shown"
          @click="shown = !shown"
        >
          <span aria-hidden="true">{{ shown ? "◉" : "◎" }}</span>
        </button>
      </template>
    </BlessInput>
    <BlessPasswordMeter v-if="meter" :value="model" class="bless-password__meter" />
  </div>
</template>

<style>
.bless-password {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
}
.bless-password__toggle {
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-md);
  line-height: 1;
  cursor: pointer;
}
.bless-password__toggle:hover {
  color: var(--bless-color-accent);
}
.bless-password__toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
