<script setup lang="ts">
import { BlessAvatar } from "blessing-ui";
import { shots } from "./_data";
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
</script>

<template>
  <div class="row">
    <BlessAvatar v-for="s in sizes" :key="s" :size="s" name="Megumi Kato" />
    <BlessAvatar name="Eriri Spencer" color="accent" />
    <BlessAvatar name="Utaha" color="text" square size="lg" />
    <BlessAvatar :src="shots[0].src" name="shot" square size="lg" />
    <BlessAvatar src="/nope.png" name="Fallback Test" />
  </div>
</template>
