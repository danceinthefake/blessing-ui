<script setup lang="ts">
import {
  BlessAlert,
  BlessButton,
  BlessLessonVideo,
  BlessQuiz,
  BlessText,
  type BlessVideoNote,
} from "blessing-ui";
import { onMounted, ref } from "vue";
import type { Lesson } from "../domain";

/** focus: move focus to the title, when a person opened this lesson */
const props = defineProps<{ lesson: Lesson; next?: Lesson; focus?: boolean }>();
const notes = defineModel<BlessVideoNote[]>("notes", { default: () => [] });
const emit = defineEmits<{ pass: []; open: [id: string] }>();
const result = ref<"pass" | "fail">();
function scored(right: number, total: number) {
  result.value = right === total ? "pass" : "fail";
  if (result.value === "pass") emit("pass");
}
// the parent renders a new pane for each lesson; focus goes to its title
const heading = ref<{ $el: HTMLElement }>();
onMounted(() => props.focus && heading.value?.$el.focus());
</script>

<template>
  <main class="pane">
    <BlessText ref="heading" as="h3" size="lg" weight="bold" tabindex="-1" class="pane__title">{{
      lesson.title
    }}</BlessText>
    <BlessLessonVideo
      v-model="notes"
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      :title="lesson.title"
    />
    <section class="pane__check" aria-labelledby="course-check">
      <BlessText id="course-check" as="h4" size="sm" weight="bold"
        >Check what you learned</BlessText
      >
      <BlessQuiz :questions="lesson.quiz" @finish="scored" />
      <BlessAlert v-if="result === 'pass'" color="success" :dismissible="false" title="Lesson done">
        <template v-if="next">
          The next lesson is open.
          <BlessButton size="sm" variant="outline" @click="emit('open', next.id)">{{
            next.title
          }}</BlessButton>
        </template>
        <template v-else>You finished the course.</template>
      </BlessAlert>
      <BlessAlert
        v-else-if="result === 'fail'"
        color="warning"
        :dismissible="false"
        title="Not yet"
      >
        Watch the lesson again, then try the quiz once more.
      </BlessAlert>
    </section>
  </main>
</template>

<style scoped>
.pane,
.pane__check {
  display: grid;
  gap: var(--bless-space-3);
  min-width: 0;
}
.pane__title,
.pane__check h4 {
  margin: 0;
}
.pane__title:focus {
  outline: none;
}
.pane__check {
  margin-top: var(--bless-space-3);
}
</style>
