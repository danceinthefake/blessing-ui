<template>
  <div style="display: grid; gap: 12px">
    <BlessArtifactPanel
      v-if="open"
      v-model:version="version"
      title="Launch plan"
      :versions
      :writing
      filename="launch-plan.txt"
      @close="open = false"
    />
    <div style="display: flex; gap: 8px">
      <BlessButton :disabled="writing" @click="revise">Ask for an email step</BlessButton>
      <BlessButton v-if="!open" variant="outline" @click="open = true">Open the panel</BlessButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessArtifactPanel, BlessButton } from "blessing-ui";

const versions = ref([
  "Launch plan\n\n1. Beta in March for 50 studios.\n2. Launch in May.",
  "Launch plan\n\n1. Beta in March for 50 studios.\n2. Fix the top 10 bugs from the beta.\n3. Launch in May with a sound test video.",
]);
const version = ref<number>();
const writing = ref(false);
const open = ref(true);
// a pretend model: it writes the next version a few words at a time
function revise() {
  const next = `${versions.value.at(-1)}\n4. Send a launch email to the 2,000 people on the wait list.`;
  versions.value.push("");
  version.value = undefined;
  writing.value = true;
  const words = next.split(" ");
  let i = 0;
  const t = setInterval(() => {
    versions.value[versions.value.length - 1] = words.slice(0, ++i).join(" ");
    if (i >= words.length) {
      clearInterval(t);
      writing.value = false;
    }
  }, 60);
}
</script>
