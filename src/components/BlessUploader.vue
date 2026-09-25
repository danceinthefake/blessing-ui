<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessFileInput from "./BlessFileInput.vue";
import BlessProgress from "./BlessProgress.vue";

defineOptions({ name: "BlessUploader" });

export interface BlessUpload {
  id: number;
  file: File;
  progress: number;
  status: "queued" | "uploading" | "done" | "error" | "cancelled";
  error?: string;
  xhr?: XMLHttpRequest;
}

const props = withDefaults(
  defineProps<{
    /** POST target; omit to handle uploads yourself via the `upload` event */
    url?: string;
    /** form field name */
    field?: string;
    headers?: Record<string, string>;
    accept?: string;
    multiple?: boolean;
    /** start as soon as files are picked */
    auto?: boolean;
    maxSize?: number;
    label?: string;
    hint?: string;
  }>(),
  { field: "file", multiple: true, auto: false, label: "Drop files here or click to browse" },
);
const emit = defineEmits<{
  /** fires per file when `url` is not set: call `progress(n)` then `done()` / `fail(msg)` */
  upload: [
    item: BlessUpload,
    progress: (n: number) => void,
    done: () => void,
    fail: (msg?: string) => void,
  ];
  done: [item: BlessUpload];
  error: [item: BlessUpload];
}>();
const queue = ref<BlessUpload[]>([]);
const picked = ref<File[]>([]);
let seq = 0;
const live = ref(""); // finished and failed uploads are announced; progress ticks are not

function onPick(files: File[]) {
  for (const f of files) {
    if (props.maxSize && f.size > props.maxSize) {
      queue.value.push({ id: ++seq, file: f, progress: 0, status: "error", error: "Too large" });
      continue;
    }
    queue.value.push({ id: ++seq, file: f, progress: 0, status: "queued" });
  }
  picked.value = [];
  if (props.auto) start();
}
function send(item: BlessUpload) {
  item.status = "uploading";
  const progress = (n: number) => (item.progress = Math.max(0, Math.min(100, n)));
  const done = () => {
    item.status = "done";
    item.progress = 100;
    live.value = `${item.file.name} uploaded`;
    emit("done", item);
  };
  const fail = (msg?: string) => {
    item.status = "error";
    item.error = msg ?? "Upload failed";
    live.value = `${item.file.name}: ${item.error}`;
    emit("error", item);
  };
  if (!props.url) return void emit("upload", item, progress, done, fail);
  const xhr = new XMLHttpRequest();
  item.xhr = xhr;
  xhr.open("POST", props.url);
  for (const [k, v] of Object.entries(props.headers ?? {})) xhr.setRequestHeader(k, v);
  xhr.upload.onprogress = (e) => e.lengthComputable && progress((e.loaded / e.total) * 100);
  xhr.onload = () => (xhr.status < 400 ? done() : fail(`HTTP ${xhr.status}`));
  xhr.onerror = () => fail();
  xhr.onabort = () => (item.status = "cancelled");
  const fd = new FormData();
  fd.append(props.field, item.file);
  xhr.send(fd);
}
const start = () => queue.value.filter((i) => i.status === "queued").forEach(send);
const cancel = (item: BlessUpload) => (item.xhr ? item.xhr.abort() : (item.status = "cancelled"));
const remove = (item: BlessUpload) => (
  item.status === "uploading" && cancel(item),
  (queue.value = queue.value.filter((i) => i !== item))
);
const clear = () => (queue.value = queue.value.filter((i) => i.status === "uploading"));
const kb = (n: number) =>
  n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`;
// a request outlives the component unless it is stopped
onBeforeUnmount(() => queue.value.forEach((i) => i.status === "uploading" && i.xhr?.abort()));
defineExpose({ start, clear, queue });
</script>

<template>
  <div class="bless-uploader">
    <BlessFileInput
      v-model="picked"
      :accept
      :multiple
      :label
      :hint
      :list="false"
      @update:model-value="onPick"
    />
    <ul role="list" v-if="queue.length" class="bless-uploader__list">
      <li
        v-for="it in queue"
        :key="it.id"
        class="bless-uploader__item"
        :class="`bless-uploader__item--${it.status}`"
      >
        <span class="bless-uploader__name">{{ it.file.name }}</span>
        <span class="bless-uploader__meta">{{
          it.error ??
          (it.status === "done"
            ? "done"
            : it.status === "uploading"
              ? `${Math.round(it.progress)}%`
              : kb(it.file.size))
        }}</span>
        <BlessProgress
          v-if="it.status === 'uploading'"
          :value="it.progress"
          size="sm"
          class="bless-uploader__bar"
        />
        <button
          v-if="it.status === 'uploading'"
          type="button"
          class="bless-uploader__x"
          :aria-label="`Cancel ${it.file.name}`"
          @click="cancel(it)"
        >
          ×
        </button>
        <button
          v-else
          type="button"
          class="bless-uploader__x"
          :aria-label="`Remove ${it.file.name}`"
          @click="remove(it)"
        >
          ×
        </button>
      </li>
    </ul>
    <span class="bless-uploader__live" aria-live="polite">{{ live }}</span>
    <div v-if="queue.length" class="bless-uploader__actions">
      <slot name="actions" :start :clear :queue>
        <BlessButton size="sm" variant="outline" @click="clear">Clear</BlessButton>
        <BlessButton
          v-if="!auto"
          size="sm"
          color="accent"
          :disabled="!queue.some((i) => i.status === 'queued')"
          @click="start"
          >Upload</BlessButton
        >
      </slot>
    </div>
  </div>
</template>

<style>
.bless-uploader__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.bless-uploader {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-uploader__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-uploader__item {
  border-radius: var(--bless-radius);
  display: grid;
  grid-template-columns: 1fr auto 24px;
  align-items: center;
  gap: 2px var(--bless-space-2);
  padding: var(--bless-space-2) 0;
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-sm);
}
.bless-uploader__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-uploader__meta {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-uploader__item--done .bless-uploader__meta {
  color: var(--bless-color-success);
}
.bless-uploader__item--error .bless-uploader__meta {
  color: var(--bless-color-danger-text);
}
.bless-uploader__item--cancelled {
  opacity: 0.5;
}
.bless-uploader__bar {
  grid-column: 1 / -1;
}
.bless-uploader__x {
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-md);
  cursor: pointer;
}
.bless-uploader__x:hover {
  color: var(--bless-color-danger-text);
}
.bless-uploader__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--bless-space-2);
}
</style>
