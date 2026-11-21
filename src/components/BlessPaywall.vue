<template>
  <div class="bless-paywall">
    <div v-if="$slots.default" class="bless-paywall__preview">
      <slot />
    </div>
    <section class="bless-paywall__box" :aria-labelledby="`${uid}-title`">
      <h3 :id="`${uid}-title`" class="bless-paywall__title">{{ text.title }}</h3>
      <p class="bless-paywall__body">{{ text.body }}</p>
      <form class="bless-paywall__form" @submit.prevent="chosen && emit('subscribe', chosen)">
        <fieldset class="bless-paywall__plans">
          <legend class="bless-sr">{{ text.plans }}</legend>
          <label v-for="p in plans" :key="p.id" class="bless-paywall__plan">
            <input v-model="chosen" type="radio" :name="`${uid}-plan`" :value="p.id" />
            <span class="bless-paywall__name">{{ p.name }}</span>
            <span class="bless-paywall__price">{{ p.price }}</span>
            <span v-if="p.note" class="bless-paywall__note">{{ p.note }}</span>
          </label>
        </fieldset>
        <BlessButton type="submit" block>{{ text.subscribe }}</BlessButton>
      </form>
      <a v-if="signInHref" class="bless-paywall__signin" :href="signInHref">{{ text.signIn }}</a>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import "./sr.css";

defineOptions({ name: "BlessPaywall" });
const pack = useLabelPack("BlessPaywall");

export interface BlessPaywallPlan {
  id: string;
  name: string;
  /** the price as text, for example "Rp 49.000 / month" */
  price: string;
  /** a short line, for example "Save 20%" */
  note?: string;
}

const props = defineProps<{
  plans: BlessPaywallPlan[];
  /** the id of the plan that is picked at first */
  pick?: string;
  /** the sign-in page, for readers who already pay */
  signInHref?: string;
  labels?: Partial<{
    title: string;
    body: string;
    subscribe: string;
    signIn: string;
    plans: string;
  }>;
}>();
const emit = defineEmits<{ subscribe: [planId: string] }>();

const text = computed(() => ({
  title: "Read the rest of this article",
  body: "Subscribe to read every article, with no limit.",
  subscribe: "Subscribe",
  signIn: "Already a subscriber? Sign in",
  plans: "Plans",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const chosen = ref(props.pick ?? props.plans[0]?.id ?? "");
</script>

<style>
.bless-paywall {
  display: grid;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
/* the end of the free text fades into the box */
.bless-paywall__preview {
  position: relative;
  max-block-size: 12rem;
  overflow: hidden;
}
.bless-paywall__preview::after {
  content: "";
  position: absolute;
  inset: 40% 0 0;
  background: linear-gradient(to bottom, transparent, var(--bless-color-bg));
}
.bless-paywall__box {
  display: grid;
  justify-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-6) var(--bless-space-4);
  border-block-start: 3px solid var(--bless-color-text);
  text-align: center;
}
.bless-paywall__title {
  margin: 0;
  font-size: var(--bless-text-lg);
}
.bless-paywall__body {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-paywall__form {
  display: grid;
  gap: var(--bless-space-3);
  inline-size: 100%;
  max-inline-size: 24rem;
}
.bless-paywall__plans {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-paywall__plan {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 2px var(--bless-space-3);
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  text-align: start;
  cursor: pointer;
}
.bless-paywall__plan:has(:checked) {
  border: 2px solid var(--bless-color-text);
}
.bless-paywall__plan:has(:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-paywall__plan input {
  accent-color: var(--bless-color-accent);
}
.bless-paywall__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-paywall__price {
  font-variant-numeric: tabular-nums;
}
.bless-paywall__note {
  grid-column: 2 / -1;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-paywall__signin {
  color: inherit;
  font-size: var(--bless-text-xs);
}
.bless-paywall__signin:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-paywall {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
