import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import BlessField from "./BlessField.vue";
import BlessForm from "./BlessForm.vue";
import BlessInput from "./BlessInput.vue";
import { formValues, issuesToErrors } from "./schema";
import type { BlessSchema } from "./schema";

/** a hand-made Standard Schema, so the test needs no validation library */
const schema = (
  check: (v: Record<string, unknown>) => { message: string; path?: string[] }[],
  out?: (v: unknown) => unknown,
): BlessSchema => ({
  "~standard": {
    validate: async (v) => {
      const issues = check(v as Record<string, unknown>);
      return issues.length ? { issues } : { value: out ? out(v) : v };
    },
  },
});

test("formValues makes an object and turns a repeated name into an array", () => {
  const fd = new FormData();
  fd.append("a", "1");
  fd.append("tag", "x");
  fd.append("tag", "y");
  fd.append("tag", "z");
  expect(formValues(fd)).toEqual({ a: "1", tag: ["x", "y", "z"] });
});

test("issuesToErrors keys by the first path step; the first message wins; no path is the form", () => {
  expect(
    issuesToErrors([
      { message: "Too short", path: ["name"] },
      { message: "Second", path: ["name"] },
      { message: "Bad email", path: [{ key: "email" }] },
      { message: "Form is wrong" },
      { message: "Nested", path: ["address", "city"] },
    ]),
  ).toEqual({ name: "Too short", email: "Bad email", "": "Form is wrong", address: "Nested" });
});

const mk = (props: Record<string, unknown>) => {
  const submitted: unknown[][] = [];
  const App = defineComponent({
    setup: () => () =>
      h(
        BlessForm,
        { ...props, onSubmit: (...a: unknown[]) => submitted.push(a), onInvalid: () => {} },
        () => [
          h(BlessField, { label: "Name" }, () => h(BlessInput, { name: "name", modelValue: "Al" })),
          h(BlessField, { label: "Email" }, () =>
            h(BlessInput, { name: "email", modelValue: "x" }),
          ),
        ],
      ),
  });
  return { w: mount(App, { attachTo: document.body }), submitted };
};

test("BlessForm schema: issues show in the Field of the matching name and block the submit", async () => {
  const s = schema((v) => [
    ...(String(v.name).length < 3 ? [{ message: "Use 3 letters or more", path: ["name"] }] : []),
    ...(!String(v.email).includes("@") ? [{ message: "Enter an email", path: ["email"] }] : []),
  ]);
  const { w, submitted } = mk({ schema: s });
  await w.find("form").trigger("submit");
  await flushPromises();
  const errs = w.findAll("[role=alert]").map((e) => e.text());
  expect(errs).toEqual(["Use 3 letters or more", "Enter an email"]);
  expect(submitted).toHaveLength(0);
  expect(w.findAll("input")[0].attributes("aria-invalid")).toBe("true");
  expect(document.activeElement).toBe(w.findAll("input")[0].element); // focus moves to the first
  w.unmount();
});

test("BlessForm schema: editing a field clears its own message only", async () => {
  const s = schema(() => [
    { message: "Name is wrong", path: ["name"] },
    { message: "Email is wrong", path: ["email"] },
  ]);
  const { w } = mk({ schema: s });
  await w.find("form").trigger("submit");
  await flushPromises();
  expect(w.findAll("[role=alert]")).toHaveLength(2);
  await w.findAll("input")[0].setValue("Alice");
  await flushPromises();
  expect(w.findAll("[role=alert]").map((e) => e.text())).toEqual(["Email is wrong"]);
  w.unmount();
});
test("BlessForm schema: a passing schema emits submit with the schema's value (its coercion)", async () => {
  const s = schema(
    () => [],
    (v) => ({ ...(v as object), name: String((v as { name: string }).name).toUpperCase() }),
  );
  const { w, submitted } = mk({ schema: s });
  await w.find("form").trigger("submit");
  await flushPromises();
  expect(submitted).toHaveLength(1);
  expect(submitted[0][0]).toBeInstanceOf(FormData);
  expect(submitted[0][2]).toEqual({ name: "AL", email: "x" });
  w.unmount();
});

test("BlessForm without a schema still emits submit at once, with the form data as an object", async () => {
  const { w, submitted } = mk({});
  await w.find("form").trigger("submit");
  expect(submitted).toHaveLength(1);
  expect(submitted[0][2]).toEqual({ name: "Al", email: "x" });
  w.unmount();
});

test("BlessForm schema: an issue without a path reaches the slot as errors[''], and reset clears all", async () => {
  const seen: Record<string, string>[] = [];
  const s = schema(() => [{ message: "Passwords do not match" }]);
  const App = defineComponent({
    setup: () => () =>
      h(
        BlessForm,
        { schema: s, onInvalid: () => {} },
        {
          default: ({ errors }: { errors: Record<string, string> }) => {
            seen.push({ ...errors });
            return h("button", { type: "reset" }, "Reset");
          },
        },
      ),
  });
  const w = mount(App, { attachTo: document.body });
  await w.find("form").trigger("submit");
  await flushPromises();
  expect(seen.at(-1)).toEqual({ "": "Passwords do not match" });
  await w.find("form").trigger("reset");
  await flushPromises();
  expect(seen.at(-1)).toEqual({});
  w.unmount();
});
