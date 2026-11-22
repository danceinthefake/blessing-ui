import type { ApiKey, AuditEntry, Delivery, Webhook } from "./domain";

export interface DevelopersApi {
  load(): Promise<{ keys: ApiKey[]; webhook: Webhook; deliveries: Delivery[]; log: AuditEntry[] }>;
  createKey(name: string, scopes: string[]): Promise<ApiKey>;
  /** a new secret for the key; the old one stops working */
  rollKey(id: string): Promise<string>;
  revokeKey(id: string): Promise<void>;
  saveWebhook(hook: Webhook): Promise<void>;
  /** sends a sample event to the webhook and resolves to the delivery */
  sendTest(event: string): Promise<Delivery>;
  /** sends a delivery again */
  redeliver(id: string): Promise<Delivery>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const secret = () =>
  "shop_live_" +
  Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 24);
const body = (event: string, id: string) => ({ id, type: event, data: { order: "10442" } });

/** offline adapter — replace with calls to your developer API */
export const mockDevelopersApi: DevelopersApi = {
  async load() {
    await wait(200);
    return {
      keys: [
        {
          id: "k1",
          name: "Warehouse sync",
          value: "shop_live_4f9a1c22be07d5e3a8c16f02",
          scopes: ["orders:read", "orders:write"],
          created: "2026-08-03",
          lastUsed: "2026-11-22",
        },
      ],
      webhook: { url: "https://ops.tokosenja.example/hooks", events: ["order.paid"] },
      deliveries: [
        {
          id: "d2",
          event: "order.paid",
          status: 503,
          time: "2026-11-22 09:41",
          duration: 10_000,
          request: body("order.paid", "evt_2"),
          response: "Service Unavailable",
        },
        {
          id: "d1",
          event: "order.paid",
          status: 200,
          time: "2026-11-22 08:12",
          duration: 182,
          request: body("order.paid", "evt_1"),
          response: { ok: true },
        },
      ],
      log: [
        {
          id: "a1",
          who: "Rina",
          when: "2026-08-03T10:20:00",
          action: "created",
          target: "the key Warehouse sync",
        },
      ],
    };
  },
  async createKey(name, scopes) {
    await wait(400);
    return { id: `k${Date.now()}`, name, scopes, value: secret(), created: "2026-11-22" };
  },
  async rollKey() {
    await wait(400);
    return secret();
  },
  async revokeKey() {
    await wait(400);
  },
  async saveWebhook() {
    await wait(400);
  },
  async sendTest(event) {
    await wait(500);
    const id = `d${Date.now()}`;
    return {
      id,
      event,
      status: 200,
      time: "2026-11-22 10:05",
      duration: 164,
      request: body(event, `evt_${id}`),
      response: { ok: true },
    };
  },
  async redeliver(id) {
    await wait(600);
    // the endpoint is back up, so the second try gets through
    return {
      id,
      event: "order.paid",
      status: 200,
      time: "2026-11-22 10:06",
      duration: 201,
      request: body("order.paid", "evt_2"),
      response: { ok: true },
    };
  },
};
