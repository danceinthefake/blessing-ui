<script setup lang="ts">
import { ref } from "vue";
import BlessInput from "./BlessInput.vue";
import BlessPasswordMeter from "./BlessPasswordMeter.vue";

defineOptions({ name: "BlessPasswordInput", inheritAttrs: false });

withDefaults(
  defineProps<{
    /** show the strength meter under the field */
    meter?: boolean;
    /** the reveal button's name; its pressed state says whether it's showing */
    showLabel?: string;
  }>(),
  { showLabel: "Show password" },
);
const model = defineModel<string>({ default: "" });
const shown = ref(false);
</script>

<template>
  <div class="bless-password">
    <!-- a meter means a password being made: new-password lets managers offer one. `autocomplete`
         passed in still wins, since $attrs binds after -->
    <BlessInput
      :autocomplete="meter ? 'new-password' : 'current-password'"
      v-bind="$attrs"
      v-model="model"
      :type="shown ? 'text' : 'password'"
    >
      <template #suffix>
        <button
          type="button"
          class="bless-password__toggle"
          :aria-label="showLabel"
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
  color: var(--bless-color-accent-text);
}
.bless-password__toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
