<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessNewsletterSignup } from "blessing-ui";

const email = ref("");
const status = ref<"idle" | "loading" | "done">("idle");
const error = ref<string>();
// a stand-in for your server: an address at example.com is already on the list
function subscribe(address: string) {
  status.value = "loading";
  error.value = undefined;
  setTimeout(() => {
    if (address.endsWith("@example.com")) {
      status.value = "idle";
      error.value = "This address is already on the list.";
    } else status.value = "done";
  }, 700);
}
</script>

<template>
  <div style="display: grid; gap: 12px">
    <BlessNewsletterSignup v-model="email" :status :error privacy-href="#" @subscribe="subscribe" />
    <BlessButton
      v-if="status === 'done'"
      size="sm"
      variant="outline"
      style="justify-self: start"
      @click="status = 'idle'"
    >
      Start again
    </BlessButton>
  </div>
</template>
