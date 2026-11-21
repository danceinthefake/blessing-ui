<template>
  <BlessPosterRow title="Shows like this one" :items="shows" />
</template>

<script setup lang="ts">
import { BlessPosterRow, type BlessPoster } from "blessing-ui";
import { art } from "./_data";

const emoji = ["🎙️", "🎧", "📻", "🎚️", "🎛️", "🎼", "🎹", "🥁", "🎸", "🎺"];
const colors = ["f3e1e7", "dfe8f3", "e8f3df", "efe6d8", "e3e0f3"];
const shows: BlessPoster[] = emoji.map((e, i) => ({
  id: String(i),
  title: [
    "Home Studio",
    "Edit Night",
    "Radio Kita",
    "Gain Stage",
    "The Mix",
    "Score",
    "Keys",
    "Beat",
    "Strings",
    "Brass",
  ][i]!,
  image: art(e, colors[i % colors.length]!),
  href: `#show-${i}`,
  meta: `${2020 + (i % 6)} · ${8 + i} episodes`,
}));
</script>
