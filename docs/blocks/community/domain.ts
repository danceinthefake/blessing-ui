import type { BlessNewPost, BlessPollOption, BlessReaction } from "blessing-ui";

export interface Author {
  name: string;
  handle: string;
}
export interface Post {
  id: number;
  author: Author;
  /** as text, for example "2h" */
  time: string;
  text: string;
  poll?: { question: string; options: BlessPollOption[]; voted?: string };
  reactions: BlessReaction[];
}
export interface Person extends Author {
  followers: number;
  following: boolean;
}

/** a new post from the composer; a poll takes the first line of the text as its question */
export function toPost(p: BlessNewPost, author: Author, id: number): Post {
  const text = p.text.trim();
  return {
    id,
    author,
    time: "now",
    text,
    poll: p.poll?.length
      ? {
          question: text.split("\n")[0],
          options: p.poll.map((label, i) => ({ value: String(i), label, votes: 0 })),
        }
      : undefined,
    reactions: [],
  };
}
