<template>
  <component
    :is="tag.is"
    v-bind="tag.attrs"
    class="bless-link"
    :class="{ 'bless-link--muted': muted }"
  >
    <slot /><template v-if="external"
      ><span class="bless-link__out" aria-hidden="true">↗</span
      ><span class="bless-sr"> ({{ text.newTab }})</span></template
    >
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { useLink } from "../composables/useLink";
import "./sr.css";

defineOptions({ name: "BlessLink" });
const pack = useLabelPack("BlessLink");
const link = useLink();

const props = defineProps<{
  href: string;
  /** another site: opens in a new tab, with an arrow and a hidden "opens in a new tab" */
  external?: boolean;
  /** the muted text color, for a footer or a caption. The underline stays */
  muted?: boolean;
  labels?: Partial<{ newTab: string }>;
}>();

const text = computed(() => ({ newTab: "opens in a new tab", ...pack(), ...props.labels }));
const tag = computed(() => link(props.href, props.external));
</script>

<style>
/* always underlined: in running text, the color alone does not show a link (WCAG 1.4.1) */
.bless-link {
  color: var(--bless-color-text);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}
.bless-link--muted {
  color: var(--bless-color-text-muted);
}
.bless-link:hover {
  text-decoration-thickness: 2px;
}
.bless-link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-link__out {
  margin-inline-start: 0.15em;
  font-size: 0.85em;
}
/* the arrow points away in the reading direction */
[dir="rtl"] .bless-link__out {
  display: inline-block;
  transform: scaleX(-1);
}
</style>
