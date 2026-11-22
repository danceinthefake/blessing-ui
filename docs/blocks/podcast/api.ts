import type { Episode } from "./domain";

export interface PodcastApi {
  episodes(): Promise<Episode[]>;
  /** the address of the audio of an episode */
  source(id: string): Promise<string>;
  /** keeps how far you listened, so another device starts there */
  saveProgress(id: string, seconds: number): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// a quiet tone of the right length, made in the browser, so the block needs no audio file
function tone(length: number, hz: number) {
  const rate = 8000;
  const n = rate * length;
  const v = new DataView(new ArrayBuffer(44 + n));
  const str = (o: number, s: string) =>
    [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF");
  v.setUint32(4, 36 + n, true);
  str(8, "WAVEfmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  str(36, "data");
  v.setUint32(40, n, true);
  for (let i = 0; i < n; i++)
    v.setUint8(44 + i, 128 + Math.round(6 * Math.sin((2 * Math.PI * hz * i) / rate)));
  return URL.createObjectURL(new Blob([v.buffer], { type: "audio/wav" }));
}

const vtt = (cues: [string, string, string][]) =>
  "WEBVTT\n\n" + cues.map(([a, b, t]) => `${a} --> ${b}\n${t}`).join("\n\n");

const episodes: Episode[] = [
  {
    id: "e12",
    number: 12,
    title: "Pricing a bundle",
    summary: "Sari and Bayu put three teas in one box and argue about the price.",
    seconds: 150,
    heard: 0,
    chapters: vtt([
      ["00:00.000", "00:40.000", "Why a bundle"],
      ["00:40.000", "01:35.000", "The cost of the box"],
      ["01:35.000", "02:30.000", "The price that we picked"],
    ]),
    transcript: vtt([
      ["00:02.000", "00:12.000", "<v Sari>This week we sell three teas in one box."],
      [
        "00:12.000",
        "00:24.000",
        "<v Bayu>And the question is: is the box cheaper than three teas?",
      ],
      ["00:24.000", "00:40.000", "<v Sari>A little. People buy a bundle to save, but not much."],
      [
        "00:40.000",
        "01:00.000",
        "<v Bayu>The box costs us 6,000 rupiah, and the card inside 1,500.",
      ],
      [
        "01:00.000",
        "01:35.000",
        "<v Sari>So the bundle must earn that back before it saves anything.",
      ],
      ["01:35.000", "02:05.000", "<v Bayu>We picked 135,000. Three teas alone are 150,000."],
      ["02:05.000", "02:30.000", "<v Sari>Ten percent off. Next week we tell you if it sold."],
    ]),
  },
  {
    id: "e11",
    number: 11,
    title: "The first hire",
    summary: "What to give away first when the shop gets too big for two people.",
    seconds: 120,
    heard: 54,
    chapters: vtt([
      ["00:00.000", "00:50.000", "Too much work"],
      ["00:50.000", "02:00.000", "Packing first"],
    ]),
    transcript: vtt([
      ["00:03.000", "00:20.000", "<v Bayu>Last month we packed until midnight four times."],
      ["00:20.000", "00:50.000", "<v Sari>That is the sign. Not the money, the midnight."],
      ["00:50.000", "01:20.000", "<v Bayu>We gave away the packing first. It is easy to teach."],
      [
        "01:20.000",
        "02:00.000",
        "<v Sari>And we kept the emails. People write to us, not to a shop.",
      ],
    ]),
  },
  {
    id: "e10",
    number: 10,
    title: "Packing that ships",
    summary: "Three boxes went to the same town. One came back broken. Why?",
    seconds: 180,
    heard: 180,
    chapters: vtt([
      ["00:00.000", "01:00.000", "The broken jar"],
      ["01:00.000", "03:00.000", "Paper, not plastic"],
    ]),
    transcript: vtt([
      ["00:02.000", "00:30.000", "<v Sari>One jar of honey broke on the way to Bandung."],
      ["00:30.000", "01:00.000", "<v Bayu>It had space to move. That is all it takes."],
      ["01:00.000", "02:00.000", "<v Sari>Now we fill each box with paper until nothing moves."],
      ["02:00.000", "03:00.000", "<v Bayu>Paper costs less than plastic, and people like it more."],
    ]),
  },
];
const urls = new Map<string, string>();

/** offline adapter — replace with calls to your podcast host */
export const mockPodcastApi: PodcastApi = {
  async episodes() {
    await wait(200);
    return structuredClone(episodes);
  },
  async source(id) {
    const e = episodes.find((x) => x.id === id)!;
    if (!urls.has(id)) urls.set(id, tone(e.seconds, 180 + e.number * 10));
    return urls.get(id)!;
  },
  async saveProgress(id, seconds) {
    episodes.find((x) => x.id === id)!.heard = seconds;
  },
};
