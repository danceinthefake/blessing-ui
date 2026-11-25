<template>
  <figure class="bless-pullquote" :class="`is-${align}`">
    <blockquote class="bless-pullquote__quote" :cite>
      <p><slot>{{ text }}</slot></p>
    </blockquote>
    <figcaption v-if="speaker" class="bless-pullquote__by">
      <span class="bless-pullquote__speaker">{{ speaker }}</span>
      <span v-if="role" class="bless-pullquote__role">{{ role }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
defineOptions({ name: "BlessPullQuote" });

withDefaults(
  defineProps<{
    /** the quote, without quote marks */
    text?: string;
    /** who said it */
    speaker?: string;
    /** a role or a source under the name */
    role?: string;
    /** a link to the source, for the cite attribute */
    cite?: string;
    align?: "start" | "center";
  }>(),
  { align: "start" },
);
</script>

<style>
.bless-pullquote {
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: var(--bless-space-6);
  border-radius: var(--bless-radius);
  border-inline-start: 3px solid var(--bless-color-accent);
  background: var(--bless-color-surface);
  box-shadow: var(--bless-shadow-sm);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-pullquote.is-center {
  justify-items: center;
  text-align: center;
  border-inline-start: 0;
}
/* two classes, so the blockquote styles of a host page (such as VitePress) do not win */
.bless-pullquote .bless-pullquote__quote {
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-pullquote .bless-pullquote__quote p {
  color: inherit;
  margin: 0;
  font-family: var(--bless-font-serif);
  font-size: var(--bless-text-xl);
  font-weight: 400;
  font-style: italic;
  line-height: 1.38;
}
/* the marks come from CSS, in the style of the language of the page */
.bless-pullquote__quote p::before {
  content: open-quote;
  color: var(--bless-color-accent);
}
.bless-pullquote__quote p::after {
  content: close-quote;
  color: var(--bless-color-accent);
}
.bless-pullquote__by {
  display: grid;
  font-size: var(--bless-text-sm);
}
.bless-pullquote__speaker {
  font-weight: var(--bless-font-weight-bold);
}
.bless-pullquote__speaker::before {
  content: "— ";
}
.bless-pullquote__role {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
