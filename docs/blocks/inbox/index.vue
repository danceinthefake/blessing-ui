<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import {
  BlessAvatar,
  BlessBadge,
  BlessButton,
  BlessEmpty,
  BlessIndicator,
  BlessItem,
  BlessText,
  BlessToolbar,
} from "blessing-ui";
import type { Mail } from "./domain";
import { mockMailApi } from "./api";

const mails = ref<Mail[]>([]);
const openId = ref<number | null>(null);
const open = computed(() => mails.value.find((m) => m.id === openId.value) ?? null);
onMounted(async () => (mails.value = await mockMailApi.list()));
// On a phone the pane replaces the list: send focus to the message, and back to its row after.
const subject = ref<{ $el: HTMLElement }>();
const list = ref<HTMLElement>();
function read(m: Mail) {
  m.unread = false;
  openId.value = m.id;
  nextTick(() => subject.value?.$el.focus());
}
function back() {
  const i = mails.value.findIndex((m) => m.id === openId.value);
  openId.value = null;
  nextTick(() => list.value?.querySelectorAll<HTMLElement>("li > *")[i]?.focus());
}
</script>

<template>
  <div class="inbox" :class="{ 'inbox--open': open }">
    <ul ref="list" role="list" class="inbox__list" aria-label="Inbox">
      <li v-for="m in mails" :key="m.id">
        <BlessItem
          :title="m.subject"
          :description="m.preview"
          size="sm"
          :variant="m.id === openId ? 'surface' : 'plain'"
          button
          :aria-current="m.id === openId ? 'true' : undefined"
          @click="read(m)"
        >
          <template #media>
            <BlessIndicator
              :value="m.unread"
              color="accent"
              :label="m.unread ? 'Unread' : undefined"
            >
              <BlessAvatar :name="m.from" size="sm" />
            </BlessIndicator>
          </template>
          <template #title>
            <span class="inbox__from" :class="{ 'inbox__from--unread': m.unread }">{{
              m.from
            }}</span>
            <span class="inbox__time">{{ m.time }}</span>
          </template>
          <template #actions
            ><BlessBadge v-if="m.tag" color="text">{{ m.tag }}</BlessBadge></template
          >
        </BlessItem>
      </li>
    </ul>
    <div class="inbox__pane">
      <template v-if="open">
        <BlessToolbar>
          <template #start>
            <BlessButton size="sm" variant="ghost" class="inbox__back" @click="back"
              ><span aria-hidden="true">← </span>Back</BlessButton
            >
          </template>
          <template #end>
            <BlessButton size="sm" variant="ghost">Archive</BlessButton>
            <BlessButton size="sm" variant="ghost" color="danger">Delete</BlessButton>
            <BlessButton size="sm" color="accent">Reply</BlessButton>
          </template>
        </BlessToolbar>
        <BlessText
          ref="subject"
          as="h2"
          size="md"
          weight="bold"
          tabindex="-1"
          class="inbox__subject"
          >{{ open.subject }}</BlessText
        >
        <div class="inbox__meta">
          <BlessAvatar :name="open.from" size="sm" />
          <div>
            <BlessText size="sm" weight="bold">{{ open.from }}</BlessText>
            <BlessText as="p" size="xs" muted>{{ open.time }}</BlessText>
          </div>
        </div>
        <BlessText as="p" size="sm" class="inbox__body">{{ open.body }}</BlessText>
      </template>
      <BlessEmpty
        v-else
        title="Nothing selected"
        description="Pick a message on the left."
        variant="plain"
      />
    </div>
  </div>
</template>

<style scoped>
/* focus lands on the subject so the message is read; it isn't a control */
.inbox__subject:focus {
  outline: none;
}
.inbox {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) 2fr;
  min-height: 100%;
}
.inbox__list {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: auto;
  border-right: var(--bless-border-width) solid var(--bless-color-border);
}
.inbox__from {
  font-weight: var(--bless-font-weight-normal);
}
.inbox__from--unread {
  font-weight: var(--bless-font-weight-bold);
}
.inbox__time {
  float: right;
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-2xs);
}
.inbox__pane {
  padding: var(--bless-space-4) var(--bless-space-6);
}
.inbox__back {
  display: none;
}
.inbox__subject {
  margin-top: var(--bless-space-4);
}
.inbox__meta {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  margin: var(--bless-space-4) 0;
}
.inbox__body {
  white-space: pre-line;
  line-height: var(--bless-leading-normal);
}
@media (max-width: 800px) {
  .inbox {
    grid-template-columns: 1fr;
  }
  .inbox--open .inbox__list,
  .inbox:not(.inbox--open) .inbox__pane {
    display: none;
  }
  .inbox__list {
    border-right: 0;
  }
  .inbox__back {
    display: inline-flex;
  }
}
</style>
