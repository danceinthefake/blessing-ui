export default {
  title: "Page states",
  group: "App",
  order: 5,
  summary:
    "The three non-happy paths that every list needs: loading skeleton, empty with a call to action, and error with retry. One `state` switch controls them.",
  components: [
    "BlessEmpty",
    "BlessSkeleton",
    "BlessAlert",
    "BlessButton",
    "BlessToggleGroup",
    "BlessToggle",
  ],
};
