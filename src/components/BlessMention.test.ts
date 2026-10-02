import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessMention from "./BlessMention.vue";
import { stubPopover } from "../test/popover";

beforeAll(stubPopover);

const people = [
  { value: "mika", label: "Mika Tanaka", hint: "design" },
  { value: "ken", label: "Ken Ito" },
  { value: "miho", label: "Miho Sato" },
];
const mk = (props = {}) =>
  mount(BlessMention, {
    props: {
      modelValue: "",
      options: people,
      "onUpdate:modelValue": (v: string) => w.setProps({ modelValue: v }),
      ...props,
    },
    attachTo: document.body,
  });
let w: ReturnType<typeof mk>;
afterEach(() => w?.unmount());

/** type `text` with the caret at its end */
async function type(text: string) {
  const el = w.find("textarea").element as HTMLTextAreaElement;
  el.value = text;
  el.setSelectionRange(text.length, text.length);
  await w.find("textarea").trigger("input");
  await nextTick();
  await nextTick();
}
const opts = () => w.findAll('[role="option"]').map((o) => o.find("span").text());

test("typing @ at a word start opens the list, filtered by what follows", async () => {
  w = mk();
  await type("hi @");
  expect(opts()).toEqual(["Mika Tanaka", "Ken Ito", "Miho Sato"]);
  expect(w.find("textarea").attributes("aria-expanded")).toBe("true");
  await type("hi @mi");
  expect(opts().map((t) => t.split(" ")[0])).toEqual(["Mika", "Miho"]);
});

test("a trigger inside a word, or no match, keeps it closed", async () => {
  w = mk();
  await type("mail@");
  expect(opts()).toEqual([]);
  await type("hi @zzz");
  expect(w.find("textarea").attributes("aria-expanded")).toBe("false");
});

test("Enter inserts the active option and a space, and emits select", async () => {
  w = mk();
  await type("hi @mi");
  await w.find("textarea").trigger("keydown", { key: "ArrowDown" });
  await w.find("textarea").trigger("keydown", { key: "Enter" });
  expect(w.props("modelValue")).toBe("hi @miho ");
  expect(w.emitted("select")![0]).toEqual([people[2], "@"]);
  expect(w.find("textarea").attributes("aria-expanded")).toBe("false");
});

test("clicking an option inserts it mid-text and leaves the rest alone", async () => {
  w = mk({ modelValue: "x @ke and more" });
  const el = w.find("textarea").element as HTMLTextAreaElement;
  el.setSelectionRange(5, 5); // right after "@ke"
  await w.find("textarea").trigger("input");
  await nextTick();
  await nextTick();
  await w.find('[role="option"]').trigger("mousedown");
  expect(w.props("modelValue")).toBe("x @ken  and more");
});

test("Escape closes without inserting; arrows wrap", async () => {
  w = mk();
  await type("@");
  await w.find("textarea").trigger("keydown", { key: "ArrowUp" });
  expect(w.find("textarea").attributes("aria-activedescendant")).toMatch(/opt-2$/);
  await w.find("textarea").trigger("keydown", { key: "Escape" });
  expect(w.find("textarea").attributes("aria-expanded")).toBe("false");
  expect(w.props("modelValue")).toBe("@");
});

test("a record of options gives each trigger its own list", async () => {
  w = mk({ options: { "@": people, "#": [{ value: "bug", label: "bug" }] } });
  await type("#");
  expect(opts()).toEqual(["bug"]);
  await type("#bug @");
  expect(opts()).toHaveLength(3);
  await type("hi !");
  expect(opts()).toEqual([]);
});
