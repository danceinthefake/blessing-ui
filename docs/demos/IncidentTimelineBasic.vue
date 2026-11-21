<template>
  <BlessIncidentTimeline
    title="Audio uploads fail for some hosts"
    impact="major"
    :affected="['Uploads', 'Transcripts']"
    :updates
    style="max-width: 560px"
  />
</template>

<script setup lang="ts">
import { BlessIncidentTimeline, type BlessIncidentUpdate } from "blessing-ui";

const updates: BlessIncidentUpdate[] = [
  {
    status: "monitoring",
    time: "16 Nov, 09:40 WIB",
    text: "We moved the uploads to a new disk. Uploads work again, and we watch them for an hour.",
  },
  {
    status: "identified",
    time: "16 Nov, 09:10 WIB",
    text: "One storage server is full. New audio files cannot be saved.",
  },
  {
    status: "investigating",
    time: "16 Nov, 08:55 WIB",
    text: "Some hosts cannot upload audio. Played episodes are not affected.",
  },
];
</script>
