<script setup lang="ts">
import { ref } from "vue";
import { BlessAnswerCompare, type BlessAnswerVote } from "blessing-ui";

const vote = ref<BlessAnswerVote | null>(null);
</script>

<template>
  <BlessAnswerCompare
    v-model="vote"
    prompt="I record a podcast in a small bedroom with a fan. Which mic do I buy?"
    :answers="[
      {
        text: 'Buy a dynamic mic. It picks up the voice close to it and little of the room and the fan. Speak 5 to 10 cm from it.',
        source: 'Assistant, new prompt',
      },
      {
        text: 'A large condenser mic gives the richest sound. Put foam on the walls first, and turn off the fan when you record.',
        source: 'Assistant, old prompt',
      },
    ]"
  />
</template>
