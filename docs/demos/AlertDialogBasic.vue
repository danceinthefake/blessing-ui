<script setup lang="ts">
import { ref } from "vue";
import { BlessAlertDialog, BlessButton, useToast } from "blessing-ui";
const open = ref(false);
const busy = ref(false);
const { success, info } = useToast();
async function del() {
  busy.value = true;
  await new Promise((r) => setTimeout(r, 800));
  busy.value = false;
  open.value = false;
  success({
    title: "Deleted",
    description: "Project removed",
    action: { label: "Undo", onClick: () => info("Restored") },
  });
}
</script>

<template>
  <BlessButton color="danger" @click="open = true">Delete project</BlessButton>
  <BlessAlertDialog
    v-model="open"
    title="Delete project?"
    description="This permanently removes the project and its 12 files."
    confirm-label="Delete"
    :loading="busy"
    @confirm="del"
  />
</template>
