<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import { menubarKey } from "./menu";

defineOptions({ name: "BlessMenubar" });

defineProps<{ label?: string }>();

const menus = ref<Array<{ id: string; open: () => void; close: () => void }>>([]);
const active = ref<string | null>(null);
const root = ref<HTMLElement>();
// One tab stop for the whole bar (arrows move between menus): the last-focused trigger keeps
// tabindex 0, the others -1.
const triggers = () =>
  Array.from(
    root.value?.querySelectorAll<HTMLElement>('[aria-haspopup="menu"][aria-controls]') ?? [],
  );
function rove(current?: HTMLElement) {
  const all = triggers();
  const keep = current && all.includes(current) ? current : all[0];
  for (const t of all) t.tabIndex = t === keep ? 0 : -1;
}
onMounted(() => rove());

provide(menubarKey, {
  register: (id, open, close) => menus.value.push({ id, open, close }),
  unregister: (id) => (menus.value = menus.value.filter((m) => m.id !== id)),
  active,
  focusNext: (id, dir) => {
    const i = menus.value.findIndex((m) => m.id === id);
    const next = menus.value[(i + dir + menus.value.length) % menus.value.length];
    if (!next) return;
    const wasOpen = active.value === id;
    menus.value[i]?.close();
    const trigger = root.value?.querySelector<HTMLElement>(`[aria-controls="${next.id}"]`);
    trigger?.focus();
    if (wasOpen) next.open();
  },
});
</script>

<template>
  <nav
    ref="root"
    class="bless-menubar"
    :aria-label="label"
    @focusin="rove($event.target as HTMLElement)"
  >
    <slot />
  </nav>
</template>

<style>
.bless-menubar {
  border-radius: var(--bless-radius);
  display: inline-flex;
  gap: var(--bless-space-1);
  padding: var(--bless-space-1);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
}
.bless-menubar .bless-dropdown__anchor > * {
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 0;
  background: transparent;
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  cursor: pointer;
}
.bless-menubar .bless-dropdown__anchor[aria-expanded="true"] > *,
.bless-menubar .bless-dropdown__anchor > *:hover {
  background: var(--bless-color-surface);
  color: var(--bless-color-accent-text);
}
.bless-menubar .bless-dropdown__anchor > *:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
</style>
