<script setup lang="ts">
import { ref } from "vue";
import { BlessTerminal, type BlessTerminalLine } from "blessing-ui";

// a pretend shell: try help, ls, echo hello, deploy, or clear
const lines = ref<BlessTerminalLine[]>([
  { text: "Welcome to the studio server. Type help to see the commands." },
]);
const files = "episodes/  cover-art/  season-plan.pdf  guests.xlsx";
function run(cmd: string) {
  lines.value.push({ kind: "in", text: cmd });
  const [name, ...rest] = cmd.split(/\s+/);
  if (name === "clear") lines.value = [];
  else if (name === "help") lines.value.push({ text: "help  ls  echo <text>  deploy  clear" });
  else if (name === "ls") lines.value.push({ text: files });
  else if (name === "echo") lines.value.push({ text: rest.join(" ") });
  else if (name === "deploy")
    lines.value.push(
      { text: "Building site… 214 pages in 6.1 s" },
      { kind: "err", text: "Upload failed: the token for the store is out of date." },
    );
  else lines.value.push({ kind: "err", text: `${name}: command not found` });
}
</script>

<template>
  <BlessTerminal :lines title="studio@server: ~" @run="run" />
</template>
