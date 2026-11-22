export default {
  title: "Status page",
  group: "Work",
  order: 40,
  summary:
    "The state of each part of a service, its uptime for 30 days, and the incidents with each update. An open incident sets the state of the parts that it affects. People can get the changes by email.",
  components: [
    "BlessSystemStatus",
    "BlessUptimeBar",
    "BlessIncidentTimeline",
    "BlessAlert",
    "BlessModal",
    "BlessField",
    "BlessFieldset",
    "BlessInput",
    "BlessCheckbox",
    "BlessButton",
    "BlessText",
  ],
  height: "1100px",
};
