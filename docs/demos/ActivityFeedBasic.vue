<template>
  <BlessActivityFeed :events :now style="max-width: 560px" />
</template>

<script setup lang="ts">
import { BlessActivityFeed } from "blessing-ui";

// a fixed "now", so the page shows the same groups on every visit
const now = new Date(2026, 10, 15, 16, 0);
const at = (daysAgo: number, hour: number, minute = 0) =>
  new Date(2026, 10, 15 - daysAgo, hour, minute);

const events = [
  {
    id: 1,
    actor: { name: "Ana Putri" },
    action: "published",
    target: "Episode 41",
    href: "#",
    time: at(0, 15, 20),
  },
  {
    id: 2,
    actor: { name: "Budi Santoso" },
    action: "uploaded the final mix of",
    target: "Episode 41",
    time: at(0, 13, 5),
  },
  {
    id: 3,
    actor: { name: "Citra Dewi" },
    action: "commented on",
    target: "the cover art",
    href: "#",
    time: at(0, 9, 40),
  },
  {
    id: 4,
    actor: { name: "Ana Putri" },
    action: "added chapters to",
    target: "Episode 41",
    time: at(1, 17, 30),
  },
  { id: 5, actor: { name: "Dimas" }, action: "joined the team as an editor", time: at(1, 10) },
  {
    id: 6,
    actor: { name: "Budi Santoso" },
    action: "recorded",
    target: "Episode 42",
    time: at(3, 14),
  },
];
</script>
