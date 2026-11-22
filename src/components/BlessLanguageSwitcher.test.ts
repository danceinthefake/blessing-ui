import { mount } from "@vue/test-utils";
import BlessLanguageSwitcher from "./BlessLanguageSwitcher.vue";

const languages = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
];

test("BlessLanguageSwitcher: a named select, each name in its own language", async () => {
  const w = mount(BlessLanguageSwitcher, {
    props: {
      languages,
      modelValue: "en",
      "onUpdate:modelValue": (v?: string) => w.setProps({ modelValue: v }),
    },
  });
  expect(w.find("label .bless-sr").text()).toBe("Language");
  const opts = w.findAll("option");
  expect(opts.map((o) => o.attributes("lang"))).toEqual(["en", "id"]);
  await w.find("select").setValue("id");
  expect(w.props("modelValue")).toBe("id");
  expect(w.find("select").attributes("lang")).toBe("id");
});

test("BlessLanguageSwitcher: with href, a list of links that marks the current one", () => {
  const w = mount(BlessLanguageSwitcher, {
    props: {
      languages,
      modelValue: "id",
      href: (c: string) => `/${c}/`,
      labels: { label: "Bahasa" },
    },
  });
  expect(w.find("nav").attributes("aria-label")).toBe("Bahasa");
  const links = w.findAll("a");
  expect(links.map((a) => a.attributes("href"))).toEqual(["/en/", "/id/"]);
  expect(links[1].attributes("aria-current")).toBe("true");
  expect(links[1].attributes("hreflang")).toBe("id");
  // negative control: the other language is not current, and no select is rendered
  expect(links[0].attributes("aria-current")).toBeUndefined();
  expect(w.find("select").exists()).toBe(false);
});
