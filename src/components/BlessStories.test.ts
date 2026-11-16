import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessStories, { type BlessStoryPerson } from "./BlessStories.vue";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
afterEach(() => vi.useRealTimers());

const people: BlessStoryPerson[] = [
  {
    id: "a",
    name: "Ana",
    stories: [
      { id: "a1", image: "x.png", alt: "Mic" },
      { id: "a2", image: "y.png", alt: "Desk", caption: "New desk" },
    ],
  },
  { id: "b", name: "Budi", seen: true, stories: [{ id: "b1", image: "z.png", alt: "Room" }] },
];

test("BlessStories: rings say new or seen, a ring opens the viewer, and stories move on with the timer", async () => {
  vi.useFakeTimers();
  const w = mount(BlessStories, { props: { people, duration: 1 }, attachTo: document.body });
  const rings = w.findAll(".bless-stories__ring");
  expect(rings[0]!.find(".bless-sr").text()).toBe("Stories of Ana, new");
  expect(rings[1]!.classes()).toContain("is-seen");
  await rings[0]!.trigger("click");
  await nextTick();
  expect(w.find(".bless-stories__image").attributes("alt")).toBe("Mic");
  expect(w.emitted("seen")).toEqual([["a", "a1"]]);
  vi.advanceTimersByTime(1100);
  await nextTick();
  expect(w.find(".bless-stories__image").attributes("alt")).toBe("Desk");
  expect(w.find(".bless-stories__caption").text()).toBe("New desk");
  // pause stops the timer
  await w.find("[aria-pressed]").trigger("click");
  vi.advanceTimersByTime(3000);
  await nextTick();
  expect(w.find(".bless-stories__image").attributes("alt")).toBe("Desk");
  // the arrow keys move, and the last story of a person goes to the next person
  await w.find(".bless-stories__viewer").trigger("keydown", { key: "ArrowRight" });
  expect(w.find(".bless-stories__image").attributes("alt")).toBe("Room");
  await w.find(".bless-stories__viewer").trigger("keydown", { key: "ArrowLeft" });
  expect(w.find(".bless-stories__image").attributes("alt")).toBe("Desk");
  w.unmount();
});
