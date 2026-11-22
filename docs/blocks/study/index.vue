<template>
  <div class="study">
    <header class="study__head">
      <BlessText as="h1" size="lg" weight="light">Study</BlessText>
      <div class="study__tools">
        <BlessField label="Deck" class="study__deck">
          <BlessSelect
            :model-value="deck"
            :options="decks"
            @update:model-value="(d) => d && onPick(d)"
          />
        </BlessField>
        <BlessButton variant="outline" @click="startAdd">Add a card</BlessButton>
      </div>
    </header>
    <div class="study__stats">
      <BlessStat label="Due today" :value="due" />
      <BlessStat label="Learned" :value="`${boxes[4]} of ${total}`" />
    </div>
    <BlessMeterGroup :segments :max="total || 1" label="Cards in each box" legend />

    <BlessFlashcards
      v-if="round.length && !finished"
      :key="deck"
      :cards="round"
      @answer="answer"
      @finish="(k, t) => (finished = { known: k, total: t })"
    />
    <BlessAlert v-else color="success" title="Done for today">
      <template v-if="finished">
        You knew {{ finished.known }} of {{ finished.total }} at the first try.
      </template>
      {{ next ? `The next cards are due on ${longDay(next)}.` : "No more cards are due." }}
    </BlessAlert>
    <div v-if="finished && due">
      <BlessButton variant="outline" @click="again"
        >Study the {{ due }} new {{ due === 1 ? "card" : "cards" }}</BlessButton
      >
    </div>

    <BlessModal v-model="adding" title="Add a card" size="sm">
      <form class="study__form" @submit.prevent="onAdd">
        <BlessField label="Front" :error="problem">
          <BlessInput v-model="front" placeholder="For example: Enak sekali" />
        </BlessField>
        <BlessField label="Back">
          <BlessTextarea v-model="back" :rows="2" placeholder="For example: Very tasty" />
        </BlessField>
        <BlessText as="p" size="sm" muted>A new card starts in box 1 and is due today.</BlessText>
        <div><BlessButton type="submit" :loading="busy">Add</BlessButton></div>
      </form>
    </BlessModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BlessAlert,
  BlessButton,
  BlessField,
  BlessFlashcards,
  BlessInput,
  BlessMeterGroup,
  BlessModal,
  BlessSelect,
  BlessStat,
  BlessText,
  BlessTextarea,
  useToast,
} from "blessing-ui";
import { mockStudyApi } from "./api";
import { dueCards } from "./domain";
import { useStudy } from "./useStudy";

const today = "2026-11-22";
const { cards, deck, round, start, pick, due, next, boxes, answer, add } = useStudy(
  mockStudyApi,
  today,
);
const { toast } = useToast();

const NAMES = { words: "Indonesian for visitors", tea: "Know your tea" };
const decks = computed(() =>
  Object.entries(NAMES).map(([value, name]) => {
    const n = dueCards(cards.value, value, today).length;
    return { value, label: n ? `${name} (${n} due)` : name };
  }),
);
const total = computed(() => boxes.value.reduce((a, b) => a + b, 0));
const segments = computed(() =>
  boxes.value.map((value, i) => ({
    label: i === 0 ? "Box 1, new or missed" : i === 4 ? "Box 5, learned" : `Box ${i + 1}`,
    value,
    color: ["danger", "warning", "info", "accent", "success"][i],
  })),
);
const longDay = (d: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(Date.parse(`${d}T00:00:00Z`));

const finished = ref<{ known: number; total: number }>();
function onPick(d: string) {
  finished.value = undefined;
  pick(d);
}
function again() {
  finished.value = undefined;
  start();
}

const adding = ref(false);
const busy = ref(false);
const front = ref("");
const back = ref("");
const problem = ref("");
function startAdd() {
  front.value = back.value = problem.value = "";
  adding.value = true;
}
async function onAdd() {
  busy.value = true;
  problem.value = await add(front.value, back.value);
  busy.value = false;
  if (problem.value) return;
  adding.value = false;
  toast({ title: `${front.value.trim()} is in the deck`, color: "success" });
}
</script>

<style scoped>
.study {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 44rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.study__head,
.study__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
.study__deck {
  min-width: 16rem;
}
.study__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--bless-space-4);
}
.study__form {
  display: grid;
  gap: var(--bless-space-4);
}
@media (max-width: 760px) {
  .study {
    padding-inline: var(--bless-space-4);
  }
  .study__tools,
  .study__deck {
    flex: 1 1 100%;
  }
}
</style>
