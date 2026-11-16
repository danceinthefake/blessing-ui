import { mount } from "@vue/test-utils";
import BlessPayslip from "./BlessPayslip.vue";

test("BlessPayslip: the employee, earnings and deductions with totals, and the net pay", () => {
  const w = mount(BlessPayslip, {
    props: {
      employee: { name: "Budi", id: "E-07", role: "Engineer" },
      period: "November 2026",
      payDate: "25 Nov 2026",
      earnings: [
        { label: "Base pay", amount: 1000 },
        { label: "Overtime", amount: 150 },
      ],
      deductions: [{ label: "Tax", amount: 115 }],
    },
  });
  expect(w.find("dd").text()).toBe("Budi · E-07Engineer");
  const [earn, ded] = w.findAll("table");
  expect(earn!.find("caption").text()).toBe("Earnings");
  expect(earn!.find("tfoot td").text()).toBe("$1,150.00");
  expect(ded!.find("tfoot td").text()).toBe("−$115.00");
  expect(w.find(".bless-payslip__net strong").text()).toBe("$1,035.00");
});
