import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import BlessKeyValueEditor, { type BlessKeyValue } from "./BlessKeyValueEditor.vue";

const Host = (props: Record<string, unknown> = {}) => ({
  components: { BlessKeyValueEditor },
  setup: () => ({ rows: ref<BlessKeyValue[]>([{ key: "Accept", value: "text/html" }]), props }),
  template: `<BlessKeyValueEditor v-model="rows" v-bind="props" />`,
});

test("BlessKeyValueEditor: the rows and one empty row; typing in it adds a row", async () => {
  const w = mount(Host());
  const keys = () => w.findAll(".bless-kv__key");
  expect(keys().map((k) => (k.element as HTMLInputElement).value)).toEqual(["Accept", ""]);
  expect(w.findAll(".bless-kv__remove")).toHaveLength(1);
  await keys()[1]!.setValue("X-Id");
  expect((w.vm as unknown as { rows: BlessKeyValue[] }).rows).toEqual([
    { key: "Accept", value: "text/html" },
    { key: "X-Id", value: "", enabled: true },
  ]);
  expect(keys()).toHaveLength(3);
  await w.findAll(".bless-kv__input")[3]!.setValue("42");
  expect((w.vm as unknown as { rows: BlessKeyValue[] }).rows[1]!.value).toBe("42");
});

test("BlessKeyValueEditor: remove takes the row out and keeps focus in the list", async () => {
  const w = mount(Host(), { attachTo: document.body });
  await w.findAll(".bless-kv__key")[1]!.setValue("B");
  const remove = w.findAll(".bless-kv__remove")[0]!;
  expect(remove.attributes("aria-label")).toBe("Remove Accept");
  await remove.trigger("click");
  await nextTick();
  expect((w.vm as unknown as { rows: BlessKeyValue[] }).rows.map((r) => r.key)).toEqual(["B"]);
  expect(document.activeElement).toBe(w.findAll(".bless-kv__key")[0]!.element);
  w.unmount();
});

test("BlessKeyValueEditor: a key used twice is marked; toggle turns a row off; secret hides values", async () => {
  const w = mount(Host({ toggle: true, secret: true }));
  await w.findAll(".bless-kv__key")[1]!.setValue("Accept");
  expect(w.findAll(".bless-kv__key[aria-invalid=true]")).toHaveLength(2);
  expect(w.find(".bless-kv__error").text()).toBe("This key is used more than once");
  const on = w.findAll<HTMLInputElement>(".bless-kv__on");
  expect(on[2]!.element.disabled).toBe(true); // the empty row
  await on[0]!.setValue(false);
  expect((w.vm as unknown as { rows: BlessKeyValue[] }).rows[0]!.enabled).toBe(false);
  expect(w.find(".bless-kv__row--off").exists()).toBe(true);
  expect(w.findAll(".bless-kv__input")[1]!.attributes("type")).toBe("password");
});
