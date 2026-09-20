import type { NewsItem } from "./domain";

export interface NewsApi {
  list(): Promise<NewsItem[]>;
}

/** offline adapter — replace with a fetch to your CMS */
export const mockNewsApi: NewsApi = {
  async list() {
    const today = new Date().toISOString().slice(0, 10);
    return [
      {
        id: "1",
        date: today,
        category: "news",
        title: "Blu-ray Disc BOX 発売決定！TVシリーズ全25話収録",
        href: "#",
      },
      {
        id: "2",
        date: "2026-09-01",
        category: "event",
        title: "スペシャルイベント 開催決定",
        href: "#",
      },
      { id: "3", date: "2026-08-20", category: "goods", title: "新作グッズ 受注開始", href: "#" },
      { id: "4", date: "2026-08-04", category: "onair", title: "再放送スケジュール", href: "#" },
      { id: "5", date: "2026-07-15", category: "news", title: "公式サイトリニューアル" },
    ];
  },
};
