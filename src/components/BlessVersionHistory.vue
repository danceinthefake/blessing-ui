<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import "./sr.css";

defineOptions({ name: "BlessVersionHistory" });
const pack = useLabelPack("BlessVersionHistory");

export interface BlessVersion {
  id: string;
  /** a name, for example "Final mix" */
  label?: string;
  author: string;
  avatar?: string;
  /** when, as text */
  time: string;
  /** what changed, in a few words */
  summary?: string;
  added?: number;
  removed?: number;
}

const props = defineProps<{
  /** newest first; the first is the current version */
  versions: BlessVersion[];
  labels?: Partial<{
    title: string;
    current: string;
    restore: string;
    changes: (added: number, removed: number) => string;
  }>;
}>();
/** the id of the version the reader looks at */
const selected = defineModel<string>("selected");
const emit = defineEmits<{ restore: [id: string] }>();

const text = computed(() => ({
  title: "Version history",
  current: "Current",
  restore: "Restore",
  changes: (a: number, r: number) => `${a} added, ${r} removed`,
  ...pack(),
  ...props.labels,
}));
</script>

<template>
  <section class="bless-versions" :aria-label="text.title">
    <ol class="bless-stagger bless-versions__list">
      <li
        v-for="(v, i) in versions"
        :key="v.id"
        class="bless-versions__item"
        :class="{ 'is-selected': (selected ?? versions[0]?.id) === v.id }"
      >
        <button
          type="button"
          class="bless-versions__pick"
          :aria-pressed="(selected ?? versions[0]?.id) === v.id"
          @click="selected = v.id"
        >
          <span class="bless-versions__line">
            <strong>{{ v.label ?? v.time }}</strong>
            <span v-if="i === 0" class="bless-versions__current">{{ text.current }}</span>
          </span>
          <span class="bless-versions__who">
            <BlessAvatar :name="v.author" :src="v.avatar" alt="" size="xs" />
            {{ v.author }}<template v-if="v.label"> · {{ v.time }}</template>
          </span>
          <span v-if="v.summary" class="bless-versions__summary">{{ v.summary }}</span>
          <span
            v-if="v.added !== undefined || v.removed !== undefined"
            class="bless-versions__diff"
          >
            <span aria-hidden="true"
              ><b class="is-add">+{{ v.added ?? 0 }}</b> <b class="is-del"
                >−{{ v.removed ?? 0 }}</b
              ></span
            >
            <span class="bless-sr">{{ text.changes(v.added ?? 0, v.removed ?? 0) }}</span>
          </span>
        </button>
        <button
          v-if="i > 0"
          type="button"
          class="bless-versions__restore"
          :aria-label="`${text.restore}: ${v.label ?? v.time}`"
          @click="emit('restore', v.id)"
        >
          {{ text.restore }}
        </button>
      </li>
    </ol>
  </section>
</template>

<style>
.bless-versions {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-versions__list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-versions__item {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
  border-inline-start: 2px solid var(--bless-color-border);
}
/* the version that shows has a bar in the accent color and a frame; no fill, so the gray and red text keep their contrast */
.bless-versions__item.is-selected {
  border-inline-start-color: var(--bless-color-accent);
  box-shadow: inset 0 0 0 1px var(--bless-color-border);
}
.bless-versions__pick {
  display: grid;
  flex: 1;
  gap: 2px;
  min-inline-size: 0;
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-versions__pick:focus-visible,
.bless-versions__restore:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-versions__line {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-versions__current {
  padding: 0 var(--bless-space-1);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-versions__who {
  display: flex;
  align-items: center;
  gap: var(--bless-space-1);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-versions__summary {
  font-size: var(--bless-text-xs);
}
.bless-versions__diff {
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
}
.bless-versions__diff .is-add {
  color: var(--bless-color-text);
}
.bless-versions__diff .is-del {
  color: var(--bless-color-danger-text);
}
.bless-versions__restore {
  margin: var(--bless-space-2);
  padding: var(--bless-space-1) var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  cursor: pointer;
}
</style>
