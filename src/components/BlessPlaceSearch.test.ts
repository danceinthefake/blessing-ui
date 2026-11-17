import { flushPromises, mount } from "@vue/test-utils";
import BlessPlaceSearch, { type BlessPlace } from "./BlessPlaceSearch.vue";

afterEach(() => vi.useRealTimers());

const places: BlessPlace[] = [
  { id: "1", name: "Kopi Tuku", address: "Jl. Cipete Raya", distance: 450, kind: "Cafe" },
  { id: "2", name: "Kopi Kenangan", distance: 2300 },
];

test("BlessPlaceSearch: waits, searches, counts, keys, picks, and ignores a late older answer", async () => {
  vi.useFakeTimers();
  let slow: (v: BlessPlace[]) => void = () => {};
  const search = vi.fn((q: string) =>
    q === "ko" ? new Promise<BlessPlace[]>((r) => (slow = r)) : Promise.resolve(places),
  );
  const w = mount(BlessPlaceSearch, {
    props: {
      search,
      "onUpdate:modelValue": (v: BlessPlace | null) => w.setProps({ modelValue: v }),
    },
  });
  const input = w.find("input");
  await input.setValue("k");
  vi.advanceTimersByTime(300);
  expect(search).not.toHaveBeenCalled();
  await input.setValue("ko");
  vi.advanceTimersByTime(300);
  await input.setValue("kop");
  vi.advanceTimersByTime(300);
  await flushPromises();
  slow([]);
  await flushPromises();
  expect(w.find("[role=status]").text()).toBe("2 places found");
  expect(input.attributes("aria-expanded")).toBe("true");
  expect(w.findAll("[role=option]")[0]!.text()).toBe("Kopi TukuCafe · Jl. Cipete Raya450 m");
  expect(w.findAll(".bless-places__dist")[1]!.text()).toBe("2.3 km");
  await input.trigger("keydown", { key: "ArrowDown" });
  await input.trigger("keydown", { key: "ArrowDown" });
  expect(input.attributes("aria-activedescendant")).toMatch(/-o1$/);
  await input.trigger("keydown", { key: "Enter" });
  expect(w.props("modelValue")).toEqual(places[1]);
  expect((input.element as HTMLInputElement).value).toBe("Kopi Kenangan");
  expect(input.attributes("aria-expanded")).toBe("false");
});
