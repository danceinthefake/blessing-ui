import { mount } from "@vue/test-utils";
import BlessReadReceipt from "./BlessReadReceipt.vue";

test("BlessReadReceipt: marks and words for each state, who read it, and retry", async () => {
  const sent = mount(BlessReadReceipt, { props: { status: "sent", time: "09:12" } });
  expect(sent.find(".bless-receipt__mark").text()).toBe("✓");
  expect(sent.find(".bless-receipt__words").text()).toBe("Sent");
  expect(sent.find(".bless-receipt__time").text()).toBe("09:12");

  const read = mount(BlessReadReceipt, { props: { status: "read", readBy: ["Ana", "Budi"] } });
  expect(read.find(".bless-receipt__mark").text()).toBe("✓✓");
  expect(read.find(".bless-receipt__words").text()).toBe("Read by Ana and Budi");
  expect(read.attributes("title")).toBe("Read by Ana and Budi");

  const failed = mount(BlessReadReceipt, { props: { status: "failed" } });
  expect(failed.find(".bless-receipt__words").text()).toBe("Not sent");
  await failed.find("button").trigger("click");
  expect(failed.emitted("retry")).toHaveLength(1);
});
