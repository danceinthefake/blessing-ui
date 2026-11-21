<template>
  <div style="max-width: 560px">
    <BlessFigure
      :src="shots[0]!.src"
      alt="A pink placeholder with the number 1"
      caption="The vocal booth after the new panels went up. The echo time dropped by half."
      credit="Ana Putri"
      credit-href="#ana"
    />
  </div>
</template>

<script setup lang="ts">
import { BlessFigure } from "blessing-ui";
import { shots } from "./_data";
</script>
