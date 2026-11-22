import type { BlessModel } from "blessing-ui";
import { newTurn, type Chat, type ReplyEvent } from "./domain";

export interface AssistantApi {
  models(): Promise<BlessModel[]>;
  chats(): Promise<Chat[]>;
  /** the reply as a stream of events; aborting `signal` ends it */
  ask(question: string, model: string, signal: AbortSignal): AsyncIterable<ReplyEvent>;
  feedback(turn: string, rating: "good" | "bad", reason?: string): Promise<void>;
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Stopped", "AbortError"));
    });
  });

const SOURCES = [
  {
    title: "Returns and refunds",
    url: "https://help.example.com/returns",
    site: "help.example.com",
    snippet: "Items can go back within 30 days of delivery.",
  },
  {
    title: "Late shipments",
    url: "https://help.example.com/late",
    site: "help.example.com",
    snippet: "If a parcel is late, the shipping is refunded.",
  },
];

const done = (question: string, text: string) => ({
  ...newTurn(`t-${question.length}`, question),
  steps: [
    { id: 0, title: "Read the question", status: "done" as const },
    { id: 1, title: "Search the help center", status: "done" as const },
    { id: 2, title: "Write the answer", status: "done" as const },
  ],
  text,
  sources: SOURCES,
  state: "done" as const,
});

/** offline adapter — replace with a call to your model server that streams events */
export const mockAssistantApi: AssistantApi = {
  async models() {
    return [
      { id: "swift", name: "Swift", description: "Short answers, fast", speed: 3, cost: 1 },
      { id: "steady", name: "Steady", description: "Good for most questions", speed: 2, cost: 2 },
      {
        id: "deep",
        name: "Deep",
        description: "Thinks first, for hard questions",
        speed: 1,
        cost: 3,
        tags: ["thinks"],
      },
    ];
  },
  async chats() {
    return [
      {
        id: "c2",
        title: "Refund for a late parcel",
        time: "2026-11-21T15:20:00Z",
        turns: [
          done(
            "Do I get a refund for a late parcel?",
            "Yes. If a parcel arrives after the promised day, we refund the shipping. The items stay yours, and you can still return them within 30 days.",
          ),
        ],
      },
      {
        id: "c1",
        title: "Return window for sale items",
        time: "2026-11-12T09:05:00Z",
        turns: [
          done(
            "Can I return sale items?",
            "Yes. Sale items have the same 30 days as other items. Gift cards and opened earbuds cannot go back.",
          ),
        ],
      },
    ];
  },
  async *ask(question, model, signal) {
    if (model === "deep") {
      for (const part of [
        "The question is about ",
        "the store's rules. ",
        "The help center has them, ",
        "so I search it first.",
      ]) {
        await wait(150, signal);
        yield { type: "thinking", text: part };
      }
      yield { type: "thought", seconds: 2 };
    }
    yield {
      type: "plan",
      steps: ["Read the question", "Search the help center", "Write the answer"],
    };
    yield { type: "step", index: 0, status: "done" };
    yield { type: "step", index: 1, status: "running" };
    const tool = { id: "search", name: "search_help", input: { query: question } };
    yield { type: "tool", tool: { ...tool, status: "running" } };
    await wait(700, signal);
    yield {
      type: "tool",
      tool: {
        ...tool,
        status: "done",
        summary: "2 articles",
        output: SOURCES.map((s) => s.title),
      },
    };
    yield { type: "step", index: 1, status: "done" };
    yield { type: "step", index: 2, status: "running" };
    const answer = `Here is what the help center says. Items can go back within 30 days of delivery, and the label is free. If a parcel arrives late, we refund the shipping as well. Ask me about a single order, and I can check its dates.`;
    for (const word of answer.split(/(?<= )/)) {
      await wait(40, signal);
      yield { type: "text", text: word };
    }
    yield { type: "step", index: 2, status: "done" };
    yield { type: "sources", sources: SOURCES };
    yield { type: "done" };
  },
  async feedback() {
    await wait(200);
  },
};
