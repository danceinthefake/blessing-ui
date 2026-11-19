import type { BlessKanbanColumn } from "blessing-ui";

export interface Task {
  id: number;
  title: string;
  assignee: string;
  tag?: string;
}
export type Board = BlessKanbanColumn<Task>[];

/** cards in the last column, out of all cards */
export function done(board: Board) {
  const total = board.reduce((n, c) => n + c.items.length, 0);
  return { done: board.at(-1)?.items.length ?? 0, total };
}
