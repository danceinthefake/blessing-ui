<script setup lang="ts">
import { ref } from "vue";
import { BlessMention } from "blessing-ui";

const text = ref("Thanks @mika — can you review ");
const options = {
  "@": [
    { value: "mika", label: "Mika Tanaka", hint: "design" },
    { value: "ken", label: "Ken Ito", hint: "backend" },
    { value: "miho", label: "Miho Sato", hint: "docs" },
  ],
  "#": [
    { value: "release", label: "release" },
    { value: "a11y", label: "accessibility" },
  ],
};
</script>

<template>
  <div class="col" style="max-width: 420px">
    <BlessMention v-model="text" :options rows="3" placeholder="Type @ or #" />
    <small>type @ or #, ↑ ↓ to choose, Enter or Tab to insert, Esc to close</small>
  </div>
</template>
