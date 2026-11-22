import type { BlessChapter, BlessCue } from "blessing-ui";

export interface Episode {
  id: string;
  number: number;
  title: string;
  summary: string;
  /** the length, in seconds */
  seconds: number;
  /** how far you listened, in seconds */
  heard: number;
  /** the transcript, as WebVTT */
  transcript: string;
  /** the chapters, as WebVTT: each cue is one chapter */
  chapters: string;
}

/** "01:02.500" or "1:01:02.500" as seconds */
const seconds = (stamp: string) => stamp.split(":").reduce((n, part) => n * 60 + Number(part), 0);

/**
 * The cues of a WebVTT file (W3C WebVTT): a block with "start --> end" and its text. A voice tag,
 * `<v Sari>`, gives the speaker. Other tags are dropped.
 */
export function parseVtt(text: string): BlessCue[] {
  const cues: BlessCue[] = [];
  for (const block of text.replace(/\r/g, "").split(/\n{2,}/)) {
    const lines = block.trim().split("\n");
    const at = lines.findIndex((l) => l.includes("-->"));
    if (at < 0) continue;
    const [start, end] = lines[at].split("-->").map((s) => seconds(s.trim().split(/\s/)[0]));
    const body = lines.slice(at + 1).join(" ");
    const speaker = /<v(?:\.[^\s>]+)?\s+([^>]+)>/.exec(body)?.[1].trim();
    cues.push({ start, end, text: body.replace(/<[^>]+>/g, "").trim(), speaker });
  }
  return cues;
}

/** the chapters of a WebVTT chapter file: the text of each cue is the title */
export const parseChapters = (text: string): BlessChapter[] =>
  parseVtt(text).map((c) => ({ start: c.start, title: c.text }));

/** where to start: where you stopped, or at 0 when you heard nearly all of it */
export const resumeAt = (e: Pick<Episode, "heard" | "seconds">) =>
  e.heard >= e.seconds * 0.95 ? 0 : e.heard;
