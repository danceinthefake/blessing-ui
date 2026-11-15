<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessProfileCard" });
const pack = useLabelPack("BlessProfileCard");

export interface BlessProfileStat {
  label: string;
  value: number;
}

const props = withDefaults(
  defineProps<{
    name: string;
    /** for example `@ana` */
    handle?: string;
    avatar?: string;
    /** a picture for the band at the top */
    cover?: string;
    bio?: string;
    /** counts under the bio, for example followers and episodes */
    stats?: BlessProfileStat[];
    /** a link for the name */
    href?: string;
    /** show the follow button */
    followable?: boolean;
    /** the language of the counts, for example `id` */
    locale?: string;
    labels?: Partial<{ follow: string; following: string }>;
  }>(),
  { stats: () => [], locale: "en" },
);
/** the reader follows this person */
const following = defineModel<boolean>("following", { default: false });

const text = computed(() => ({
  follow: "Follow",
  following: "Following",
  ...pack(),
  ...props.labels,
}));
const compact = computed(
  () => new Intl.NumberFormat(props.locale, { notation: "compact", maximumFractionDigits: 1 }),
);
</script>

<template>
  <article class="bless-profile">
    <div
      class="bless-profile__cover"
      :style="cover ? { backgroundImage: `url(${JSON.stringify(cover)})` } : undefined"
      aria-hidden="true"
    />
    <div class="bless-profile__body">
      <div class="bless-profile__top">
        <BlessAvatar class="bless-profile__avatar" :src="avatar" :name alt="" size="xl" />
        <div class="bless-profile__actions">
          <slot name="actions" />
          <BlessButton
            v-if="followable"
            size="sm"
            :variant="following ? 'outline' : 'solid'"
            :aria-pressed="following"
            @click="following = !following"
          >
            {{ following ? text.following : text.follow }}
          </BlessButton>
        </div>
      </div>
      <h3 class="bless-profile__name">
        <a v-if="href" :href>{{ name }}</a>
        <template v-else>{{ name }}</template>
      </h3>
      <p v-if="handle" class="bless-profile__handle">{{ handle }}</p>
      <p v-if="bio" class="bless-profile__bio">{{ bio }}</p>
      <dl v-if="stats.length" class="bless-profile__stats">
        <div v-for="s in stats" :key="s.label">
          <dt>{{ s.label }}</dt>
          <dd>{{ compact.format(s.value) }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>

<style>
.bless-profile {
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-plate);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-profile__cover {
  block-size: 6rem;
  background: var(--bless-color-surface-2) center / cover no-repeat;
}
.bless-profile__body {
  padding: 0 var(--bless-space-4) var(--bless-space-4);
}
.bless-profile__top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--bless-space-3);
  margin-block-start: -2rem;
}
.bless-profile__avatar {
  box-shadow: 0 0 0 3px var(--bless-color-bg);
}
.bless-profile__actions {
  display: flex;
  gap: var(--bless-space-2);
}
.bless-profile__name {
  margin: var(--bless-space-3) 0 0;
  font-size: var(--bless-text-lg);
  line-height: 1.3;
}
.bless-profile__name a {
  color: inherit;
  text-decoration: none;
}
.bless-profile__name a:hover {
  text-decoration: underline;
}
.bless-profile__name a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-profile__handle {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-profile__bio {
  margin: var(--bless-space-2) 0 0;
  line-height: 1.5;
}
/* each count shows the number first, then its name */
.bless-profile__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-4);
  margin: var(--bless-space-3) 0 0;
}
.bless-profile__stats div {
  display: flex;
  flex-direction: row-reverse;
  gap: var(--bless-space-1);
}
.bless-profile__stats dt {
  color: var(--bless-color-text-muted);
}
.bless-profile__stats dd {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
</style>
