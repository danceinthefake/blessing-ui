<template>
  <nav class="bless-convos" :aria-label="text.title">
    <ul class="bless-stagger bless-convos__list">
      <li v-for="c in conversations" :key="c.id">
        <button
          type="button"
          class="bless-convos__item"
          :class="{ 'is-unread': (c.unread ?? 0) > 0 }"
          :aria-current="selected === c.id ? 'true' : undefined"
          @click="selected = c.id"
        >
          <span class="bless-convos__avatar">
            <BlessAvatar :name="c.name" :src="c.avatar" alt="" size="md" />
            <span v-if="c.online" class="bless-convos__dot" aria-hidden="true" />
          </span>
          <span class="bless-convos__main">
            <span class="bless-convos__top">
              <span class="bless-convos__name">{{ c.name }}</span
              ><span v-if="c.online" class="bless-sr">, {{ text.online }}</span>
              <span class="bless-convos__time">{{ c.time }}</span>
            </span>
            <span class="bless-convos__bottom">
              <span class="bless-convos__last" :class="{ 'is-typing': c.typing }">{{
                c.typing ? text.typing : c.last
              }}</span>
              <span v-if="(c.unread ?? 0) > 0" class="bless-convos__badge">
                <span aria-hidden="true">{{ c.unread! > 99 ? "99+" : c.unread }}</span>
                <span class="bless-sr">{{ text.unread(c.unread!) }}</span>
              </span>
            </span>
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import "./sr.css";

defineOptions({ name: "BlessConversationList" });
const pack = useLabelPack("BlessConversationList");

export interface BlessConversation {
  id: string;
  name: string;
  avatar?: string;
  /** the last message, as plain text */
  last: string;
  /** when the last message came, as text */
  time: string;
  unread?: number;
  online?: boolean;
  /** someone types now; shows in place of the last message */
  typing?: boolean;
}

const props = defineProps<{
  conversations: BlessConversation[];
  labels?: Partial<{
    title: string;
    typing: string;
    online: string;
    unread: (count: number) => string;
  }>;
}>();
/** the id of the open conversation */
const selected = defineModel<string>();

const text = computed(() => ({
  title: "Conversations",
  typing: "typing…",
  online: "online",
  unread: (n: number) => (n === 1 ? "1 unread message" : `${n} unread messages`),
  ...pack(),
  ...props.labels,
}));
</script>

<style>
.bless-convos {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-convos__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-convos__item {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  inline-size: 100%;
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 0;
  border-inline-start: 3px solid transparent;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-convos__item:hover {
  background: var(--bless-color-surface-2);
}
.bless-convos__item[aria-current] {
  border-inline-start-color: var(--bless-color-accent);
  background: var(--bless-color-surface-2);
}
.bless-convos__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-convos__avatar {
  position: relative;
  flex: none;
}
/* online is a dot with a ring; the screen reader text says it */
.bless-convos__dot {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
  inline-size: 0.7rem;
  block-size: 0.7rem;
  border: 2px solid var(--bless-color-bg);
  border-radius: 50%;
  background: var(--bless-color-success);
}
.bless-convos__main {
  display: grid;
  flex: 1;
  gap: 2px;
  min-inline-size: 0;
}
.bless-convos__top,
.bless-convos__bottom {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-convos__name,
.bless-convos__last {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.is-unread .bless-convos__name,
.is-unread .bless-convos__last {
  font-weight: var(--bless-font-weight-bold);
}
.bless-convos__time {
  flex: none;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text);
}
.bless-convos__last {
  font-size: var(--bless-text-xs);
}
.bless-convos__last.is-typing {
  font-style: italic;
}
.bless-convos__badge {
  flex: none;
  min-inline-size: 1.25rem;
  padding: 0 var(--bless-space-1);
  border-radius: 1rem;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-2xs);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.25rem;
  text-align: center;
}
</style>
