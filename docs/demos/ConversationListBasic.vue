<script setup lang="ts">
import { ref } from "vue";
import { BlessConversationList, type BlessConversation } from "blessing-ui";

const conversations: BlessConversation[] = [
  {
    id: "ana",
    name: "Ana Putri",
    last: "The edit is ready, can you listen?",
    time: "09:12",
    unread: 2,
    online: true,
  },
  {
    id: "guests",
    name: "Guest bookings",
    last: "Citra: Friday at 3 works for me",
    time: "08:40",
    typing: true,
  },
  { id: "budi", name: "Budi Santoso", last: "Thanks for the cables!", time: "Mon" },
  { id: "sponsor", name: "Radio Kita", last: "The invoice is attached.", time: "Sun", unread: 1 },
  { id: "team", name: "Studio team", last: "Dimas: new mic arrives tomorrow", time: "12 Nov" },
];
const open = ref("budi");
</script>

<template>
  <BlessConversationList v-model="open" :conversations style="max-width: 360px" />
</template>
