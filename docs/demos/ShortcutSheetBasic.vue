<script setup lang="ts">
import { BlessShortcutSheet, type BlessShortcutGroup } from "blessing-ui";

// the keys of a podcast editor
const groups: BlessShortcutGroup[] = [
  {
    title: "Player",
    shortcuts: [
      { keys: "Space", description: "Play or pause" },
      { keys: ["L", "Shift+→"], description: "Skip forward 10 seconds" },
      { keys: ["J", "Shift+←"], description: "Skip back 10 seconds" },
      { keys: "M", description: "Mute" },
    ],
  },
  {
    title: "Editing",
    shortcuts: [
      { keys: "Mod+X", description: "Cut the selection" },
      { keys: "Mod+Z", description: "Undo" },
      { keys: "Mod+Shift+Z", description: "Redo" },
      { keys: "B", description: "Add a marker" },
    ],
  },
  {
    title: "App",
    shortcuts: [
      { keys: "Mod+K", description: "Open the command menu" },
      { keys: "Mod+S", description: "Save the project" },
      { keys: "?", description: "Show this list" },
    ],
  },
];
</script>

<template>
  <BlessShortcutSheet :groups />
</template>
