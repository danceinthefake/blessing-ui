import type { BlessQualityResult } from "blessing-ui";
import type { Job } from "./domain";

export interface StationApi {
  job(): Promise<Job>;
  report(unit: BlessQualityResult, passed: boolean): Promise<void>;
  stop(reason: string, note: string): Promise<void>;
}

/** offline adapter: a press line for limited-edition game boxes */
export const mockStationApi: StationApi = {
  async job() {
    return {
      order: {
        number: "WO-2026-0118",
        product: "Cherry Blessing, limited box",
        target: 120,
        station: "Packing line 1",
        due: "19 Nov, 17:00",
        state: "running",
        good: 117,
        scrap: 2,
      },
      steps: [
        {
          title: "Check the parts",
          body: "Lay out one box, one disc case, one art book, and one sticker sheet.",
        },
        {
          title: "Pack the disc",
          body: "Put the disc case in the left slot, label up.",
          caution: "Hold the case by its edges. A print on the label is a scrap.",
        },
        {
          title: "Add the book and the stickers",
          body: "The art book goes in the right slot. The sticker sheet goes on top.",
        },
        { title: "Close the box", body: "Close the lid and press the seal along all four edges." },
      ],
      checks: [
        { id: "weight", label: "Box weight", min: 640, max: 660, unit: "g" },
        { id: "seal", label: "Seal closed on all four edges" },
        { id: "print", label: "No marks on the cover" },
      ],
      reasons: [
        { id: "jam", label: "Sealer jam", icon: "⛔" },
        { id: "material", label: "No boxes", icon: "📦" },
        { id: "quality", label: "Quality hold", icon: "🔍" },
        { id: "break", label: "Break", icon: "☕", planned: true },
      ],
    };
  },
  async report() {},
  async stop() {},
};
