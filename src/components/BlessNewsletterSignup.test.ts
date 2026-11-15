import { mount } from "@vue/test-utils";
import BlessNewsletterSignup from "./BlessNewsletterSignup.vue";

test("BlessNewsletterSignup: a bad address shows a hint, a good one emits subscribe", async () => {
  const w = mount(BlessNewsletterSignup, {
    attachTo: document.body,
    props: { privacyHref: "/privacy" },
  });
  const input = w.find("input");
  expect(input.attributes("type")).toBe("email");
  expect(input.attributes("autocomplete")).toBe("email");
  await input.setValue("not an email");
  await w.find("form").trigger("submit");
  expect(w.emitted("subscribe")).toBeUndefined();
  expect(w.text()).toContain("Enter an email address such as name@example.com.");
  await input.setValue("  rara@example.com ");
  await w.find("form").trigger("submit");
  expect(w.emitted("subscribe")).toEqual([["rara@example.com"]]);
  expect(w.find(".bless-newsletter__privacy a").attributes("href")).toBe("/privacy");
  w.unmount();
});

test("BlessNewsletterSignup: loading blocks a second send, the server error shows, and done thanks", async () => {
  const w = mount(BlessNewsletterSignup, {
    attachTo: document.body,
    props: { status: "loading", modelValue: "a@b.co", error: "Already on the list" },
  });
  await w.find("form").trigger("submit");
  expect(w.emitted("subscribe")).toBeUndefined();
  expect(w.text()).toContain("Already on the list");
  await w.setProps({ status: "done", labels: { done: "Terima kasih!" } });
  expect(w.find("form").exists()).toBe(false);
  expect(w.find("[role=status]").text()).toBe("Terima kasih!");
  w.unmount();
});
