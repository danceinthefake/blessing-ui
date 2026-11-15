<script setup lang="ts">
import { BlessChangelog, type BlessRelease } from "blessing-ui";

// the release notes of a podcast app
const releases: BlessRelease[] = [
  {
    version: "2.4.0",
    date: "2026-11-15",
    title: "Chapters",
    changes: [
      { type: "added", text: "Chapters with titles and pictures in each episode." },
      { type: "added", text: "A sleep timer that ends at the end of a chapter." },
      { type: "changed", text: "The player shows the chapter name under the title." },
      { type: "fixed", text: "The speed control kept its value after a new episode." },
    ],
  },
  {
    version: "2.3.1",
    date: "2026-10-28",
    changes: [
      { type: "fixed", text: "Downloads stopped when the screen locked." },
      { type: "security", text: "Links in show notes open in a safe tab." },
    ],
  },
  {
    version: "2.3.0",
    date: "2026-10-02",
    changes: [
      { type: "added", text: "A queue that you can sort with a drag." },
      { type: "deprecated", text: "The old feed address. It stops in version 3." },
    ],
  },
];
</script>

<template>
  <BlessChangelog :releases style="max-width: 640px" />
</template>
