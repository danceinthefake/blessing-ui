import type { BlessCommandItem } from "blessing-ui";

export const commands: BlessCommandItem[] = [
  {
    label: "New project",
    value: "new",
    group: "File",
    shortcut: "⌘N",
    icon: "＋",
    keywords: ["create"],
  },
  { label: "Open recent…", value: "open", group: "File", shortcut: "⌘O" },
  { label: "Save all", value: "save", group: "File", shortcut: "⌥⌘S" },
  { label: "Toggle sidebar", value: "sidebar", group: "View", shortcut: "⌘B" },
  { label: "Toggle theme", value: "theme", group: "View", disabled: true },
  { label: "Zoom in", value: "zoomin", group: "View", shortcut: "⌘+" },
  {
    label: "Go to character…",
    value: "chara",
    group: "Navigate",
    keywords: ["heroine", "megumi", "eriri"],
  },
  { label: "Go to news", value: "news", group: "Navigate" },
];
