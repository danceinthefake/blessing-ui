export default {
  title: "Inbox",
  group: "People and messages",
  order: 14,
  summary:
    "Two-pane mail: a list with unread indicators, and a reading pane. A person can undo Archive and Delete, and Reply to all leaves the reader out and names each person once. On a phone, it collapses to one pane with a back button.",
  components: [
    "BlessItem",
    "BlessIndicator",
    "BlessAvatar",
    "BlessToolbar",
    "BlessEmailView",
    "BlessEmailComposer",
    "BlessModal",
    "BlessButton",
    "BlessBadge",
    "BlessEmpty",
  ],
  height: "640px",
};
