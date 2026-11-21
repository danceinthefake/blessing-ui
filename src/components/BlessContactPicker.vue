<template>
  <div class="bless-contacts" role="group" :aria-label="text.title">
    <div v-if="chosen.length" class="bless-contacts__chosen" :aria-label="text.chosen" role="group">
      <BlessChip
        v-for="id in chosen"
        :key="id"
        :label="byId.get(id)?.name ?? id"
        size="sm"
        removable
        :labels="{ remove: text.remove }"
        @remove="pick(id, false)"
      />
    </div>
    <input
      v-model="query"
      class="bless-contacts__search"
      type="search"
      :aria-label="text.search"
      :placeholder="text.search"
    />
    <p class="bless-contacts__none" role="status">{{ count ? "" : text.none }}</p>
    <div class="bless-contacts__scroll">
      <fieldset v-for="s in sections" :key="s.key" class="bless-contacts__section">
        <legend v-if="s.title" class="bless-contacts__title">{{ s.title }}</legend>
        <label v-for="c in s.list" :key="`${s.key}-${c.id}`" class="bless-contacts__row">
          <input
            :type="multiple ? 'checkbox' : 'radio'"
            :name="multiple ? undefined : `${uid}-contact`"
            :checked="on(c.id)"
            @change="pick(c.id, ($event.target as HTMLInputElement).checked)"
          />
          <BlessAvatar :name="c.name" :src="c.avatar" alt="" size="sm" />
          <span class="bless-contacts__text">
            <span class="bless-contacts__name">{{ c.name }}</span>
            <span v-if="c.detail" class="bless-contacts__detail">{{ c.detail }}</span>
          </span>
        </label>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import BlessChip from "./BlessChip.vue";

defineOptions({ name: "BlessContactPicker" });
const pack = useLabelPack("BlessContactPicker");

export interface BlessContact {
  id: string;
  name: string;
  /** an email, a phone, or a role, under the name */
  detail?: string;
  avatar?: string;
}

const props = withDefaults(
  defineProps<{
    contacts: BlessContact[];
    /** ids of recent contacts, shown first while the search is empty */
    recent?: string[];
    /** pick more than one */
    multiple?: boolean;
    labels?: Partial<{
      title: string;
      search: string;
      recent: string;
      all: string;
      none: string;
      chosen: string;
      remove: string;
    }>;
  }>(),
  { recent: () => [], multiple: true },
);
/** the ids of the chosen contacts */
const chosen = defineModel<string[]>({ default: () => [] });

const text = computed(() => ({
  title: "People",
  search: "Search people",
  recent: "Recent",
  all: "All people",
  none: "Nobody matches the search.",
  chosen: "Chosen",
  remove: "Remove",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const query = ref("");
const byId = computed(() => new Map(props.contacts.map((c) => [c.id, c])));
const sections = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (q) {
    const hits = props.contacts.filter((c) =>
      `${c.name} ${c.detail ?? ""}`.toLowerCase().includes(q),
    );
    return [{ key: "hits", title: "", list: hits }];
  }
  const recent = props.recent.map((id) => byId.value.get(id)).filter((c): c is BlessContact => !!c);
  const rest = [...props.contacts].sort((a, b) => a.name.localeCompare(b.name));
  return [
    ...(recent.length ? [{ key: "recent", title: text.value.recent, list: recent }] : []),
    { key: "all", title: text.value.all, list: rest },
  ];
});
const count = computed(() => sections.value.reduce((n, s) => n + s.list.length, 0));
const on = (id: string) => chosen.value.includes(id);
function pick(id: string, checked: boolean) {
  if (!props.multiple) chosen.value = checked ? [id] : [];
  else chosen.value = checked ? [...chosen.value, id] : chosen.value.filter((x) => x !== id);
}
</script>

<style>
.bless-contacts {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-contacts__chosen {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
.bless-contacts__search {
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-contacts__search:focus-visible,
.bless-contacts__row input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-contacts__none {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-contacts__none:empty {
  display: none;
}
.bless-contacts__scroll {
  display: grid;
  gap: var(--bless-space-3);
  max-block-size: 20rem;
  overflow: auto;
}
.bless-contacts__section {
  display: grid;
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-contacts__title {
  margin-block-end: var(--bless-space-1);
  padding: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-contacts__row {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-1) var(--bless-space-2);
  cursor: pointer;
}
.bless-contacts__row:hover,
.bless-contacts__row:has(:checked) {
  background: var(--bless-color-surface-2);
}
.bless-contacts__row input {
  flex: none;
  accent-color: var(--bless-color-accent);
}
.bless-contacts__text {
  display: grid;
  min-inline-size: 0;
}
.bless-contacts__detail {
  overflow: hidden;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
