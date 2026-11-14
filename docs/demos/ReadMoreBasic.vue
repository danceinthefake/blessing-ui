<script setup lang="ts">
import { BlessReadMore } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: 32rem">
    <BlessReadMore :lines="3">
      Tomoya Aki is an otaku who meets a girl under the cherry blossoms on a spring day, and he
      decides to make a visual novel with her as the heroine. He gathers a team: a famous
      illustrator who is his childhood friend, a popular novelist who is his senior, and his cousin,
      who plays in a band. The girl, Megumi Katō, turns out to be so plain that nobody notices her.
      Tomoya must make her a heroine whom the players love, before the winter market.
    </BlessReadMore>
    <BlessReadMore :lines="3">This text fits, so there is no button.</BlessReadMore>
  </div>
</template>
