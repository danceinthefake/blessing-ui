<template>
  <div class="col" style="max-width: none">
    <BlessSection title="News" class="boxed">
      <BlessText as="p">2019.04.04<BlessDash /><BlessBadge /> Blu-ray Disc BOX 発売決定</BlessText>
      <BlessText as="p" muted size="sm">watermark defaults to the title, top-end</BlessText>
    </BlessSection>
    <BlessSection
      title="スタッフ・キャスト"
      watermark="Staff & Cast"
      watermark-position="bottom-start"
      :heading-level="3"
      class="boxed"
    >
      <BlessText as="p"><BlessSkew color="text" label>原作</BlessSkew> 丸戸史明</BlessText>
    </BlessSection>
  </div>
</template>

<script setup lang="ts">
import { BlessBadge, BlessDash, BlessSection, BlessSkew, BlessText } from "blessing-ui";
</script>
