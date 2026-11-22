import type { BlessTicketPriority, BlessTicketStatus } from "blessing-ui";
import type { Message, Ticket } from "./domain";

export interface SupportApi {
  tickets(): Promise<Ticket[]>;
  reply(id: string, body: string, internal: boolean): Promise<Message>;
  setStatus(id: string, status: BlessTicketStatus): Promise<void>;
  setPriority(id: string, priority: BlessTicketPriority): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
let seq = 0;
const ask = (id: string, from: string, at: string, body: string): Message => ({
  id,
  from,
  role: "customer",
  at,
  body,
});

/** offline adapter — replace with calls to your help desk */
export const mockSupportApi: SupportApi = {
  async tickets() {
    await wait(200);
    return [
      {
        id: "t41",
        number: "2041",
        subject: "My card was charged twice",
        customer: { name: "Rina Wulandari", email: "rina.w@mail.example" },
        priority: "urgent",
        status: "open",
        created: "2026-11-23T02:50:00Z",
        messages: [
          ask(
            "a",
            "Rina Wulandari",
            "2026-11-23T02:50:00Z",
            "I paid for order #10460 and my bank shows two payments of Rp 135,000.",
          ),
        ],
      },
      {
        id: "t40",
        number: "2040",
        subject: "Wrong tea in my box",
        customer: { name: "Dimas Pratama", email: "dimas@mail.example" },
        priority: "high",
        status: "open",
        created: "2026-11-21T07:00:00Z",
        messages: [
          ask(
            "b",
            "Dimas Pratama",
            "2026-11-21T07:00:00Z",
            "I ordered oolong, but the box has ginger tea.",
          ),
          {
            id: "c",
            from: "Bayu",
            role: "note",
            at: "2026-11-21T08:00:00Z",
            body: "Packing mixed up A-01-2 and A-02-1 on Saturday. Check the other weekend orders.",
          },
        ],
      },
      {
        id: "t39",
        number: "2039",
        subject: "Can I change my address?",
        customer: { name: "Ayu Setiawan", email: "ayu@mail.example" },
        priority: "normal",
        status: "pending",
        created: "2026-11-20T09:00:00Z",
        messages: [
          ask(
            "d",
            "Ayu Setiawan",
            "2026-11-20T09:00:00Z",
            "I moved last week. Can you send order #10449 to my new address?",
          ),
          {
            id: "e",
            from: "Sari",
            role: "agent",
            at: "2026-11-20T09:30:00Z",
            body: "Yes, we can. What is the new address?",
          },
        ],
      },
      {
        id: "t38",
        number: "2038",
        subject: "Do you ship to Singapore?",
        customer: { name: "Ken Tan", email: "ken@mail.example" },
        priority: "low",
        status: "open",
        created: "2026-11-19T03:00:00Z",
        messages: [
          ask("f", "Ken Tan", "2026-11-19T03:00:00Z", "I want to send a gift box to my sister."),
        ],
      },
      {
        id: "t35",
        number: "2035",
        subject: "A note in the gift box",
        customer: { name: "Lia Hartono", email: "lia@mail.example" },
        priority: "normal",
        status: "solved",
        created: "2026-11-17T02:00:00Z",
        messages: [
          ask(
            "g",
            "Lia Hartono",
            "2026-11-17T02:00:00Z",
            "Can you put a card with my words in the box?",
          ),
          {
            id: "h",
            from: "Sari",
            role: "agent",
            at: "2026-11-17T03:00:00Z",
            body: "Of course. Write the words here, and we print them on the card.",
          },
        ],
      },
    ];
  },
  async reply(_id, body, internal) {
    await wait(300);
    return {
      id: `r${++seq}`,
      from: "Sari",
      role: internal ? "note" : "agent",
      at: "2026-11-23T03:30:00Z",
      body,
    };
  },
  async setStatus() {
    await wait(150);
  },
  async setPriority() {
    await wait(150);
  },
};
