<template>
  <BlessThread :comments="comments">
    <template #footer="{ comment }">
      <BlessButton size="sm" variant="ghost" :aria-label="`Reply to ${comment.name}`"
        >Reply</BlessButton
      >
    </template>
  </BlessThread>
</template>

<script setup lang="ts">
import { BlessButton, BlessThread, type BlessThreadComment } from "blessing-ui";

const comments: BlessThreadComment[] = [
  {
    id: 1,
    name: "Megumi Kato",
    time: "3 h ago",
    body: "The route draft is ready. Can you check the second day?",
    replies: [
      {
        id: 2,
        name: "Tomoya Aki",
        time: "2 h ago",
        body: "The museum closes at five. We need to go there first.",
        replies: [
          {
            id: 3,
            name: "Megumi Kato",
            time: "1 h ago",
            body: "Done. I moved lunch to the afternoon.",
          },
        ],
      },
      { id: 4, name: "Eriri Spencer", time: "2 h ago", body: "I can draw the map." },
    ],
  },
  {
    id: 5,
    name: "Utaha Kasumigaoka",
    time: "Yesterday",
    body: "Notes on the ending are in the shared folder.",
    collapsed: true,
    replies: [{ id: 6, name: "Michiru Hyodo", time: "Yesterday", body: "Read them. Agreed." }],
  },
];
</script>
