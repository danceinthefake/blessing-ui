import { onMounted, ref } from "vue";
import { now, type ChatMessage } from "./domain";
import type { ChatApi } from "./api";

/** the thread, the draft, and sending; the api is the only way out */
export function useChat(api: ChatApi) {
  const messages = ref<ChatMessage[]>([]);
  const draft = ref("");
  const typing = ref(false);
  onMounted(async () => (messages.value = await api.history()));
  const nextId = () => Math.max(0, ...messages.value.map((m) => m.id)) + 1;
  async function send() {
    const text = draft.value.trim();
    if (!text) return;
    messages.value.push({ id: nextId(), from: "me", text, time: now() });
    draft.value = "";
    typing.value = true;
    const answer = await api.send(text);
    typing.value = false;
    messages.value.push({ id: nextId(), from: "them", text: answer, time: now() });
  }
  return { messages, draft, typing, send };
}
