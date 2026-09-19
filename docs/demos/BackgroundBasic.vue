<script setup lang="ts">
import { BlessBackground, BlessText } from "blessing-ui";
</script>

<template>
  <div class="row">
    <div class="boxed" style="position: relative; width: 260px; height: 120px">
      <BlessBackground />
      <BlessText as="p" style="position: relative">pattern fallback</BlessText>
    </div>
    <div class="boxed" style="position: relative; width: 260px; height: 120px">
      <BlessBackground :offset="-40" :opacity="0.4" />
      <BlessText as="p" style="position: relative">offset -40, opacity .4</BlessText>
    </div>
  </div>
</template>
