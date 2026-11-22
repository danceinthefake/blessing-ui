export default {
  title: "File manager",
  group: "Work",
  order: 33,
  summary:
    "Folders and files in a grid or a list, with the folder path, a search in the folder, and the storage used. Upload adds files to the open folder. Pick a file to see its details, then rename it or delete it.",
  components: [
    "BlessFileBrowser",
    "BlessUploader",
    "BlessQuotaUsage",
    "BlessDescriptions",
    "BlessModal",
    "BlessAlertDialog",
    "BlessForm",
    "BlessField",
    "BlessInput",
    "BlessButton",
    "BlessText",
  ],
  height: "720px",
};
