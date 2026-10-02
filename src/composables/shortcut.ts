const MODS = ["Ctrl", "Alt", "Shift", "Meta"] as const;
const NAMES: Record<string, string> = {
  " ": "Space",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Escape: "Esc",
  Delete: "Del",
};

/** is this key just a modifier being held? */
export const isModifierKey = (e: Pick<KeyboardEvent, "key">) =>
  ["Control", "Alt", "Shift", "Meta", "AltGraph", "OS"].includes(e.key);

/**
 * The combo a key event stands for, e.g. `Ctrl+Shift+K`, modifiers in a fixed order. Letters and
 * digits come from the physical key (`code`), so Shift+1 is `Shift+1`, not `Shift+!`.
 * Returns `null` while only modifiers are down.
 */
export function shortcutFromEvent(
  e: Pick<KeyboardEvent, "key" | "code" | "ctrlKey" | "altKey" | "shiftKey" | "metaKey">,
): string | null {
  if (isModifierKey(e)) return null;
  const m = /^(?:Key|Digit)(.)$/.exec(e.code);
  const key = m ? m[1]! : (NAMES[e.key] ?? (e.key.length === 1 ? e.key.toUpperCase() : e.key));
  const held = [e.ctrlKey && "Ctrl", e.altKey && "Alt", e.shiftKey && "Shift", e.metaKey && "Meta"];
  return [...MODS.filter((_, i) => held[i]), key].join("+");
}

/** does `e` press exactly the combo `combo`? */
export const matchShortcut = (combo: string, e: KeyboardEvent) => shortcutFromEvent(e) === combo;

/** the parts of a combo, for display: `"Ctrl+K"` → `["Ctrl", "K"]` (a literal "+" key survives) */
export const splitShortcut = (combo: string) =>
  combo.endsWith("++") ? [...combo.slice(0, -2).split("+").filter(Boolean), "+"] : combo.split("+");
