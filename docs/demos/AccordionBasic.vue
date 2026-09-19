<script setup lang="ts">
import { BlessAccordion, BlessAccordionItem } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessAccordion>
        <BlessAccordionItem title="放送情報" :open="true">TOKYO MX 木曜 24:00〜</BlessAccordionItem>
        <BlessAccordionItem title="配信">AbemaTV ほか</BlessAccordionItem>
        <BlessAccordionItem title="Blu-ray">2019.09.25 発売</BlessAccordionItem>
      </BlessAccordion>
    </div>
    <div class="col">
      <BlessAccordion type="multiple">
        <BlessAccordionItem title="Multiple 1">any number open</BlessAccordionItem>
        <BlessAccordionItem title="Multiple 2">at once</BlessAccordionItem>
      </BlessAccordion>
    </div>
  </div>
</template>
