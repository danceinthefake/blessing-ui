import type { ChatMessage } from "./domain";

export interface ChatApi {
  history(): Promise<ChatMessage[]>;
  /** sends a message; resolves with the answer of the other person */
  send(text: string): Promise<string>;
}

/** offline adapter: a fixed thread and a canned answer after a short wait */
export const mockChatApi: ChatApi = {
  async history() {
    return [
      { id: 1, from: "them", text: "今日、部室来る？", time: "16:02" },
      { id: 2, from: "me", text: "行く。スクリプトの続き、詩羽先輩から来た？", time: "16:03" },
      { id: 3, from: "them", text: "来た。第3章、めっちゃ長い。", time: "16:03" },
    ];
  },
  async send() {
    await new Promise((r) => setTimeout(r, 1200));
    return "了解。";
  },
};
