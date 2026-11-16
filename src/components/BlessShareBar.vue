<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { copyText } from "../composables/copyText";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessShareBar" });
const pack = useLabelPack("BlessShareBar");

export interface BlessShareTarget {
  label: string;
  /** the share link of the service, with the page in it */
  href: string;
}

const props = defineProps<{
  /** the page to share */
  url: string;
  title?: string;
  /** share links of the services you choose */
  targets?: BlessShareTarget[];
  labels?: Partial<{ title: string; share: string; copy: string; copied: string }>;
}>();
const emit = defineEmits<{ shared: [how: string] }>();

const text = computed(() => ({
  title: "Share",
  share: "Share…",
  copy: "Copy link",
  copied: "Link copied",
  ...pack(),
  ...props.labels,
}));
// the Web Share API is known only in the browser, so the button shows after mount
const canShare = ref(false);
onMounted(() => (canShare.value = typeof navigator !== "undefined" && "share" in navigator));
const said = ref("");
async function share() {
  try {
    await navigator.share({ url: props.url, title: props.title });
    emit("shared", "system");
  } catch {
    // the reader closed the share sheet; nothing to do
  }
}
async function copy() {
  await copyText(props.url);
  said.value = "";
  said.value = text.value.copied;
  emit("shared", "copy");
}
</script>

<template>
  <div class="bless-share" role="group" :aria-label="text.title">
    <button v-if="canShare" type="button" class="bless-share__btn is-main" @click="share">
      <span aria-hidden="true">⇪</span> {{ text.share }}
    </button>
    <button type="button" class="bless-share__btn" @click="copy">
      {{ said || text.copy }}
    </button>
    <a
      v-for="t in targets"
      :key="t.label"
      class="bless-share__btn"
      :href="t.href"
      target="_blank"
      rel="noopener"
      @click="emit('shared', t.label)"
      >{{ t.label }}</a
    >
    <span class="bless-sr" role="status">{{ said }}</span>
  </div>
</template>

<style>
.bless-share {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-share__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}
.bless-share__btn.is-main {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-share__btn:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
