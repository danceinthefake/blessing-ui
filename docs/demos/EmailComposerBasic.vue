<template>
  <BlessEmailComposer
    v-model="draft"
    style="max-width: 640px"
    @send="status = `Sent to ${draft.to.join(', ')}`"
    @discard="status = 'Discarded'"
  />
  <p v-if="status" style="margin-top: 12px">{{ status }}</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessEmailComposer, type BlessEmailDraft } from "blessing-ui";

const draft = ref<BlessEmailDraft>({
  to: ["budi@homestudio.example"],
  cc: [],
  subject: "Episode 41: the final edit",
  body: "Hi Budi,\n\nThe edit is ready. Can you listen before Thursday?\n\nAna",
});
const status = ref("");
</script>
