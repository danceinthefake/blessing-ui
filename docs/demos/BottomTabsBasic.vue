<script setup lang="ts">
import { ref } from "vue";
import { BlessBottomTabs, BlessMockup } from "blessing-ui";
const tab = ref("home");
const items = [
  { label: "Home", value: "home", icon: "⌂" },
  { label: "Search", value: "search", icon: "⌕" },
  { label: "Inbox", value: "inbox", icon: "✉", badge: 3 },
  { label: "Me", value: "me", icon: "◯" },
];
</script>

<template>
  <div class="row" style="align-items: flex-start; gap: 32px">
    <BlessMockup type="phone" dark style="width: 240px">
      <div style="display: flex; flex-direction: column; height: 100%">
        <div
          style="flex: 1; display: grid; place-items: center; color: var(--bless-color-text-muted)"
        >
          {{ tab }}
        </div>
        <BlessBottomTabs v-model="tab" :items inline />
      </div>
    </BlessMockup>
    <div class="col">
      <small>dock variant, inline:</small>
      <BlessBottomTabs v-model="tab" :items variant="dock" inline />
    </div>
  </div>
</template>
