export default {
  title: "Find a time",
  group: "Work",
  order: 45,
  summary:
    "A poll for a meeting time. You mark when you are free, the heatmap shows how many people are free at each time, and the best times come first: the most people for the whole meeting, then the earliest.",
  components: [
    "BlessAvailabilityGrid",
    "BlessHeatmap",
    "BlessSelect",
    "BlessField",
    "BlessAlert",
    "BlessButton",
    "BlessText",
  ],
  height: "1100px",
};
