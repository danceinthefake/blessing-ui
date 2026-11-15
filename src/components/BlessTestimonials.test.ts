import { mount } from "@vue/test-utils";
import BlessTestimonials from "./BlessTestimonials.vue";

const items = [
  { quote: "Best show on audio.", name: "Ana", role: "Host", rating: 5 },
  { quote: "I learned to mix.", name: "Budi" },
  { quote: "Short and useful.", name: "Citra", rating: 4 },
];

test("BlessTestimonials: a grid of quotes with names, roles, and stars in words", () => {
  const w = mount(BlessTestimonials, { props: { items } });
  const figs = w.findAll("figure");
  expect(figs).toHaveLength(3);
  expect(figs[0]!.find("blockquote").text()).toBe("Best show on audio.");
  expect(figs[0]!.find("figcaption").text()).toContain("AnaHost");
  expect(figs[0]!.find(".bless-sr").text()).toBe("5 out of 5 stars");
  expect(figs[2]!.find("[aria-hidden]").text()).toBe("★★★★☆");
  expect(figs[1]!.find(".bless-quotes__stars").exists()).toBe(false);
  expect(w.find(".bless-quotes__nav").exists()).toBe(false);
});

test("BlessTestimonials: one at a time with buttons that wrap, and labels translate", async () => {
  const w = mount(BlessTestimonials, {
    props: {
      items,
      layout: "single",
      labels: { position: (n: number, t: number) => `${n} dari ${t}` },
    },
  });
  expect(w.findAll("figure")).toHaveLength(1);
  expect(w.attributes("aria-roledescription")).toBe("carousel");
  expect(w.find(".bless-quotes__pos").text()).toBe("1 dari 3");
  await w.find('[aria-label="Previous quote"]').trigger("click");
  expect(w.find("blockquote").text()).toBe("Short and useful.");
  await w.find('[aria-label="Next quote"]').trigger("click");
  expect(w.find("blockquote").text()).toBe("Best show on audio.");
  expect(w.find("figure").attributes("aria-label")).toBe("1 dari 3");
});
