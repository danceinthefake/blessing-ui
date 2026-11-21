<template>
  <article
    class="bless-incident"
    :class="[`is-${impact}`, { 'is-resolved': current === 'resolved' }]"
  >
    <header class="bless-incident__head">
      <h3 class="bless-incident__title">{{ title }}</h3>
      <p class="bless-incident__meta">
        <span class="bless-incident__impact">{{ text.impact }}: {{ text[impact] }}</span>
        <span v-if="current" class="bless-incident__state">{{ text[current] }}</span>
      </p>
      <p v-if="affected.length" class="bless-incident__affected">
        {{ text.affected }}: {{ affected.join(", ") }}
      </p>
    </header>
    <ol class="bless-stagger bless-incident__updates">
      <li
        v-for="(u, i) in updates"
        :key="i"
        class="bless-incident__update"
        :class="`is-${u.status}`"
      >
        <span class="bless-incident__dot" aria-hidden="true" />
        <div>
          <p class="bless-incident__line">
            <strong>{{ text[u.status] }}</strong>
            <time class="bless-incident__time">{{ u.time }}</time>
          </p>
          <p class="bless-incident__text">{{ u.text }}</p>
        </div>
      </li>
    </ol>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessIncidentTimeline" });
const pack = useLabelPack("BlessIncidentTimeline");

export type BlessIncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";
export interface BlessIncidentUpdate {
  status: BlessIncidentStatus;
  /** as text, for example "16 Nov, 09:40 WIB" */
  time: string;
  text: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    impact?: "minor" | "major" | "critical";
    /** the parts of the service that it affects */
    affected?: string[];
    /** newest first */
    updates: BlessIncidentUpdate[];
    labels?: Partial<
      Record<BlessIncidentStatus | "minor" | "major" | "critical", string> & {
        affected: string;
        impact: string;
      }
    >;
  }>(),
  { impact: "minor", affected: () => [] },
);

const text = computed(() => ({
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
  minor: "Minor",
  major: "Major",
  critical: "Critical",
  affected: "Affected",
  impact: "Impact",
  ...pack(),
  ...props.labels,
}));
const current = computed(() => props.updates[0]?.status);
</script>

<style>
.bless-incident {
  --_c: var(--bless-color-warning);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-inline-start: 4px solid var(--_c);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-incident.is-major,
.bless-incident.is-critical {
  --_c: var(--bless-color-danger);
}
.bless-incident.is-resolved {
  --_c: var(--bless-color-success);
}
.bless-incident__head {
  display: grid;
  gap: var(--bless-space-1);
  padding: var(--bless-space-3) var(--bless-space-4);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-incident__title {
  margin: 0;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-incident__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  margin: 0;
  font-size: var(--bless-text-xs);
}
/* the state is a word in a box, so it does not rest on the color of the edge */
.bless-incident__impact,
.bless-incident__state {
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--bless-tracking-wide);
}
.bless-incident__affected {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-incident__updates {
  position: relative;
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: var(--bless-space-3) var(--bless-space-4);
  list-style: none;
}
.bless-incident__update {
  display: flex;
  gap: var(--bless-space-3);
}
.bless-incident__dot {
  flex: none;
  inline-size: 10px;
  block-size: 10px;
  margin-block-start: 5px;
  border: 2px solid var(--bless-color-text-muted);
  border-radius: 50%;
}
.bless-incident__update:first-child .bless-incident__dot {
  border-color: var(--_c);
  background: var(--_c);
}
.bless-incident__line {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  align-items: baseline;
  margin: 0;
}
.bless-incident__time {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-incident__text {
  margin: var(--bless-space-1) 0 0;
  line-height: 1.5;
}
</style>
