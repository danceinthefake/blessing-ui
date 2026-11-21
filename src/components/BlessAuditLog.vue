<template>
  <section class="bless-audit" :aria-label="text.title">
    <ol class="bless-stagger bless-audit__list" role="list">
      <li v-for="e in entries" :key="e.id" class="bless-audit__entry" :class="`is-${e.action}`">
        <div class="bless-audit__box">
          <div class="bless-audit__head">
            <BlessAvatar :name="e.who" alt="" size="xs" />
            <span class="bless-audit__line">
              <strong>{{ e.who }}</strong>{{ " "
              }}<span class="bless-audit__action"
                ><span aria-hidden="true">{{ MARK[e.action] }}</span> {{ text[e.action] }}</span
              >{{ " " }}<span class="bless-audit__target">{{ e.target }}</span>
            </span>
            <span class="bless-audit__when"
              >{{ e.when }}<template v-if="e.source"> · {{ e.source }}</template></span
            >
          </div>
          <dl v-if="e.changes?.length" class="bless-audit__changes">
            <div v-for="c in e.changes" :key="c.field" class="bless-audit__change">
              <dt>{{ c.field }}</dt>
              <dd>
                <del
                  ><span class="bless-sr">{{ text.from }}</span>{{ " "
                  }}{{ c.from || text.empty }}</del
                >
                <span aria-hidden="true"> → </span>
                <ins
                  ><span class="bless-sr">{{ text.to }}</span>{{ " " }}{{ c.to || text.empty }}</ins
                >
              </dd>
            </div>
          </dl>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import "./sr.css";

defineOptions({ name: "BlessAuditLog" });
const pack = useLabelPack("BlessAuditLog");

export type BlessAuditAction = "created" | "updated" | "deleted" | "viewed";
export interface BlessAuditEntry {
  id: string;
  who: string;
  /** when, as text */
  when: string;
  action: BlessAuditAction;
  /** the record, for example "Invoice INV-0042" */
  target: string;
  changes?: { field: string; from?: string; to?: string }[];
  /** where it came from, for example an IP address or "API" */
  source?: string;
}

const props = defineProps<{
  entries: BlessAuditEntry[];
  labels?: Partial<
    Record<BlessAuditAction, string> & {
      title: string;
      from: string;
      to: string;
      empty: string;
    }
  >;
}>();

const text = computed(() => ({
  title: "Audit log",
  created: "created",
  updated: "changed",
  deleted: "deleted",
  viewed: "viewed",
  from: "was",
  to: "now",
  empty: "empty",
  ...pack(),
  ...props.labels,
}));
const MARK: Record<BlessAuditAction, string> = {
  created: "+",
  updated: "✎",
  deleted: "✕",
  viewed: "◉",
};
</script>

<style>
.bless-audit {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-audit__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-audit__entry {
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
/* the space sits on a div, so a list reset of the host page keeps it */
.bless-audit__box {
  display: grid;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3) 0;
}
.bless-audit__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-audit__line {
  flex: 1;
  min-inline-size: 0;
}
.bless-audit__action {
  font-weight: var(--bless-font-weight-bold);
}
.is-deleted .bless-audit__action {
  color: var(--bless-color-danger-text);
}
.bless-audit__target {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-xs);
}
.bless-audit__when {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-audit__changes {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
  padding: var(--bless-space-2) var(--bless-space-3);
  background: var(--bless-color-surface-2);
}
.bless-audit__change {
  display: grid;
  grid-template-columns: minmax(6rem, auto) 1fr;
  gap: var(--bless-space-3);
}
.bless-audit__change dt {
  font-weight: var(--bless-font-weight-bold);
}
.bless-audit__change dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.bless-audit__change del {
  color: var(--bless-color-text);
}
.bless-audit__change ins {
  font-weight: var(--bless-font-weight-bold);
  text-decoration: none;
}
</style>
