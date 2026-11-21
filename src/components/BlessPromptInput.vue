<template>
  <div
    class="bless-prompt"
    :class="{ 'bless-prompt--disabled': disabled }"
    @dragover="attach && $event.preventDefault()"
    @drop="attach && ($event.preventDefault(), add($event.dataTransfer?.files))"
  >
    <ul v-if="files.length" role="list" class="bless-prompt__files">
      <li v-for="(f, i) in files" :key="`${f.name}-${i}`">
        <BlessAttachment
          :name="f.name"
          :description="size(f.size)"
          size="sm"
          removable
          :labels="{ remove: `${text.remove} ${f.name}` }"
          @remove="files = files.filter((_, k) => k !== i)"
        />
      </li>
    </ul>
    <textarea
      ref="box"
      v-model="model"
      class="bless-prompt__box"
      rows="1"
      :style="{ '--_rows': maxRows }"
      :disabled
      :aria-label="text.label"
      :placeholder="text.placeholder"
      @keydown="onKey"
    />
    <div class="bless-prompt__bar">
      <template v-if="attach">
        <BlessButton
          variant="ghost"
          size="sm"
          icon
          :disabled
          :aria-label="text.attach"
          @click="picker?.click()"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              d="M11 4.5 5.8 9.7a1.2 1.2 0 0 0 1.7 1.7l5.2-5.2a2.6 2.6 0 0 0-3.6-3.6L3.8 7.9a4 4 0 0 0 5.6 5.6L13.5 9.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </BlessButton>
        <input ref="picker" type="file" multiple :accept hidden @change="onPick" />
      </template>
      <slot name="actions" />
      <BlessButton
        v-if="busy"
        class="bless-prompt__go"
        size="sm"
        icon
        :aria-label="text.stop"
        @click="emit('stop')"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <rect x="4" y="4" width="8" height="8" fill="currentColor" />
        </svg>
      </BlessButton>
      <BlessButton
        v-else
        class="bless-prompt__go"
        size="sm"
        icon
        color="accent"
        :disabled="!canSend"
        :aria-label="text.send"
        @click="send"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path
            d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </BlessButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAttachment from "./BlessAttachment.vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessPromptInput" });
const pack = useLabelPack("BlessPromptInput");

const props = withDefaults(
  defineProps<{
    /** a reply is coming in: the send button becomes a stop button */
    busy?: boolean;
    disabled?: boolean;
    /** show the attach button; a text sets the file types, as `accept` on a file input */
    attach?: boolean | string;
    /** the most lines before the box scrolls */
    maxRows?: number;
    labels?: Partial<{
      label: string;
      placeholder: string;
      send: string;
      stop: string;
      attach: string;
      remove: string;
    }>;
  }>(),
  { maxRows: 8 },
);
const emit = defineEmits<{
  /** the text and the files; the box is then empty again */
  send: [message: { text: string; files: File[] }];
  /** the stop button while `busy` */
  stop: [];
}>();

const text = computed(() => ({
  label: "Message",
  placeholder: "Ask anything",
  send: "Send",
  stop: "Stop",
  attach: "Attach files",
  remove: "Remove",
  ...pack(),
  ...props.labels,
}));
const model = defineModel<string>({ default: "" });
const files = defineModel<File[]>("files", { default: () => [] });
const picker = ref<HTMLInputElement>();
const box = ref<HTMLTextAreaElement>();

const canSend = computed(
  () => !props.disabled && !props.busy && (!!model.value.trim() || files.value.length > 0),
);
function send() {
  if (!canSend.value) return;
  emit("send", { text: model.value.trim(), files: files.value });
  model.value = "";
  files.value = [];
  box.value?.focus();
}
function onKey(e: KeyboardEvent) {
  // Enter sends; Shift+Enter adds a line, and Enter inside an input method (IME) picks a word
  if (e.key !== "Enter" || e.shiftKey || e.isComposing || e.keyCode === 229) return;
  e.preventDefault();
  send();
}
function add(list: FileList | null | undefined) {
  if (list?.length) files.value = [...files.value, ...list];
}
function onPick(e: Event) {
  const input = e.target as HTMLInputElement;
  add(input.files);
  input.value = "";
}
const accept = computed(() => (typeof props.attach === "string" ? props.attach : undefined));
const size = (n: number) =>
  n < 1024
    ? `${n} B`
    : n < 1048576
      ? `${Math.round(n / 1024)} KB`
      : `${(n / 1048576).toFixed(1)} MB`;
</script>

<style>
.bless-prompt {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-plate);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
}
.bless-prompt:has(.bless-prompt__box:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-prompt--disabled {
  opacity: 0.6;
}
.bless-prompt__files {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-prompt__box {
  inline-size: 100%;
  min-block-size: 1lh;
  max-block-size: calc(var(--_rows) * 1lh);
  padding: var(--bless-space-1) 0;
  border: 0;
  background: none;
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-md);
  line-height: 1.5;
  resize: none;
  field-sizing: content;
}
.bless-prompt__box:focus {
  outline: none;
}
.bless-prompt__box::placeholder {
  color: var(--bless-color-text-muted);
}
.bless-prompt__bar {
  display: flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-prompt__go {
  margin-inline-start: auto;
}
</style>
