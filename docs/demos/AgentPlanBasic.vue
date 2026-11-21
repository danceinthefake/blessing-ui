<template>
  <div style="max-width: 480px">
    <BlessButton
      size="sm"
      variant="outline"
      :disabled="busy"
      style="margin-bottom: 16px"
      @click="run"
    >
      Run the plan
    </BlessButton>
    <BlessAgentPlan :steps title="Publish episode 41" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { BlessAgentPlan, BlessButton, type BlessPlanStep } from "blessing-ui";

const titles = [
  "Read the transcript of episode 41",
  "Find the chapters",
  "Write the show notes",
  "Make three social clips",
  "Post the notes to the website",
];
const start = (): BlessPlanStep[] => titles.map((title, id) => ({ id, title, status: "pending" }));
const steps = ref(start());
const busy = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

// a stand-in for an agent: one step a second, and the last step fails
function run() {
  clearInterval(timer);
  steps.value = start();
  busy.value = true;
  let i = 0;
  steps.value[0]!.status = "running";
  timer = setInterval(() => {
    const s = steps.value[i]!;
    if (i === 3) s.detail = "3 clips, 45 seconds each";
    if (i === titles.length - 1) {
      s.status = "failed";
      s.detail = "The website asked for a new login";
      busy.value = false;
      return clearInterval(timer);
    }
    s.status = "done";
    steps.value[++i]!.status = "running";
  }, 1000);
}
onBeforeUnmount(() => clearInterval(timer));
</script>
