import { mount } from "@vue/test-utils";
import BlessReviewSummary from "./BlessReviewSummary.vue";

test("BlessReviewSummary: the average, stars cut at it, the count, and a bar for each level", () => {
  const w = mount(BlessReviewSummary, { props: { counts: [6, 2, 1, 0, 1] } });
  expect(w.find(".bless-reviews__avg").text()).toBe("4.2");
  const stars = w.find(".bless-reviews__stars");
  expect(stars.attributes("aria-label")).toBe("Average 4.2 out of 5 stars");
  expect(stars.attributes("style")).toContain("--_fill: 84%");
  expect(w.find(".bless-reviews__total").text()).toBe("10 reviews");
  const rows = w.findAll(".bless-reviews__row");
  expect(rows.map((r) => r.find(".bless-sr").text())).toEqual([
    "5 stars: 6 reviews",
    "4 stars: 2 reviews",
    "3 stars: 1 review",
    "2 stars: 0 reviews",
    "1 star: 1 review",
  ]);
  expect(rows[0]!.find(".bless-reviews__bar span").attributes("style")).toContain(
    "inline-size: 60%",
  );
});

test("BlessReviewSummary: a bar sets the filter, a second click clears it", async () => {
  const w = mount(BlessReviewSummary, {
    props: {
      counts: [1, 1, 1, 1, 1],
      "onUpdate:filter": (v: unknown) => w.setProps({ filter: v as number }),
    },
  });
  const row = () => w.findAll(".bless-reviews__row")[1]!;
  await row().trigger("click");
  expect(row().attributes("aria-pressed")).toBe("true");
  expect(w.findAll(".bless-reviews__row")[0]!.classes()).toContain("is-off");
  await row().trigger("click");
  expect(w.emitted("update:filter")).toEqual([[4], [undefined]]);
});

test("BlessReviewSummary: no reviews, plain rows, and labels translate", () => {
  const w = mount(BlessReviewSummary, {
    props: { counts: [], filterable: false, labels: { reviews: (n: number) => `${n} ulasan` } },
  });
  expect(w.find(".bless-reviews__avg").text()).toBe("0.0");
  expect(w.find("button").exists()).toBe(false);
  expect(w.find(".bless-reviews__total").text()).toBe("0 ulasan");
});
