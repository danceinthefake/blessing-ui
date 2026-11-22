// Types and pure rules of a file tree. No Vue here.
export interface Node {
  id: string;
  name: string;
  /** the folder that holds it; "root" for the top */
  parent: string;
  folder?: boolean;
  size?: number;
  modified?: string;
}
export const ROOT = "root";

export const childrenOf = (nodes: Node[], folder: string) =>
  nodes.filter((n) => n.parent === folder);

/** the folders from the top to `folder`, for the path bar */
export function pathTo(nodes: Node[], folder: string) {
  const out: { id: string; label: string }[] = [];
  for (let id = folder; id !== ROOT;) {
    const n = nodes.find((x) => x.id === id);
    if (!n) break;
    out.unshift({ id: n.id, label: n.name });
    id = n.parent;
  }
  return [{ id: ROOT, label: "My files" }, ...out];
}

/** what is wrong with a new name, or "" */
export function nameProblem(nodes: Node[], parent: string, name: string, self?: string) {
  const n = name.trim();
  if (!n) return "Write a name.";
  if (/[\\/:*?"<>|]/.test(n)) return 'A name cannot have \\ / : * ? " < > or |.';
  if (
    childrenOf(nodes, parent).some((x) => x.id !== self && x.name.toLowerCase() === n.toLowerCase())
  )
    return `This folder already has an item named ${n}.`;
  return "";
}

/** every node under `id`, and `id` itself, so a deleted folder takes its contents with it */
export function subtree(nodes: Node[], id: string): string[] {
  return [id, ...childrenOf(nodes, id).flatMap((c) => subtree(nodes, c.id))];
}

export const usedBytes = (nodes: Node[]) => nodes.reduce((n, x) => n + (x.size ?? 0), 0);
