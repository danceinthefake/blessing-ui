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
    <BlessCard label="Link" label-color="accent" href="#" style="width: 240px">
      <BlessText as="p">whole card is an anchor</BlessText>
    </BlessCard>
    <BlessCard surface="surface" :bordered="false" style="width: 240px">
      <BlessText as="p">surface, no border, no label</BlessText>
    </BlessCard>
  </div>
</template>
