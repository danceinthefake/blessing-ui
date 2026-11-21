<template>
  <section class="bless-tasks" :aria-label="text.title">
    <ul class="bless-stagger bless-tasks__list">
      <li v-for="t in ordered" :key="t.id" class="bless-tasks__task" :class="{ 'is-done': t.done }">
        <div class="bless-tasks__row">
          <label class="bless-tasks__check">
            <input
              type="checkbox"
              :checked="!!t.done"
              @change="set(t.id, { done: ($event.target as HTMLInputElement).checked })"
            />
            <span class="bless-tasks__title">{{ t.title }}</span>
          </label>
          <span v-if="t.subtasks?.length" class="bless-tasks__count">
            {{ text.subtasks(t.subtasks.filter((s) => s.done).length, t.subtasks.length) }}
          </span>
          <span v-if="t.due" class="bless-tasks__due" :class="{ 'is-late': late(t) }">
            {{ text.due(date(t.due)) }}<template v-if="late(t)"> · {{ text.late }}</template>
          </span>
          <BlessAvatar
            v-if="t.assignee"
            :name="t.assignee.name"
            :src="t.assignee.avatar"
            :alt="t.assignee.name"
            size="xs"
          />
        </div>
        <ul v-if="t.subtasks?.length" class="bless-tasks__subs">
          <li v-for="s in t.subtasks" :key="s.id" :class="{ 'is-done': s.done }">
            <label class="bless-tasks__check">
              <input
                type="checkbox"
                :checked="!!s.done"
                @change="setSub(t, s.id, ($event.target as HTMLInputElement).checked)"
              />
              <span class="bless-tasks__title">{{ s.title }}</span>
            </label>
          </li>
        </ul>
      </li>
    </ul>
    <form v-if="addable" class="bless-tasks__add" @submit.prevent="add">
      <input
        v-model="draft"
        class="bless-tasks__field"
        :aria-label="text.add"
        :placeholder="`+ ${text.add}`"
      />
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";

defineOptions({ name: "BlessTaskList" });
const pack = useLabelPack("BlessTaskList");

export interface BlessSubtask {
  id: string;
  title: string;
  done?: boolean;
}
export interface BlessTask extends BlessSubtask {
  assignee?: { name: string; avatar?: string };
  /** YYYY-MM-DD */
  due?: string;
  subtasks?: BlessSubtask[];
}

const props = withDefaults(
  defineProps<{
    /** today as YYYY-MM-DD, for late tasks; default: today of the reader, after mount */
    today?: string;
    locale?: string;
    /** show a field that adds a task */
    addable?: boolean;
    labels?: Partial<{
      title: string;
      add: string;
      late: string;
      due: (date: string) => string;
      subtasks: (done: number, total: number) => string;
    }>;
  }>(),
  { locale: "en", addable: true },
);
const tasks = defineModel<BlessTask[]>({ default: () => [] });

const text = computed(() => ({
  title: "Tasks",
  add: "Add a task",
  late: "late",
  due: (d: string) => `due ${d}`,
  subtasks: (d: number, t: number) => `${d} of ${t}`,
  ...pack(),
  ...props.labels,
}));
// today of the reader is known only in the browser
const local = ref<string>();
onMounted(() => {
  const d = new Date();
  local.value = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    .toISOString()
    .slice(0, 10);
});
const day = computed(() => props.today ?? local.value);
// open tasks first, done tasks at the bottom; each keeps its place among its own kind
const ordered = computed(() => [
  ...tasks.value.filter((t) => !t.done),
  ...tasks.value.filter((t) => t.done),
]);
const date = (iso: string) =>
  new Intl.DateTimeFormat(props.locale, { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
const late = (t: BlessTask) => !t.done && !!t.due && !!day.value && t.due < day.value;
const set = (id: string, p: Partial<BlessTask>) =>
  (tasks.value = tasks.value.map((t) => (t.id === id ? { ...t, ...p } : t)));
const setSub = (t: BlessTask, sid: string, done: boolean) =>
  set(t.id, { subtasks: t.subtasks?.map((s) => (s.id === sid ? { ...s, done } : s)) });
const draft = ref("");
let seq = 0;
function add() {
  const title = draft.value.trim();
  if (!title) return;
  tasks.value = [...tasks.value, { id: `t${Date.now().toString(36)}${seq++}`, title, done: false }];
  draft.value = "";
}
</script>

<style>
.bless-tasks {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-tasks__list,
.bless-tasks__subs {
  margin: 0;
  padding: 0;
  list-style: none;
}
/* spacing sits on the row and the labels, not on ul and li, so a list reset of the host page keeps it */
.bless-tasks__task {
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-tasks__row {
  display: flex;
  padding-block: var(--bless-space-2);
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-tasks__check {
  display: inline-flex;
  flex: 1;
  align-items: center;
  gap: var(--bless-space-2);
  min-inline-size: 0;
  cursor: pointer;
}
.bless-tasks__check input {
  inline-size: 1.05rem;
  block-size: 1.05rem;
  accent-color: var(--bless-color-accent);
}
.bless-tasks__check input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
/* a done task is struck through and gray, so its state does not rest on the box alone */
.is-done > .bless-tasks__row .bless-tasks__title,
.bless-tasks__subs .is-done .bless-tasks__title {
  color: var(--bless-color-text-muted);
  text-decoration: line-through;
}
.bless-tasks__count,
.bless-tasks__due {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-tasks__due.is-late {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-tasks__subs .bless-tasks__check {
  padding: 0 0 var(--bless-space-2) var(--bless-space-6);
}
.bless-tasks__add {
  margin-block-start: var(--bless-space-2);
}
.bless-tasks__field {
  inline-size: 100%;
  padding: var(--bless-space-2) 0;
  border: 0;
  border-block-end: var(--bless-border-width) dashed var(--bless-color-border);
  background: none;
  color: inherit;
  font: inherit;
}
.bless-tasks__field:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
