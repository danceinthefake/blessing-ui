<template>
  <div style="max-width: 560px">
    <p style="margin-top: 0">{{ reply }}</p>
    <BlessMessageFeedback
      v-model:rating="rating"
      :copy="reply"
      retry
      :reasons="['Not true', 'Not helpful', 'Too long', 'Other']"
      @feedback="log"
      @retry="tries++"
    />
    <BlessText as="p" size="sm" style="margin-top: 12px">
      Sent: {{ last }} · Tries: {{ tries }}
    </BlessText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessMessageFeedback, BlessText, type BlessMessageFeedbackEvent } from "blessing-ui";

const reply =
  "Try “Home Studio, Real Sound”. It is short, it names the topic, and it is easy to say out loud.";
const rating = ref<"good" | "bad">();
const last = ref("nothing yet");
const tries = ref(1);
const log = (e: BlessMessageFeedbackEvent) => (last.value = JSON.stringify(e));
</script>
