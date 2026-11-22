import type { BlessAchievement, BlessActivity, BlessWork } from "blessing-ui";

export interface Profile {
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  followers: number;
  following: number;
  works: number;
  followedByMe: boolean;
}
export interface ProfileApi {
  profile(handle: string): Promise<Profile>;
  works(handle: string): Promise<BlessWork[]>;
  activity(handle: string): Promise<BlessActivity[]>;
  achievements(handle: string): Promise<BlessAchievement[]>;
  /** posts per day, by YYYY-MM-DD */
  contributions(handle: string): Promise<Record<string, number>>;
  /** throws when the server refuses */
  follow(handle: string, on: boolean): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const art = (emoji: string, color: string, w = 600, h = 450) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#${color}"/><text x="50%" y="54%" font-size="${Math.min(w, h) / 2}" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`)}`;
const day = (back: number) =>
  new Date(Date.UTC(2026, 10, 22) - back * 86_400_000).toISOString().slice(0, 10);

/** offline adapter — replace with calls to your API */
export const mockProfileApi: ProfileApi = {
  async profile(handle) {
    return {
      name: "Rina Kusuma",
      handle,
      avatar: art("🌸", "f3d9e0", 160, 160),
      cover: art("", "dbe7f4", 1200, 300),
      bio: "Illustrator in Bandung. I draw the covers of Circle Hanamichi, and I post a sketch most days.",
      followers: 1284,
      following: 211,
      works: 6,
      followedByMe: false,
    };
  },
  async works() {
    const w = (
      id: string,
      title: string,
      kind: string,
      emoji: string,
      color: string,
      year: number,
    ) => ({
      id,
      title,
      kind,
      year,
      image: art(emoji, color),
      imageAlt: title,
      href: "#",
    });
    return [
      w("1", "Spring cover", "Covers", "🌸", "f3d9e0", 2026),
      w("2", "Night market", "Illustration", "🏮", "f3e3cf", 2026),
      w("3", "Rain study", "Sketches", "🌧️", "dbe7f4", 2026),
      w("4", "Summer cover", "Covers", "🌻", "f6efc9", 2025),
      w("5", "Cat café", "Illustration", "🐈", "e6e6e6", 2025),
      w("6", "Hands", "Sketches", "✋", "efe3da", 2025),
    ];
  },
  async activity() {
    const me = { name: "Rina Kusuma" };
    const at = (back: number, h: number) => Date.UTC(2026, 10, 22 - back, h);
    return [
      { id: 1, actor: me, action: "posted", target: "Rain study", href: "#", time: at(0, 3) },
      { id: 2, actor: me, action: "earned the badge", target: "30-day streak", time: at(0, 2) },
      {
        id: 3,
        actor: me,
        action: "commented on",
        target: "Lantern, issue 4",
        href: "#",
        time: at(1, 9),
      },
      { id: 4, actor: me, action: "posted", target: "Night market", href: "#", time: at(3, 11) },
    ];
  },
  async achievements() {
    return [
      {
        id: "streak",
        title: "30-day streak",
        description: "Post 30 days in a row.",
        icon: "🔥",
        earned: "2026-11-22",
      },
      {
        id: "first",
        title: "First post",
        description: "Post your first work.",
        icon: "✏️",
        earned: "2025-02-03",
      },
      {
        id: "fans",
        title: "1,000 followers",
        description: "Reach 1,000 followers.",
        icon: "⭐",
        earned: "2026-09-14",
      },
      {
        id: "cover",
        title: "Ten covers",
        description: "Post ten covers.",
        icon: "📚",
        progress: [2, 10],
      },
    ];
  },
  async contributions() {
    const out: Record<string, number> = {};
    for (let i = 0; i < 365; i++) {
      const n = (i * 7 + (i % 5) * 3) % 9;
      if (n > 2) out[day(i)] = n - 2;
    }
    return out;
  },
  async follow() {
    await wait(400);
    if (!navigator.onLine) throw new Error("offline");
  },
};
