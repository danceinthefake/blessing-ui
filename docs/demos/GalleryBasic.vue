<script setup lang="ts">
import { BlessGallery } from "blessing-ui";
import { shots } from "./_data";
</script>

<template>
  <BlessGallery :items="shots" columns="120px" style="max-width: 640px" />
</template>
