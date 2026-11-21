<template>
  <BlessTree
    class="bless-filetree"
    :nodes
    :label
    :selected
    @select="(n, p) => ((selected = n.id ?? p), emit('select', n.id ?? p, !!n.children))"
  />
</template>

<script lang="ts">
import type { BlessTreeNode } from "./tree";

const ICONS: [RegExp, string][] = [
  [/\.(png|jpe?g|gif|webp|avif|svg)$/i, "🖼"],
  [/\.(mp3|wav|flac|ogg|m4a|aac)$/i, "🎵"],
  [/\.(mp4|mov|webm|mkv)$/i, "🎬"],
  [/\.(md|txt|pdf|docx?)$/i, "📝"],
  [/\.(json|ya?ml|toml|ini|env)$|^\./i, "⚙"],
  [/\.(zip|tar|gz|7z|rar)$/i, "📦"],
];
/** the icon of a file by its name */
export const fileIcon = (name: string): string => ICONS.find(([r]) => r.test(name))?.[1] ?? "📄";

/** A tree from a flat list of paths: folders first, then files, each by name. The id of a node is its path. */
export function filesToTree(paths: string[], open: (path: string) => boolean): BlessTreeNode[] {
  type Dir = Map<string, Dir | null>;
  const root: Dir = new Map();
  for (const p of paths) {
    const parts = p.split("/").filter(Boolean);
    let dir = root;
    parts.forEach((part, i) => {
      // a trailing slash or a deeper path makes a folder
      const folder = i < parts.length - 1 || p.endsWith("/");
      if (folder) {
        let next = dir.get(part);
        if (!next) dir.set(part, (next = new Map()));
        dir = next;
      } else if (!dir.has(part)) dir.set(part, null);
    });
  }
  const walk = (dir: Dir, at: string): BlessTreeNode[] =>
    [...dir]
      .sort(([a, x], [b, y]) => Number(!x) - Number(!y) || a.localeCompare(b))
      .map(([name, sub]) => {
        const path = at ? `${at}/${name}` : name;
        return sub
          ? { id: path, label: name, icon: "📁", open: open(path), children: walk(sub, path) }
          : { id: path, label: name, icon: fileIcon(name) };
      });
  return walk(root, "");
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import BlessTree from "./BlessTree.vue";

defineOptions({ name: "BlessFileTree" });

const props = withDefaults(
  defineProps<{
    /** the files, each as a path such as `audio/ep41/raw.wav`; a path that ends in `/` is an empty folder */
    paths: string[];
    /** open every folder, not only the folders of the selected file */
    expanded?: boolean;
    label?: string;
  }>(),
  { label: "Files" },
);
/** the path of the selected file or folder */
const selected = defineModel<string | undefined>("selected");
const emit = defineEmits<{ select: [path: string, folder: boolean] }>();

// the folders on the way to the selected file start open
const nodes = computed(() =>
  filesToTree(props.paths, (p) => props.expanded || !!selected.value?.startsWith(`${p}/`)),
);
</script>
