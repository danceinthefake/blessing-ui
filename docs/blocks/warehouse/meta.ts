export default {
  title: "Warehouse",
  group: "Shop",
  order: 42,
  summary:
    "Stock levels against the reorder point, a picking list for each paid order, and deliveries that come in by barcode. A shipped order takes its items off the stock, and the low items go to the supplier in one purchase order.",
  components: [
    "BlessTabs",
    "BlessStockLevels",
    "BlessPickingList",
    "BlessSkuField",
    "BlessSelect",
    "BlessModal",
    "BlessDescriptions",
    "BlessField",
    "BlessInput",
    "BlessAlert",
    "BlessEmpty",
    "BlessButton",
    "BlessText",
  ],
  height: "900px",
};
