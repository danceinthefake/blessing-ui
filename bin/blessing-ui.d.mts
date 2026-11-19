export function add(
  names: string[],
  options: { dir: string; from?: string; force?: boolean },
): { copied: string[]; skipped: string[]; packages: string[] };
