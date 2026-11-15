<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { BlessButton, BlessReasoning, BlessStack } from "blessing-ui";

const steps = [
  "The listener asks for a short title for episode 41.",
  "The episode is about recording a podcast at home on a small budget.",
  "A good title is short, names the topic, and promises a result.",
  "Options: “Studio Sound on a Shoestring”, “Home Studio, Real Sound”.",
  "The second one is shorter and easier to say out loud. I will suggest it.",
];
const text = ref("");
const streaming = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;
function ask() {
  clearInterval(timer);
  text.value = "";
  streaming.value = true;
  let i = 0;
  timer = setInterval(() => {
    text.value += (i ? "\n" : "") + steps[i++];
    if (i === steps.length) {
      clearInterval(timer);
      streaming.value = false;
    }
  }, 700);
}
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <BlessStack :gap="4" style="max-width: 560px">
    <BlessButton
      size="sm"
      variant="outline"
      :disabled="streaming"
      style="align-self: flex-start"
      @click="ask"
    >
      Ask for a title
    </BlessButton>
    <BlessReasoning v-if="text || streaming" :text :streaming />
    <!-- an old reply from the history: the app stored the time -->
    <BlessReasoning
      :duration="8"
      text="The user wants the show notes as a list. I will keep the links and drop the ads."
    />
  </BlessStack>
</template>
