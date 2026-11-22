export default {
  title: "Support desk",
  group: "Work",
  order: 46,
  summary:
    "A queue of tickets by the nearest deadline, and a ticket with its replies and notes. The time limits for the first reply and for the fix count only open hours, so a ticket from the weekend starts on Monday morning.",
  components: [
    "BlessTabs",
    "BlessBadge",
    "BlessSlaTimer",
    "BlessField",
    "BlessSelect",
    "BlessTicketView",
    "BlessEmpty",
    "BlessButton",
    "BlessText",
  ],
  height: "900px",
};
