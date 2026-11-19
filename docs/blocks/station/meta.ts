export default {
  title: "Station",
  group: "Work",
  order: 19,
  summary:
    "A work station on a shop floor: the work order, a counter of good and scrap units, step-by-step instructions, and a quality check for each unit. Pause asks why the line stopped.",
  components: [
    "BlessWorkOrderCard",
    "BlessProductionCounter",
    "BlessWorkInstructions",
    "BlessQualityCheck",
    "BlessSheet",
    "BlessDowntimePicker",
    "BlessText",
  ],
  height: "820px",
};
