import type { BlessLesson, BlessQuizQuestion } from "blessing-ui";

export interface Lesson extends BlessLesson {
  quiz: BlessQuizQuestion[];
}

/** the lesson to open: the first one that is not done, or the last one */
export const current = (lessons: Lesson[]) => lessons.find((l) => !l.done) ?? lessons.at(-1);

/** a lesson can open when it is done or when it is the current one */
export const canOpen = (lessons: Lesson[], id: string) => {
  const i = lessons.findIndex((l) => l.id === id);
  return i >= 0 && lessons.slice(0, i).every((l) => l.done);
};
