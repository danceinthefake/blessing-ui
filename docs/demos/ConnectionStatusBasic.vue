<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessConnectionStatus } from "blessing-ui";

// in an app this follows the socket, for example Phoenix's onOpen, onError, and onClose
const state = ref<"online" | "connecting" | "offline">("online");
const states = ["online", "connecting", "offline"] as const;
</script>

<template>
  <div class="col">
    <div class="row">
      <BlessButton
        v-for="s in states"
        :key="s"
        size="sm"
        :variant="state === s ? 'solid' : 'outline'"
        :aria-pressed="state === s"
        @click="state = s"
      >
        Socket {{ s }}
      </BlessButton>
    </div>
    <BlessConnectionStatus :state />
    <BlessConnectionStatus :state always />
  </div>
</template>
