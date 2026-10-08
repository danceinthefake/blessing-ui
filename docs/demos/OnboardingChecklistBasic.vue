<script setup lang="ts">
import { ref } from "vue";
import { BlessOnboardingChecklist, type BlessChecklistItem } from "blessing-ui";

const items: BlessChecklistItem[] = [
  {
    id: "profile",
    label: "Fill in your profile",
    description: "A name and a photo",
    action: "Open",
  },
  { id: "invite", label: "Invite a teammate" },
  { id: "page", label: "Publish your first page", action: "Start" },
];
const done = ref<string[]>(["invite"]);
const last = ref("");
</script>

<template>
  <div class="col">
    <BlessOnboardingChecklist
      v-model:done="done"
      :items
      @select="(it) => (last = `Go to “${it.label}”`)"
      @complete="last = 'Everything done!'"
    />
    <p style="margin: 0" aria-live="polite">{{ last }}</p>
  </div>
</template>
