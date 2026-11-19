import type { Lesson } from "./domain";

export interface CourseApi {
  lessons(): Promise<Lesson[]>;
  complete(id: string): Promise<void>;
}

/** offline adapter */
export const mockCourseApi: CourseApi = {
  async lessons() {
    return [
      {
        id: "premise",
        title: "Write the premise",
        meta: "6 min",
        done: true,
        quiz: [
          {
            question: "What does a premise say?",
            choices: ["Who wants what, and what is in the way", "The price of the game"],
            answer: 0,
          },
        ],
      },
      {
        id: "heroine",
        title: "Design the heroine",
        meta: "9 min",
        quiz: [
          {
            question: "What makes a heroine more than a type?",
            choices: ["A big hair ribbon", "A want that the player did not expect", "More scenes"],
            answer: 1,
            explain: "A type is a costume. A want that surprises the player makes her a person.",
          },
          {
            question: "Who should see her first sketch?",
            choices: ["Only the artist", "The whole circle"],
            answer: 1,
          },
        ],
      },
      {
        id: "routes",
        title: "Branch the routes",
        meta: "12 min",
        quiz: [
          {
            question: "Where should the first branch come?",
            choices: ["In the first scene", "After the player knows the cast"],
            answer: 1,
          },
        ],
      },
      {
        id: "music",
        title: "Add music and sound",
        meta: "8 min",
        quiz: [
          {
            question: "When should the music stop?",
            choices: ["Never", "When a scene needs silence to land"],
            answer: 1,
          },
        ],
      },
      {
        id: "ship",
        title: "Test and ship",
        meta: "10 min",
        quiz: [
          {
            question: "Who should play-test the game?",
            choices: ["Only the circle", "People who never saw it"],
            answer: 1,
          },
        ],
      },
    ];
  },
  async complete() {},
};
