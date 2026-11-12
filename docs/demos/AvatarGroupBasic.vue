<script setup lang="ts">
import { BlessAvatarGroup } from "blessing-ui";
import { shots } from "./_data";

const team = [
  { name: "Megumi Kato" },
  { name: "Eriri Spencer", src: shots[0].src },
  { name: "Utaha Kasumigaoka" },
  { name: "Michiru Hyodo" },
  { name: "Izumi Hashima" },
  { name: "Tomoya Aki" },
];
</script>

<template>
  <div class="row">
    <BlessAvatarGroup :items="team" :max="4" />
  </div>
  <div class="row" style="margin-top: 12px">
    <BlessAvatarGroup :items="team.slice(0, 3)" size="sm" color="text" />
  </div>
</template>
