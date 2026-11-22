export default {
  title: "Timesheet",
  group: "Work",
  order: 49,
  summary:
    "A week of time entries, the normal hours and overtime of each day, and the pay so far. Overtime follows the Indonesian rules: 1.5 times for the first hour on a work day, then 2 times, and more on a rest day. A sent week goes to approval and does not change.",
  components: [
    "BlessTimeTracker",
    "BlessBarChart",
    "BlessApprovalFlow",
    "BlessPayslip",
    "BlessButton",
    "BlessText",
  ],
  height: "1200px",
};
