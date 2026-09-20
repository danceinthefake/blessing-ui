<script setup lang="ts">
import { BlessImg } from "blessing-ui";
import { shots } from "./_data";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessImg :src="shots[0].src" alt="Episode 1" ratio="16 / 9" style="width: 240px"
      >第1話</BlessImg
    >
    <BlessImg
      :src="shots[2].src"
      alt="Episode 3"
      :ratio="1"
      :placeholder="shots[6].src"
      style="width: 135px"
    />
    <BlessImg src="/does-not-exist.png" alt="Missing still" ratio="4 / 3" style="width: 160px" />
  </div>
</template>
