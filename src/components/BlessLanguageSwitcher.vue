<template>
  <nav v-if="href" class="bless-lang bless-lang--links" :aria-label="text.label">
    <ul role="list">
      <li v-for="l in languages" :key="l.code">
        <component
          :is="tag(l.code).is"
          v-bind="tag(l.code).attrs"
          class="bless-lang__link"
          :class="{ 'is-current': l.code === model }"
          :lang="l.code"
          :hreflang="l.code"
          :aria-current="l.code === model ? 'true' : undefined"
          @click="model = l.code"
          >{{ l.label }}</component
        >
      </li>
    </ul>
  </nav>
  <label v-else class="bless-lang">
    <svg class="bless-lang__icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M1.5 8h13M8 1.5c-2.2 2.4-2.2 10.6 0 13M8 1.5c2.2 2.4 2.2 10.6 0 13" />
    </svg>
    <span class="bless-sr">{{ text.label }}</span>
    <select v-model="model" class="bless-lang__select" :lang="model">
      <option v-for="l in languages" :key="l.code" :value="l.code" :lang="l.code">
        {{ l.label }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { useLink } from "../composables/useLink";
import "./sr.css";

defineOptions({ name: "BlessLanguageSwitcher" });
const pack = useLabelPack("BlessLanguageSwitcher");
const link = useLink();

export interface BlessLanguage {
  /** a BCP 47 tag, for example "id" or "pt-BR" */
  code: string;
  /** the name of the language in itself, for example "Bahasa Indonesia", so each reader finds their own */
  label: string;
}

const props = defineProps<{
  languages: BlessLanguage[];
  /** the page in each language: the switcher becomes a list of links, for a footer or a site that has a URL per language */
  href?: (code: string) => string;
  labels?: Partial<{ label: string }>;
}>();
/** the code of the current language */
const model = defineModel<string>();

const text = computed(() => ({ label: "Language", ...pack(), ...props.labels }));
const tag = (code: string) => link(props.href!(code));
</script>

<style>
.bless-lang {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  color: var(--bless-color-text);
  font-size: var(--bless-text-sm);
}
.bless-lang__icon {
  inline-size: 1rem;
  block-size: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.2;
}
.bless-lang__select {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-lang__select:focus-visible,
.bless-lang__link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-lang--links ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1) var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-lang__link {
  color: var(--bless-color-text-muted);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
/* the current language is plain text weight, not a color: color means chosen only on controls */
.bless-lang__link.is-current {
  color: var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
  text-decoration: none;
}
</style>
