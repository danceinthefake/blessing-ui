<script setup lang="ts">
import { BlessFootnoteRef, BlessFootnotes } from "blessing-ui";

const notes = [
  "Recorded on 2 November 2026 in a bedroom in Bandung, with a USB microphone and a wardrobe full of coats.",
  "Most podcast apps play episodes at about −16 LUFS, so a louder file gets turned down.",
  "The guest asked us to leave out the name of the school.",
];
</script>

<template>
  <article style="max-width: 560px">
    <p style="margin: 0 0 12px">
      Episode 41 was the first one that we made at home<BlessFootnoteRef :n="1" id="ep41" />. We
      mixed it quieter than the old episodes<BlessFootnoteRef :n="2" id="ep41" />, and nobody
      complained.
    </p>
    <p style="margin: 0">
      Our guest learned to edit audio at school<BlessFootnoteRef :n="3" id="ep41" />, on a computer
      older than both hosts.
    </p>
    <BlessFootnotes :notes id="ep41" />
  </article>
</template>
