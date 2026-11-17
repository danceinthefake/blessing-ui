import { mount } from "@vue/test-utils";
import BlessContactForm from "./BlessContactForm.vue";

test("BlessContactForm: errors linked to fields, focus on the first, submit, the bot trap, and the states", async () => {
  const w = mount(BlessContactForm, {
    props: { topics: ["Sales", "Help"] },
    attachTo: document.body,
  });
  await w.find("form").trigger("submit");
  expect(w.emitted("submit")).toBeUndefined();
  const name = w.find("input[name=name]");
  expect(name.attributes("aria-invalid")).toBe("true");
  expect(w.find(`#${name.attributes("aria-describedby")}`).text()).toBe("Enter your name.");
  expect(document.activeElement).toBe(name.element);
  await name.setValue("Ana");
  await w.find("input[name=email]").setValue("not-an-email");
  await w.find("textarea").setValue("Hello");
  await w.find("form").trigger("submit");
  expect(document.activeElement).toBe(w.find("input[name=email]").element);
  await w.find("input[name=email]").setValue("ana@example.com");
  await w.find("select").setValue("Help");
  await w.find("form").trigger("submit");
  expect(w.emitted("submit")).toEqual([
    [{ name: "Ana", email: "ana@example.com", topic: "Help", message: "Hello" }],
  ]);
  await w.setProps({ state: "error" });
  expect(w.find("[role=alert]").exists()).toBe(true);
  await w.find("input[name=website]").setValue("spam");
  await w.find("form").trigger("submit");
  expect(w.emitted("submit")).toHaveLength(1);
  await w.setProps({ state: "sent" });
  expect(w.find("[role=status]").text()).toContain("Thank you");
  w.unmount();
});
