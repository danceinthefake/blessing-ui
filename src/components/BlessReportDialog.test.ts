import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessReportDialog from "./BlessReportDialog.vue";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});

test("BlessReportDialog: no reason shows an error, a reason sends, then a thank-you", async () => {
  const w = mount(BlessReportDialog, {
    attachTo: document.body,
    props: {
      open: false,
      subject: "this comment",
      "onUpdate:open": (v: boolean) => w.setProps({ open: v }),
    },
  });
  await w.setProps({ open: true });
  await nextTick();
  expect(document.body.textContent).toContain("Report this comment");
  await w.find("form").trigger("submit");
  expect(w.find("[role=alert]").text()).toBe("Pick a reason.");
  expect(w.find("fieldset").attributes("aria-invalid")).toBe("true");
  expect(w.emitted("report")).toBeUndefined();
  await w.findAll("input[type=radio]")[0]!.setValue(true);
  await w.find("textarea").setValue("  Same link 20 times ");
  await w.find("form").trigger("submit");
  expect(w.emitted("report")).toEqual([["Spam", "Same link 20 times"]]);
  expect(w.find("[role=status]").text()).toContain("We will look at it.");
  // opening again starts a fresh form
  await w.setProps({ open: false });
  await w.setProps({ open: true });
  expect(w.find("form").exists()).toBe(true);
  expect(w.findAll("input[type=radio]").some((r) => (r.element as HTMLInputElement).checked)).toBe(
    false,
  );
  w.unmount();
});
