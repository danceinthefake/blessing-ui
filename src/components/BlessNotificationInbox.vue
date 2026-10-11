<script setup lang="ts">
import { computed } from "vue";
import { useLink } from "../composables/useLink";
import BlessButton from "./BlessButton.vue";
import BlessIndicator from "./BlessIndicator.vue";
import BlessPopover from "./BlessPopover.vue";
import type { Placement } from "../composables/useFloating";

export interface BlessNotice {
  id: string;
  title: string;
  body?: string;
  /** when, as text you already formatted, for example "2 min ago" */
  time?: string;
  read?: boolean;
  /** makes the title a link (through your router when one is set) */
  href?: string;
}

defineOptions({ name: "BlessNotificationInbox" });

const props = withDefaults(
  defineProps<{
    items: BlessNotice[];
    placement?: Placement;
    /** the largest count the badge shows before "99+" */
    max?: number;
    labels?: Partial<{
      title: string;
      /** the name of the bell, from the unread count */
      bell: (unread: number) => string;
      readAll: string;
      dismiss: string;
      empty: string;
      unread: string;
    }>;
  }>(),
  { placement: "bottom-end", max: 99 },
);
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{
  /** a notice was opened or marked read */
  read: [id: string];
  readAll: [];
  dismiss: [id: string];
  select: [notice: BlessNotice];
}>();

const text = computed(() => ({
  title: "Notifications",
  bell: (n: number) => (n ? `Notifications, ${n} unread` : "Notifications"),
  readAll: "Mark all as read",
  dismiss: "Dismiss",
  empty: "You are all caught up.",
  unread: "Unread",
  ...props.labels,
}));
const unread = computed(() => props.items.filter((i) => !i.read).length);
const link = useLink();

function pick(n: BlessNotice) {
  if (!n.read) emit("read", n.id);
  emit("select", n);
}
</script>

<template>
  <BlessPopover v-model:open="open" :title="text.title" :placement="placement">
    <template #trigger>
      <BlessButton variant="ghost" icon :aria-label="text.bell(unread)">
        <BlessIndicator :value="unread" :max="max" color="danger">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4" />
          </svg>
        </BlessIndicator>
      </BlessButton>
    </template>
    <div class="bless-inbox__panel">
      <div class="bless-inbox__head">
        <BlessButton variant="ghost" size="sm" :disabled="!unread" @click="emit('readAll')">{{
          text.readAll
        }}</BlessButton>
      </div>
      <p v-if="!items.length" class="bless-inbox__empty">{{ text.empty }}</p>
      <ul v-else class="bless-inbox__list">
        <li
          v-for="n in items"
          :key="n.id"
          class="bless-inbox__item"
          :class="{ 'bless-inbox__item--unread': !n.read }"
        >
          <span v-if="!n.read" class="bless-inbox__dot" aria-hidden="true" />
          <div class="bless-inbox__main">
            <component
              :is="link(n.href, undefined, 'button').is"
              v-bind="link(n.href, undefined, 'button').attrs"
              class="bless-inbox__open"
              :type="n.href ? undefined : 'button'"
              @click="pick(n)"
            >
              <span v-if="!n.read" class="bless-inbox__sr">{{ text.unread }}: </span>{{ n.title }}
            </component>
            <span v-if="n.body" class="bless-inbox__body">{{ n.body }}</span>
            <span v-if="n.time" class="bless-inbox__time">{{ n.time }}</span>
          </div>
          <button
            type="button"
            class="bless-inbox__dismiss"
            :aria-label="`${text.dismiss}: ${n.title}`"
            @click="emit('dismiss', n.id)"
          >
            <span aria-hidden="true">×</span>
          </button>
        </li>
      </ul>
    </div>
  </BlessPopover>
</template>

<style>
.bless-inbox__panel {
  inline-size: min(22rem, 86vw);
  max-block-size: 70vh;
  overflow: auto;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-inbox__head {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-block-end: var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-inbox__empty {
  margin: var(--bless-space-4) 0 0;
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-inbox__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-inbox__item {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
  padding-block: var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-inbox__dot {
  flex: none;
  inline-size: 8px;
  block-size: 8px;
  margin-block-start: 5px;
  background: var(--bless-color-text); /* ink, not accent: unread is not a choice */
}
.bless-inbox__main {
  flex: 1;
  min-inline-size: 0;
  display: grid;
  gap: var(--bless-space-1);
  justify-items: start;
}
.bless-inbox__open {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-size: var(--bless-text-md);
  text-align: start;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-inbox__item--unread .bless-inbox__open {
  font-weight: var(--bless-font-weight-bold);
}
.bless-inbox__open:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-inbox__open:focus-visible,
.bless-inbox__dismiss:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-inbox__body,
.bless-inbox__time {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-inbox__dismiss {
  flex: none;
  inline-size: 24px;
  block-size: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: var(--bless-text-lg);
  line-height: 1;
  color: var(--bless-color-text-muted);
  cursor: pointer;
}
.bless-inbox__dismiss:hover {
  color: var(--bless-color-text);
}
.bless-inbox__sr {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
