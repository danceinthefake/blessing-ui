<template>
  <div class="course">
    <aside class="course__path">
      <BlessText as="p" size="xs" muted class="course__kicker">Blessing Software Academy</BlessText>
      <BlessText as="h2" size="md" weight="bold" class="course__name"
        >Make your first visual novel</BlessText
      >
      <BlessLessonPath :lessons @select="open" />
    </aside>
    <LessonPane
      v-if="lesson"
      :key="lesson.id"
      v-model:notes="notes[lesson.id]"
      :lesson
      :next
      :focus="!first"
      @pass="pass"
      @open="open"
    />
  </div>
</template>

<script setup lang="ts">
import { BlessLessonPath, BlessText, type BlessVideoNote } from "blessing-ui";
import { computed, onMounted, ref } from "vue";
import { mockCourseApi } from "./api";
import { canOpen, current, type Lesson } from "./domain";
import LessonPane from "./parts/LessonPane.vue";

const lessons = ref<Lesson[]>([]);
const openId = ref<string>();
const first = ref(true);
onMounted(async () => {
  lessons.value = await mockCourseApi.lessons();
  openId.value = current(lessons.value)?.id;
});
const at = computed(() => lessons.value.findIndex((l) => l.id === openId.value));
const lesson = computed(() => lessons.value[at.value]);
const next = computed(() => lessons.value[at.value + 1]);
// notes are kept per lesson
const notes = ref<Record<string, BlessVideoNote[]>>({});

function open(id: string) {
  if (!canOpen(lessons.value, id)) return;
  first.value = false;
  openId.value = id;
}
async function pass() {
  const l = lesson.value;
  if (!l || l.done) return;
  l.done = true;
  await mockCourseApi.complete(l.id);
}
</script>

<style scoped>
.course {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(0, 2.4fr);
  gap: var(--bless-space-6);
  padding: var(--bless-space-6);
  align-items: start;
}
.course__path {
  display: grid;
  gap: var(--bless-space-3);
  min-width: 0;
}
.course__kicker,
.course__name {
  margin: 0;
}
@media (max-width: 760px) {
  .course {
    grid-template-columns: minmax(0, 1fr);
    padding: var(--bless-space-4);
  }
}
</style>
