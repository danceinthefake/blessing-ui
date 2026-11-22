export default {
  title: "Checkout",
  group: "Shop",
  order: 28,
  summary:
    "Three steps from cart to order: the address, a delivery time, and the card. The order summary with a discount code stays next to the steps, and each step says what is missing before it goes on.",
  components: [
    "BlessSteps",
    "BlessAddressFields",
    "BlessDeliveryPicker",
    "BlessCardInput",
    "BlessCouponInput",
    "BlessOrderSummary",
    "BlessField",
    "BlessInput",
    "BlessAlert",
    "BlessButton",
    "BlessText",
  ],
  height: "820px",
};
