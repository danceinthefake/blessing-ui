import { mount } from "@vue/test-utils";
import BlessMessageFeedback from "./BlessMessageFeedback.vue";

const btn = (w: ReturnType<typeof mount>, label: string) => w.find(`[aria-label="${label}"]`);

test("BlessMessageFeedback: a good mark is pressed, sent at once, and a second click clears it", async () => {
  const w = mount(BlessMessageFeedback);
  await btn(w, "Good reply").trigger("click");
  expect(btn(w, "Good reply").attributes("aria-pressed")).toBe("true");
  expect(w.emitted("feedback")).toEqual([[{ rating: "good" }]]);
  expect(w.emitted("update:rating")).toEqual([["good"]]);
  expect(w.find("[role=status]").text()).toBe("Thanks for the feedback");
  await btn(w, "Good reply").trigger("click");
  expect(w.emitted("update:rating")!.at(-1)).toEqual([undefined]);
});

test("BlessMessageFeedback: a bad mark asks for a reason and a note before it sends", async () => {
  const w = mount(BlessMessageFeedback, { props: { reasons: ["Not true", "Too long"] } });
  await btn(w, "Bad reply").trigger("click");
  expect(w.emitted("feedback")).toBeUndefined();
  expect(w.find(".bless-feedback__ask").text()).toBe("What was wrong?");
  const reasons = w.findAll(".bless-feedback__reason");
  await reasons[1]!.trigger("click");
  expect(reasons[1]!.attributes("aria-pressed")).toBe("true");
  await w.find("textarea").setValue("  Half of it  ");
  await w.find("form").trigger("submit");
  expect(w.emitted("feedback")).toEqual([
    [{ rating: "bad", reason: "Too long", note: "Half of it" }],
  ]);
  expect(w.find("form").exists()).toBe(false);
});

test("BlessMessageFeedback: copy and retry show only when asked, and labels translate", async () => {
  const plain = mount(BlessMessageFeedback);
  expect(btn(plain, "Copy").exists()).toBe(false);
  expect(btn(plain, "Try again").exists()).toBe(false);
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  const w = mount(BlessMessageFeedback, {
    props: { copy: "the reply", retry: true, labels: { retry: "Coba lagi" } },
  });
  await btn(w, "Copy").trigger("click");
  await new Promise((r) => setTimeout(r));
  expect(writeText).toHaveBeenCalledWith("the reply");
  expect(btn(w, "Copied").exists()).toBe(true);
  await btn(w, "Coba lagi").trigger("click");
  expect(w.emitted("retry")).toHaveLength(1);
});
