<script setup lang="ts">
import { BlessText, BlessWatermarkOverlay } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessWatermarkOverlay
      text="DRAFT"
      style="width: 320px; padding: 24px; border: 1px solid var(--bless-color-border)"
    >
      <BlessText as="p" weight="bold">第3話 脚本 v0.4</BlessText>
      <BlessText as="p" size="sm" muted>tiled, rotated, aria-hidden, no pointer events</BlessText>
      <BlessText as="p" size="sm"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</BlessText
      >
    </BlessWatermarkOverlay>
    <BlessWatermarkOverlay
      text="© Blessing"
      :gap="120"
      :angle="-45"
      :font-size="12"
      :opacity="0.4"
      color="#e85078"
      style="width: 240px; height: 160px; background: var(--bless-color-surface)"
    />
  </div>
</template>
