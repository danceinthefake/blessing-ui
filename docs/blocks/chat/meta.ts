export default {
  title: "Chat",
  group: "App",
  order: 8,
  summary:
    "A conversation thread that sticks to the bottom, with a composer that sends on Enter (never mid-IME conversion) and a typing indicator.",
  components: [
    "BlessMessageScroller",
    "BlessMessage",
    "BlessBubble",
    "BlessTextarea",
    "BlessButton",
    "BlessAvatar",
  ],
  height: "520px",
};
