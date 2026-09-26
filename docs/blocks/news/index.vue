<script setup lang="ts">
import {
  BlessButton,
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
  { value: "all", label: "ALL" },
  { value: "news", label: "NEWS" },
  { value: "event", label: "EVENT" },
  { value: "goods", label: "GOODS" },
  { value: "onair", label: "ON AIR" },
];
</script>

<template>
  <BlessSection title="News" class="news">
    <!-- the list lives in the active tab's panel, so the tabs control what they filter -->
    <BlessTabs v-model="filter" :tabs label="News category" color="text" class="news__tabs">
      <template #default="{ active }">
        <template v-if="active">
          <BlessSkeleton v-if="loading" :lines="4" height="14px" />
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
  text-align: right;
}
</style>
