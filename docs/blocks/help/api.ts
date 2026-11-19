import type { Article, BlessFaq } from "./domain";

export interface HelpApi {
  articles(): Promise<Article[]>;
  faq(): Promise<BlessFaq[]>;
}

/** offline adapter: the help center of a small game circle */
export const mockHelpApi: HelpApi = {
  async articles() {
    return [
      {
        id: "install",
        title: "Install the game",
        kind: "Guide",
        summary: "Download the installer, then run it. The game needs 4 GB of free space.",
        updated: "2026-11-02",
        sections: [
          {
            title: "Before you start",
            body: "Make sure that the computer has 4 GB of free space and Windows 10 or later.",
          },
          {
            title: "Install",
            body: "Open the link in your receipt and download the installer.\n\nRun it, and choose a folder. The install takes about two minutes.",
          },
        ],
        related: ["saves", "start"],
      },
      {
        id: "start",
        title: "The game does not start",
        kind: "Fix",
        summary:
          "A black screen or no window at start: update the graphics driver, then start the game again.",
        updated: "2026-11-15",
        sections: [
          {
            title: "Update the graphics driver",
            body: "Most black screens at start come from an old graphics driver. Get the newest driver from the maker of your graphics card.",
          },
          {
            title: "Start in a window",
            body: "Hold Shift while you start the game. It then opens in a window, not on the full screen.",
          },
        ],
        related: ["install"],
      },
      {
        id: "saves",
        title: "Move your saves to a new computer",
        kind: "Guide",
        summary: "Copy the saves folder from the old computer to the same place on the new one.",
        updated: "2026-10-20",
        sections: [
          {
            title: "Find the saves",
            body: "The saves are in Documents, in the folder Blessing Software, then Saves.",
          },
          {
            title: "Copy them",
            body: "Copy the whole folder to a USB stick, then to the same place on the new computer. Start the game once before you copy.",
          },
        ],
        related: ["install"],
      },
      {
        id: "refund",
        title: "Get a refund",
        kind: "Policy",
        summary: "You can get your money back within 14 days if you played less than 2 hours.",
        updated: "2026-09-01",
        sections: [
          {
            title: "Who can get a refund",
            body: "Anyone who bought the game in the last 14 days and played less than 2 hours.",
          },
          {
            title: "Ask for it",
            body: "Reply to your receipt email with the word Refund. The money comes back within 5 work days.",
          },
        ],
        related: [],
      },
      {
        id: "controller",
        title: "Play with a controller",
        kind: "Guide",
        summary:
          "Connect the controller before you start the game. A press of Start opens the menu.",
        updated: "2026-11-10",
        sections: [
          {
            title: "Connect",
            body: "Connect the controller by cable or Bluetooth, then start the game. The text speed and the menu work with the buttons.",
          },
        ],
        related: ["start"],
      },
    ];
  },
  async faq() {
    return [
      {
        question: "Is there a version for phones?",
        answer: "Not yet. The game runs on Windows and macOS.",
      },
      {
        question: "Can I play in Japanese?",
        answer: "Yes. Choose the language in Settings, then Text.",
      },
      {
        question: "How long is the game?",
        answer: "One route takes about 8 hours. All five routes take about 40.",
      },
      {
        question: "Where do I report a bug?",
        answer: "Write to the circle from the contact page, with a screenshot if you can.",
      },
    ];
  },
};
