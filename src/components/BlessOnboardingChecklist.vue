<script lang="ts">
export interface BlessChecklistItem {
  id: string;
  label: string;
  description?: string;
  /** text of a button that takes the person to the step; it emits `select` */
  action?: string;
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref, useId, watch } from "vue";
import BlessCheckbox from "./BlessCheckbox.vue";
import BlessButton from "./BlessButton.vue";
import BlessProgress from "./BlessProgress.vue";

defineOptions({ name: "BlessOnboardingChecklist" });

const props = withDefaults(
  defineProps<{
    items: BlessChecklistItem[];
    title?: string;
    /** remember progress, collapsed state and dismissal under this key (localStorage) */
    persist?: string;
    /** pin it to the bottom corner of the window */
    floating?: boolean;
    /** a close button that dismisses it for good */
    dismissible?: boolean;
    labels?: Partial<{
      progress: (done: number, total: number) => string;
      complete: string;
      dismiss: string;
    }>;
  }>(),
  { title: "Getting started", dismissible: true },
);
/** ids of the finished steps */
const done = defineModel<string[]>("done", { default: () => [] });
const collapsed = defineModel<boolean>("collapsed", { default: false });
const dismissed = defineModel<boolean>("dismissed", { default: false });
const emit = defineEmits<{ select: [item: BlessChecklistItem]; complete: []; dismiss: [] }>();

const text = computed(() => ({
  progress: (d: number, n: number) => `${d} of ${n} done`,
  complete: "All done — nicely finished.",
  dismiss: "Dismiss",
  ...props.labels,
}));
const id = useId();
const known = computed(() => props.items.filter((i) => done.value.includes(i.id)).length);
const total = computed(() => props.items.length);
const finished = computed(() => total.value > 0 && known.value === total.value);

// --- remembered between visits, read after mount so server and client agree ---
const key = computed(() => (props.persist ? `bless-checklist:${props.persist}` : null));
const ready = ref(false);
onMounted(() => {
  try {
    const raw = key.value && localStorage.getItem(key.value);
    if (raw) {
      const s = JSON.parse(raw) as { done?: string[]; collapsed?: boolean; dismissed?: boolean };
      if (s.done) done.value = s.done;
      if (typeof s.collapsed === "boolean") collapsed.value = s.collapsed;
      if (s.dismissed) dismissed.value = true;
    }
  } catch {
    /* blocked or damaged storage: start fresh */
  }
  ready.value = true;
});
watch([done, collapsed, dismissed], () => {
  if (!ready.value || !key.value) return;
  try {
    localStorage.setItem(
      key.value,
      JSON.stringify({ done: done.value, collapsed: collapsed.value, dismissed: dismissed.value }),
    );
  } catch {
    /* ignore */
  }
});
let told = false;
watch(finished, (v) => {
  if (v && !told) ((told = true), emit("complete"));
  if (!v) told = false;
});
function close() {
  dismissed.value = true;
  emit("dismiss");
}
</script>

<template>
  <section
    v-if="!dismissed"
    class="bless-checklist"
    :class="{ 'bless-checklist--floating': floating, 'bless-checklist--done': finished }"
    :aria-labelledby="`${id}-t`"
  >
    <header class="bless-checklist__head">
      <button
        type="button"
        class="bless-checklist__toggle"
        :aria-expanded="!collapsed"
        :aria-controls="`${id}-b`"
        @click="collapsed = !collapsed"
      >
        <span :id="`${id}-t`" class="bless-checklist__title">{{ title }}</span>
        <span class="bless-checklist__count">{{ known }}/{{ total }}</span>
        <span class="bless-checklist__chev" aria-hidden="true">{{ collapsed ? "▸" : "▾" }}</span>
      </button>
      <button
        v-if="dismissible"
        type="button"
        class="bless-checklist__close"
        :aria-label="text.dismiss"
        @click="close"
      >
        ×
      </button>
    </header>
    <BlessProgress
      :value="known"
      :max="Math.max(1, total)"
      size="sm"
      :label="text.progress(known, total)"
    />
    <div v-show="!collapsed" :id="`${id}-b`" class="bless-checklist__body">
      <ul class="bless-checklist__list" role="list">
        <li v-for="it in items" :key="it.id" class="bless-checklist__item">
          <BlessCheckbox v-model="done" :value="it.id" :description="it.description">{{
            it.label
          }}</BlessCheckbox>
          <BlessButton
            v-if="it.action && !done.includes(it.id)"
            size="sm"
            variant="outline"
            @click="emit('select', it)"
            >{{ it.action }}</BlessButton
          >
        </li>
      </ul>
      <p v-if="finished" class="bless-checklist__all" role="status">
        <slot name="complete">{{ text.complete }}</slot>
      </p>
    </div>
  </section>
</template>

<style>
.bless-checklist {
  display: grid;
  gap: var(--bless-space-2);
  box-sizing: border-box;
  width: min(100%, 360px);
  padding: var(--bless-space-3);
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-checklist--floating {
  position: fixed;
  inset-block-end: var(--bless-space-4);
  inset-inline-end: var(--bless-space-4);
  z-index: var(--bless-z-nav);
  box-shadow: var(--bless-shadow-plate);
}
.bless-checklist__head {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-checklist__toggle {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-checklist__toggle:focus-visible,
.bless-checklist__close:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-checklist__title {
  font-weight: var(--bless-font-weight-bold, 700);
}
.bless-checklist__count {
  color: var(--bless-color-text-muted);
  margin-inline-start: auto;
}
.bless-checklist__close {
  padding: 0 var(--bless-space-2);
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-lg);
  line-height: 1;
  cursor: pointer;
}
.bless-checklist__list {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-checklist__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-checklist__all {
  margin: var(--bless-space-2) 0 0;
  color: var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold, 700);
}
</style>
