import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessFormula from "./BlessFormula.vue";

const variables = [
  { name: "price", label: "Price", value: 12.5 },
  { name: "qty", value: 4 },
  { name: "tax", value: 2 },
];
let w: VueWrapper;
const mk = (props: Record<string, unknown> = {}) => {
  w = mount(BlessFormula, {
    props: {
      variables,
      modelValue: "",
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string }),
      ...props,
    },
    attachTo: document.body,
  });
  return w;
};
afterEach(() => w?.unmount());
const input = () => w.find("input").element as HTMLInputElement;
const out = () => w.find(".bless-formula__out").text();
const type = async (s: string) => {
  await w.find("input").setValue(s);
  await nextTick();
};

test("a labelled input; nothing is said while it is empty", () => {
  mk();
  expect(w.find("label").attributes("for")).toBe(w.find("input").attributes("id"));
  expect(out()).toBe("");
  expect(w.find("input").attributes("aria-invalid")).toBeUndefined();
});

test("a valid formula shows its value, formatted, and emits it", async () => {
  mk({ locale: "en" });
  await type("price * qty + tax");
  expect(out()).toBe("= 52");
  expect(w.emitted("result")!.at(-1)).toEqual([52]);
  await type("1000 * 1000 / 3");
  expect(out()).toBe("= 333,333.333333");
});

test("a mistake is described, marks the input invalid, and emits null", async () => {
  mk();
  await type("price * ");
  expect(out()).toBe("The formula ends too soon");
  expect(w.find("input").attributes("aria-invalid")).toBe("true");
  expect(w.emitted("result")!.at(-1)).toEqual([null]);
  await type("price / 0");
  expect(out()).toBe("Division by zero");
  await type("price $ 2");
  expect(out()).toBe("Unexpected “$” at position 7");
});

test("a mistyped name offers the close one, and the button fixes it in place", async () => {
  mk({ locale: "en" });
  await type("prise * qty");
  expect(out()).toContain("Unknown value “prise” — did you mean “price”?");
  await w.find(".bless-formula__fix").trigger("click");
  await nextTick();
  expect(input().value).toBe("price * qty");
  expect(out()).toBe("= 50");
});

test("chips insert at the caret, with spaces where words would touch, and keep focus in the input", async () => {
  mk();
  await type("qty");
  input().setSelectionRange(3, 3);
  await w.findAll(".bless-formula__chip")[0]!.trigger("click"); // price
  await nextTick();
  await nextTick();
  expect(input().value).toBe("qty price");
  expect(document.activeElement).toBe(input());
  expect(input().selectionStart).toBe(9);
  await type("(  )");
  input().setSelectionRange(2, 2);
  await w.findAll(".bless-formula__chip")[2]!.trigger("click"); // tax
  await nextTick();
  expect(input().value).toBe("( tax )");
});

test("chips that the formula uses read as pressed, and show their value on hover", async () => {
  mk();
  await type("price + 1");
  const chips = w.findAll(".bless-formula__chip");
  expect(chips[0]!.attributes("aria-pressed")).toBe("true");
  expect(chips[1]!.attributes("aria-pressed")).toBe("false");
  expect(chips[0]!.attributes("title")).toBe("price = 12.5");
  expect(chips[0]!.text()).toBe("Price");
});

test("custom functions work, and the wording can be translated", async () => {
  mk({
    functions: { vat: (x: number) => x * 0.11 },
    labels: { result: (v: string) => `Hasil: ${v}`, error: () => "Rumus salah" },
  });
  await type("vat(100)");
  expect(out()).toBe("Hasil: 11");
  await type("vat(");
  expect(out()).toBe("Rumus salah");
});

test("it cannot be made to run code", async () => {
  mk();
  await type("constructor('return 1')()");
  expect(w.find("input").attributes("aria-invalid")).toBe("true");
  await type("toString(1)");
  expect(out()).toContain("Unknown function");
});
