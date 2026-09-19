import type { BlessMenuItem } from "blessing-ui";

export const menu: BlessMenuItem[] = [
  { type: "label", label: "Heroine" },
  { label: "New project", shortcut: "⌘N", value: "new", icon: "＋" },
  { label: "Open…", shortcut: "⌘O", value: "open" },
  { label: "Locked", value: "lock", disabled: true },
  { type: "separator" },
  { type: "checkbox", label: "Show grid", value: "grid" },
  { type: "checkbox", label: "Snap", value: "snap" },
  { type: "separator" },
  { type: "radio", label: "Small", value: "s", group: "size" },
  { type: "radio", label: "Large", value: "l", group: "size" },
  {
    type: "sub",
    label: "Share",
    items: [
      { label: "Twitter", value: "tw" },
      { label: "Copy link", value: "cp", shortcut: "⌘C" },
      { type: "sub", label: "More", items: [{ label: "Deep item", value: "deep" }] },
    ],
  },
  { type: "separator" },
  { label: "Delete", value: "del", danger: true, shortcut: "⌫" },
];
