<template>
  <div class="bless-newsletter">
    <p v-if="status === 'done'" class="bless-newsletter__done" role="status">{{ text.done }}</p>
    <form v-else class="bless-newsletter__form" novalidate @submit.prevent="submit">
      <BlessInput
        v-model="email"
        class="bless-newsletter__field"
        type="email"
        autocomplete="email"
        required
        :aria-label="text.label"
        :placeholder="text.label"
        :error="local ?? error"
        @input="local = undefined"
      />
      <BlessButton type="submit" :loading="status === 'loading'">{{ text.button }}</BlessButton>
    </form>
    <p v-if="status !== 'done'" class="bless-newsletter__privacy">
      {{ text.privacy }}
      <a v-if="privacyHref" :href="privacyHref">{{ text.policy }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessInput from "./BlessInput.vue";

defineOptions({ name: "BlessNewsletterSignup" });
const pack = useLabelPack("BlessNewsletterSignup");

const props = withDefaults(
  defineProps<{
    /** `loading` while your server works, `done` after it took the address */
    status?: "idle" | "loading" | "done";
    /** a reason from your server, for example "This address is already on the list" */
    error?: string;
    /** a link to the privacy policy */
    privacyHref?: string;
    labels?: Partial<{
      label: string;
      button: string;
      done: string;
      invalid: string;
      privacy: string;
      policy: string;
    }>;
  }>(),
  { status: "idle" },
);
const email = defineModel<string>({ default: "" });
const emit = defineEmits<{ subscribe: [email: string] }>();

const text = computed(() => ({
  label: "Email address",
  button: "Subscribe",
  done: "Thanks! Check your inbox to confirm.",
  invalid: "Enter an email address such as name@example.com.",
  privacy: "One email a week. Leave at any time.",
  policy: "Privacy policy",
  ...pack(),
  ...props.labels,
}));
const local = ref<string>();
function submit(e: Event) {
  const input = (e.target as HTMLFormElement).querySelector("input")!;
  // the browser checks the form of the address; the server checks the rest
  if (!input.checkValidity()) return void (local.value = text.value.invalid);
  local.value = undefined;
  if (props.status !== "loading") emit("subscribe", email.value.trim());
}
</script>

<style>
.bless-newsletter {
  display: grid;
  gap: var(--bless-space-2);
  max-inline-size: 30rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-newsletter__form {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
}
.bless-newsletter__field {
  flex: 1;
  min-inline-size: 0;
}
.bless-newsletter__privacy {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-newsletter__privacy a {
  color: var(--bless-color-text);
}
/* the thanks has a check-like bar, so it does not rest on the color */
.bless-newsletter__done {
  margin: 0;
  padding: var(--bless-space-3);
  border-inline-start: 4px solid var(--bless-color-success);
  background: var(--bless-color-surface-2);
  font-weight: var(--bless-font-weight-bold);
}
.bless-newsletter {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
