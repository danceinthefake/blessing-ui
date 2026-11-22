import { computed, onMounted, ref } from "vue";
import type { FilesApi } from "./api";
import { ROOT, childrenOf, nameProblem, pathTo, subtree, usedBytes, type Node } from "./domain";

/** a folder tree: open, search, upload, rename, delete */
export function useFiles(api: FilesApi) {
  const nodes = ref<Node[]>([]);
  onMounted(async () => (nodes.value = await api.list()));

  const folder = ref(ROOT);
  const query = ref("");
  const items = computed(() => {
    const q = query.value.trim().toLowerCase();
    return childrenOf(nodes.value, folder.value).filter(
      (n) => !q || n.name.toLowerCase().includes(q),
    );
  });
  const path = computed(() => pathTo(nodes.value, folder.value));
  const used = computed(() => usedBytes(nodes.value));

  const selected = ref<Node>();
  function open(id: string) {
    const n = nodes.value.find((x) => x.id === id);
    if (n && !n.folder) return void (selected.value = n);
    folder.value = n?.id ?? ROOT;
    query.value = "";
    selected.value = undefined;
  }

  async function upload(file: File, progress: (n: number) => void) {
    nodes.value.push(await api.upload(folder.value, file, progress));
  }

  /** resolves to a problem to show, or "" when the name changed */
  async function rename(name: string) {
    const n = selected.value!;
    const problem = nameProblem(nodes.value, n.parent, name, n.id);
    if (problem) return problem;
    await api.rename(n.id, name.trim());
    n.name = name.trim();
    return "";
  }
  async function remove() {
    const gone = subtree(nodes.value, selected.value!.id);
    await api.remove(gone);
    nodes.value = nodes.value.filter((n) => !gone.includes(n.id));
    selected.value = undefined;
  }

  return { items, path, used, folder, query, selected, open, upload, rename, remove };
}
