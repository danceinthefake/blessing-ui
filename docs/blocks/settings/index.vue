<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  BlessAlertDialog,
  BlessAvatar,
  BlessButton,
  BlessField,
  BlessInput,
  BlessPanel,
  BlessSelect,
  BlessSwitch,
  BlessText,
  BlessTextarea,
  useToast,
} from "blessing-ui";

const form = reactive({
  name: "加藤 恵",
  email: "megumi@example.com",
  bio: "同じクラスの、目立たない女の子。",
  lang: "ja",
  emails: true,
  push: false,
  digest: true,
});
const langs = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
];
const confirmDelete = ref(false);
const { success } = useToast();
</script>

<template>
  <div class="settings">
    <BlessText as="h1" size="lg" weight="light">Settings</BlessText>
    <BlessPanel title="Profile">
      <div class="settings__avatar">
        <BlessAvatar :name="form.name" size="lg" />
        <BlessButton size="sm" variant="outline">Change photo</BlessButton>
      </div>
      <div class="settings__grid">
        <BlessField label="Name"><BlessInput v-model="form.name" /></BlessField>
        <BlessField label="Email"><BlessInput v-model="form.email" type="email" /></BlessField>
      </div>
      <BlessField label="Bio" hint="Shown on your public profile."
        ><BlessTextarea v-model="form.bio" :rows="2" autogrow
      /></BlessField>
      <BlessField label="Language"><BlessSelect v-model="form.lang" :options="langs" /></BlessField>
    </BlessPanel>
    <BlessPanel title="Notifications">
      <div class="settings__switches">
        <BlessSwitch v-model="form.emails">Email me about account activity</BlessSwitch>
        <BlessSwitch v-model="form.push">Push notifications</BlessSwitch>
        <BlessSwitch v-model="form.digest">Weekly digest</BlessSwitch>
      </div>
    </BlessPanel>
    <BlessPanel title="Danger zone" class="settings__danger">
      <BlessText as="p" size="sm" muted
        >Deleting your account removes all your data. This cannot be undone.</BlessText
      >
      <BlessButton color="danger" variant="outline" size="sm" @click="confirmDelete = true"
        >Delete account</BlessButton
      >
    </BlessPanel>
    <div class="settings__bar">
      <BlessButton variant="ghost">Discard</BlessButton>
      <BlessButton color="accent" @click="success('Settings saved')">Save changes</BlessButton>
    </div>
    <BlessAlertDialog
      v-model="confirmDelete"
      title="Delete account?"
      confirm-label="Delete"
      @confirm="confirmDelete = false"
    >
      Everything goes: profile, history, files. Type your password on the next screen to confirm.
    </BlessAlertDialog>
  </div>
</template>

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
.settings__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--bless-space-4);
}
.settings :deep(.bless-field) {
  margin-bottom: var(--bless-space-4);
}
.settings__switches {
  display: grid;
  gap: var(--bless-space-3);
}
.settings__danger :deep(.bless-panel__title) {
  color: var(--bless-color-danger);
}
.settings__danger p {
  margin-bottom: var(--bless-space-3);
}
.settings__bar {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3) 0;
  background: var(--bless-color-bg);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
</style>
