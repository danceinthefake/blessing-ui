import type { BlessFlashcard } from "blessing-ui";

/** a card with its Leitner box (Leitner, 1972): a card that you know moves up and waits longer */
export interface Card extends BlessFlashcard {
  id: string;
  deck: string;
  /** 1 (new or missed) to 5 (learned) */
  box: number;
  /** the day to see it again, `YYYY-MM-DD` */
  due: string;
}

/** the days to wait before the next review, for each box */
export const WAIT = [0, 1, 2, 4, 8, 16];
export const LAST = 5;

const DAY = 86_400_000;
export const addDays = (d: string, n: number) =>
  new Date(Date.parse(`${d}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);

/**
 * The card after an answer. Only the first try of a day counts: a card that you know goes up one
 * box, and a card that you miss goes back to box 1 for tomorrow.
 */
export function review(c: Card, know: boolean, first: boolean, today: string): Card {
  if (!first) return c;
  const box = know ? Math.min(LAST, c.box + 1) : 1;
  return { ...c, box, due: addDays(today, WAIT[box]) };
}

/** the cards of a deck to see today, the lowest box first */
export const dueCards = (cards: Card[], deck: string, today: string) =>
  cards.filter((c) => c.deck === deck && c.due <= today).sort((a, b) => a.box - b.box);

/** the first day after today that a card of the deck is due */
export const nextDue = (cards: Card[], deck: string, today: string) =>
  cards
    .filter((c) => c.deck === deck && c.due > today)
    .map((c) => c.due)
    .sort()[0];

/** how many cards of the deck are in each box, box 1 first */
export const perBox = (cards: Card[], deck: string) =>
  Array.from(
    { length: LAST },
    (_, i) => cards.filter((c) => c.deck === deck && c.box === i + 1).length,
  );
