import type { BlessEmailDraft, BlessMailbox } from "blessing-ui";

export interface Mail {
  id: number;
  from: BlessMailbox;
  to: BlessMailbox[];
  cc?: BlessMailbox[];
  subject: string;
  preview: string;
  body: string;
  /** as text, for the list */
  time: string;
  /** as text, for the open mail */
  date: string;
  unread: boolean;
  tag?: string;
}

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** "Re: " once, whatever the mail app of the sender put in front: Re, Fwd, AW, WG */
export const reSubject = (subject: string) =>
  `Re: ${subject.replace(/^\s*((re|fwd?|aw|wg)\s*:\s*)+/i, "")}`;

/** the old mail under a reply, each line after "> " */
export const quote = (m: Mail) =>
  `\n\n${m.date}, ${m.from.name}:\n${m.body
    .split("\n")
    .map((l) => (l ? `> ${l}` : ">"))
    .join("\n")}`;

/**
 * A reply: to the sender, or for "reply to all" also to the other people on the mail. You are
 * never on it, and each address is on it once. A reply to your own mail goes to its recipients.
 */
export function replyDraft(m: Mail, me: string, all: boolean): BlessEmailDraft {
  const mine = same(m.from.email, me);
  const to = mine ? m.to.map((x) => x.email).filter((e) => !same(e, me)) : [m.from.email];
  const seen = new Set([me, ...to].map((x) => x.toLowerCase()));
  const others = all ? [...(mine ? [] : m.to), ...(m.cc ?? [])].map((x) => x.email) : [];
  const cc = others.filter((e) => !seen.has(e.toLowerCase()) && seen.add(e.toLowerCase()));
  return { to, cc, subject: reSubject(m.subject), body: quote(m) };
}
