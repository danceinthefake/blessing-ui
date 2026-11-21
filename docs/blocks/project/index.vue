<template>
  <div class="project">
    <BlessToolbar class="project__bar">
      <template #start>
        <BlessText as="h2" size="lg" weight="bold" class="project__title"
          >Cherry Blessing</BlessText
        >
      </template>
      <template #end>
        <BlessAvatarGroup :items="people.map((p) => ({ name: p.name }))" :max="3" size="sm" />
        <BlessButton size="sm" variant="outline" @click="sharing = true">Share</BlessButton>
      </template>
    </BlessToolbar>
    <BlessProgress
      :value="count.done"
      :max="count.total || 1"
      label="Tasks done"
      show-value
      :format="(v, m) => `${v} of ${m}`"
      class="project__progress"
    />

    <BlessTabs v-model="tab" :tabs label="Views">
      <template #default="{ tab: t }">
        <BlessKanban
          v-if="t.value === 'board'"
          v-model="board"
          :row-key="(x: Task) => x.id"
          label="Tasks"
          class="project__board"
        >
          <template #card="{ item }">
            <div class="project__card">
              <span>{{ (item as Task).title }}</span>
              <span class="project__meta">
                <BlessBadge v-if="(item as Task).tag" color="text" variant="outline">{{
                  (item as Task).tag
                }}</BlessBadge>
                <BlessAvatar :name="(item as Task).assignee" size="xs" />
              </span>
            </div>
          </template>
        </BlessKanban>
        <BlessGantt v-else v-model:tasks="plan" from="2026-11-02" to="2026-12-13" label="Plan" />
      </template>
    </BlessTabs>

    <BlessModal v-model="sharing" title="Share Cherry Blessing">
      <BlessShareAccess
        v-model:people="people"
        v-model:link-access="linkAccess"
        link="https://example.com/projects/cherry-blessing"
        @invite="invite"
      />
    </BlessModal>
  </div>
</template>

<script setup lang="ts">
import {
  BlessAvatar,
  BlessAvatarGroup,
  BlessBadge,
  BlessButton,
  BlessGantt,
  BlessKanban,
  BlessModal,
  BlessProgress,
  BlessShareAccess,
  BlessTabs,
  BlessText,
  BlessToolbar,
  type BlessAccessRole,
  type BlessGanttTask,
  type BlessSharePerson,
} from "blessing-ui";
import { computed, onMounted, ref } from "vue";
import { mockProjectApi } from "./api";
import { done, type Board, type Task } from "./domain";

const board = ref<Board>([]);
const plan = ref<BlessGanttTask[]>([]);
const people = ref<BlessSharePerson[]>([]);
onMounted(async () => {
  [board.value, plan.value, people.value] = await Promise.all([
    mockProjectApi.board(),
    mockProjectApi.plan(),
    mockProjectApi.people(),
  ]);
});
const count = computed(() => done(board.value));
const tab = ref("board");
const tabs = [
  { value: "board", label: "Board" },
  { value: "timeline", label: "Timeline" },
];
const sharing = ref(false);
const linkAccess = ref<"restricted" | BlessAccessRole>("restricted");
const invite = (email: string, role: BlessAccessRole) =>
  people.value.push({ id: email, name: email.split("@")[0]!, email, role });
</script>

<style scoped>
.project {
  display: grid;
  gap: var(--bless-space-4);
  padding: var(--bless-space-6);
}
/* a grid item is as wide as its content by default; the board scrolls inside instead */
.project > * {
  min-width: 0;
}
.project__bar {
  flex-wrap: wrap;
  gap: var(--bless-space-3);
}
.project__title {
  margin: 0;
}
.project__card {
  display: grid;
  gap: var(--bless-space-2);
}
.project__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.project__board {
  overflow-x: auto;
}
@media (max-width: 700px) {
  .project {
    padding: var(--bless-space-4);
  }
}
</style>
