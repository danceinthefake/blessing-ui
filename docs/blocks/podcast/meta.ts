export default {
  title: "Podcast",
  group: "Everyday",
  order: 41,
  summary:
    "A show with its episodes, a player, chapters, and a transcript that follows the audio. Each episode starts where you stopped. Chapters and transcript lines seek the player, and the place is kept as you listen.",
  components: [
    "BlessAudioPlayer",
    "BlessTabs",
    "BlessChapterList",
    "BlessTranscript",
    "BlessEpisodeList",
    "BlessText",
  ],
  height: "760px",
};
