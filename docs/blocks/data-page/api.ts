import type { Member } from "./domain";

export interface MemberApi {
  list(): Promise<Member[]>;
}

/** offline adapter */
export const mockMemberApi: MemberApi = {
  async list() {
    const names = [
      "加藤 恵",
      "澤村 英梨々",
      "霞ヶ丘 詩羽",
      "氷堂 美智留",
      "波島 出海",
      "安芸 倫也",
      "波島 伊織",
      "紅坂 朱音",
      "町田 苑子",
      "橋本 恵",
    ];
    return names.map((name, i) => ({
      id: i + 1,
      name,
      email: `user${i + 1}@example.com`,
      role: i === 5 ? "Owner" : i < 3 ? "Admin" : "Member",
      status: (["active", "active", "invited", "active", "suspended"] as const)[i % 5],
      joined: `2026-0${(i % 9) + 1}-1${i % 10}`,
    }));
  },
};
