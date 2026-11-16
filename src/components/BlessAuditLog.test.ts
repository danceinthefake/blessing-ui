import { mount } from "@vue/test-utils";
import BlessAuditLog from "./BlessAuditLog.vue";

test("BlessAuditLog: who, the action as a mark and a word, the record, the time, and old and new values", () => {
  const w = mount(BlessAuditLog, {
    props: {
      entries: [
        {
          id: "1",
          who: "Ana",
          when: "09:12",
          action: "updated",
          target: "INV-0042",
          source: "API",
          changes: [
            { field: "Status", from: "Draft", to: "Sent" },
            { field: "Note", to: "Paid by transfer" },
          ],
        },
        { id: "2", who: "Budi", when: "08:00", action: "deleted", target: "PO-0007" },
      ],
    },
  });
  const [a, b] = w.findAll(".bless-audit__entry");
  expect(a!.find(".bless-audit__line").text().replace(/\s+/g, " ")).toBe("Ana ✎ changed INV-0042");
  expect(a!.find(".bless-audit__when").text()).toBe("09:12 · API");
  const changes = a!.findAll(".bless-audit__change");
  expect(changes[0]!.find("del").text()).toBe("was Draft");
  expect(changes[0]!.find("ins").text()).toBe("now Sent");
  expect(changes[1]!.find("del").text()).toBe("was empty");
  expect(b!.classes()).toContain("is-deleted");
  expect(b!.find("dl").exists()).toBe(false);
});
