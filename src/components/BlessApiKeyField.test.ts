import { mount } from "@vue/test-utils";
import BlessApiKeyField, { maskKey } from "./BlessApiKeyField.vue";

const key = "sk_demo_51HxQ9aB7cD3f9a";

test("maskKey: the start and the last four letters", () => {
  expect(maskKey(key)).toBe("sk_demo_••••••••3f9a");
  expect(maskKey("abcdefghij1234")).toBe("••••••••1234");
  expect(maskKey("ab")).toBe("••••••••");
});

test("BlessApiKeyField: hidden by default, the eye shows it, and the meta line", async () => {
  const w = mount(BlessApiKeyField, {
    props: { value: key, name: "Upload script", created: "3 Nov 2026", lastUsed: "today" },
  });
  const code = () => w.find(".bless-apikey__value");
  expect(code().text()).not.toContain("51HxQ9");
  expect(code().find(".bless-sr").text()).toBe("sk_demo_ … 3f9a");
  const eye = w.find('[aria-label="Show the key"]');
  expect(eye.attributes("aria-pressed")).toBe("false");
  await eye.trigger("click");
  expect(code().text()).toBe(key);
  expect(eye.attributes("aria-pressed")).toBe("true");
  expect(w.find(".bless-apikey__meta").text()).toBe("Made 3 Nov 2026 · Last used today");
  expect(w.find(".bless-apikey__name").text()).toBe("Upload script");
});

test("BlessApiKeyField: copy writes the full key, and a new key waits for a confirm", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  const w = mount(BlessApiKeyField, { props: { value: key, labels: { copied: "Tersalin" } } });
  const copy = w.findAll("button").find((b) => b.text() === "Copy")!;
  await copy.trigger("click");
  await new Promise((r) => setTimeout(r));
  expect(writeText).toHaveBeenCalledWith(key);
  expect(w.find("[role=status]").text()).toBe("Tersalin");
  expect(w.emitted("copy")).toHaveLength(1);
  // the confirm popup asks first; only its confirm emits regenerate
  expect(w.emitted("regenerate")).toBeUndefined();
  w.findComponent({ name: "BlessConfirmPopup" }).vm.$emit("confirm");
  expect(w.emitted("regenerate")).toHaveLength(1);
  const plain = mount(BlessApiKeyField, { props: { value: key, regenerable: false } });
  expect(plain.findComponent({ name: "BlessConfirmPopup" }).exists()).toBe(false);
});
