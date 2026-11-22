export default {
  title: "Orders",
  group: "Shop",
  order: 36,
  summary:
    "The past orders of a buyer. Open an order to see where it is, cancel it before it ships, or return items within 30 days of delivery. Buy again puts the same items in the cart.",
  components: [
    "BlessOrderHistory",
    "BlessSheet",
    "BlessShipmentTracker",
    "BlessReturnRequest",
    "BlessAlertDialog",
    "BlessAlert",
    "BlessButton",
    "BlessText",
  ],
  height: "820px",
};
