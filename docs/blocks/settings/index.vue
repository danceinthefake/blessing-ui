<template>
  <!-- a form, so Enter in any field saves -->
  <BlessForm class="settings" @submit="save">
    <BlessText as="h1" size="lg" weight="light">Settings</BlessText>
    <BlessPanel title="Profile" :level="2">
      <div class="settings__avatar">
        <BlessAvatar :name="form.name" size="lg" />
        <BlessButton size="sm" variant="outline">Change photo</BlessButton>
      </div>
      <BlessGrid min="220px">
        <BlessField label="Name"><BlessInput v-model="form.name" /></BlessField>
        <BlessField label="Email"><BlessInput v-model="form.email" type="email" /></BlessField>
      </BlessGrid>
      <BlessField label="Bio" description="Shown on your public profile."
        ><BlessTextarea v-model="form.bio" :rows="2" autogrow
      /></BlessField>
      <BlessField label="Language"><BlessSelect v-model="form.lang" :options="langs" /></BlessField>
    </BlessPanel>
    <BlessPanel title="Notifications" :level="2">
      <div class="settings__checks">
        <!-- checkboxes, not switches: these apply on Save, and a switch promises it's done now -->
        <BlessCheckbox v-model="form.emails">Email me about account activity</BlessCheckbox>
        <BlessCheckbox v-model="form.push">Push notifications</BlessCheckbox>
        <BlessCheckbox v-model="form.digest">Weekly digest</BlessCheckbox>
      </div>
    </BlessPanel>
    <BlessPanel title="Danger zone" :level="2" class="settings__danger">
      <BlessText as="p" size="sm" muted
        >Deleting your account removes all your data. This cannot be undone.</BlessText
      >
      <BlessButton color="danger" variant="outline" size="sm" @click="confirmDelete = true"
        >Delete account</BlessButton
      >
    </BlessPanel>
    <div class="settings__bar">
      <BlessButton variant="ghost" @click="discard">Discard</BlessButton>
      <BlessButton type="submit" :loading="saving">Save changes</BlessButton>
    </div>
    <BlessAlertDialog
      v-model="confirmDelete"
      title="Delete account?"
      :labels="{ confirm: 'Delete' }"
      @confirm="confirmDelete = false"
    >
      Everything goes: profile, history, files. Type your password on the next screen to confirm.
    </BlessAlertDialog>
  </BlessForm>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { mockSettingsApi, type Profile } from "./api";
import {
  BlessAlertDialog,
  BlessAvatar,
  BlessButton,
  BlessCheckbox,
  BlessField,
  BlessForm,
  BlessGrid,
  BlessInput,
  BlessPanel,
  BlessSelect,
  BlessText,
  BlessTextarea,
  useToast,
} from "blessing-ui";

// the last saved profile; the form edits a copy, so Discard can bring it back
let saved: Profile = {
  name: "",
  email: "",
  bio: "",
  lang: "ja",
  emails: false,
  push: false,
  digest: false,
};
const form = reactive<Profile>({ ...saved });
onMounted(async () => {
  saved = await mockSettingsApi.load();
  Object.assign(form, saved);
});
const saving = ref(false);
const langs = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
];
const confirmDelete = ref(false);
const { success, info } = useToast();
async function save() {
  saving.value = true;
  await mockSettingsApi.save({ ...form });
  saved = { ...form };
  saving.value = false;
  success("Settings saved");
}
function discard() {
  Object.assign(form, saved);
  info("Changes discarded");
}
</script>

<style scoped>
.settings {
  display: grid;
  gap: var(--bless-space-6);
  max-width: 640px;
  margin: 0 auto;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.settings__avatar {
  display: flex;
  align-items: center;
  gap: var(--bless-space-4);
  margin-bottom: var(--bless-space-4);
}
.settings :deep(.bless-field) {
  margin-bottom: var(--bless-space-4);
}
.settings__checks {
  display: grid;
  gap: var(--bless-space-3);
}
.settings__danger :deep(.bless-panel__title) {
  color: var(--bless-color-danger-text);
}
.settings__danger p {
  margin-bottom: var(--bless-space-3);
}
.settings__bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--bless-space-2);
  padding-top: var(--bless-space-4);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
</style>
