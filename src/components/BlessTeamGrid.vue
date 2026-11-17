<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import "./sr.css";

defineOptions({ name: "BlessTeamGrid" });
const pack = useLabelPack("BlessTeamGrid");

export interface BlessTeamMember {
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  /** for example a profile page or an email link */
  links?: { label: string; href: string }[];
}

const props = defineProps<{
  people: BlessTeamMember[];
  /** the words after a link label for screen readers, such as " of Ana" */
  labels?: Partial<{ of: (name: string) => string }>;
}>();

const text = computed(() => ({
  of: (n: string) => ` of ${n}`,
  ...pack(),
  ...props.labels,
}));
</script>

<template>
  <ul class="bless-stagger bless-team" role="list">
    <li v-for="p in people" :key="p.name" class="bless-team__person">
      <img v-if="p.photo" :src="p.photo" alt="" class="bless-team__photo" loading="lazy" />
      <BlessAvatar v-else :name="p.name" size="xl" class="bless-team__photo" />
      <h3 class="bless-team__name">{{ p.name }}</h3>
      <div class="bless-team__role">{{ p.role }}</div>
      <div v-if="p.bio" class="bless-team__bio">{{ p.bio }}</div>
      <ul v-if="p.links?.length" class="bless-team__links" role="list">
        <li v-for="l in p.links" :key="l.href">
          <a :href="l.href">{{ l.label }}<span class="bless-sr">{{ text.of(p.name) }}</span></a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style>
.bless-team {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: var(--bless-space-6) var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-team__person {
  display: grid;
  align-content: start;
  gap: 2px;
}
.bless-team__photo {
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 1;
  margin-block-end: var(--bless-space-2);
  object-fit: cover;
}
.bless-team__photo.bless-avatar {
  --_s: 100%;
  font-size: 2.5rem;
}
/* two classes, so the heading styles of a host page do not win */
.bless-team .bless-team__name {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-team__role {
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text-muted);
}
.bless-team__bio {
  margin-block-start: var(--bless-space-1);
  line-height: 1.55;
}
.bless-team__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1) var(--bless-space-3);
  margin: var(--bless-space-1) 0 0;
  padding: 0;
  list-style: none;
}
.bless-team__links a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.bless-team__links a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
