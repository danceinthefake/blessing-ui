<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAlert,
  BlessButton,
  BlessInput,
  BlessModal,
  BlessPopover,
  BlessSwitch,
  BlessToggle,
  BlessToggleGroup,
} from "blessing-ui";
const calm = ref(false);
const flair = ref(true);
const again = ref(0);
const modal = ref(false);
const scene = ref<string | undefined>();
const name = ref("");
const tried = ref(false);
</script>

<template>
  <div class="col" :data-motion="calm ? 'calm' : undefined" :data-flair="flair ? '' : undefined">
    <div class="row">
      <BlessSwitch v-model="calm">Calm motion</BlessSwitch>
      <BlessSwitch v-model="flair">Flair</BlessSwitch>
    </div>
    <BlessAlert :key="again" title="Base">It rises out of a soft focus and settles.</BlessAlert>
    <div class="row">
      <BlessButton size="sm" variant="outline" @click="again++">Show the alert again</BlessButton>
      <BlessPopover title="Base">
        <template #trigger
          ><BlessButton size="sm" variant="outline">Open a popover</BlessButton></template
        >
        Menus, popovers and banners use the base layer.
      </BlessPopover>
      <BlessButton size="sm" @click="modal = true">Open a dialog</BlessButton>
    </div>
    <BlessToggleGroup v-model="scene" label="First scene">
      <BlessToggle value="hill">The hill</BlessToggle>
      <BlessToggle value="club">The club room</BlessToggle>
      <BlessToggle value="night">The night before</BlessToggle>
    </BlessToggleGroup>
    <div class="row" style="align-items: flex-start">
      <BlessInput
        v-model="name"
        aria-label="Circle name"
        placeholder="blessing software"
        :error="tried && !name.trim() ? 'Enter a circle name' : ''"
      />
      <BlessButton size="sm" @click="tried = true">Save</BlessButton>
    </div>
    <BlessModal v-model="modal" title="Voice" size="sm">
      Dialogs, toasts, tours and coachmarks talk, so they wipe up like a game text box.
      <template #footer><BlessButton @click="modal = false">Close</BlessButton></template>
    </BlessModal>
  </div>
</template>
