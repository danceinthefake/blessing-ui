<template>
  <div class="inbox" :class="{ 'inbox--open': open }">
    <BlessEmpty
      v-if="loaded && !mails.length"
      class="inbox__list"
      title="Inbox zero"
      description="Every message is archived or deleted."
      variant="plain"
    />
    <ul v-else ref="list" role="list" class="inbox__list" aria-label="Inbox">
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
            <BlessIndicator :value="m.unread" :label="m.unread ? 'Unread' : undefined">
              <BlessAvatar :name="m.from.name" size="sm" />
            </BlessIndicator>
          </template>
          <template #title>
            <span class="inbox__from" :class="{ 'inbox__from--unread': m.unread }">{{
              m.from.name
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
            <BlessButton size="sm" variant="ghost" @click="drop('Archived')">Archive</BlessButton>
            <BlessButton size="sm" variant="ghost" color="danger" @click="drop('Deleted')"
              >Delete</BlessButton
            >
          </template>
        </BlessToolbar>
        <BlessEmailView
          ref="mail"
          :subject="open.subject"
          :from="open.from"
          :to="open.to"
          :cc="open.cc"
          :date="open.date"
          :body="open.body"
        >
          <template #actions>
            <BlessButton size="sm" @click="reply(false)">Reply</BlessButton>
            <BlessButton
              v-if="open.to.length + (open.cc?.length ?? 0) > 1"
              size="sm"
              variant="outline"
              @click="reply(true)"
              >Reply to all</BlessButton
            >
          </template>
        </BlessEmailView>
      </template>
      <BlessEmpty
        v-else
        title="Nothing selected"
        description="Pick a message from the list."
        variant="plain"
      />
    </div>
    <BlessModal v-model="writing" title="Reply" size="md">
      <BlessEmailComposer v-model="draft" @send="onSend" @discard="writing = false" />
    </BlessModal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import {
  BlessAvatar,
  BlessBadge,
  BlessButton,
  BlessEmailComposer,
  BlessEmailView,
  BlessEmpty,
  BlessIndicator,
  BlessItem,
  BlessModal,
  BlessToolbar,
  useToast,
  type BlessEmailDraft,
} from "blessing-ui";
import { replyDraft, type Mail } from "./domain";
import { me, mockMailApi } from "./api";

const mails = ref<Mail[]>([]);
const openId = ref<number | null>(null);
const open = computed(() => mails.value.find((m) => m.id === openId.value) ?? null);
const loaded = ref(false);
onMounted(async () => {
  mails.value = await mockMailApi.list();
  loaded.value = true;
});
// On a phone the pane replaces the list: send focus to the message, and back to its row after.
const mail = ref<{ $el: HTMLElement }>();
const list = ref<HTMLElement>();
function read(m: Mail) {
  m.unread = false;
  openId.value = m.id;
  nextTick(() => {
    const h = mail.value?.$el.querySelector<HTMLElement>("h2");
    h?.setAttribute("tabindex", "-1");
    h?.focus();
  });
}
const { toast } = useToast();
// archive and delete act at once and offer Undo; focus goes to the row that took its place
function drop(verb: "Archived" | "Deleted") {
  const i = mails.value.findIndex((m) => m.id === openId.value);
  if (i < 0) return;
  const before = [...mails.value];
  mails.value.splice(i, 1);
  openId.value = null;
  toast({
    title: `${verb} 1 message`,
    action: { label: "Undo", onClick: () => (mails.value = before) },
  });
  nextTick(() => {
    const rows = list.value?.querySelectorAll<HTMLElement>("li > *") ?? [];
    rows[Math.min(i, rows.length - 1)]?.focus();
  });
}
const writing = ref(false);
const draft = ref<BlessEmailDraft>({ to: [], cc: [], subject: "", body: "" });
function reply(all: boolean) {
  draft.value = replyDraft(open.value!, me.email, all);
  writing.value = true;
}
async function onSend(d: BlessEmailDraft) {
  await mockMailApi.send(d);
  writing.value = false;
  toast({ title: `Sent to ${d.to.join(", ")}`, color: "success" });
}
function back() {
  const i = mails.value.findIndex((m) => m.id === openId.value);
  openId.value = null;
  nextTick(() => list.value?.querySelectorAll<HTMLElement>("li > *")[i]?.focus());
}
</script>

<style scoped>
/* focus lands on the subject so the message is read; it is not a control */
.inbox__pane :deep(.bless-email__subject:focus) {
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
  border-inline-end: var(--bless-border-width) solid var(--bless-color-border);
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
@media (max-width: 800px) {
  .inbox {
    grid-template-columns: 1fr;
  }
  .inbox--open .inbox__list,
  .inbox:not(.inbox--open) .inbox__pane {
    display: none;
  }
  .inbox__list {
    border-inline-end: 0;
  }
  .inbox__back {
    display: inline-flex;
  }
}
</style>
