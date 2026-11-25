<template>
  <div class="files">
    <aside class="files__aside" aria-label="Storage">
      <BlessButton block @click="uploading = true">Upload</BlessButton>
      <BlessQuotaUsage
        :quotas="[{ label: 'Storage', used: Math.round(used / MB), limit: 2048, unit: 'MB' }]"
        locale="en-US"
      />
    </aside>
    <div class="files__main">
      <div class="files__bar">
        <BlessText as="h1" size="lg" weight="light">Files</BlessText>
        <BlessInput
          v-model="query"
          type="search"
          aria-label="Search in this folder"
          placeholder="Search in this folder"
          class="files__search"
        />
      </div>
      <BlessFileBrowser
        v-model:view="view"
        :items
        :path
        locale="en-US"
        @open="(f) => open(f.id)"
        @navigate="open"
      />
    </div>
    <section
      v-if="selected"
      ref="details"
      tabindex="-1"
      class="files__details"
      aria-labelledby="files-name"
    >
      <BlessText id="files-name" as="h2" weight="bold" class="files__name">{{
        selected.name
      }}</BlessText>
      <BlessDescriptions
        :columns="1"
        :items="[
          { label: 'Type', value: kind(selected.name) },
          { label: 'Size', value: bytes(selected.size ?? 0) },
          { label: 'Modified', value: selected.modified },
          { label: 'Folder', value: path.at(-1)!.label },
        ]"
      />
      <div class="files__actions">
        <BlessButton variant="outline" size="sm" @click="startRename">Rename</BlessButton>
        <BlessButton variant="outline" color="danger" size="sm" @click="deleting = true"
          >Delete</BlessButton
        >
        <BlessButton variant="ghost" size="sm" @click="selected = undefined">Close</BlessButton>
      </div>
    </section>

    <BlessModal v-model="uploading" title="Upload to this folder" size="sm">
      <BlessUploader
        multiple
        auto
        :max-size="50 * MB"
        hint="Up to 50 MB per file"
        @upload="onUpload"
      />
    </BlessModal>
    <BlessModal v-model="renaming" title="Rename" size="sm">
      <BlessForm class="files__form" @submit="onRename">
        <BlessField label="Name" :error="renameError">
          <BlessInput v-model="newName" name="name" @input="renameError = ''" />
        </BlessField>
        <BlessButton type="submit">Save</BlessButton>
      </BlessForm>
    </BlessModal>
    <BlessAlertDialog
      v-model="deleting"
      :title="`Delete ${selected?.name}?`"
      description="You cannot undo this."
      color="danger"
      :labels="{ confirm: 'Delete' }"
      @confirm="onDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import {
  BlessAlertDialog,
  BlessButton,
  BlessDescriptions,
  BlessField,
  BlessFileBrowser,
  BlessForm,
  BlessInput,
  BlessModal,
  BlessQuotaUsage,
  BlessText,
  BlessUploader,
  useToast,
  type BlessUpload,
} from "blessing-ui";
import { mockFilesApi } from "./api";
import { useFiles } from "./useFiles";

const { items, path, used, query, selected, open, upload, rename, remove } = useFiles(mockFilesApi);
const MB = 1024 * 1024;
const view = ref<"grid" | "list">("grid");
const bytes = (n: number) => (n >= MB ? `${(n / MB).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`);
const kind = (name: string) => name.split(".").pop()!.toUpperCase();
const { toast } = useToast();

// a picked file shows its details: focus moves there, so a screen reader hears the name
const details = ref<HTMLElement>();
watch(selected, (n) => n && nextTick(() => details.value?.focus()));

const uploading = ref(false);
function onUpload(
  item: BlessUpload,
  progress: (n: number) => void,
  done: () => void,
  fail: (m?: string) => void,
) {
  upload(item.file, progress).then(done, (e: Error) => fail(e.message));
}

const renaming = ref(false);
const newName = ref("");
const renameError = ref("");
function startRename() {
  newName.value = selected.value!.name;
  renameError.value = "";
  renaming.value = true;
}
async function onRename() {
  renameError.value = await rename(newName.value);
  if (!renameError.value) renaming.value = false;
}

const deleting = ref(false);
async function onDelete() {
  const name = selected.value!.name;
  await remove();
  deleting.value = false;
  toast({ title: `${name} deleted`, color: "success" });
}
</script>

<style scoped>
.files {
  display: grid;
  grid-template-columns: 14rem minmax(0, 1fr) auto;
  gap: var(--bless-space-6);
  align-items: start;
  padding: var(--bless-space-6);
}
.files__aside {
  display: grid;
  gap: var(--bless-space-6);
}
.files__main {
  display: grid;
  gap: var(--bless-space-4);
}
.files__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-3);
}
.files__search {
  width: min(100%, 16rem);
}
.files__details {
  display: grid;
  gap: var(--bless-space-4);
  width: 16rem;
  padding: var(--bless-space-4);
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
  box-shadow: var(--bless-shadow-sm);
}
.files__details:focus {
  outline: none;
}
.files__name {
  overflow-wrap: anywhere;
}
.files__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.files__form {
  display: grid;
  gap: var(--bless-space-4);
}
@media (max-width: 900px) {
  .files {
    grid-template-columns: minmax(0, 1fr);
    padding-inline: var(--bless-space-4);
  }
  .files__details {
    width: auto;
  }
}
</style>
