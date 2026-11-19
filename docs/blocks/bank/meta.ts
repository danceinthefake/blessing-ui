export default {
  title: "Bank",
  group: "Money",
  order: 21,
  summary:
    "An account page: the balance with Transfer, the budget for the month, and the recent transactions. Transfer opens a sheet that checks the amount, then asks for a PIN before the money moves.",
  components: [
    "BlessBalanceCard",
    "BlessButton",
    "BlessBudgetBars",
    "BlessTransactionList",
    "BlessSheet",
    "BlessForm",
    "BlessField",
    "BlessInput",
    "BlessInputNumber",
    "BlessPinPad",
    "BlessText",
  ],
  height: "680px",
};
