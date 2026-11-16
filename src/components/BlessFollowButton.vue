<script setup lang="ts">
// The words change from Follow to Following, so the button has no aria-pressed:
// a toggle with a name that changes would say the state twice.
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessFollowButton" });
const pack = useLabelPack("BlessFollowButton");

const props = withDefaults(
  defineProps<{
    /** the person or page to follow, for screen readers */
    name: string;
    /** the number of followers, without the reader */
    followers?: number;
    locale?: string;
    labels?: Partial<{
      follow: string;
      following: string;
      followers: (count: string) => string;
      followed: (name: string) => string;
      unfollowed: (name: string) => string;
    }>;
  }>(),
  { locale: "en" },
);
const following = defineModel<boolean>({ default: false });

const text = computed(() => ({
  follow: "Follow",
  following: "Following",
  followers: (n: string) => `${n} followers`,
  followed: (n: string) => `You follow ${n}.`,
  unfollowed: (n: string) => `You no longer follow ${n}.`,
  ...pack(),
  ...props.labels,
}));
// the reader counts once they follow
const count = computed(() =>
  props.followers === undefined
    ? ""
    : new Intl.NumberFormat(props.locale, { notation: "compact", maximumFractionDigits: 1 }).format(
        props.followers + (following.value ? 1 : 0),
      ),
);
const said = ref("");
function toggle() {
  const next = !following.value;
  following.value = next;
  said.value = next ? text.value.followed(props.name) : text.value.unfollowed(props.name);
}
</script>

<template>
  <span class="bless-follow">
    <button
      type="button"
      class="bless-follow__button"
      :class="{ 'is-on': following }"
      @click="toggle"
    >
      <span aria-hidden="true">{{ following ? "✓" : "+" }}</span>
      {{ following ? text.following : text.follow }}<span class="bless-sr">: {{ name }}</span>
    </button>
    <span v-if="count" class="bless-follow__count">{{ text.followers(count) }}</span>
    <span class="bless-sr" role="status">{{ said }}</span>
  </span>
</template>

<style>
.bless-follow {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-follow__button {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
/* following is an outline with a tick, not following is filled with a plus: shape and words differ */
.bless-follow__button.is-on {
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
}
.bless-follow__button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-follow__count {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
