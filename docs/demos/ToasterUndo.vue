<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, useToast } from "blessing-ui";
const { toast } = useToast();
const files = ref(["plot.md", "route-a.md", "route-b.md"]);
function remove(i: number) {
  const [name] = files.value.splice(i, 1);
  // do it now, offer the way back — no "are you sure?"
  toast({
    title: `Deleted ${name}`,
    action: { label: "Undo", onClick: () => files.value.splice(i, 0, name) },
  });
}
</script>

<template>
  <ul class="files">
    <li v-for="(f, i) in files" :key="f">
      {{ f }}
      <BlessButton size="sm" variant="outline" :aria-label="`Delete ${f}`" @click="remove(i)"
        >Delete</BlessButton
      >
    </li>
    <li v-if="!files.length">No files.</li>
  </ul>
</template>

<style scoped>
.files {
  display: grid;
  gap: var(--bless-space-2);
  max-width: 320px;
  padding: 0;
  list-style: none;
}
.files li {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
