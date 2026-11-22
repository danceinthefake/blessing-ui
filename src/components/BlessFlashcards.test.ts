import { mount } from "@vue/test-utils";
import BlessFlashcards from "./BlessFlashcards.vue";

const cards = [
  { front: "LUFS", back: "A unit of loudness" },
  { front: "Gain", back: "How much the input is made louder" },
];

test("BlessFlashcards: flip shows the back, Again sends the card to the end, and the score counts first tries", async () => {
  const w = mount(BlessFlashcards, { props: { cards }, attachTo: document.body });
  expect(w.find(".bless-flash__progress").text()).toBe("Card 1 of 2");
  expect(w.find(".bless-flash__back").exists()).toBe(false);
  await w.find(".bless-flash__card").trigger("click");
  expect(w.find(".bless-flash__back").text()).toBe("A unit of loudness");
  expect(w.find(".bless-flash__card").attributes("aria-pressed")).toBe("true");
  const buttons = () => w.findAll(".bless-flash__actions button");
  await buttons()[0]!.trigger("click"); // Again
  expect(w.find(".bless-flash__face").text()).toBe("Gain");
  expect(w.find(".bless-flash__back").exists()).toBe(false);
  await buttons()[0]!.trigger("click"); // flip
  await buttons()[1]!.trigger("click"); // know
  expect(w.find(".bless-flash__face").text()).toBe("LUFS");
  expect(w.find(".bless-flash__progress").text()).toBe("Card 2 of 2");
  await buttons()[0]!.trigger("click");
  await buttons()[1]!.trigger("click");
  expect(w.find(".bless-flash__score").text()).toBe("You knew 1 of 2 at the first try.");
  expect(w.emitted("finish")).toEqual([[1, 2]]);
  await w.find(".bless-flash__end button").trigger("click");
  expect(w.find(".bless-flash__face").text()).toBe("LUFS");
  w.unmount();
});

test("BlessFlashcards emits each answer with its first try, and new cards start a new round", async () => {
  const w = mount(BlessFlashcards, { props: { cards: [] as typeof cards } });
  expect(w.find(".bless-flash__end").exists()).toBe(true);
  await w.setProps({ cards });
  expect(w.find(".bless-flash__face").text()).toBe("LUFS");
  const buttons = () => w.findAll(".bless-flash__actions button");
  await buttons()[0]!.trigger("click");
  await buttons()[0]!.trigger("click"); // Again on LUFS
  await buttons()[0]!.trigger("click");
  await buttons()[1]!.trigger("click"); // know Gain
  await buttons()[0]!.trigger("click");
  await buttons()[1]!.trigger("click"); // know LUFS, its second try
  expect(w.emitted("answer")).toEqual([
    [cards[0], false, true],
    [cards[1], true, true],
    [cards[0], true, false],
  ]);
});
