import type { BlessTrend } from "blessing-ui";
import type { Person, Post } from "./domain";

export interface CommunityApi {
  feed(): Promise<Post[]>;
  trends(): Promise<BlessTrend[]>;
  people(): Promise<Person[]>;
  publish(post: Post): Promise<void>;
  vote(postId: number, option: string): Promise<void>;
}

/** offline adapter */
export const mockCommunityApi: CommunityApi = {
  async feed() {
    return [
      {
        id: 3,
        author: { name: "Megumi Kato", handle: "@megumi" },
        time: "2h",
        text: "The route map for chapter 3 is done. Thank you to everyone who play-tested last weekend.",
        reactions: [
          { emoji: "🎉", count: 31 },
          { emoji: "🌸", count: 12, active: true },
        ],
      },
      {
        id: 2,
        author: { name: "Eriri Spencer Sawamura", handle: "@eriri" },
        time: "5h",
        text: "Which cover should the next volume use? Vote by tonight.",
        poll: {
          question: "Which cover should the next volume use?",
          options: [
            { value: "a", label: "A: the hill at sunset", votes: 48 },
            { value: "b", label: "B: the club room", votes: 35 },
            { value: "c", label: "C: the train platform", votes: 22 },
          ],
        },
        reactions: [{ emoji: "🎨", count: 18 }],
      },
      {
        id: 1,
        author: { name: "Utaha Kasumigaoka", handle: "@utaha" },
        time: "1d",
        text: "Draft 4 of the script is in the shared folder. Read it before you comment.",
        reactions: [
          { emoji: "📖", count: 9 },
          { emoji: "😂", count: 4 },
        ],
      },
    ];
  },
  async trends() {
    return [
      {
        id: "1",
        topic: "#cherryblessing",
        category: "Games · Trending",
        posts: 15300,
        href: "#t1",
      },
      { id: "2", topic: "Comiket winter", category: "Events", posts: 8120, href: "#t2" },
      { id: "3", topic: "#routemap", category: "Game design", posts: 2110, href: "#t3" },
      { id: "4", topic: "Icy Tail live", category: "Music", posts: 960, href: "#t4" },
    ];
  },
  async people() {
    return [
      { name: "Michiru Hyodo", handle: "@michiru", followers: 2310, following: false },
      { name: "Izumi Hashima", handle: "@izumi", followers: 870, following: false },
      { name: "Iori Hashima", handle: "@iori", followers: 5400, following: true },
    ];
  },
  async publish() {},
  async vote() {},
};
