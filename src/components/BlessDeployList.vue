<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessDeployList" });
const pack = useLabelPack("BlessDeployList");

export type BlessDeployState = "queued" | "building" | "ready" | "failed" | "canceled";
export interface BlessDeploy {
  id: string;
  state: BlessDeployState;
  /** for example "production" or "preview" */
  env: string;
  commit: string;
  message?: string;
  branch?: string;
  author?: string;
  /** when it started, as text */
  time: string;
  duration?: string;
  url?: string;
  /** the deploy that serves the environment now */
  live?: boolean;
}

const props = defineProps<{
  deploys: BlessDeploy[];
  labels?: Partial<
    Record<BlessDeployState, string> & {
      live: string;
      open: string;
      rollback: string;
      redeploy: string;
      list: string;
    }
  >;
}>();
const emit = defineEmits<{ rollback: [id: string]; redeploy: [id: string] }>();

const text = computed(() => ({
  queued: "Queued",
  building: "Building",
  ready: "Ready",
  failed: "Failed",
  canceled: "Canceled",
  live: "Live",
  open: "Open",
  rollback: "Roll back to this",
  redeploy: "Deploy again",
  list: "Deploys",
  ...pack(),
  ...props.labels,
}));
// a shape for each state, so the state does not rest on color alone
const MARK: Record<BlessDeployState, string> = {
  queued: "○",
  building: "◐",
  ready: "●",
  failed: "✕",
  canceled: "–",
};
</script>

<template>
  <ul class="bless-stagger bless-deploys" role="list" :aria-label="text.list">
    <li v-for="d in deploys" :key="d.id">
      <div class="bless-deploys__row" :class="[`is-${d.state}`, { 'is-live': d.live }]">
        <span class="bless-deploys__state">
          <span aria-hidden="true">{{ MARK[d.state] }}</span> {{ text[d.state] }}
        </span>
        <span class="bless-deploys__main">
          <span class="bless-deploys__env">
            {{ d.env }}
            <span v-if="d.live" class="bless-deploys__live">{{ text.live }}</span>
          </span>
          <span class="bless-deploys__commit">
            <code>{{ d.commit.slice(0, 7) }}</code>
            <span v-if="d.message" class="bless-deploys__msg">{{ d.message }}</span>
          </span>
          <span class="bless-deploys__meta">
            <span v-if="d.branch">{{ d.branch }}</span>
            <span v-if="d.author">{{ d.author }}</span>
            <span>{{ d.time }}</span>
            <span v-if="d.duration">{{ d.duration }}</span>
          </span>
        </span>
        <span class="bless-deploys__actions">
          <a v-if="d.url && d.state === 'ready'" :href="d.url">{{ text.open }}</a>
          <button
            v-if="d.state === 'ready' && !d.live"
            type="button"
            @click="emit('rollback', d.id)"
          >
            {{ text.rollback }}
          </button>
          <button
            v-if="d.state === 'failed' || d.state === 'canceled'"
            type="button"
            @click="emit('redeploy', d.id)"
          >
            {{ text.redeploy }}
          </button>
        </span>
      </div>
    </li>
  </ul>
</template>

<style>
.bless-deploys {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-deploys li + li {
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-deploys__row {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3);
  border-inline-start: 4px solid transparent;
}
@media (max-width: 36rem) {
  .bless-deploys__row {
    grid-template-columns: 1fr;
    gap: var(--bless-space-1);
  }
}
.bless-deploys__row.is-live {
  border-inline-start-color: var(--bless-color-accent);
}
.bless-deploys__state {
  font-weight: var(--bless-font-weight-bold);
  white-space: nowrap;
}
.is-failed > .bless-deploys__state {
  color: var(--bless-color-danger-text);
}
.is-building > .bless-deploys__state span {
  display: inline-block;
  animation: bless-deploys-spin 1.2s linear infinite;
}
@keyframes bless-deploys-spin {
  to {
    transform: rotate(1turn);
  }
}
@media (prefers-reduced-motion: reduce) {
  .is-building > .bless-deploys__state span {
    animation: none;
  }
}
.bless-deploys__main {
  display: grid;
  gap: 2px;
  min-inline-size: 0;
}
.bless-deploys__env {
  font-weight: var(--bless-font-weight-bold);
}
.bless-deploys__live {
  margin-inline-start: var(--bless-space-2);
  padding: 0 var(--bless-space-1);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-xs);
}
.bless-deploys__commit {
  display: flex;
  gap: var(--bless-space-2);
  min-inline-size: 0;
}
.bless-deploys__commit code {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
}
.bless-deploys__msg {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-deploys__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1) var(--bless-space-3);
  font-size: var(--bless-text-xs);
}
.bless-deploys__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-deploys__actions :is(a, button) {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}
.bless-deploys__actions :is(a, button):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
