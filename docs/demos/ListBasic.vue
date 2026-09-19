<script setup lang="ts">
import { BlessButton, BlessList, BlessListItem } from "blessing-ui";
</script>

<template>
  <BlessList style="max-width: 640px">
    <BlessListItem meta="2019.04.04" badge href="#"
      >Blu-ray Disc BOX 発売決定！全25話収録</BlessListItem
    >
    <BlessListItem meta="2019.03.20" href="#"
      >「冴えない彼女の育てかた Fine」公開日決定</BlessListItem
    >
    <BlessListItem meta="2019.02.01" badge="EVENT">
      スペシャルイベント開催
      <template #suffix><BlessButton size="sm" variant="outline">詳細</BlessButton></template>
    </BlessListItem>
    <BlessListItem>no meta, plain row</BlessListItem>
  </BlessList>
</template>
