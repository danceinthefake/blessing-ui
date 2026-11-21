<template>
  <div style="max-width: 560px">
    <BlessSelectionToolbar :actions @action="onAction">
      <p>
        Select some words in this text. A small toolbar comes up above them, with actions for the
        words that you selected. Press Tab to reach it from the keyboard, and Escape to close it.
      </p>
      <p>
        The toolbar goes below the text when there is no room above it, near the top of the window.
      </p>
    </BlessSelectionToolbar>
    <BlessText v-if="last" as="p" size="sm">{{ last }}</BlessText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessSelectionToolbar, BlessText, type BlessSelection } from "blessing-ui";

const actions = [
  { id: "mark", label: "Mark", icon: "🖍" },
  { id: "quote", label: "Quote" },
  { id: "copy", label: "Copy" },
];
const last = ref("");

function onAction(id: string, sel: BlessSelection) {
  if (id === "mark") {
    // wrap the selected text in <mark>, when it is inside one paragraph
    const mark = document.createElement("mark");
    try {
      sel.range.surroundContents(mark);
    } catch {
      // the range crosses paragraphs: nothing to wrap
    }
  }
  if (id === "copy") navigator.clipboard?.writeText(sel.text).catch(() => {});
  last.value = `${id}: “${sel.text}”`;
}
</script>
