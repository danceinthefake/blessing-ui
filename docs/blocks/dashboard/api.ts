import type { Overview, Period } from "./domain";

export interface DashboardApi {
  overview(days: Period): Promise<Overview>;
}

/** offline adapter: a short wait, so the loading state shows */
export const mockDashboardApi: DashboardApi = {
  async overview(days) {
    await new Promise((r) => setTimeout(r, 400));
    const k = days / 30;
    return {
      stats: [
        {
          label: "Revenue",
          value: Math.round(1_284_000 * k),
          delta: days === 7 ? 0.08 : 0.12,
          format: "currency",
        },
        { label: "Orders", value: Math.round(3_421 * k), delta: days === 7 ? -0.02 : 0.04 },
        { label: "Conversion", value: 0.037, delta: -0.006, format: "percent" },
        { label: "Active users", value: Math.round(18_902 * (days === 7 ? 0.4 : 1)), delta: 0.21 },
      ],
      trend: Array.from({ length: days }, (_, i) => ({
        d: i + 1,
        v: Math.round(60 + 25 * Math.sin(i / 4) + i * 1.5),
      })),
      orders: [
        { id: "#4821", customer: "加藤 恵", status: "paid", total: "¥12,800" },
        { id: "#4820", customer: "澤村 英梨々", status: "pending", total: "¥3,300" },
        { id: "#4819", customer: "霞ヶ丘 詩羽", status: "paid", total: "¥38,500" },
        { id: "#4818", customer: "氷堂 美智留", status: "refunded", total: "¥1,980" },
      ],
    };
  },
};
