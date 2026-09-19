<script setup lang="ts">
import { BlessDropdownMenu, BlessMenubar, BlessText, type BlessMenuItem } from "blessing-ui";
const file: BlessMenuItem[] = [
  { label: "New", shortcut: "⌘N", value: "n" },
  { label: "Open", shortcut: "⌘O", value: "o" },
  { type: "separator" },
  { label: "Quit", value: "q" },
];
const edit: BlessMenuItem[] = [
  { label: "Undo", shortcut: "⌘Z", value: "u" },
  { label: "Redo", shortcut: "⇧⌘Z", value: "r" },
];
const view: BlessMenuItem[] = [
  { type: "checkbox", label: "Sidebar", value: "sb" },
  { type: "checkbox", label: "Status bar", value: "st" },
];
</script>

<template>
  <BlessMenubar label="App">
    <BlessDropdownMenu :items="file"
      ><template #trigger><button>File</button></template></BlessDropdownMenu
    >
    <BlessDropdownMenu :items="edit"
      ><template #trigger><button>Edit</button></template></BlessDropdownMenu
    >
    <BlessDropdownMenu :items="view"
      ><template #trigger><button>View</button></template></BlessDropdownMenu
    >
  </BlessMenubar>
  <BlessText as="p" size="xs" muted>← → moves between menus; open one then hover others</BlessText>
</template>
