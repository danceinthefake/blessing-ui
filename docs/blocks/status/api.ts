import type { Incident, Maintenance, Part, Update } from "./domain";

export interface StatusData {
  parts: Part[];
  incidents: Incident[];
  maintenance: Maintenance[];
  /** when the states were checked, an ISO time */
  checked: string;
}

export interface StatusApi {
  load(): Promise<StatusData>;
  /** emails the address when the state of one of the parts changes */
  subscribe(email: string, parts: string[]): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const parts: Part[] = [
  {
    id: "web",
    name: "Website",
    description: "The shop and the product pages",
    since: "2026-01-10",
  },
  { id: "checkout", name: "Checkout", since: "2026-01-10" },
  { id: "pay", name: "Card payments", since: "2026-01-10" },
  { id: "search", name: "Search", since: "2026-01-10" },
  { id: "mail", name: "Order emails", since: "2026-11-01" },
];

const closed: Incident[] = [
  {
    id: "i4",
    title: "Search is slow",
    impact: "minor",
    parts: ["search"],
    start: "2026-11-19T07:00:00Z",
    end: "2026-11-19T09:30:00Z",
    updates: [
      { status: "resolved", at: "2026-11-19T09:30:00Z", text: "Search is fast again." },
      { status: "identified", at: "2026-11-19T07:40:00Z", text: "A full index rebuild runs." },
      { status: "investigating", at: "2026-11-19T07:05:00Z", text: "Results take 8 seconds." },
    ],
  },
  {
    id: "i3",
    title: "Checkout does not open",
    impact: "critical",
    parts: ["checkout", "pay"],
    start: "2026-11-12T13:05:00Z",
    end: "2026-11-12T13:52:00Z",
    updates: [
      {
        status: "resolved",
        at: "2026-11-12T13:52:00Z",
        text: "We undid the release. Checkout works.",
      },
      { status: "identified", at: "2026-11-12T13:20:00Z", text: "A release broke the cart page." },
      {
        status: "investigating",
        at: "2026-11-12T13:08:00Z",
        text: "Checkout shows an error page.",
      },
    ],
  },
  {
    id: "i2",
    title: "Order emails are late",
    impact: "minor",
    parts: ["mail"],
    start: "2026-11-05T01:00:00Z",
    end: "2026-11-05T04:00:00Z",
    updates: [
      { status: "resolved", at: "2026-11-05T04:00:00Z", text: "All late emails went out." },
      {
        status: "investigating",
        at: "2026-11-05T01:10:00Z",
        text: "Emails arrive up to 2 hours late.",
      },
    ],
  },
  {
    id: "i1",
    title: "The website is down",
    impact: "major",
    parts: ["web"],
    start: "2026-10-28T22:10:00Z",
    end: "2026-10-28T22:40:00Z",
    updates: [
      { status: "resolved", at: "2026-10-28T22:40:00Z", text: "The host is back." },
      { status: "investigating", at: "2026-10-28T22:12:00Z", text: "Our host has an outage." },
    ],
  },
];

// the open incident gets one more update at each check, so Refresh shows it move on
const script: { checked: string; update?: Update; end?: string }[] = [
  { checked: "2026-11-22T03:15:00Z" },
  {
    checked: "2026-11-22T03:24:00Z",
    update: {
      status: "monitoring",
      at: "2026-11-22T03:22:00Z",
      text: "The bank fixed its gateway. We watch the payments.",
    },
  },
  {
    checked: "2026-11-22T03:47:00Z",
    update: { status: "resolved", at: "2026-11-22T03:45:00Z", text: "Card payments work again." },
    end: "2026-11-22T03:45:00Z",
  },
];
const open: Incident = {
  id: "i5",
  title: "Card payments fail for some banks",
  impact: "major",
  parts: ["pay", "checkout"],
  start: "2026-11-22T02:40:00Z",
  updates: [
    {
      status: "identified",
      at: "2026-11-22T02:58:00Z",
      text: "The gateway of one bank refuses cards. Other banks work.",
    },
    { status: "investigating", at: "2026-11-22T02:42:00Z", text: "Some card payments fail." },
  ],
};
let step = 0;

/** offline adapter — replace with calls to your status service */
export const mockStatusApi: StatusApi = {
  async load() {
    await wait(300);
    const now = script[Math.min(step++, script.length - 1)];
    if (now.update && open.updates[0].status !== now.update.status)
      open.updates = [now.update, ...open.updates];
    if (now.end) open.end = now.end;
    return {
      parts,
      incidents: [structuredClone(open), ...closed],
      maintenance: [
        {
          id: "m1",
          title: "Database upgrade",
          parts: ["checkout", "pay"],
          start: "2026-11-24T18:00:00Z",
          end: "2026-11-24T19:00:00Z",
          text: "Checkout can be slow for a few minutes.",
        },
      ],
      checked: now.checked,
    };
  },
  async subscribe() {
    await wait(400);
  },
};
