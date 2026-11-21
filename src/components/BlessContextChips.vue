<template>
  <div class="bless-ctxchips">
    <ul v-if="items.length" class="bless-ctxchips__list" role="list" :aria-label="text.list">
      <li v-for="c in items" :key="c.id">
        <BlessChip
          :label="c.label"
          size="sm"
          removable
          :labels="{ remove: text.remove }"
          @remove="emit('remove', c.id)"
        >
          <span class="bless-ctxchips__kind">{{ text[c.kind] }}</span>{{ " "
          }}<span class="bless-ctxchips__name">{{ c.label }}</span
          ><template v-if="c.detail"
            >{{ " " }}<span class="bless-ctxchips__detail">{{ c.detail }}</span></template
          >
        </BlessChip>
      </li>
    </ul>
    <button v-if="addable" type="button" class="bless-ctxchips__add" @click="emit('add')">
      + {{ text.add }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessChip from "./BlessChip.vue";

defineOptions({ name: "BlessContextChips" });
const pack = useLabelPack("BlessContextChips");

export type BlessContextKind = "file" | "page" | "image" | "folder" | "selection";
export interface BlessContextItem {
  id: string;
  label: string;
  kind: BlessContextKind;
  /** a short fact, for example the size or the number of tokens */
  detail?: string;
}

const props = defineProps<{
  items: BlessContextItem[];
  /** show an Add button that emits `add` */
  addable?: boolean;
  labels?: Partial<
    Record<BlessContextKind, string> & { list: string; add: string; remove: string }
  >;
}>();
const emit = defineEmits<{ remove: [id: string]; add: [] }>();

const text = computed(() => ({
  file: "File",
  page: "Page",
  image: "Image",
  folder: "Folder",
  selection: "Selection",
  list: "Context for the message",
  add: "Add context",
  remove: "Remove",
  ...pack(),
  ...props.labels,
}));
</script>

<style>
.bless-ctxchips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text);
}
.bless-ctxchips__list {
  display: contents;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-ctxchips__list li {
  display: inline-flex;
  min-inline-size: 0;
}
.bless-ctxchips__kind {
  font-size: 0.85em;
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.bless-ctxchips__name {
  display: inline-block;
  max-inline-size: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.bless-ctxchips__detail {
  font-variant-numeric: tabular-nums;
}
.bless-ctxchips__add {
  min-block-size: 1.75rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) dashed var(--bless-color-text);
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-ctxchips__add:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
