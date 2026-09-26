<script setup lang="ts">
import {
  BlessButton,
  BlessEmpty,
  BlessList,
  BlessListItem,
  BlessSection,
  BlessSkeleton,
  BlessTabs,
} from "blessing-ui";
import { fmtDate, isNew } from "./domain";
import { useNews } from "./useNews";

const { visible, loading, filter } = useNews();
const tabs = [
  // written as words: the tabs set them in capitals, and "ALL" typed in capitals can be spelled out
  { value: "all", label: "All" },
  { value: "news", label: "News" },
  { value: "event", label: "Event" },
  { value: "goods", label: "Goods" },
  { value: "onair", label: "On air" },
];
</script>

<template>
  <BlessSection title="News" class="news">
    <!-- the list lives in the active tab's panel, so the tabs control what they filter -->
    <BlessTabs v-model="filter" :tabs label="News category" class="news__tabs">
      <template #default="{ active }">
        <template v-if="active">
          <BlessSkeleton v-if="loading" :lines="4" height="14px" />
          <BlessEmpty
            v-else-if="!visible.length"
            variant="plain"
            title="Nothing in this category yet"
          />
          <BlessList v-else>
            <BlessListItem
              v-for="n in visible"
              :key="n.id"
              :meta="fmtDate(n.date)"
              :badge="isNew(n.date)"
              :href="n.href"
            >
              {{ n.title }}
            </BlessListItem>
          </BlessList>
        </template>
      </template>
    </BlessTabs>
    <div class="news__more">
      <BlessButton href="#">More</BlessButton>
    </div>
  </BlessSection>
</template>

<style scoped>
.news {
  padding: var(--bless-space-8) var(--bless-space-6);
}
.news__tabs {
  margin-bottom: var(--bless-space-4);
}
.news__more {
  margin-top: var(--bless-space-6);
  text-align: end;
}
</style>
