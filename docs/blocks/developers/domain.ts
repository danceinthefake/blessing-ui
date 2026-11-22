export interface ApiKey {
  id: string;
  name: string;
  /** the secret; a real server returns it only once, when the key is made */
  value: string;
  scopes: string[];
  created: string;
  lastUsed?: string;
}

export interface Webhook {
  url: string;
  events: string[];
}

export interface Delivery {
  id: string;
  event: string;
  status?: number;
  time: string;
  duration?: number;
  request?: unknown;
  response?: unknown;
}

export interface AuditEntry {
  id: string;
  who: string;
  when: string;
  action: "created" | "updated" | "deleted" | "viewed";
  target: string;
  changes?: { field: string; from?: string; to?: string }[];
}

export const SCOPES = [
  { value: "orders:read", label: "Read orders" },
  { value: "orders:write", label: "Change orders" },
  { value: "customers:read", label: "Read customers" },
];
export const EVENTS = [
  { value: "order.paid", label: "An order is paid" },
  { value: "order.shipped", label: "An order ships" },
  { value: "refund.created", label: "A refund starts" },
];

/** the problem with a new key name, or "" */
export function checkKeyName(name: string, keys: ApiKey[]) {
  const n = name.trim();
  if (!n) return "Give the key a name, for example the app that uses it.";
  if (keys.some((k) => k.name.toLowerCase() === n.toLowerCase()))
    return `A key named ${n} exists. Use another name.`;
  return "";
}

/** the problem with a webhook address, or "". Only public https addresses can get events */
export function checkUrl(url: string) {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return "Type a full address, for example https://shop.example.com/hooks.";
  }
  if (u.protocol !== "https:") return "The address must start with https://.";
  if (/^(localhost|127\.|10\.|192\.168\.)/.test(u.hostname) || u.hostname.endsWith(".local"))
    return "We cannot reach a local address. Use a public one.";
  return "";
}

/** a short form of a key for the log: the start and the last four letters */
export const shortKey = (value: string) => `${value.slice(0, 8)}…${value.slice(-4)}`;
