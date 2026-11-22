export default {
  title: "Profile",
  group: "People and messages",
  order: 32,
  summary:
    "A public profile: cover, avatar, bio, and counts with Follow, a year of activity as a heatmap, and tabs for works, recent activity, and badges. Follow updates the count at once and undoes it if the server says no.",
  components: [
    "BlessProfileCard",
    "BlessHeatmapCalendar",
    "BlessTabs",
    "BlessPortfolioGrid",
    "BlessActivityFeed",
    "BlessAchievements",
    "BlessText",
  ],
  height: "900px",
};
