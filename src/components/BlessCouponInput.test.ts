import { mount } from "@vue/test-utils";
import BlessCouponInput from "./BlessCouponInput.vue";

test("BlessCouponInput: a code is sent in capitals, an error shows on the field", async () => {
  const w = mount(BlessCouponInput, { props: { error: "This code has expired" } });
  expect(w.find("button[type=submit]").attributes("disabled")).toBeDefined();
  await w.find("input").setValue("  listener10 ");
  await w.find("form").trigger("submit");
  expect(w.emitted("apply")).toEqual([["LISTENER10"]]);
  expect(w.find("input").attributes("aria-invalid")).toBe("true");
  expect(w.text()).toContain("This code has expired");
});

test("BlessCouponInput: an applied code is a chip with the saving and a remove button, read aloud", async () => {
  const w = mount(BlessCouponInput);
  await w.setProps({ applied: { code: "LISTENER10", saving: "−$7.80" } });
  expect(w.find("form").exists()).toBe(false);
  expect(w.find(".bless-coupon__chip").text()).toBe("LISTENER10−$7.80");
  expect(w.find("[role=status]").text()).toBe("Code LISTENER10 applied");
  const remove = w.find(".bless-coupon__remove");
  expect(remove.attributes("aria-label")).toBe("Remove the code LISTENER10");
  await remove.trigger("click");
  expect(w.emitted("remove")).toEqual([["LISTENER10"]]);
});

test("BlessCouponInput: no capitals on request, no send while loading, and labels translate", async () => {
  const w = mount(BlessCouponInput, {
    props: { uppercase: false, loading: true, labels: { apply: "Pakai" } },
  });
  await w.find("input").setValue("abc");
  await w.find("form").trigger("submit");
  expect(w.emitted("apply")).toBeUndefined();
  await w.setProps({ loading: false });
  await w.find("form").trigger("submit");
  expect(w.emitted("apply")).toEqual([["abc"]]);
  expect(w.find("button[type=submit]").text()).toBe("Pakai");
});
