import type { BlessSource } from "blessing-ui";

export type StepStatus = "pending" | "running" | "done" | "failed" | "skipped";

export interface Tool {
  id: string;
  name: string;
  status: "running" | "done" | "error";
  summary?: string;
  input?: unknown;
  output?: unknown;
}

/** one question and the reply to it */
export interface Turn {
  id: string;
  question: string;
  thinking: string;
  /** seconds of thinking, when it ended */
  thought?: number;
  steps: { id: number; title: string; status: StepStatus }[];
  tools: Tool[];
  text: string;
  sources: BlessSource[];
  state: "running" | "done" | "stopped" | "failed";
  error?: string;
}

export interface Chat {
  id: string;
  title: string;
  time: string;
  turns: Turn[];
}

/** the parts of a reply, in the order the server sends them */
export type ReplyEvent =
  | { type: "thinking"; text: string }
  | { type: "thought"; seconds: number }
  | { type: "plan"; steps: string[] }
  | { type: "step"; index: number; status: StepStatus }
  | { type: "tool"; tool: Tool }
  | { type: "text"; text: string }
  | { type: "sources"; sources: BlessSource[] }
  | { type: "done" };

export const newTurn = (id: string, question: string): Turn => ({
  id,
  question,
  thinking: "",
  steps: [],
  tools: [],
  text: "",
  sources: [],
  state: "running",
});

/** the turn after one event. Text comes in parts; a tool with a known id is replaced */
export function apply(t: Turn, e: ReplyEvent): Turn {
  switch (e.type) {
    case "thinking":
      return { ...t, thinking: t.thinking + e.text };
    case "thought":
      return { ...t, thought: e.seconds };
    case "plan":
      return { ...t, steps: e.steps.map((title, id) => ({ id, title, status: "pending" })) };
    case "step":
      return {
        ...t,
        steps: t.steps.map((s) => (s.id === e.index ? { ...s, status: e.status } : s)),
      };
    case "tool": {
      const known = t.tools.some((x) => x.id === e.tool.id);
      return {
        ...t,
        tools: known ? t.tools.map((x) => (x.id === e.tool.id ? e.tool : x)) : [...t.tools, e.tool],
      };
    }
    case "text":
      return { ...t, text: t.text + e.text };
    case "sources":
      return { ...t, sources: e.sources };
    case "done":
      return { ...t, state: "done" };
  }
}

/** the turn when the reply ends early: what did not finish is skipped, and a running tool fails */
export function halt(t: Turn, state: "stopped" | "failed", error?: string): Turn {
  return {
    ...t,
    state,
    error,
    steps: t.steps.map((s) =>
      s.status === "running" || s.status === "pending" ? { ...s, status: "skipped" } : s,
    ),
    tools: t.tools.map((x) =>
      x.status === "running" ? { ...x, status: "error", summary: "Stopped" } : x,
    ),
  };
}

/** a chat title from its first question: the first six words */
export function titleOf(question: string) {
  const words = question.trim().split(/\s+/);
  return words.slice(0, 6).join(" ") + (words.length > 6 ? "…" : "");
}
