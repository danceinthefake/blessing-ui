<script setup lang="ts">
import { ref } from "vue";
import { BlessLabel, BlessTimezonePicker } from "blessing-ui";

const zone = ref<string>();
// a fixed moment keeps the offsets the same on the server and in the browser
const at = new Date("2026-07-01T12:00:00Z");
const now = () =>
  zone.value
    ? new Intl.DateTimeFormat("en", {
        timeZone: zone.value,
        dateStyle: "medium",
        timeStyle: "short",
      }).format(at)
    : "—";
</script>

<template>
  <div class="col">
    <BlessLabel for="d-tz">Time zone</BlessLabel>
    <BlessTimezonePicker id="d-tz" v-model="zone" :at="at" detect />
    <small>{{ zone ?? "—" }} · at 12:00 UTC on 1 July 2026 it is {{ now() }}</small>
  </div>
</template>
