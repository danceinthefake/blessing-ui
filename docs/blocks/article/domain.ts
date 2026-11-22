import type { BlessRelatedArticle, BlessTocItem } from "blessing-ui";

/** a part of an article as the editor writes it. A note goes inline as `[^text]`, as in Pandoc */
export type Block =
  | { type: "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string; speaker?: string };

export interface Article {
  title: string;
  topic: string;
  summary: string;
  author: string;
  /** `YYYY-MM-DD` */
  date: string;
  blocks: Block[];
  related: BlessRelatedArticle[];
}

/** a part ready to show: headings with an id, paragraphs as text and note numbers */
export type Part =
  | { type: "h2" | "h3"; text: string; id: string }
  | { type: "p"; pieces: (string | number)[] }
  | { type: "quote"; text: string; speaker?: string };

/** an id from a heading, made unique with -2, -3 when two headings have the same words */
export function slug(text: string, used: Set<string>) {
  const base =
    text
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "part";
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

/** the parts to show, the notes in the order that they first show, and the table of contents */
export function prepare(blocks: Block[]) {
  const used = new Set<string>();
  const notes: string[] = [];
  const toc: BlessTocItem[] = [];
  const parts = blocks.map((b): Part => {
    if (b.type === "h2" || b.type === "h3") {
      const id = slug(b.text, used);
      toc.push({ id, label: b.text, level: b.type === "h2" ? 0 : 1 });
      return { ...b, id };
    }
    if (b.type === "quote") return b;
    const pieces = b.text.split(/\[\^([^\]]+)\]/).map((s, i) => {
      if (i % 2 === 0) return s;
      // the same note twice gets the same number
      const at = notes.indexOf(s);
      return at >= 0 ? at + 1 : notes.push(s);
    });
    return { type: "p", pieces: pieces.filter((p) => p !== "") };
  });
  return { parts, notes, toc };
}

/** the minutes to read the text at `wpm` words a minute, at least 1; notes do not count */
export function minutes(blocks: Block[], wpm = 230) {
  const words = blocks
    .map((b) => b.text.replace(/\[\^[^\]]+\]/g, ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
}
