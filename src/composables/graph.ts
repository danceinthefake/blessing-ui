export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

export const edgeKey = (e: Pick<GraphEdge, "from" | "to">) => `${e.from}->${e.to}`;

/** True when `target` can be reached from `start` by following edges forward. */
export function reaches(edges: readonly GraphEdge[], start: string, target: string): boolean {
  const seen = new Set<string>();
  const walk = (id: string): boolean => {
    if (id === target) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return edges.some((e) => e.from === id && walk(e.to));
  };
  return walk(start);
}

/** Why `from -> to` cannot be added, or null when it can. */
export function linkProblem(
  edges: readonly GraphEdge[],
  from: string,
  to: string,
  acyclic = false,
): "self" | "exists" | "cycle" | null {
  if (from === to) return "self";
  if (edges.some((e) => e.from === from && e.to === to)) return "exists";
  if (acyclic && reaches(edges, to, from)) return "cycle";
  return null;
}

/** A smooth S-curve from an output port at `a` to an input port at `b`. */
export function edgePath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const dx = Math.max(48, Math.abs(b.x - a.x) / 2);
  return `M${a.x} ${a.y}C${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}`;
}

export const snapTo = (v: number, grid: number) => (grid > 0 ? Math.round(v / grid) * grid : v);
