import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** parts that a public component renders for itself; they are not exported, so not registered */
export const internalComponents = [
  "BlessMenuList",
  "BlessOrgChartNode",
  "BlessQueryGroup",
  "BlessTreeItem",
];

/**
 * Every public component of the package, read from the built files next to this one, so the list
 * cannot drift from what ships. Node only: the resolver and the Nuxt module run in the build.
 */
export function blessComponents(): string[] {
  // not new URL("./components/", import.meta.url): the bundler would inline that as an asset
  return readdirSync(join(dirname(fileURLToPath(import.meta.url)), "components"))
    .map((f) => /^(Bless[A-Za-z0-9]+)\.js$/.exec(f)?.[1])
    .filter((n): n is string => !!n && !internalComponents.includes(n));
}

/** each component is imported from its own file, which also pulls in only its CSS */
export const componentPath = (name: string) => `blessing-ui/components/${name}`;
