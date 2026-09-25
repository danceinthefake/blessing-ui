<script setup lang="ts">
import BlessAvatar from "./BlessAvatar.vue";

defineOptions({ name: "BlessMessage" });

withDefaults(
  defineProps<{
    /** sender name, shown in header and used for avatar initials */
    name?: string;
    /** timestamp / meta text in header */
    time?: string;
    /** machine-readable form of `time` for the <time> element */
    datetime?: string;
    avatar?: string;
    /** start = other party, end = self */
    align?: "start" | "end";
    /** hide avatar column (consecutive messages in a group) */
    compact?: boolean;
  }>(),
  { align: "start" },
);
</script>

<template>
  <article
    class="bless-message"
    :class="[`bless-message--${align}`, { 'bless-message--compact': compact }]"
  >
    <span v-if="!compact" class="bless-message__avatar">
      <slot name="avatar"><BlessAvatar :src="avatar" :name size="sm" /></slot>
    </span>
    <div class="bless-message__body">
      <header v-if="!compact && (name || time || $slots.header)" class="bless-message__header">
        <slot name="header">
          <strong v-if="name">{{ name }}</strong>
          <time v-if="time" :datetime>{{ time }}</time>
        </slot>
      </header>
      <div class="bless-message__content"><slot /></div>
      <footer v-if="$slots.footer" class="bless-message__footer"><slot name="footer" /></footer>
    </div>
    <span v-if="$slots.actions" class="bless-message__actions"><slot name="actions" /></span>
  </article>
</template>

<style>
.bless-message {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-message--end {
  flex-direction: row-reverse;
}
.bless-message--compact {
  /* keep content aligned with the avatar'd message above (sm avatar 32px + gap) */
  padding-inline-start: calc(32px + var(--bless-space-2));
}
.bless-message--end.bless-message--compact {
  padding-inline-start: 0;
  padding-inline-end: calc(32px + var(--bless-space-2));
}
.bless-message__avatar {
  flex: none;
}
.bless-message__body {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-1);
  min-width: 0;
  max-width: min(100%, 65ch);
}
.bless-message--end .bless-message__body {
  align-items: flex-end;
}
.bless-message__header {
  display: flex;
  gap: var(--bless-space-2);
  align-items: baseline;
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-message__header time {
  color: var(--bless-color-text-muted);
}
.bless-message__content {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-1);
}
.bless-message--end .bless-message__content {
  align-items: flex-end;
}
.bless-message__footer {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-message__actions {
  display: inline-flex;
  gap: var(--bless-space-1);
  align-self: center;
  opacity: 0;
  transition: opacity var(--bless-duration-base);
}
.bless-message:hover .bless-message__actions,
.bless-message:focus-within .bless-message__actions {
  opacity: 1;
}
</style>
