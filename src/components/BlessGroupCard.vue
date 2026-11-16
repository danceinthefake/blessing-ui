<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatarGroup, { type BlessAvatarGroupItem } from "./BlessAvatarGroup.vue";
import BlessButton from "./BlessButton.vue";
import "./sr.css";

defineOptions({ name: "BlessGroupCard" });
const pack = useLabelPack("BlessGroupCard");

export type BlessGroupState = "none" | "requested" | "member";

const props = withDefaults(
  defineProps<{
    name: string;
    href?: string;
    cover?: string;
    description?: string;
    members: number;
    /** a few members to show as faces */
    faces?: BlessAvatarGroupItem[];
    /** a private group needs an approval to join */
    private?: boolean;
    locale?: string;
    labels?: Partial<{
      join: string;
      request: string;
      requested: string;
      member: string;
      public: string;
      private: string;
      members: (count: string) => string;
    }>;
  }>(),
  { locale: "en" },
);
/** where the reader stands: not in, asked to join, or a member */
const state = defineModel<BlessGroupState>({ default: "none" });

const text = computed(() => ({
  join: "Join",
  request: "Ask to join",
  requested: "Request sent",
  member: "Joined",
  public: "Public group",
  private: "Private group",
  members: (n: string) => `${n} members`,
  ...pack(),
  ...props.labels,
}));
const count = computed(() =>
  new Intl.NumberFormat(props.locale, { notation: "compact", maximumFractionDigits: 1 }).format(
    props.members,
  ),
);
const label = computed(() =>
  state.value === "member"
    ? text.value.member
    : state.value === "requested"
      ? text.value.requested
      : props.private
        ? text.value.request
        : text.value.join,
);
// a click moves forward: join a public group, or ask to join a private one; again leaves or cancels
const press = () =>
  (state.value = state.value !== "none" ? "none" : props.private ? "requested" : "member");
</script>

<template>
  <article class="bless-group">
    <div class="bless-group__cover">
      <img v-if="cover" :src="cover" alt="" />
    </div>
    <div class="bless-group__body">
      <h3 class="bless-group__name">
        <a v-if="href" :href="href">{{ name }}</a>
        <template v-else>{{ name }}</template>
      </h3>
      <p class="bless-group__meta">
        <span aria-hidden="true">{{ private ? "🔒︎" : "🌐︎" }}</span>
        {{ private ? text.private : text.public }} · {{ text.members(count) }}
      </p>
      <p v-if="description" class="bless-group__desc">{{ description }}</p>
      <div class="bless-group__foot">
        <BlessAvatarGroup v-if="faces?.length" :items="faces" :max="4" size="sm" />
        <BlessButton
          class="bless-group__join"
          size="sm"
          :variant="state === 'none' ? 'solid' : 'outline'"
          @click="press"
        >
          {{ label }}<span class="bless-sr">: {{ name }}</span>
        </BlessButton>
      </div>
    </div>
  </article>
</template>

<style>
.bless-group {
  display: grid;
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-group__cover {
  aspect-ratio: 3 / 1;
  background: color-mix(in srgb, var(--bless-color-accent) 16%, var(--bless-color-bg));
}
.bless-group__cover img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.bless-group__body {
  display: grid;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3) var(--bless-space-4) var(--bless-space-4);
}
.bless-group__name {
  margin: 0;
  font-size: var(--bless-text-md);
}
.bless-group__name a {
  color: inherit;
  text-decoration: none;
}
.bless-group__name a:hover {
  text-decoration: underline;
}
.bless-group__name a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-group__meta {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-group__desc {
  margin: 0;
  line-height: 1.5;
}
.bless-group__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
  margin-block-start: var(--bless-space-1);
}
.bless-group__join {
  margin-inline-start: auto;
}
</style>
