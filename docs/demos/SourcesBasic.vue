<template>
  <div style="max-width: 640px">
    <p style="margin-top: 0">
      Start with the room, not the gear: blankets and a bookshelf stop most of the echo<a
        class="bless-source-mark"
        href="#ep41-src-1"
        aria-label="source 1"
        >1</a
      >. One USB microphone is enough for a solo show<a
        class="bless-source-mark"
        href="#ep41-src-2"
        aria-label="source 2"
        >2</a
      >, and an export at −16 LUFS sounds right in most apps<a
        class="bless-source-mark"
        href="#ep41-src-3"
        aria-label="source 3"
        >3</a
      >.
    </p>
    <BlessSources id="ep41-src" :sources />
  </div>
</template>

<script setup lang="ts">
import { BlessSources } from "blessing-ui";

const sources = [
  {
    title: "How to treat a small room for voice",
    url: "https://example.com/guides/room-treatment",
    snippet: "Soft things on hard walls stop most of the echo, for little money.",
  },
  {
    title: "USB or XLR: which microphone to buy first",
    url: "https://www.example.org/mic-buying-guide",
    snippet: "A good USB microphone is enough for one voice at home.",
  },
  {
    title: "Loudness for podcasts",
    url: "https://audio.example.net/loudness",
    site: "Audio Lab",
    snippet: "Most apps play episodes at about −16 LUFS.",
  },
];
</script>
