<script setup lang="ts">
import { ref } from "vue";
import { BlessAlertDialog, BlessButton, useToast } from "blessing-ui";
const open = ref(false);
const busy = ref(false);
const { success } = useToast();
async function del() {
  busy.value = true;
  await new Promise((r) => setTimeout(r, 800));
  busy.value = false;
  open.value = false;
  // no Undo: this can't be reversed, which is the only reason to ask first
  success({ title: "Project deleted" });
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
