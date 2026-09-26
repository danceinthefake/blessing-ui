<script setup lang="ts">
import { BlessButton, BlessMockup, BlessText } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessMockup title="saenai.tv/news" style="width: 360px">
      <div style="padding: 16px">
        <BlessText as="p" weight="bold">Blu-ray Disc BOX</BlessText>
        <BlessButton size="sm">詳細</BlessButton>
      </div>
    </BlessMockup>
    <BlessMockup type="window" title="Terminal" dark style="width: 300px">
      <pre style="margin: 0; padding: 12px; font-size: 12px">$ pnpm add blessing-ui</pre>
    </BlessMockup>
    <BlessMockup type="phone" style="width: 200px">
      <div style="padding: 16px; font-size: 12px">
        <BlessText as="p" weight="bold">第1話</BlessText>
        <BlessText as="p" size="xs" muted>冴えないヒロインの育てかた · 24:00</BlessText>
      </div>
    </BlessMockup>
  </div>
</template>
