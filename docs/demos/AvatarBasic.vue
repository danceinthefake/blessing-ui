<script setup lang="ts">
import { BlessAvatar } from "blessing-ui";
import { shots } from "./_data";
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
</script>

<template>
  <div class="row">
    <BlessAvatar v-for="s in sizes" :key="s" :size="s" name="Megumi Kato" />
  </div>
  <div class="row" style="margin-top: 12px">
    <BlessAvatar name="Utaha Kasumigaoka" color="text" />
    <a href="#avatar" aria-label="Eriri's profile"
      ><BlessAvatar :src="shots[0].src" name="Eriri Spencer" lean size="lg"
    /></a>
    <BlessAvatar src="/missing-photo.png" name="Michiru Hyodo" />
  </div>
</template>
