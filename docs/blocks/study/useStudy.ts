import { computed, onMounted, ref } from "vue";
import type { BlessFlashcard } from "blessing-ui";
import type { StudyApi } from "./api";
import { dueCards, nextDue, perBox, review, type Card } from "./domain";

/** a deck, the cards that are due today, and the answers that move them between boxes */
export function useStudy(api: StudyApi, today: string) {
  const cards = ref<Card[]>([]);
  const deck = ref("words");
  // the round is fixed when it starts: a card that moves up must not leave the deck on screen
  const round = ref<Card[]>([]);
  const start = () => (round.value = dueCards(cards.value, deck.value, today));
  onMounted(async () => {
    cards.value = await api.cards();
    start();
  });
  function pick(d: string) {
    deck.value = d;
    start();
  }

  const due = computed(() => dueCards(cards.value, deck.value, today).length);
  const next = computed(() => nextDue(cards.value, deck.value, today));
  const boxes = computed(() => perBox(cards.value, deck.value));

  async function answer(shown: BlessFlashcard, know: boolean, first: boolean) {
    const i = cards.value.findIndex((c) => c.id === (shown as Card).id);
    const after = review(cards.value[i], know, first, today);
    if (after === cards.value[i]) return;
    cards.value[i] = after;
    await api.save(after);
  }

  async function add(front: string, back: string) {
    if (!front.trim() || !back.trim()) return "Write both sides of the card.";
    const c = await api.add({
      deck: deck.value,
      front: front.trim(),
      back: back.trim(),
      box: 1,
      due: today,
    });
    cards.value.push(c);
    return "";
  }

  return { cards, deck, round, start, pick, due, next, boxes, answer, add };
}
