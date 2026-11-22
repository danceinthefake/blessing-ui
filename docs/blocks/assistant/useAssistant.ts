import { computed, onMounted, ref, shallowRef } from "vue";
import type { BlessModel } from "blessing-ui";
import type { AssistantApi } from "./api";
import { apply, halt, newTurn, titleOf, type Chat } from "./domain";

/** the chats, the open chat, and a reply that streams in and can be stopped. `now` is an ISO time */
export function useAssistant(api: AssistantApi, now: () => string) {
  const models = ref<BlessModel[]>([]);
  const model = ref("steady");
  const chats = ref<Chat[]>([]);
  const openId = ref<string>();
  onMounted(async () => {
    [models.value, chats.value] = await Promise.all([api.models(), api.chats()]);
  });
  const chat = computed(() => chats.value.find((c) => c.id === openId.value));
  const turns = computed(() => chat.value?.turns ?? []);

  const controller = shallowRef<AbortController>();
  const busy = computed(() => !!controller.value);

  /** ask in the open chat; with no open chat, start one named after the question */
  async function ask(question: string, replace?: string) {
    if (busy.value || !question.trim()) return;
    let c = chat.value;
    if (!c) {
      c = { id: `c${Date.now()}`, title: titleOf(question), time: now(), turns: [] };
      chats.value = [c, ...chats.value];
      openId.value = c.id;
      c = chats.value[0];
    }
    const id = replace ?? `t${Date.now()}`;
    const at = replace ? c.turns.findIndex((t) => t.id === replace) : c.turns.length;
    c.turns[at] = newTurn(id, question);
    c.time = now();
    const ctl = new AbortController();
    controller.value = ctl;
    try {
      for await (const e of api.ask(question, model.value, ctl.signal))
        c.turns[at] = apply(c.turns[at], e);
    } catch (e) {
      c.turns[at] = ctl.signal.aborted
        ? halt(c.turns[at], "stopped")
        : halt(c.turns[at], "failed", "The assistant did not answer. Try again.");
    } finally {
      controller.value = undefined;
    }
  }
  const stop = () => controller.value?.abort();
  const retry = (turnId: string) => {
    const t = turns.value.find((x) => x.id === turnId);
    if (t) ask(t.question, t.id);
  };

  function newChat() {
    stop();
    openId.value = undefined;
  }
  function open(id: string | number) {
    stop();
    openId.value = String(id);
  }
  function rename(id: string | number, title: string) {
    const c = chats.value.find((x) => x.id === id);
    if (c) c.title = title;
  }
  function remove(id: string | number) {
    if (openId.value === id) newChat();
    chats.value = chats.value.filter((c) => c.id !== id);
  }
  const feedback = (turnId: string, rating: "good" | "bad", reason?: string) =>
    api.feedback(turnId, rating, reason);

  return {
    models,
    model,
    chats,
    openId,
    turns,
    busy,
    ask,
    stop,
    retry,
    newChat,
    open,
    rename,
    remove,
    feedback,
  };
}
