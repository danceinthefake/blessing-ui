<script setup lang="ts">
import { ref } from "vue";
import { BlessHotspots, BlessSwitch, type BlessHotspot } from "blessing-ui";

const edit = ref(false);
const active = ref<string | number | null>(null);
const spots = ref<BlessHotspot[]>([
  { id: "nav", x: 62, y: 6, label: "Search and the main navigation" },
  { id: "news", x: 78, y: 40, label: "The news list, filtered by the tabs" },
  { id: "air", x: 30, y: 78, label: "Broadcast times for the current season" },
]);
</script>

<template>
  <div class="col" style="max-width: 640px">
    <BlessSwitch v-model="edit">Edit pins</BlessSwitch>
    <BlessHotspots
      v-model="spots"
      v-model:active="active"
      src="/hero-light.png"
      alt="The Blessing docs home page"
      :editable="edit"
    />
    <small>{{
      edit
        ? "click the image to add a pin, drag to move, Delete removes the focused pin"
        : "click a pin"
    }}</small>
  </div>
</template>
