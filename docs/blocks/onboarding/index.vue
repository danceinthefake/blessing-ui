<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  BlessButton,
  BlessField,
  BlessInput,
  BlessInputTags,
  BlessRadio,
  BlessRadioGroup,
  BlessStepper,
  BlessText,
  blessPalettes,
  useTheme,
  type BlessPalette,
} from "blessing-ui";

const steps = [
  { label: "Workspace", description: "Name it" },
  { label: "Team", description: "Invite people" },
  { label: "Look", description: "Pick a palette" },
];
const step = ref(0);
const form = reactive({ name: "", invites: [] as string[], palette: "megumi" as BlessPalette });
const done = ref(false);
const { setPalette } = useTheme();
</script>

<template>
  <div class="onboard">
    <template v-if="!done">
      <BlessText as="h1" size="lg" weight="light">Welcome</BlessText>
      <BlessText as="p" size="sm" muted class="onboard__lead"
        >Three quick things and you're in.</BlessText
      >
      <BlessStepper v-model="step" :steps @finish="done = true">
        <template #default="{ index }">
          <BlessField v-if="index === 0" label="Workspace name" hint="You can change this later.">
            <BlessInput v-model="form.name" placeholder="Blessing Software" />
          </BlessField>
          <BlessField
            v-else-if="index === 1"
            label="Invite by email"
            hint="Press Enter after each address."
          >
            <BlessInputTags v-model="form.invites" placeholder="eriri@example.com" />
          </BlessField>
          <BlessRadioGroup
            v-else
            v-model="form.palette"
            label="Palette"
            @update:model-value="(p) => setPalette(p as BlessPalette)"
          >
            <BlessRadio v-for="p in blessPalettes" :key="p" :value="p">{{ p }}</BlessRadio>
          </BlessRadioGroup>
        </template>
      </BlessStepper>
    </template>
    <div v-else class="onboard__done">
      <BlessText as="h1" size="lg" weight="light"
        >You're set, {{ form.name || "friend" }}.</BlessText
      >
      <BlessText as="p" size="sm" muted
        >{{ form.invites.length }} invite{{ form.invites.length === 1 ? "" : "s" }} sent · palette
        {{ form.palette }}</BlessText
      >
      <BlessButton
        color="accent"
        @click="
          done = false;
          step = 0;
        "
        >Open workspace</BlessButton
      >
    </div>
  </div>
</template>

<style scoped>
.onboard {
  max-width: 520px;
  margin: 0 auto;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.onboard__lead {
  margin-bottom: var(--bless-space-6);
}
.onboard :deep(.bless-stepper__panel) {
  min-height: 120px;
  padding: var(--bless-space-6) 0;
}
.onboard__done {
  display: grid;
  gap: var(--bless-space-4);
  justify-items: start;
}
</style>
