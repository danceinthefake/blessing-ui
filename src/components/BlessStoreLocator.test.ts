import { mount } from "@vue/test-utils";
import BlessStoreLocator from "./BlessStoreLocator.vue";

const stores = [
  { id: "far", name: "North", address: "1 Hill Rd", distance: 12.34, open: false, hours: "10–18" },
  {
    id: "near",
    name: "Center",
    address: "5 Main St",
    distance: 0.8,
    open: true,
    phone: "+62 21 555-01",
    directions: "https://maps.example/near",
  },
  { id: "x", name: "Online desk", address: "Main St kiosk" },
];

test("BlessStoreLocator: nearest first, distance, open or closed in words, links named with the store", () => {
  const w = mount(BlessStoreLocator, { props: { stores } });
  const items = w.findAll(".bless-stores__store");
  expect(items.map((i) => i.find(".bless-stores__name").text())).toEqual([
    "Center",
    "North",
    "Online desk",
  ]);
  expect(items[0]!.find(".bless-stores__meta").text().replace(/\s+/g, " ")).toBe(
    "0.8 km away · Open now",
  );
  expect(items[1]!.find(".bless-stores__meta").text().replace(/\s+/g, " ")).toBe(
    "12.3 km away · Closed · 10–18",
  );
  const links = items[0]!.findAll(".bless-stores__links a");
  expect(links.map((a) => a.text())).toEqual(["Directions: Center", "Call: Center"]);
  expect(links[1]!.attributes("href")).toBe("tel:+622155501");
});

test("BlessStoreLocator: search filters, and a radio picks the store", async () => {
  const w = mount(BlessStoreLocator, {
    props: {
      stores,
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string }),
    },
  });
  await w.find("input[type=search]").setValue("main");
  expect(w.findAll(".bless-stores__name").map((n) => n.text())).toEqual(["Center", "Online desk"]);
  await w.findAll("input[type=radio]")[1]!.setValue(true);
  expect(w.props("modelValue")).toBe("x");
  expect(w.findAll(".bless-stores__store")[1]!.classes()).toContain("is-selected");
  await w.find("input[type=search]").setValue("zzz");
  expect(w.find("[role=status]").text()).toBe("No store matches the search.");
});
