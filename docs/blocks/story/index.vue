<script setup lang="ts">
import {
  BlessAccordion,
  BlessAccordionItem,
  BlessBadge,
  BlessDash,
  BlessSection,
  BlessText,
} from "blessing-ui";

const intro =
  "平凡な男子高校生・安芸倫也は、桜舞う坂道でひとりの少女と出会う。その出会いから、彼はゲーム制作サークルを立ち上げることを決意する——。";
const episodes = [
  {
    n: 1,
    title: "プロローグ",
    air: "10.09",
    aired: true,
    text: "サークル結成の経緯と、メンバーたちの温泉旅行。",
  },
  {
    n: 2,
    title: "運命の出会い",
    air: "10.16",
    aired: true,
    text: "坂道での出会い。倫也はその少女を探し始める。",
  },
  {
    n: 3,
    title: "フラグの立たない彼女",
    air: "10.23",
    aired: true,
    text: "少女の正体は同じクラスの加藤恵だった。",
  },
  {
    n: 4,
    title: "冴えない彼女の育てかた",
    air: "10.30",
    aired: false,
    text: "英梨々と詩羽を巻き込み、サークルが動き出す。",
  },
  { n: 5, title: "同人誌即売会", air: "11.06", aired: false, text: "" },
];
</script>

<template>
  <BlessSection title="Story" watermark="Story" class="story">
    <BlessText as="p" class="story__intro">{{ intro }}</BlessText>
    <BlessAccordion type="multiple">
      <BlessAccordionItem v-for="e in episodes" :key="e.n" :open="e.n === 1" :disabled="!e.text">
        <template #title>
          <span class="story__row">
            <BlessText size="2xs" weight="bold" tracking="wider" muted
              >#{{ String(e.n).padStart(2, "0") }}</BlessText
            >
            <BlessDash />
            <span class="story__title">{{ e.title }}</span>
            <BlessText size="xs" muted>{{ e.air }}</BlessText>
            <BlessBadge v-if="!e.aired" color="text">COMING</BlessBadge>
          </span>
        </template>
        {{ e.text }}
      </BlessAccordionItem>
    </BlessAccordion>
  </BlessSection>
</template>

<style scoped>
.story {
  padding: var(--bless-space-8) var(--bless-space-6);
}
.story__intro {
  max-width: 60ch;
  margin-bottom: var(--bless-space-6);
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
}
.story__row {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-width: 0;
}
.story__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
