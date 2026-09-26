<script setup lang="ts">
import { BlessButton, BlessCard, BlessText } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start; padding-top: 12px">
    <BlessCard label="Blu-ray" style="width: 240px">
      <template #media
        ><div style="height: 100px; background: var(--bless-color-surface-2)"
      /></template>
      <BlessText as="p" weight="bold">Blu-ray Disc BOX</BlessText>
      <BlessText as="p" size="sm" muted>2019.09.25 発売</BlessText>
      <template #footer><BlessButton size="sm">詳細</BlessButton></template>
    </BlessCard>
    <BlessCard label="Episode" href="#card" style="width: 240px">
      <BlessText as="p" weight="bold">第1話 冴えない竹馬の友の口説きかた</BlessText>
      <BlessText as="p" size="sm" muted>2019.04.04 · 24:00</BlessText>
    </BlessCard>
    <BlessCard surface="surface" :bordered="false" style="width: 240px">
      <BlessText as="p" weight="bold">Staff</BlessText>
      <BlessText as="p" size="sm" muted>原作 丸戸史明 · キャラクター原案 深崎暮人</BlessText>
    </BlessCard>
  </div>
</template>
