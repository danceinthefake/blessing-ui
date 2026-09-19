<script setup lang="ts">
import { BlessSkew } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessSkew color="text" class="pad">Label</BlessSkew>
    <BlessSkew color="accent" class="pad">Accent</BlessSkew>
    <BlessSkew color="danger" class="pad">Danger</BlessSkew>
    <BlessSkew color="surface" class="pad">Surface</BlessSkew>
    <BlessSkew as="h3" class="pad">as h3</BlessSkew>
  </div>
</template>
