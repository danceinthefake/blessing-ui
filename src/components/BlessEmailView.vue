<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAttachment from "./BlessAttachment.vue";
import BlessAvatar from "./BlessAvatar.vue";

defineOptions({ name: "BlessEmailView" });
const pack = useLabelPack("BlessEmailView");

export interface BlessMailbox {
  name: string;
  email: string;
}
export interface BlessEmailAttachment {
  name: string;
  /** size and type, as text, for example "2.4 MB · PDF" */
  description?: string;
  href?: string;
}

const props = defineProps<{
  subject: string;
  from: BlessMailbox & { avatar?: string };
  to: BlessMailbox[];
  cc?: BlessMailbox[];
  /** when, as text */
  date: string;
  /** the body as plain text; blank lines start a new paragraph. For rich mail, use the slot */
  body?: string;
  attachments?: BlessEmailAttachment[];
  labels?: Partial<{
    to: string;
    cc: string;
    details: string;
    attachments: (count: number) => string;
  }>;
}>();

const text = computed(() => ({
  to: "to",
  cc: "cc",
  details: "Show the addresses",
  attachments: (n: number) => (n === 1 ? "1 attachment" : `${n} attachments`),
  ...pack(),
  ...props.labels,
}));
const open = ref(false);
const names = (list: BlessMailbox[]) => list.map((m) => m.name).join(", ");
const full = (list: BlessMailbox[]) => list.map((m) => `${m.name} <${m.email}>`).join(", ");
// "to Budi, cc Citra", with the addresses when open
const recipients = computed(() => {
  const list = (l: BlessMailbox[]) => (open.value ? full(l) : names(l));
  const parts = [`${text.value.to} ${list(props.to)}`];
  if (props.cc?.length) parts.push(`${text.value.cc} ${list(props.cc)}`);
  return parts.join(", ");
});
const paragraphs = computed(() =>
  (props.body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean),
);
</script>

<template>
  <article class="bless-email">
    <h2 class="bless-email__subject">{{ subject }}</h2>
    <header class="bless-email__head">
      <BlessAvatar :name="from.name" :src="from.avatar" alt="" size="md" />
      <div class="bless-email__people">
        <div class="bless-email__from">
          <strong>{{ from.name }}</strong>{{ " "
          }}<span class="bless-email__address">&lt;{{ from.email }}&gt;</span>
        </div>
        <div class="bless-email__to">
          {{ recipients }}
          <button
            type="button"
            class="bless-email__more"
            :aria-expanded="open"
            :aria-label="text.details"
            :title="text.details"
            @click="open = !open"
          >
            ▾
          </button>
        </div>
      </div>
      <time class="bless-email__date">{{ date }}</time>
    </header>
    <div class="bless-email__body">
      <slot>
        <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
      </slot>
    </div>
    <section
      v-if="attachments?.length"
      class="bless-email__files"
      :aria-label="text.attachments(attachments.length)"
    >
      <p class="bless-email__count">{{ text.attachments(attachments.length) }}</p>
      <div class="bless-email__grid">
        <BlessAttachment
          v-for="a in attachments"
          :key="a.name"
          :name="a.name"
          :description="a.description"
          :href="a.href"
          size="sm"
        />
      </div>
    </section>
    <footer v-if="$slots.actions" class="bless-email__actions"><slot name="actions" /></footer>
  </article>
</template>

<style>
.bless-email {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-email__subject {
  margin: 0;
  font-size: var(--bless-text-lg);
  line-height: var(--bless-leading-tight);
}
.bless-email__head {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-3);
}
.bless-email__people {
  display: grid;
  flex: 1;
  gap: 2px;
  min-inline-size: 0;
}
.bless-email__address,
.bless-email__to,
.bless-email__date {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-email__to {
  overflow-wrap: anywhere;
}
.bless-email__more {
  margin-inline-start: var(--bless-space-1);
  padding: 0 var(--bless-space-1);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-email__more[aria-expanded="true"] {
  transform: rotate(180deg);
}
.bless-email__more:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-email__date {
  flex: none;
  white-space: nowrap;
}
.bless-email__body {
  line-height: 1.6;
}
.bless-email__body > p {
  margin: 0 0 var(--bless-space-3);
}
.bless-email__files {
  display: grid;
  gap: var(--bless-space-2);
  padding-block-start: var(--bless-space-3);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-email__count {
  margin: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-email__grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-email__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
</style>
