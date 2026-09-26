<script setup lang="ts">
import { BlessBadge, BlessSection, BlessText } from "blessing-ui";
</script>

<template>
  <BlessSection title="Character" subtitle="登場人物" headline="hanging">
    <template #band>
      <!-- the key visual goes here; a gradient stands in -->
      <div class="kv" />
    </template>
    <div class="profile">
      <BlessText as="p" weight="bold" class="quote"
        >サークルってさ、辛いことも、<br />悲しいこともあるけど……<br />それでも、これからも続けるよ</BlessText
      >
      <p class="tags">
        <BlessBadge variant="outline">企画</BlessBadge>
        <BlessBadge variant="outline">サブディレクター</BlessBadge>
        <BlessBadge variant="outline">メインヒロイン</BlessBadge>
      </p>
      <BlessText as="p" size="lg" weight="bold">加藤 恵</BlessText>
      <BlessText as="p" size="xs" muted tracking="wider">Megumi Kato</BlessText>
    </div>
  </BlessSection>
</template>

<style scoped>
.kv {
  height: 100%;
  background: linear-gradient(160deg, #2a4a8a, #6a8ad0 60%, #c9d6f0);
}
.profile {
  max-width: 420px;
  margin-inline-start: auto;
}
.quote {
  font-size: var(--bless-text-lg);
  line-height: 1.7;
  margin-bottom: var(--bless-space-4);
}
.tags {
  display: flex;
  gap: var(--bless-space-2);
  flex-wrap: wrap;
  margin: 0 0 var(--bless-space-4);
}
</style>
