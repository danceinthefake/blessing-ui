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
