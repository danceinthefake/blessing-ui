export default {
  title: "Chat",
  group: "App",
  order: 8,
  summary:
    "A conversation thread that sticks to the bottom, with a composer that sends on Enter and a typing indicator — the LINE-style screen.",
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
