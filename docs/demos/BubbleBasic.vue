<script setup lang="ts">
import { BlessBubble } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessBubble>surface (default)</BlessBubble>
    <BlessBubble variant="outline">outline</BlessBubble>
    <BlessBubble variant="plain">plain — no box</BlessBubble>
    <BlessBubble
      variant="outline"
      align="end"
      :reactions="[
        { emoji: '👍', count: 3, active: true },
        { emoji: '🎉', count: 1 },
      ]"
    >
      accent, end, reactions
    </BlessBubble>
    <BlessBubble collapsible :lines="2">
      Long text clamped to two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
      do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
      nostrud exercitation ullamco.
    </BlessBubble>
  </div>
</template>
