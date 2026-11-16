import { mount } from "@vue/test-utils";
import BlessJournalEntry, { journalTotals, type BlessJournalLine } from "./BlessJournalEntry.vue";

test("journalTotals: sums in cents, the difference, and balanced only when equal and above zero", () => {
  expect(
    journalTotals([
      { id: "a", account: "1", debit: 0.1 },
      { id: "b", account: "1", debit: 0.2 },
      { id: "c", account: "2", credit: 0.3 },
    ]),
  ).toEqual({
    debit: 0.3,
    credit: 0.3,
    difference: 0,
    balanced: true,
  });
  expect(journalTotals([]).balanced).toBe(false);
});

const accounts = [
  { code: "1100", name: "Cash" },
  { code: "4000", name: "Sales" },
];
const sheet = (lines: BlessJournalLine[]) => {
  const w = mount(BlessJournalEntry, {
    props: {
      accounts,
      modelValue: lines,
      "onUpdate:modelValue": (v: BlessJournalLine[]) => w.setProps({ modelValue: v }),
    },
  });
  return w;
};
const lines = (w: ReturnType<typeof sheet>) => w.props("modelValue") as BlessJournalLine[];

test("BlessJournalEntry: one side per line, the status in words, and post only when balanced", async () => {
  const w = sheet([
    { id: "a", account: "1100", debit: 100 },
    { id: "b", account: "4000" },
  ]);
  const post = () => w.find(".bless-journal__foot button:last-child");
  expect(w.find("[role=status]").text()).toBe("≠ Not balanced: $100.00 more on the debit side");
  expect(post().attributes("disabled")).toBeDefined();
  const credit = w.find('[aria-label="Credit, line 2"]');
  await credit.setValue("100");
  await credit.trigger("change");
  expect(w.find("[role=status]").text()).toBe("✓ Balanced");
  await post().trigger("click");
  expect(w.emitted("post")).toHaveLength(1);
  // a debit on line 2 clears its credit
  const debit = w.find('[aria-label="Debit, line 2"]');
  await debit.setValue("40");
  await debit.trigger("change");
  expect(lines(w)[1]).toMatchObject({ debit: 40, credit: undefined });
});
