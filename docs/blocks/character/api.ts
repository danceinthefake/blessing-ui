import type { Character } from "./domain";

export interface CharacterApi {
  list(): Promise<Character[]>;
}

/** offline adapter — colours stand in for key art */
export const mockCharacterApi: CharacterApi = {
  async list() {
    return [
      {
        id: "megumi",
        name: "加藤 恵",
        reading: "Kato Megumi",
        role: "メインヒロイン",
        cv: "安野希世乃",
        color: "#e85078",
        bio: "同じクラスの、目立たない女の子。",
      },
      {
        id: "eriri",
        name: "澤村・スペンサー・英梨々",
        reading: "Sawamura Spencer Eriri",
        role: "原画",
        cv: "大西沙織",
        color: "#c8e018",
        bio: "幼馴染で美術部。人気同人作家。",
      },
      {
        id: "utaha",
        name: "霞ヶ丘 詩羽",
        reading: "Kasumigaoka Utaha",
        role: "シナリオ",
        cv: "茅野愛衣",
        color: "#e03028",
        bio: "一学年上の先輩。現役ライトノベル作家。",
      },
      {
        id: "michiru",
        name: "氷堂 美智留",
        reading: "Hyodo Michiru",
        role: "音楽",
        cv: "矢作紗友里",
        color: "#b878b0",
        bio: "従姉。バンドをやっている。",
      },
      {
        id: "izumi",
        name: "波島 出海",
        reading: "Hashima Izumi",
        role: "原画（後輩）",
        cv: "赤﨑千夏",
        color: "#4090d0",
        bio: "中学時代の後輩。同人サークルで活動。",
      },
      {
        id: "tomoya",
        name: "安芸 倫也",
        reading: "Aki Tomoya",
        role: "プロデューサー",
        cv: "松岡禎丞",
        color: "#5870f8",
        bio: "サークルの発起人。",
      },
    ];
  },
};
