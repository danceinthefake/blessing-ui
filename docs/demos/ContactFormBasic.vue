<script setup lang="ts">
import { ref } from "vue";
import { BlessContactForm, type BlessContactMessage } from "blessing-ui";

const state = ref<"idle" | "sending" | "sent" | "error">("idle");
// a pretend send; post the message to your server here
function send(m: BlessContactMessage) {
  state.value = "sending";
  setTimeout(() => (state.value = m.message.includes("fail") ? "error" : "sent"), 800);
}
</script>

<template>
  <BlessContactForm
    :topics="['A question about a product', 'Studio booking', 'Press', 'Something else']"
    :state
    @submit="send"
  />
</template>
