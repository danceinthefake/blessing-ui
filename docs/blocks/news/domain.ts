export interface NewsItem {
  id: string;
  date: string; // ISO
  category: "news" | "goods" | "event" | "onair";
  title: string;
  href?: string;
}

/** "2019-04-04" → "2019.04.04" */
export const fmtDate = (iso: string) => iso.replaceAll("-", ".");

/** newer than `days` counts as NEW! */
export const isNew = (iso: string, now = new Date(), days = 14) =>
  (now.getTime() - new Date(iso).getTime()) / 86_400_000 <= days;

export const byNewest = (a: NewsItem, b: NewsItem) => b.date.localeCompare(a.date);
