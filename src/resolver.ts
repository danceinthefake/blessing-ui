import { blessComponents, componentPath } from "./components";

/**
 * Auto-import for unplugin-vue-components:
 * `Components({ resolvers: [BlessingUiResolver()] })`. Write `<BlessButton>` with no import.
 */
export function BlessingUiResolver() {
  let names: Set<string> | undefined;
  return {
    type: "component" as const,
    resolve(name: string) {
      names ??= new Set(blessComponents());
      if (!names.has(name)) return;
      return { name: "default", from: componentPath(name), sideEffects: "blessing-ui/tokens.css" };
    },
  };
}
