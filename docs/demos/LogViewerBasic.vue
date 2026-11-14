<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { BlessButton, BlessLogViewer } from "blessing-ui";

const C = {
  info: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[1;31m",
  dim: "\x1b[2m",
  off: "\x1b[0m",
};
const events = [
  `${C.info}[info]${C.off} GET /episodes 200 in 12ms`,
  `${C.info}[info]${C.off} Joined room:storyboard`,
  `${C.warn}[warn]${C.off} Slow query: 412ms ${C.dim}(episodes_by_season)${C.off}`,
  `${C.info}[info]${C.off} POST /drafts 201 in 30ms`,
  `${C.error}[error]${C.off} Upload failed: file too large`,
];
const lines = ref<string[]>([`${C.dim}Phoenix server started on port 4000${C.off}`]);
const running = ref(true);
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (running.value) lines.value = [...lines.value, events[lines.value.length % events.length]!];
  }, 700);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessButton size="sm" variant="outline" @click="running = !running">
      {{ running ? "Pause the server" : "Resume the server" }}
    </BlessButton>
    <BlessLogViewer :lines height="240px" label="Server log" />
  </div>
</template>
