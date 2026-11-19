export default {
  title: "Health",
  group: "Everyday",
  order: 23,
  summary:
    "A health tracker for one day: vitals with their normal ranges, the medicines to take, last night's sleep, the habits of the week, and the next doctor visit. Reschedule opens free times in a sheet.",
  components: [
    "BlessVitalsPanel",
    "BlessMedicationSchedule",
    "BlessSleepChart",
    "BlessHabitTracker",
    "BlessAppointmentCard",
    "BlessSheet",
    "BlessSlotPicker",
    "BlessButton",
    "BlessText",
  ],
  height: "900px",
};
