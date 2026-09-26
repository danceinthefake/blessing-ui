<script setup lang="ts">
import { ref } from "vue";
import {
  BlessBadge,
  BlessButton,
  BlessCheckbox,
  BlessProgress,
  BlessSidebarNav,
  BlessSwitch,
  BlessTabs,
  BlessToggle,
} from "blessing-ui";
// colour means chosen: the palette shows on what is selected, on, done, active or pressed — never at rest
const tab = ref("news");
const tabs = [
  { value: "news", label: "News" },
  { value: "event", label: "Event" },
  { value: "goods", label: "Goods" },
];
</script>

<template>
  <BlessTabs v-model="tab" :tabs label="Category" style="max-width: 360px" />
  <div class="row" style="margin-top: 12px">
    <BlessToggle :pressed="true">Pinned</BlessToggle>
    <BlessCheckbox :model-value="true">Subscribed</BlessCheckbox>
    <BlessSwitch :model-value="true">Notify</BlessSwitch>
    <BlessBadge>NEW!</BlessBadge>
    <BlessButton>Press me</BlessButton>
  </div>
  <div style="margin-top: 12px; max-width: 360px">
    <BlessProgress :value="64" show-value label="Progress" />
  </div>
  <div style="margin-top: 16px; max-width: 220px">
    <BlessSidebarNav
      :items="[
        { label: 'News', href: '#news', badge: true },
        { label: 'On Air', href: '#onair' },
      ]"
      active="#news"
      @select="(_, e) => e.preventDefault()"
    />
  </div>
</template>
