// Sankey layout: nodes in columns by the longest path from a start, heights by flow, and each link
// as a band from its source to its target. Pixel units, so text in the SVG is never stretched.

export interface BlessSankeyLink {
  source: string;
  target: string;
  value: number;
}
export interface BlessSankeyNode {
  id: string;
  /** shown next to the node; default: the id */
  label?: string;
  /** a token name (`chart-2`…) or any CSS color */
  color?: string;
}

export interface LaidNode {
  id: string;
  label: string;
  color?: string;
  index: number;
  col: number;
  value: number;
  x: number;
  y: number;
  h: number;
}
export interface LaidLink extends BlessSankeyLink {
  /** the closed band */
  d: string;
  from: LaidNode;
  to: LaidNode;
}

export function layoutSankey(
  links: BlessSankeyLink[],
  nodes: BlessSankeyNode[],
  width: number,
  height: number,
  nodeWidth = 12,
  gap = 12,
): { nodes: LaidNode[]; links: LaidLink[] } {
  const live = links.filter((l) => l.value > 0 && l.source !== l.target);
  const byId = new Map<string, LaidNode>();
  const add = (id: string) => {
    if (byId.has(id)) return;
    const n = nodes.find((x) => x.id === id);
    byId.set(id, {
      id,
      label: n?.label ?? id,
      color: n?.color,
      index: byId.size,
      col: 0,
      value: 0,
      x: 0,
      y: 0,
      h: 0,
    });
  };
  // the order of `nodes` first, then the order the links name them
  nodes.forEach((n) => live.some((l) => l.source === n.id || l.target === n.id) && add(n.id));
  live.forEach((l) => (add(l.source), add(l.target)));
  const all = [...byId.values()];

  // column = the longest path from a start; a cycle stops after one pass per node
  for (let pass = 0; pass < all.length; pass++) {
    let moved = false;
    for (const l of live) {
      const s = byId.get(l.source)!;
      const t = byId.get(l.target)!;
      if (t.col < s.col + 1) ((t.col = s.col + 1), (moved = true));
    }
    if (!moved) break;
  }
  const last = Math.max(0, ...all.map((n) => n.col));
  // an end goes to the last column, so all results line up on the right
  for (const n of all) if (!live.some((l) => l.source === n.id)) n.col = last;

  const sum = (id: string, key: "source" | "target") =>
    live.filter((l) => l[key] === id).reduce((a, l) => a + l.value, 0);
  for (const n of all) n.value = Math.max(sum(n.id, "source"), sum(n.id, "target"));

  const cols = Array.from({ length: last + 1 }, (_, c) => all.filter((n) => n.col === c));
  const g = Math.min(gap, ...cols.map((c) => (height * 0.5) / Math.max(1, c.length - 1)));
  const ky = Math.min(
    ...cols.map((c) => (height - (c.length - 1) * g) / (c.reduce((a, n) => a + n.value, 0) || 1)),
  );
  for (const c of cols) {
    const used = c.reduce((a, n) => a + n.value * ky, 0) + (c.length - 1) * g;
    let y = (height - used) / 2;
    for (const n of c) {
      n.h = Math.max(1, n.value * ky);
      n.y = y;
      n.x = last ? (n.col * (width - nodeWidth)) / last : 0;
      y += n.h + g;
    }
  }

  // bands leave a source in the order of their targets, and enter a target in the order of sources
  const bands = live.map((l) => ({
    l,
    from: byId.get(l.source)!,
    to: byId.get(l.target)!,
    w: l.value * ky,
    y0: 0,
    y1: 0,
  }));
  const next = new Map(all.map((n) => [n.id, n.y]));
  for (const b of [...bands].sort((p, q) => p.to.y - q.to.y || p.from.y - q.from.y)) {
    b.y0 = next.get(b.from.id)!;
    next.set(b.from.id, b.y0 + b.w);
  }
  next.clear();
  for (const n of all) next.set(n.id, n.y);
  for (const b of [...bands].sort((p, q) => p.from.y - q.from.y || p.to.y - q.to.y)) {
    b.y1 = next.get(b.to.id)!;
    next.set(b.to.id, b.y1 + b.w);
  }
  const r = (n: number) => Math.round(n * 10) / 10;
  return {
    nodes: all,
    links: bands.map(({ l, from, to, w, y0, y1 }) => {
      const x0 = from.x + nodeWidth;
      const x1 = to.x;
      const xm = (x0 + x1) / 2;
      const d =
        `M${r(x0)},${r(y0)}C${r(xm)},${r(y0)} ${r(xm)},${r(y1)} ${r(x1)},${r(y1)}` +
        `L${r(x1)},${r(y1 + w)}C${r(xm)},${r(y1 + w)} ${r(xm)},${r(y0 + w)} ${r(x0)},${r(y0 + w)}Z`;
      return { source: l.source, target: l.target, value: l.value, d, from, to };
    }),
  };
}
