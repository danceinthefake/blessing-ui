import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessOnboardingChecklist from "./BlessOnboardingChecklist.vue";

const items = [
  { id: "profile", label: "Fill in your profile", description: "Name and photo", action: "Open" },
  { id: "invite", label: "Invite a teammate" },
  { id: "first", label: "Publish your first page" },
];
let w: VueWrapper;
const mk = (props: Record<string, unknown> = {}) => {
  w = mount(BlessOnboardingChecklist, {
    props: {
      items,
      "onUpdate:done": (v: unknown) => w.setProps({ done: v as string[] }),
      "onUpdate:collapsed": (v: unknown) => w.setProps({ collapsed: v as boolean }),
      ...props,
    },
    attachTo: document.body,
  });
  return w;
};
afterEach(() => w?.unmount());
beforeEach(() => localStorage.clear());
const boxes = () => w.findAll("input[type=checkbox]");

test("a titled section with a checkbox per step and the count", () => {
  mk({ done: ["invite"] });
  expect(w.find("section").attributes("aria-labelledby")).toBeTruthy();
  expect(boxes()).toHaveLength(3);
  expect((boxes()[1]!.element as HTMLInputElement).checked).toBe(true);
  expect(w.find(".bless-checklist__count").text()).toBe("1/3");
  expect(w.find("[role=progressbar]").attributes("aria-label")).toBe("1 of 3 done");
});

test("ticking a step updates the model; a done step loses its action button", async () => {
  mk();
  expect(w.text()).toContain("Open");
  await boxes()[0]!.setValue(true);
  await nextTick();
  expect(w.props("done" as never)).toEqual(["profile"]);
  expect(w.find(".bless-checklist__item button").exists()).toBe(false);
});

test("the action button says which step with `select`", async () => {
  mk();
  await w.find(".bless-checklist__item button").trigger("click");
  expect((w.emitted("select")![0] as unknown[])[0]).toMatchObject({ id: "profile" });
});

test("finishing every step says so and emits complete once", async () => {
  mk({ done: ["profile", "invite"] });
  await boxes()[2]!.setValue(true);
  await nextTick();
  expect(w.find(".bless-checklist__all").text()).toContain("All done");
  expect(w.emitted("complete")).toHaveLength(1);
  await boxes()[2]!.setValue(false);
  await nextTick();
  expect(w.find(".bless-checklist__all").exists()).toBe(false);
});

test("the header collapses the list and says so", async () => {
  mk();
  const t = w.find(".bless-checklist__toggle");
  expect(t.attributes("aria-expanded")).toBe("true");
  await t.trigger("click");
  await nextTick();
  expect(t.attributes("aria-expanded")).toBe("false");
  expect(w.find(".bless-checklist__body").attributes("style")).toContain("display: none");
});

test("dismiss hides it for good", async () => {
  mk();
  await w.find(".bless-checklist__close").trigger("click");
  expect(w.find("section").exists()).toBe(false);
  expect(w.emitted("dismiss")).toHaveLength(1);
});

test("persist remembers progress, collapsed state and dismissal across visits", async () => {
  mk({ persist: "welcome" });
  await nextTick();
  await boxes()[0]!.setValue(true);
  await w.find(".bless-checklist__toggle").trigger("click");
  await nextTick();
  expect(JSON.parse(localStorage.getItem("bless-checklist:welcome")!)).toMatchObject({
    done: ["profile"],
    collapsed: true,
  });
  w.unmount();
  mk({ persist: "welcome" });
  await nextTick();
  expect(w.find(".bless-checklist__count").text()).toBe("1/3");
  expect(w.find(".bless-checklist__toggle").attributes("aria-expanded")).toBe("false");
});

test("labels translate the count, the finish line and the close button", async () => {
  mk({
    done: ["profile", "invite", "first"],
    labels: {
      progress: (d: number, n: number) => `${d} dari ${n}`,
      complete: "Selesai",
      dismiss: "Tutup",
    },
  });
  expect(w.find("[role=progressbar]").attributes("aria-label")).toBe("3 dari 3");
  expect(w.find(".bless-checklist__all").text()).toBe("Selesai");
  expect(w.find(".bless-checklist__close").attributes("aria-label")).toBe("Tutup");
});
