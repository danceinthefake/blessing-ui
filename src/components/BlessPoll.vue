<script setup lang="ts">
import { computed, ref, useId } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessRadio from "./BlessRadio.vue";
import BlessRadioGroup from "./BlessRadioGroup.vue";

export interface BlessPollOption {
  value: string;
  label: string;
  /** votes so far, yours included */
  votes: number;
}

defineOptions({ name: "BlessPoll" });

const props = withDefaults(
  defineProps<{
    question: string;
    options: BlessPollOption[];
    /** no more votes: show the results to everyone */
    closed?: boolean;
    labels?: Partial<{ vote: string; yours: string; votes: (n: number) => string }>;
  }>(),
  {},
);
/** the value this person voted for. Set it to show the results. */
const voted = defineModel<string | undefined>();
const emit = defineEmits<{ vote: [value: string] }>();

const text = computed(() => ({
  vote: "Vote",
  yours: "your vote",
  votes: (n: number) => `${n} ${n === 1 ? "vote" : "votes"}`,
  ...props.labels,
}));
const id = useId();
const pick = ref<string>();
const results = computed(() => props.closed || voted.value !== undefined);
const total = computed(() => props.options.reduce((a, o) => a + o.votes, 0));
const pct = (o: BlessPollOption) => (total.value ? Math.round((o.votes / total.value) * 100) : 0);
function submit() {
  if (pick.value === undefined) return;
  voted.value = pick.value;
  emit("vote", pick.value);
}
</script>

<template>
  <div class="bless-poll">
    <template v-if="!results">
      <form @submit.prevent="submit">
        <BlessRadioGroup v-model="pick" :label="question">
          <BlessRadio v-for="o in options" :key="o.value" :value="o.value">{{
            o.label
          }}</BlessRadio>
        </BlessRadioGroup>
        <BlessButton type="submit" size="sm" :disabled="pick === undefined">{{
          text.vote
        }}</BlessButton>
      </form>
    </template>
    <figure v-else :aria-labelledby="`${id}-q`" class="bless-poll__results">
      <figcaption :id="`${id}-q`" class="bless-poll__question">{{ question }}</figcaption>
      <ul class="bless-poll__list">
        <li v-for="o in options" :key="o.value" class="bless-poll__row">
          <span class="bless-poll__label"
            >{{ o.label
            }}<span v-if="o.value === voted" class="bless-poll__yours">
              ({{ text.yours }})</span
            ></span
          >
          <span class="bless-poll__bar" aria-hidden="true"
            ><span
              class="bless-poll__fill"
              :class="{ 'bless-poll__fill--yours': o.value === voted }"
              :style="{ inlineSize: `${pct(o)}%` }"
          /></span>
          <span class="bless-poll__num">{{ pct(o) }}% · {{ text.votes(o.votes) }}</span>
        </li>
      </ul>
    </figure>
  </div>
</template>

<style>
.bless-poll {
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-poll form {
  display: grid;
  gap: var(--bless-space-3);
  justify-items: start;
}
.bless-poll__results {
  margin: 0;
}
.bless-poll__question {
  margin-block-end: var(--bless-space-3);
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-poll__list {
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-poll__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--bless-space-1) var(--bless-space-3);
  font-size: var(--bless-text-md);
}
.bless-poll__bar {
  grid-column: 1 / -1;
  grid-row: 2;
  display: block;
  block-size: 6px;
  background: var(--bless-color-surface);
}
.bless-poll__fill {
  display: block;
  block-size: 100%;
  background: var(--bless-color-text-muted);
  transition: inline-size var(--bless-duration-slow) var(--bless-ease-out);
}
/* color means chosen: only the bar of your own vote takes the accent */
.bless-poll__fill--yours {
  background: var(--bless-color-accent);
}
.bless-poll__yours,
.bless-poll__num {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
