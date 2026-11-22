export default {
  title: "Billing",
  group: "Money",
  order: 34,
  summary:
    "The plan, the usage, the card, and the invoices of an account. An overdue invoice shows at the top with a way to pay it. A smaller plan that cannot hold your seats or files says what to remove first.",
  components: [
    "BlessCard",
    "BlessQuotaUsage",
    "BlessTable",
    "BlessSheet",
    "BlessInvoice",
    "BlessModal",
    "BlessRadioGroup",
    "BlessRadio",
    "BlessAlertDialog",
    "BlessAlert",
    "BlessButton",
    "BlessText",
  ],
  height: "820px",
};
