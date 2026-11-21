<template>
  <nav ref="root" class="bless-chats" :aria-label="text.title">
    <BlessInput
      v-if="search"
      v-model="query"
      class="bless-chats__search"
      type="search"
      size="sm"
      :aria-label="text.search"
      :placeholder="text.search"
    />
    <p v-if="!groups.length" class="bless-chats__none" role="status">{{ text.none }}</p>
    <section
      v-for="g in groups"
      :key="g.key"
      class="bless-chats__group"
      :aria-label="g.title || undefined"
    >
      <p v-if="g.title" class="bless-chats__date" aria-hidden="true">{{ g.title }}</p>
      <ul class="bless-stagger bless-chats__list">
        <li
          v-for="c in g.chats"
          :key="c.id"
          class="bless-chats__item"
          :class="{ 'is-selected': c.id === selected }"
        >
          <input
            v-if="editing === c.id"
            v-model="draft"
            class="bless-chats__edit"
            :aria-label="text.rename"
            @keydown.enter.prevent="save"
            @keydown.esc.prevent="editing = undefined"
            @blur="save"
          />
          <template v-else>
            <button
              type="button"
              class="bless-chats__open"
              :aria-current="c.id === selected ? 'page' : undefined"
              @click="open(c)"
            >
              {{ c.title }}
            </button>
            <span class="bless-chats__actions">
              <button
                type="button"
                class="bless-chats__act"
                :aria-label="`${text.rename}: ${c.title}`"
                :title="text.rename"
                @click="startRename(c)"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M10.5 2.5l3 3L6 13H3v-3z" />
                </svg>
              </button>
              <button
                type="button"
                class="bless-chats__act"
                :aria-label="`${text.remove}: ${c.title}`"
                :title="text.remove"
                @click="emit('remove', c.id)"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.7 8.5h5.6l.7-8.5" />
                </svg>
              </button>
            </span>
          </template>
        </li>
      </ul>
    </section>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessInput from "./BlessInput.vue";
import { toDate } from "./relativeTime";

defineOptions({ name: "BlessChatHistory" });
const pack = useLabelPack("BlessChatHistory");

export interface BlessChat {
  id: string | number;
  title: string;
  /** the time of the last message: a Date, a timestamp in ms, or a date string */
  time: Date | number | string;
}

const props = withDefaults(
  defineProps<{
    chats: BlessChat[];
    /** show a search box over the list */
    search?: boolean;
    /** a fixed "now" for the groups */
    now?: Date | number;
    labels?: Partial<{
      title: string;
      search: string;
      none: string;
      today: string;
      yesterday: string;
      week: string;
      month: string;
      older: string;
      rename: string;
      remove: string;
    }>;
  }>(),
  { search: true },
);
/** the id of the open chat */
const selected = defineModel<string | number>("selected");
const emit = defineEmits<{
  select: [id: string | number];
  rename: [id: string | number, title: string];
  remove: [id: string | number];
}>();

const text = computed(() => ({
  title: "Chats",
  search: "Search chats",
  none: "No chats found",
  today: "Today",
  yesterday: "Yesterday",
  week: "Previous 7 days",
  month: "Previous 30 days",
  older: "Older",
  rename: "Rename",
  remove: "Delete",
  ...pack(),
  ...props.labels,
}));

// the server does not know the day of the reader, so the groups come after mount
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const query = ref("");
const day = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
const groups = computed(() => {
  const q = query.value.trim().toLowerCase();
  const list = props.chats
    .filter((c) => !q || c.title.toLowerCase().includes(q))
    .sort((a, b) => +toDate(b.time) - +toDate(a.time));
  if (!mounted.value && props.now === undefined)
    return list.length ? [{ key: "all", title: "", chats: list }] : [];
  const today = day(new Date(props.now ?? Date.now()));
  const keys = ["today", "yesterday", "week", "month", "older"] as const;
  const out = keys.map((key) => ({ key, title: text.value[key], chats: [] as BlessChat[] }));
  for (const c of list) {
    const ago = Math.round((today - day(toDate(c.time))) / 86_400_000);
    out[ago <= 0 ? 0 : ago === 1 ? 1 : ago <= 7 ? 2 : ago <= 30 ? 3 : 4]!.chats.push(c);
  }
  return out.filter((g) => g.chats.length);
});

const editing = ref<string | number>();
const draft = ref("");
const root = ref<HTMLElement>();
function startRename(c: BlessChat) {
  editing.value = c.id;
  draft.value = c.title;
  nextTick(() => root.value?.querySelector<HTMLInputElement>(".bless-chats__edit")?.select());
}
function save() {
  const id = editing.value;
  if (id === undefined) return;
  editing.value = undefined;
  const t = draft.value.trim();
  if (t && t !== props.chats.find((c) => c.id === id)?.title) emit("rename", id, t);
}
function open(c: BlessChat) {
  selected.value = c.id;
  emit("select", c.id);
}
</script>

<style>
.bless-chats {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-chats__none {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-chats__date {
  margin: 0 0 var(--bless-space-1);
  padding-inline: var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text-muted);
}
.bless-chats__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-chats__item {
  display: flex;
  align-items: center;
  min-block-size: 2.1rem;
}
.bless-chats__item:hover,
.bless-chats__item:focus-within {
  background: var(--bless-color-surface-2);
}
/* the open chat has a bar at its start and bold words, not only a fill */
.bless-chats__item.is-selected {
  box-shadow: inset 3px 0 0 var(--bless-color-accent);
  background: var(--bless-color-surface-2);
}
[dir="rtl"] .bless-chats__item.is-selected {
  box-shadow: inset -3px 0 0 var(--bless-color-accent);
}
.is-selected .bless-chats__open {
  font-weight: var(--bless-font-weight-bold);
}
.bless-chats__open {
  flex: 1;
  min-inline-size: 0;
  padding: var(--bless-space-2);
  overflow: hidden;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.bless-chats__actions {
  display: flex;
  opacity: 0;
}
/* the actions show on hover and on focus, and always on a touch screen */
.bless-chats__item:hover .bless-chats__actions,
.bless-chats__item:focus-within .bless-chats__actions {
  opacity: 1;
}
@media (hover: none) {
  .bless-chats__actions {
    opacity: 1;
  }
}
.bless-chats__act {
  display: inline-grid;
  place-items: center;
  inline-size: 1.8rem;
  block-size: 1.8rem;
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  cursor: pointer;
}
.bless-chats__act:hover {
  color: var(--bless-color-text);
}
.bless-chats__act svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bless-chats__open:focus-visible,
.bless-chats__act:focus-visible,
.bless-chats__edit:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-chats__edit {
  flex: 1;
  min-inline-size: 0;
  margin: 2px;
  padding: var(--bless-space-1) var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-accent);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
</style>
