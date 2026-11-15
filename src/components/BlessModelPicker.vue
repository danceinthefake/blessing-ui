<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessListbox from "./BlessListbox.vue";
import BlessPopover from "./BlessPopover.vue";
import "./sr.css";

defineOptions({ name: "BlessModelPicker" });
const pack = useLabelPack("BlessModelPicker");

export interface BlessModel {
  id: string;
  name: string;
  /** one short line, for example "Best for long documents" */
  description?: string;
  /** 1 to 3: how fast it answers */
  speed?: number;
  /** 1 to 3: how much it costs */
  cost?: number;
  /** short marks, for example "vision" or "new" */
  tags?: string[];
  disabled?: boolean;
}

const props = defineProps<{
  models: BlessModel[];
  labels?: Partial<{
    label: string;
    choose: string;
    speed: (level: number) => string;
    cost: (level: number) => string;
  }>;
}>();
/** the id of the chosen model */
const model = defineModel<string>();

const text = computed(() => ({
  label: "Model",
  choose: "Choose a model",
  speed: (n: number) => `speed ${n} of 3`,
  cost: (n: number) => `cost ${n} of 3`,
  ...pack(),
  ...props.labels,
}));
const current = computed(() => props.models.find((m) => m.id === model.value));
const options = computed(() =>
  props.models.map((m) => ({ value: m.id, label: m.name, disabled: m.disabled })),
);
const byId = (id: string) => props.models.find((m) => m.id === id)!;

const open = ref(false);
const panel = ref<HTMLElement>();
watch(open, async (v) => {
  if (!v) return;
  await nextTick();
  panel.value?.querySelector<HTMLElement>(".bless-listbox")?.focus();
});
function pick(id: unknown) {
  model.value = id as string;
  open.value = false;
}
</script>

<template>
  <BlessPopover
    v-model:open="open"
    placement="bottom-start"
    :title="text.choose"
    class="bless-modelpick__panel"
  >
    <template #trigger>
      <button type="button" class="bless-modelpick" :aria-expanded="open">
        <span class="bless-sr">{{ text.label }}: </span>
        <span class="bless-modelpick__name">{{ current?.name ?? text.choose }}</span>
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
          <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
    </template>
    <div ref="panel">
      <BlessListbox :model-value="model" :options :label="text.choose" @update:model-value="pick">
        <template #default="{ option }">
          <span class="bless-modelpick__option">
            <span class="bless-modelpick__head">
              <strong>{{ option.label }}</strong>
              <span v-for="t in byId(option.value).tags" :key="t" class="bless-modelpick__tag">{{
                t
              }}</span>
            </span>
            <span v-if="byId(option.value).description" class="bless-modelpick__desc">
              {{ byId(option.value).description }}
            </span>
            <span class="bless-modelpick__marks">
              <span v-if="byId(option.value).speed" :title="text.speed(byId(option.value).speed!)">
                <span aria-hidden="true"
                  >⚡{{ "●".repeat(byId(option.value).speed!)
                  }}{{ "○".repeat(3 - byId(option.value).speed!) }}</span
                >
                <span class="bless-sr">{{ text.speed(byId(option.value).speed!) }}</span>
              </span>
              <span v-if="byId(option.value).cost" :title="text.cost(byId(option.value).cost!)">
                <span aria-hidden="true"
                  >$ {{ "●".repeat(byId(option.value).cost!)
                  }}{{ "○".repeat(3 - byId(option.value).cost!) }}</span
                >
                <span class="bless-sr">{{ text.cost(byId(option.value).cost!) }}</span>
              </span>
            </span>
          </span>
        </template>
      </BlessListbox>
    </div>
  </BlessPopover>
</template>

<style>
.bless-modelpick {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-modelpick:hover {
  background: var(--bless-color-surface-2);
}
.bless-modelpick:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-modelpick__panel {
  min-inline-size: 18rem;
  max-inline-size: 24rem;
}
.bless-modelpick__option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-block: var(--bless-space-1);
}
.bless-modelpick__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-modelpick__tag {
  padding: 0 var(--bless-space-1);
  border: var(--bless-border-width) solid currentColor;
  font-size: var(--bless-text-2xs, 10px);
  text-transform: uppercase;
  letter-spacing: var(--bless-tracking-wide);
}
.bless-modelpick__desc {
  font-size: var(--bless-text-xs);
}
.bless-modelpick__marks {
  display: flex;
  gap: var(--bless-space-3);
  font-size: var(--bless-text-xs);
  letter-spacing: 1px;
}
</style>
