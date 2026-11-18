import { mount } from "@vue/test-utils";
import BlessRecordHeader from "./BlessRecordHeader.vue";

test("BlessRecordHeader: code, title at the level, status with a mark and a word, facts, and actions", () => {
  const w = mount(BlessRecordHeader, {
    props: {
      title: "Studio gear order",
      code: "PO-2026-0142",
      status: "Approved",
      color: "success",
      level: 2,
      facts: [
        { label: "Supplier", value: "Toko Audio" },
        { label: "Total", value: "Rp 4.200.000" },
      ],
    },
    slots: { default: "<button>Send</button>" },
  });
  expect(w.find("h2").text()).toBe("Studio gear order");
  expect(w.find(".bless-record__code").text()).toBe("PO-2026-0142");
  expect(w.find(".bless-record__status").text()).toBe("✓ Approved");
  expect(w.findAll("dt").map((d) => d.text())).toEqual(["Supplier", "Total"]);
  expect(w.findAll("dd").map((d) => d.text())).toEqual(["Toko Audio", "Rp 4.200.000"]);
  expect(w.find(".bless-record__actions button").text()).toBe("Send");
});
