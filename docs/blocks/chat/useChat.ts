import { ref } from "vue";
import { now, type ChatMessage } from "./domain";

/** local thread with a canned reply — swap the reply for your transport */
export function useChat() {
  const messages = ref<ChatMessage[]>([
    { id: 1, from: "them", text: "今日、部室来る？", time: "16:02" },
    { id: 2, from: "me", text: "行く。スクリプトの続き、詩羽先輩から来た？", time: "16:03" },
    { id: 3, from: "them", text: "来た。第3章、めっちゃ長い。", time: "16:03" },
  ]);
  const draft = ref("");
  const typing = ref(false);
  let seq = 3;
  function send() {
    const text = draft.value.trim();
    if (!text) return;
    messages.value.push({ id: ++seq, from: "me", text, time: now() });
    draft.value = "";
    typing.value = true;
    setTimeout(() => {
      typing.value = false;
      messages.value.push({ id: ++seq, from: "them", text: "了解。", time: now() });
    }, 1200);
  }
  return { messages, draft, typing, send };
}
