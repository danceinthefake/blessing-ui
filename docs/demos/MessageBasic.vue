<script setup lang="ts">
import { BlessBubble, BlessButton, BlessMessage } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: 560px">
    <BlessMessage name="Megumi" time="12:01">
      <BlessBubble>おはよう。今日の予定は？</BlessBubble>
      <template #actions><BlessButton size="sm" variant="ghost">↩</BlessButton></template>
    </BlessMessage>
    <BlessMessage name="Tomoya" time="12:02" align="end">
      <BlessBubble align="end" variant="outline">脚本の続き。第3話まで。</BlessBubble>
    </BlessMessage>
    <BlessMessage name="Tomoya" align="end" compact>
      <BlessBubble align="end" variant="outline">夜までには送る。</BlessBubble>
      <template #footer>Delivered</template>
    </BlessMessage>
  </div>
</template>
