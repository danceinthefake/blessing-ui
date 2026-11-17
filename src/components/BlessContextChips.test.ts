import { mount } from "@vue/test-utils";
import BlessContextChips from "./BlessContextChips.vue";

test("BlessContextChips: the kind in words, details, remove by id, and add", async () => {
  const w = mount(BlessContextChips, {
    props: {
      addable: true,
      items: [
        { id: "a", label: "plan.pdf", kind: "file", detail: "2.4k tokens" },
        { id: "b", label: "Pricing page", kind: "page" },
      ],
    },
  });
  expect(w.find("ul").attributes("aria-label")).toBe("Context for the message");
  const chips = w.findAll(".bless-chip");
  expect(chips[0]!.find(".bless-chip__label").text().replace(/\s+/g, " ")).toBe(
    "File plan.pdf 2.4k tokens",
  );
  expect(chips[1]!.find("button").attributes("aria-label")).toBe("Remove Pricing page");
  await chips[1]!.find("button").trigger("click");
  expect(w.emitted("remove")).toEqual([["b"]]);
  await w.find(".bless-ctxchips__add").trigger("click");
  expect(w.emitted("add")).toHaveLength(1);
});
