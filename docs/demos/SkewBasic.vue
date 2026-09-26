<script setup lang="ts">
import { BlessSkew } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessSkew color="text" label>企画</BlessSkew>
    <BlessSkew color="danger" label>締切</BlessSkew>
    <BlessSkew color="surface" label>第1話</BlessSkew>
    <!-- a link leans on hover and focus; the static labels beside it stay upright -->
    <BlessSkew as="a" href="#skew" color="surface" label>Hover me</BlessSkew>
  </div>
</template>
