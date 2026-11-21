<template>
  <BlessTicketView
    v-model:status="status"
    subject="The microphone hums on the charger"
    number="#4012"
    :customer="{ name: 'Eka Lestari', email: 'eka@example.com' }"
    priority="high"
    :messages
    style="max-width: 640px"
    @reply="reply"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessTicketView, type BlessTicketMessage, type BlessTicketStatus } from "blessing-ui";

const status = ref<BlessTicketStatus>("open");
const messages = ref<BlessTicketMessage[]>([
  {
    id: "1",
    from: "Eka Lestari",
    role: "customer",
    time: "16 Nov, 08:41",
    body: "My new USB mic makes a low hum when my laptop is on its charger.\nIt stops on battery.",
  },
  {
    id: "2",
    from: "Ana Putri",
    role: "note",
    time: "16 Nov, 08:55",
    body: "Sounds like a ground loop. Ask if the charger has a third pin.",
  },
  {
    id: "3",
    from: "Ana Putri",
    role: "agent",
    time: "16 Nov, 09:02",
    body: "Hi Eka, thanks for the clear report! Does your charger plug have three pins?",
  },
]);
let n = 4;
function reply(body: string, internal: boolean) {
  messages.value.push({
    id: String(n++),
    from: "You",
    role: internal ? "note" : "agent",
    time: "now",
    body,
  });
  if (!internal) status.value = "pending";
}
</script>
