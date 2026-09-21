<script setup lang="ts">
import { BlessSkew } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessSkew color="text" label>Label</BlessSkew>
    <BlessSkew color="accent" label>Accent</BlessSkew>
    <BlessSkew color="danger" label>Danger</BlessSkew>
    <BlessSkew color="surface" label>Surface</BlessSkew>
    <BlessSkew as="h3" class="pad" style="margin: 0; border: 1px solid var(--bless-color-border)"
      >bare skew, as h3</BlessSkew
    >
  </div>
</template>
