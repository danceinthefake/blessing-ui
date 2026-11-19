export default {
  title: "Smart home",
  group: "App",
  order: 18,
  summary:
    "A smart home app: scenes that set many devices at once, a floor plan that opens a room and its devices, the thermostat, and the batteries that run low. A scene and a device switch stay in step.",
  components: [
    "BlessSceneButtons",
    "BlessFloorPlan",
    "BlessDeviceTile",
    "BlessThermostat",
    "BlessBatteryLevel",
    "BlessText",
  ],
  height: "820px",
};
