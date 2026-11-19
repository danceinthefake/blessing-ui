import type { BlessGanttTask, BlessSharePerson } from "blessing-ui";
import type { Board } from "./domain";

export interface ProjectApi {
  board(): Promise<Board>;
  plan(): Promise<BlessGanttTask[]>;
  people(): Promise<BlessSharePerson[]>;
}

/** offline adapter */
export const mockProjectApi: ProjectApi = {
  async board() {
    return [
      {
        id: "todo",
        title: "To do",
        items: [
          {
            id: 1,
            title: "Write the ending of route B",
            assignee: "Utaha Kasumigaoka",
            tag: "Script",
          },
          { id: 2, title: "Pick the opening song", assignee: "Michiru Hyodo", tag: "Music" },
          { id: 3, title: "Test the save menu", assignee: "Megumi Kato" },
        ],
      },
      {
        id: "doing",
        title: "Doing",
        limit: 2,
        items: [
          {
            id: 4,
            title: "Draw the event art for chapter 3",
            assignee: "Eriri Spencer Sawamura",
            tag: "Art",
          },
          { id: 5, title: "Fix the text speed setting", assignee: "Tomoya Aki" },
        ],
      },
      {
        id: "done",
        title: "Done",
        items: [{ id: 6, title: "Route map for chapter 3", assignee: "Megumi Kato" }],
      },
    ];
  },
  async plan() {
    return [
      { id: "script", label: "Script", start: "2026-11-02", end: "2026-11-20", progress: 70 },
      { id: "art", label: "Event art", start: "2026-11-09", end: "2026-11-27", progress: 40 },
      { id: "music", label: "Music", start: "2026-11-16", end: "2026-11-30", progress: 10 },
      {
        id: "test",
        label: "Play test",
        start: "2026-12-01",
        end: "2026-12-07",
        after: ["script", "art", "music"],
      },
      { id: "ship", label: "Master up", start: "2026-12-10", end: "2026-12-10", after: ["test"] },
    ];
  },
  async people() {
    return [
      { id: "1", name: "Tomoya Aki", email: "tomoya@example.com", role: "owner" },
      { id: "2", name: "Megumi Kato", email: "megumi@example.com", role: "edit" },
      { id: "3", name: "Eriri Spencer Sawamura", email: "eriri@example.com", role: "edit" },
      { id: "4", name: "Utaha Kasumigaoka", email: "utaha@example.com", role: "comment" },
    ];
  },
};
