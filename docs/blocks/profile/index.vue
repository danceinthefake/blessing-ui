<template>
  <div v-if="profile" class="profile">
    <BlessProfileCard
      v-model:following="following"
      :name="profile.name"
      :handle="`@${profile.handle}`"
      :avatar="profile.avatar"
      :cover="profile.cover"
      :bio="profile.bio"
      :stats
      followable
      locale="en-US"
      class="profile__card"
    />
    <div class="profile__main">
      <BlessAlert v-if="error" color="danger">{{ error }}</BlessAlert>
      <section aria-labelledby="profile-year" class="profile__year">
        <BlessText id="profile-year" as="h2" size="sm" weight="bold">The last year</BlessText>
        <BlessHeatmapCalendar
          :data="contributions"
          end="2026-11-22"
          :weeks="52"
          :week-start="1"
          unit="post"
          legend
          label="Posts per day"
          locale="en-US"
        />
      </section>
      <BlessTabs v-model="tab" :tabs label="Profile sections">
        <template #default="{ tab: t }">
          <BlessPortfolioGrid v-if="t.value === 'works'" :works />
          <BlessActivityFeed
            v-else-if="t.value === 'activity'"
            :events="activity"
            :now="now"
            locale="en-US"
          />
          <BlessAchievements v-else :achievements />
        </template>
      </BlessTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAchievements,
  BlessActivityFeed,
  BlessAlert,
  BlessHeatmapCalendar,
  BlessPortfolioGrid,
  BlessProfileCard,
  BlessTabs,
  BlessText,
} from "blessing-ui";
import { mockProfileApi } from "./api";
import { useProfile } from "./useProfile";

const { profile, works, activity, achievements, contributions, following, error, stats } =
  useProfile(mockProfileApi, "rina");
const now = Date.UTC(2026, 10, 22, 12);
const tabs = [
  { value: "works", label: "Works" },
  { value: "activity", label: "Activity" },
  { value: "badges", label: "Badges" },
];
const tab = ref("works");
</script>

<style scoped>
.profile {
  display: grid;
  grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
  gap: var(--bless-space-8);
  align-items: start;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.profile__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--bless-space-6);
}
.profile__year {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--bless-space-3);
}
@media (max-width: 760px) {
  .profile {
    grid-template-columns: minmax(0, 1fr);
    padding-inline: var(--bless-space-4);
  }
}
</style>
