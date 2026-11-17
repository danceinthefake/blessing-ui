import { mount } from "@vue/test-utils";
import BlessCheckAnswers from "./BlessCheckAnswers.vue";

test("BlessCheckAnswers: rows, lists, empty answers, change actions, and the declaration", async () => {
  const w = mount(BlessCheckAnswers, {
    props: {
      declaration: "The answers are true.",
      groups: [
        {
          title: "About you",
          rows: [
            { key: "name", label: "Full name", value: "Ana Putri", href: "/name" },
            { key: "address", label: "Address", value: ["Jl. Kemang 12", "Jakarta"] },
            { key: "phone", label: "Phone", value: "" },
          ],
        },
      ],
    },
  });
  const rows = w.findAll(".bless-answers__row");
  expect(rows[0]!.find("a").text()).toBe("Change Full name");
  expect(rows[1]!.findAll(".bless-answers__value div").map((d) => d.text())).toEqual([
    "Jl. Kemang 12",
    "Jakarta",
  ]);
  expect(rows[2]!.find(".bless-answers__value").text()).toBe("Not given");
  await rows[1]!.find("button").trigger("click");
  expect(w.emitted("change")).toEqual([["address"]]);
  await w.find("form").trigger("submit");
  expect(w.emitted("submit")).toBeUndefined();
  const box = w.find("input[type=checkbox]");
  expect(box.attributes("aria-invalid")).toBe("true");
  expect(w.find(`#${box.attributes("aria-describedby")}`).text()).toBe(
    "To send, you must agree to the statement.",
  );
  await box.setValue(true);
  await w.find("form").trigger("submit");
  expect(w.emitted("submit")).toHaveLength(1);
  expect(w.find(".bless-answers__error").exists()).toBe(false);
});
