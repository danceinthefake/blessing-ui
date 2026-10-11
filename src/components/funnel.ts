export interface BlessFunnelStage {
  label: string;
  value: number;
}

export interface FunnelRow extends BlessFunnelStage {
  /** bar width as a percent of the first stage, never below `floor` so a tiny stage stays visible */
  width: number;
  /** percent of the first stage that is left */
  ofFirst: number;
  /** percent of the previous stage that is left. `null` for the first stage. */
  ofPrev: number | null;
}

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);

/** The rows of a funnel: widths for the bars and the rates between stages. */
export function funnelRows(stages: BlessFunnelStage[], floor = 2): FunnelRow[] {
  const first = stages[0]?.value ?? 0;
  return stages.map((s, i) => ({
    ...s,
    width: Math.max(floor, Math.min(100, pct(s.value, first))),
    ofFirst: pct(s.value, first),
    ofPrev: i ? pct(s.value, stages[i - 1].value) : null,
  }));
}
