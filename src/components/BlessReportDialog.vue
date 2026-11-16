<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessModal from "./BlessModal.vue";

defineOptions({ name: "BlessReportDialog" });
const pack = useLabelPack("BlessReportDialog");

const props = withDefaults(
  defineProps<{
    /** what is reported, for the title, for example "this post" */
    subject?: string;
    /** the reasons to choose from */
    reasons?: string[];
    labels?: Partial<{
      title: (subject: string) => string;
      why: string;
      note: string;
      send: string;
      cancel: string;
      missing: string;
      thanks: string;
      thanksBody: string;
      close: string;
    }>;
  }>(),
  {
    subject: "this post",
    reasons: () => [
      "Spam",
      "Harassment or hate",
      "Violence or danger",
      "False information",
      "Something else",
    ],
  },
);
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ report: [reason: string, note: string] }>();

const text = computed(() => ({
  title: (s: string) => `Report ${s}`,
  why: "Why do you report it?",
  note: "Tell us more (optional)",
  send: "Send the report",
  cancel: "Cancel",
  missing: "Pick a reason.",
  thanks: "Thank you",
  thanksBody: "We will look at it. The person does not see who reported it.",
  close: "Close",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const reason = ref("");
const note = ref("");
const tried = ref(false);
const done = ref(false);
// a fresh form each time the dialog opens
watch(open, (o) => {
  if (o) {
    reason.value = "";
    note.value = "";
    tried.value = false;
    done.value = false;
  }
});
function send() {
  tried.value = true;
  if (!reason.value) return;
  emit("report", reason.value, note.value.trim());
  done.value = true;
}
</script>

<template>
  <BlessModal v-model="open" size="sm" :title="done ? text.thanks : text.title(subject)">
    <div v-if="done" class="bless-report__done" role="status">
      <p>{{ text.thanksBody }}</p>
      <BlessButton @click="open = false">{{ text.close }}</BlessButton>
    </div>
    <form v-else class="bless-report" novalidate @submit.prevent="send">
      <fieldset
        class="bless-report__set"
        role="radiogroup"
        :aria-invalid="tried && !reason ? 'true' : undefined"
        :aria-describedby="`${uid}-err`"
      >
        <legend class="bless-report__legend">{{ text.why }}</legend>
        <label v-for="r in reasons" :key="r" class="bless-report__reason">
          <input v-model="reason" type="radio" :name="`${uid}-reason`" :value="r" />
          {{ r }}
        </label>
      </fieldset>
      <p :id="`${uid}-err`" class="bless-report__error" role="alert">
        {{ tried && !reason ? text.missing : "" }}
      </p>
      <label class="bless-report__field">
        <span>{{ text.note }}</span>
        <textarea v-model="note" rows="3" />
      </label>
      <div class="bless-report__actions">
        <BlessButton type="submit">{{ text.send }}</BlessButton>
        <BlessButton variant="ghost" @click="open = false">{{ text.cancel }}</BlessButton>
      </div>
    </form>
  </BlessModal>
</template>

<style>
.bless-report,
.bless-report__done {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-report__done p {
  margin: 0;
}
.bless-report__set {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-report__legend {
  margin-block-end: var(--bless-space-2);
  padding: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-report__reason {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-block-size: 2rem;
  cursor: pointer;
}
.bless-report__reason input {
  accent-color: var(--bless-color-accent);
}
.bless-report__reason input:focus-visible,
.bless-report__field textarea:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-report__error {
  margin: 0;
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-report__error:empty {
  display: none;
}
.bless-report__field {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-report__field textarea {
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  resize: vertical;
}
.bless-report__actions {
  display: flex;
  gap: var(--bless-space-2);
}
</style>
