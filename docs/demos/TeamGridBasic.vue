<template>
  <BlessTeamGrid :people />
</template>

<script setup lang="ts">
import { BlessTeamGrid, type BlessTeamMember } from "blessing-ui";
import { art } from "./_data";

const people: BlessTeamMember[] = [
  {
    name: "Ana Putri",
    role: "Founder",
    photo: art("🎙️", "f3d9c4"),
    bio: "Ran a radio show for ten years before she built the studio.",
    links: [{ label: "Email", href: "#ana" }],
  },
  {
    name: "Dimas Pratama",
    role: "Sound engineer",
    photo: art("🎚️", "c9dcf2"),
    bio: "Mixes every episode and teaches the mixing course.",
    links: [
      { label: "Email", href: "#dimas" },
      { label: "Portfolio", href: "#dimas-work" },
    ],
  },
  {
    name: "Sari Wulandari",
    role: "Producer",
    bio: "Finds the guests and writes the show notes.",
    links: [{ label: "Email", href: "#sari" }],
  },
  {
    name: "Budi Santoso",
    role: "Engineer",
    photo: art("💻", "d7ecd0"),
    bio: "Builds the editor in the browser.",
  },
];
</script>
