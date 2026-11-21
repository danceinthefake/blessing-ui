<template>
  <section class="bless-approval" :aria-label="text.title">
    <p class="bless-approval__summary" role="status">{{ summary }}</p>
    <ol class="bless-stagger bless-approval__steps">
      <li
        v-for="(s, i) in steps"
        :key="s.id"
        class="bless-approval__step"
        :class="[`is-${states[i]}`, { 'is-current': i === current }]"
        :aria-current="i === current ? 'step' : undefined"
      >
        <div class="bless-approval__box">
          <div class="bless-approval__head">
            <span class="bless-approval__mark" aria-hidden="true">{{ MARK[states[i]!] }}</span>
            <strong>{{ s.title }}</strong>
            <span class="bless-approval__state">{{ text[states[i]!] }}</span>
            <span class="bless-approval__rule">{{ s.rule === "any" ? text.any : text.all }}</span>
          </div>
          <ul class="bless-approval__people">
            <li v-for="a in s.approvers" :key="a.name" :class="`is-${a.decision ?? 'pending'}`">
              <BlessAvatar :name="a.name" :src="a.avatar" alt="" size="xs" />
              <span class="bless-approval__name">{{ a.name }}</span>
              <span class="bless-approval__decision">{{ text[a.decision ?? "pending"] }}</span>
              <span v-if="a.time" class="bless-approval__time">{{ a.time }}</span>
              <div v-if="a.note" class="bless-approval__note">“{{ a.note }}”</div>
            </li>
          </ul>
          <div v-if="i === current && canDecide" class="bless-approval__act">
            <textarea
              v-model="note"
              class="bless-approval__field"
              rows="2"
              :aria-label="text.note"
              :placeholder="text.note"
            />
            <div class="bless-approval__buttons">
              <BlessButton size="sm" @click="decide('approved')">{{ text.approve }}</BlessButton>
              <BlessButton size="sm" variant="outline" color="danger" @click="decide('rejected')">{{
                text.reject
              }}</BlessButton>
            </div>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<script lang="ts">
export type BlessDecision = "approved" | "rejected" | "pending";
export interface BlessApprover {
  name: string;
  avatar?: string;
  decision?: BlessDecision;
  note?: string;
  /** when they decided, as text */
  time?: string;
}
export interface BlessApprovalStep {
  id: string;
  title: string;
  approvers: BlessApprover[];
  /** `all` approvers must approve (default), or `any` one is enough */
  rule?: "all" | "any";
}
/** The state of a step: one rejection rejects it; the rule decides when it is approved. */
export function stepState(s: BlessApprovalStep): BlessDecision {
  const ds = s.approvers.map((a) => a.decision ?? "pending");
  if (ds.includes("rejected")) return "rejected";
  const ok =
    s.rule === "any" ? ds.includes("approved") : ds.length > 0 && ds.every((d) => d === "approved");
  return ok ? "approved" : "pending";
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessApprovalFlow" });
const pack = useLabelPack("BlessApprovalFlow");

const props = defineProps<{
  steps: BlessApprovalStep[];
  /** the name of the reader: if they are a waiting approver of the current step, they get the buttons */
  me?: string;
  labels?: Partial<
    Record<BlessDecision, string> & {
      title: string;
      approve: string;
      reject: string;
      note: string;
      all: string;
      any: string;
      done: string;
      stopped: string;
      waiting: (step: string) => string;
    }
  >;
}>();
const emit = defineEmits<{
  decide: [stepId: string, decision: "approved" | "rejected", note: string];
}>();

const text = computed(() => ({
  title: "Approval",
  approved: "Approved",
  rejected: "Rejected",
  pending: "Waiting",
  approve: "Approve",
  reject: "Reject",
  note: "A note (optional)",
  all: "All must approve",
  any: "One approval is enough",
  done: "Approved by everyone",
  stopped: "Stopped: a step was rejected",
  waiting: (s: string) => `Waiting for: ${s}`,
  ...pack(),
  ...props.labels,
}));
const states = computed(() => props.steps.map(stepState));
const current = computed(() => states.value.findIndex((s) => s !== "approved"));
const summary = computed(() =>
  states.value.includes("rejected")
    ? text.value.stopped
    : current.value < 0
      ? text.value.done
      : text.value.waiting(props.steps[current.value]!.title),
);
const canDecide = computed(() => {
  const s = props.steps[current.value];
  return (
    !!props.me &&
    !!s &&
    states.value[current.value] === "pending" &&
    s.approvers.some((a) => a.name === props.me && (a.decision ?? "pending") === "pending")
  );
});
const note = ref("");
function decide(d: "approved" | "rejected") {
  emit("decide", props.steps[current.value]!.id, d, note.value.trim());
  note.value = "";
}
const MARK: Record<BlessDecision, string> = { approved: "✓", rejected: "✕", pending: "…" };
</script>

<style>
/* spacing sits on divs, not on p and li, so a list reset of the host page does not remove it */
.bless-approval {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-approval__summary {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-approval__steps {
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-approval__box {
  display: grid;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-inline-start: 4px solid var(--bless-color-border);
}
.is-approved > .bless-approval__box {
  border-inline-start-color: var(--bless-color-success);
}
.is-rejected > .bless-approval__box {
  border-inline-start-color: var(--bless-color-danger);
}
.is-current.is-pending > .bless-approval__box {
  border-inline-start-color: var(--bless-color-accent);
}
.bless-approval__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
/* each state has a mark and a word, so it does not rest on the color of the edge */
.bless-approval__mark {
  display: inline-grid;
  place-items: center;
  inline-size: 1.3rem;
  block-size: 1.3rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-approval__state {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--bless-tracking-wide);
}
.bless-approval__step.is-rejected .bless-approval__head .bless-approval__state {
  color: var(--bless-color-danger-text);
}
.bless-approval__rule {
  margin-inline-start: auto;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-approval__people {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-approval__people > li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-approval__decision,
.bless-approval__time {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-approval__people .is-rejected .bless-approval__decision {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-approval__note {
  flex-basis: 100%;
  padding-inline-start: 2rem;
  font-style: italic;
}
.bless-approval__act {
  display: grid;
  gap: var(--bless-space-2);
}
.bless-approval__field {
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  resize: vertical;
}
.bless-approval__field:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-approval__buttons {
  display: flex;
  gap: var(--bless-space-2);
}
</style>
