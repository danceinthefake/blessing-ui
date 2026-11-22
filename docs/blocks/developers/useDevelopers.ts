import { onMounted, ref } from "vue";
import type { DevelopersApi } from "./api";
import {
  checkKeyName,
  checkUrl,
  shortKey,
  type ApiKey,
  type AuditEntry,
  type Delivery,
  type Webhook,
} from "./domain";

/** API keys, the webhook and its deliveries, and a log of each change. `now` gives the time */
export function useDevelopers(api: DevelopersApi, who: string, now: () => string) {
  const keys = ref<ApiKey[]>([]);
  const webhook = ref<Webhook>({ url: "", events: [] });
  const deliveries = ref<Delivery[]>([]);
  const log = ref<AuditEntry[]>([]);
  const loaded = ref(false);
  onMounted(async () => {
    const d = await api.load();
    keys.value = d.keys;
    webhook.value = d.webhook;
    deliveries.value = d.deliveries;
    log.value = d.log;
    loaded.value = true;
  });
  const note = (e: Omit<AuditEntry, "id" | "who" | "when">) =>
    log.value.unshift({ id: `a${Date.now()}`, who, when: now(), ...e });

  /** resolves to the problem, or to the new key */
  async function createKey(name: string, scopes: string[]) {
    const problem =
      checkKeyName(name, keys.value) || (scopes.length ? "" : "Pick at least one scope.");
    if (problem) return problem;
    const key = await api.createKey(name.trim(), scopes);
    keys.value.push(key);
    note({ action: "created", target: `the key ${key.name}` });
    return key;
  }
  async function rollKey(id: string) {
    const key = keys.value.find((k) => k.id === id)!;
    const old = key.value;
    key.value = await api.rollKey(id);
    note({
      action: "updated",
      target: `the key ${key.name}`,
      changes: [{ field: "secret", from: shortKey(old), to: shortKey(key.value) }],
    });
  }
  async function revokeKey(id: string) {
    await api.revokeKey(id);
    const key = keys.value.find((k) => k.id === id)!;
    keys.value = keys.value.filter((k) => k.id !== id);
    note({ action: "deleted", target: `the key ${key.name}` });
  }

  /** resolves to the problem, or "" when saved */
  async function saveWebhook(next: Webhook) {
    const problem =
      checkUrl(next.url) || (next.events.length ? "" : "Pick at least one event to send.");
    if (problem) return problem;
    const before = webhook.value;
    await api.saveWebhook(next);
    webhook.value = { ...next, url: next.url.trim() };
    const changes = [
      ...(before.url !== webhook.value.url
        ? [{ field: "address", from: before.url, to: webhook.value.url }]
        : []),
      ...(before.events.join() !== next.events.join()
        ? [{ field: "events", from: before.events.join(", "), to: next.events.join(", ") }]
        : []),
    ];
    if (changes.length) note({ action: "updated", target: "the webhook", changes });
    return "";
  }

  const retrying = ref<string[]>([]);
  async function sendTest() {
    deliveries.value.unshift(await api.sendTest(webhook.value.events[0]));
  }
  async function redeliver(id: string | number) {
    const key = String(id);
    retrying.value.push(key);
    const d = await api.redeliver(key);
    deliveries.value = deliveries.value.map((x) => (x.id === key ? d : x));
    retrying.value = retrying.value.filter((x) => x !== key);
  }

  return {
    loaded,
    keys,
    webhook,
    deliveries,
    log,
    createKey,
    rollKey,
    revokeKey,
    saveWebhook,
    retrying,
    sendTest,
    redeliver,
  };
}
