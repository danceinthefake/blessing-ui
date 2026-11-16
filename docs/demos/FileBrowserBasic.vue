<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessFileBrowser, type BlessFileItem } from "blessing-ui";

// a small tree: each folder id lists its items
const tree: Record<string, BlessFileItem[]> = {
  root: [
    { id: "ep", name: "Episodes", folder: true, modified: "2026-11-15" },
    { id: "art", name: "Cover art", folder: true, modified: "2026-10-02" },
    { id: "plan", name: "Season plan.pdf", size: 412_000, modified: "2026-11-10" },
    { id: "guests", name: "Guests.xlsx", size: 38_400, modified: "2026-11-12" },
  ],
  ep: [
    { id: "e41", name: "Episode 41.wav", size: 612_000_000, modified: "2026-11-01" },
    { id: "e42", name: "Episode 42.wav", size: 655_000_000, modified: "2026-11-15" },
    { id: "notes", name: "Show notes.md", size: 6_100, modified: "2026-11-15" },
  ],
  art: [{ id: "c1", name: "Season 3.png", size: 2_300_000, modified: "2026-10-02" }],
};
const names: Record<string, string> = { root: "My files", ep: "Episodes", art: "Cover art" };
const trail = ref(["root"]);
const path = computed(() => trail.value.map((id) => ({ id, label: names[id]! })));
const view = ref<"grid" | "list">("grid");
const opened = ref("");
function open(f: BlessFileItem) {
  if (f.folder) trail.value.push(f.id);
  else opened.value = f.name;
}
const go = (id: string) => (trail.value = trail.value.slice(0, trail.value.indexOf(id) + 1));
</script>

<template>
  <BlessFileBrowser
    v-model:view="view"
    :items="tree[trail.at(-1)!]!"
    :path
    @open="open"
    @navigate="go"
  />
  <div v-if="opened" style="margin-top: 12px">Opened {{ opened }}</div>
</template>
