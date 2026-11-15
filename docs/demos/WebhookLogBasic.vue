<script setup lang="ts">
import { ref } from "vue";
import { BlessWebhookLog, type BlessWebhookDelivery } from "blessing-ui";

const body = (event: string) => ({ event, episode: { id: 41, title: "Home Studio, Real Sound" } });
const deliveries = ref<BlessWebhookDelivery[]>([
  {
    id: 1,
    event: "episode.published",
    status: 200,
    time: "15 Nov, 09:12:04",
    duration: 182,
    request: body("episode.published"),
    response: { received: true },
  },
  {
    id: 2,
    event: "episode.updated",
    status: 503,
    time: "15 Nov, 09:10:41",
    duration: 30_000,
    request: body("episode.updated"),
    response: "Service Unavailable",
  },
  {
    id: 3,
    event: "comment.created",
    status: 404,
    time: "15 Nov, 08:55:19",
    duration: 96,
    request: { event: "comment.created", id: 812 },
    response: "Not Found: /hooks/comments",
  },
  {
    id: 4,
    event: "episode.published",
    status: 201,
    time: "14 Nov, 21:03:50",
    duration: 240,
    request: body("episode.published"),
    response: { ok: 1 },
  },
]);
const retrying = ref<(string | number)[]>([]);

// a stand-in for your server: the second try of each delivery works
function retry(id: string | number) {
  retrying.value = [...retrying.value, id];
  setTimeout(() => {
    retrying.value = retrying.value.filter((r) => r !== id);
    deliveries.value = deliveries.value.map((d) =>
      d.id === id ? { ...d, status: 200, duration: 140, response: { received: true } } : d,
    );
  }, 900);
}
</script>

<template>
  <BlessWebhookLog :deliveries :retrying style="max-width: 680px" @retry="retry" />
</template>
