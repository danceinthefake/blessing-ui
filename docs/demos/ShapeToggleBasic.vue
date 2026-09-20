<script setup lang="ts">
import {
  BlessBadge,
  BlessButton,
  BlessCard,
  BlessInput,
  BlessShapeToggle,
  BlessSwitch,
  BlessText,
  useTheme,
} from "blessing-ui";
const { shape } = useTheme();
</script>

<template>
  <div class="row" style="align-items: center; margin-bottom: 12px">
    <BlessShapeToggle />
    <BlessText size="sm" muted>data-shape="{{ shape === "rounded" ? "rounded" : "" }}"</BlessText>
  </div>
  <div class="row">
    <BlessButton color="accent">Sign in</BlessButton>
    <BlessButton variant="outline">Cancel</BlessButton>
    <BlessBadge color="accent" :scaled="false">NEW</BlessBadge>
    <BlessSwitch :model-value="true">On</BlessSwitch>
  </div>
  <div class="row" style="margin-top: 12px; align-items: flex-start">
    <BlessInput placeholder="Search" aria-label="Search" />
    <BlessCard label="Card" style="width: 200px"
      ><BlessText size="sm">Corners follow the setting.</BlessText></BlessCard
    >
  </div>
</template>
