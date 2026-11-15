<script setup lang="ts">
import { ref } from "vue";
import { BlessPromptInput, BlessStack, BlessText } from "blessing-ui";

const draft = ref("");
const sent = ref<string[]>([]);
const busy = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

function onSend(m: { text: string; files: File[] }) {
  const names = m.files.map((f) => f.name).join(", ");
  sent.value.push(m.text + (names ? ` (+ ${names})` : ""));
  // a reply comes in for two seconds; Stop ends it early
  busy.value = true;
  timer = setTimeout(() => (busy.value = false), 2000);
}
function onStop() {
  clearTimeout(timer);
  busy.value = false;
}
</script>

<template>
  <BlessStack :gap="3" style="max-width: 560px">
    <BlessText v-for="(s, i) in sent" :key="i" as="p" size="sm">You: {{ s }}</BlessText>
    <BlessPromptInput v-model="draft" attach :busy @send="onSend" @stop="onStop" />
  </BlessStack>
</template>
