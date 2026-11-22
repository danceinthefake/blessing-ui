<template>
  <div class="bless-contact">
    <p v-if="state === 'sent'" class="bless-contact__sent" role="status">✓ {{ text.sent }}</p>
    <form v-else ref="form" class="bless-contact__form" novalidate @submit.prevent="submit">
      <div class="bless-contact__row">
        <div class="bless-contact__field">
          <label :for="`${id}-name`">{{ text.name }}</label>
          <input
            :id="`${id}-name`"
            v-model="v.name"
            name="name"
            autocomplete="name"
            :aria-invalid="!!errors.name || undefined"
            :aria-describedby="err('name')"
          />
          <div v-if="errors.name" :id="err('name')" class="bless-contact__error">
            {{ errors.name }}
          </div>
        </div>
        <div class="bless-contact__field">
          <label :for="`${id}-email`">{{ text.email }}</label>
          <input
            :id="`${id}-email`"
            v-model="v.email"
            name="email"
            type="email"
            autocomplete="email"
            :aria-invalid="!!errors.email || undefined"
            :aria-describedby="err('email')"
          />
          <div v-if="errors.email" :id="err('email')" class="bless-contact__error">
            {{ errors.email }}
          </div>
        </div>
      </div>
      <div v-if="topics.length" class="bless-contact__field">
        <label :for="`${id}-topic`">{{ text.topic }}</label>
        <select :id="`${id}-topic`" v-model="v.topic" name="topic">
          <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="bless-contact__field">
        <label :for="`${id}-message`">{{ text.message }}</label>
        <textarea
          :id="`${id}-message`"
          v-model="v.message"
          name="message"
          rows="5"
          :aria-invalid="!!errors.message || undefined"
          :aria-describedby="err('message')"
        />
        <div v-if="errors.message" :id="err('message')" class="bless-contact__error">
          {{ errors.message }}
        </div>
      </div>
      <input
        v-model="trap"
        class="bless-contact__trap"
        name="website"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />
      <p v-if="state === 'error'" class="bless-contact__failed" role="alert">{{ text.error }}</p>
      <div>
        <button type="submit" :aria-disabled="state === 'sending' || undefined">
          {{ state === "sending" ? text.sending : text.send }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useId, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessContactForm" });
const pack = useLabelPack("BlessContactForm");

export interface BlessContactMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const props = withDefaults(
  defineProps<{
    /** the topics of the menu; without them, the form has no topic */
    topics?: string[];
    /** your part after the submit event: sending, sent, or error */
    state?: "idle" | "sending" | "sent" | "error";
    labels?: Partial<{
      name: string;
      email: string;
      topic: string;
      message: string;
      send: string;
      sending: string;
      sent: string;
      error: string;
      needName: string;
      needEmail: string;
      needMessage: string;
    }>;
  }>(),
  { topics: () => [], state: "idle" },
);
const emit = defineEmits<{ submit: [message: BlessContactMessage] }>();

const text = computed(() => ({
  name: "Your name",
  email: "Your email",
  topic: "Topic",
  message: "Message",
  send: "Send the message",
  sending: "Sending…",
  sent: "Thank you. We got your message and reply within two working days.",
  error: "The message did not go out. Try again, or write to us by email.",
  needName: "Enter your name.",
  needEmail: "Enter an email address, such as name@example.com.",
  needMessage: "Write a message.",
  ...pack(),
  ...props.labels,
}));
const id = useId();
const v = reactive({ name: "", email: "", topic: props.topics[0] ?? "", message: "" });
// topics that load late, or change, keep a topic that is in the list
watch(
  () => props.topics,
  (t) => !t.includes(v.topic) && (v.topic = t[0] ?? ""),
);
const errors = reactive<Record<string, string>>({});
// a field that people do not see; a bot that fills it gets no message through
const trap = ref("");
const form = ref<HTMLFormElement>();
function check(f: HTMLFormElement) {
  for (const k of Object.keys(errors)) delete errors[k];
  const el = (n: string) => f.elements.namedItem(n) as HTMLInputElement;
  if (!v.name.trim()) errors.name = text.value.needName;
  if (!el("email").validity.valid || !v.email) errors.email = text.value.needEmail;
  if (!v.message.trim()) errors.message = text.value.needMessage;
  const first = ["name", "email", "message"].find((k) => errors[k]);
  if (first) el(first).focus();
  return !first;
}
function submit() {
  if (!form.value || !check(form.value) || props.state === "sending") return;
  if (trap.value) return;
  emit("submit", { ...v, name: v.name.trim(), message: v.message.trim() });
}
const err = (k: string) => (errors[k] ? `${id}-${k}-err` : undefined);
</script>

<style>
.bless-contact {
  max-inline-size: 36rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-contact__form {
  display: grid;
  gap: var(--bless-space-4);
}
.bless-contact__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  gap: var(--bless-space-4);
}
.bless-contact__field {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-contact__field label {
  font-weight: var(--bless-font-weight-bold);
}
.bless-contact__field :is(input, select, textarea) {
  min-block-size: 2.75rem;
  box-sizing: border-box;
  padding: var(--bless-space-2);
  border: 2px solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-contact__field textarea {
  resize: vertical;
}
.bless-contact__field [aria-invalid="true"] {
  border-color: var(--bless-color-danger);
}
.bless-contact :is(input, select, textarea, button):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-contact__error,
.bless-contact__failed {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-contact__failed,
.bless-contact__sent {
  margin: 0;
  padding: var(--bless-space-3);
  border-inline-start: 4px solid currentColor;
  background: var(--bless-color-surface-2);
}
.bless-contact__sent {
  border-inline-start-color: var(--bless-color-accent);
  font-weight: var(--bless-font-weight-bold);
}
.bless-contact__trap {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  opacity: 0;
  pointer-events: none;
}
.bless-contact button {
  min-block-size: 2.75rem;
  padding: 0 var(--bless-space-6);
  border: 0;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-contact button[aria-disabled="true"] {
  opacity: 0.7;
  cursor: progress;
}
.bless-contact {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
