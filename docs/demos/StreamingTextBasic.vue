<template>
  <BlessStack :gap="3" style="max-width: 560px">
    <BlessStack direction="row" :gap="4" align="center" wrap>
      <BlessButton size="sm" @click="ask">Ask for a reply</BlessButton>
      <BlessSwitch v-model="even">Even pace</BlessSwitch>
    </BlessStack>
    <BlessStreamingText :text :done :pace="even ? 80 : 0" />
  </BlessStack>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { BlessButton, BlessStack, BlessStreamingText, BlessSwitch } from "blessing-ui";

const reply =
  "A good episode title is short and says what the listener gets. Put the main word first, so it shows in a narrow list. Keep the number of the episode out of the title: the app shows it already.";
const text = ref("");
const done = ref(true);
const even = ref(true);
let timer: ReturnType<typeof setInterval> | undefined;

// parts of 5 to 25 letters come in every 150 ms, as from a model
function ask() {
  clearInterval(timer);
  text.value = "";
  done.value = false;
  timer = setInterval(() => {
    text.value = reply.slice(0, text.value.length + 5 + Math.floor(Math.random() * 20));
    if (text.value.length >= reply.length) {
      clearInterval(timer);
      done.value = true;
    }
  }, 150);
}
onBeforeUnmount(() => clearInterval(timer));
</script>
