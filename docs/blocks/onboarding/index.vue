<script setup lang="ts">
import { nextTick, reactive, ref, watch } from "vue";
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
// the finished screen replaces the stepper (and the button that had focus): move focus to it
const doneHead = ref<{ $el: HTMLElement }>();
watch(done, (d) => d && nextTick(() => doneHead.value?.$el.focus()));
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
// in an app this would navigate; here it starts over — either way focus follows to the new screen
const welcome = ref<{ $el: HTMLElement }>();
function restart() {
  done.value = false;
  step.value = 0;
  nextTick(() => welcome.value?.$el.focus());
}
</script>

<template>
  <div class="onboard">
    <template v-if="!done">
      <BlessText ref="welcome" as="h1" size="lg" weight="light" tabindex="-1" class="onboard__head"
        >Welcome</BlessText
      >
      <BlessText as="p" size="sm" muted class="onboard__lead"
        >Three quick things and you're in.</BlessText
      >
      <BlessStepper v-model="step" :steps @finish="done = true">
        <template #default="{ index }">
          <BlessField
            v-if="index === 0"
            label="Workspace name"
            description="You can change this later."
          >
            <BlessInput v-model="form.name" placeholder="Blessing Software" />
          </BlessField>
          <BlessField
            v-else-if="index === 1"
            label="Invite by email"
            description="Press Enter or type a comma after each address."
          >
            <BlessInputTags v-model="form.invites" placeholder="eriri@example.com" />
          </BlessField>
          <BlessRadioGroup
            v-else
            v-model="form.palette"
            label="Palette"
            @update:model-value="(p) => setPalette(p as BlessPalette)"
          >
            <BlessRadio v-for="p in blessPalettes" :key="p.name" :value="p.name"
              ><span class="onboard__chip" :style="{ background: p.color }" aria-hidden="true" />{{
                cap(p.name)
              }}</BlessRadio
            >
          </BlessRadioGroup>
        </template>
      </BlessStepper>
    </template>
    <div v-else class="onboard__done">
      <BlessText ref="doneHead" as="h1" size="lg" weight="light" tabindex="-1" class="onboard__head"
        >You're set, {{ form.name || "friend" }}.</BlessText
      >
      <BlessText as="p" size="sm" muted
        >{{ form.invites.length }} invite{{ form.invites.length === 1 ? "" : "s" }} sent · palette
        {{ cap(form.palette) }}</BlessText
      >
      <BlessButton @click="restart">Open workspace</BlessButton>
    </div>
  </div>
</template>

<style scoped>
.onboard__head:focus {
  outline: none;
}
.onboard__chip {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-inline-end: var(--bless-space-2);
  vertical-align: -1px;
  transform: skewX(var(--bless-skew));
}
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
