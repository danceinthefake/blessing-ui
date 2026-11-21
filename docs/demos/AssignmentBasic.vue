<template>
  <div style="display: grid; gap: 16px">
    <BlessAssignment
      v-model="files"
      title="Mic lab: record one verse three ways"
      due="Fri 21 Nov, 23:59"
      :points="100"
      instructions="Record the same verse with the mic at 5 cm, 15 cm, and 30 cm.
Hand in three WAV files and one line on what changed."
      accept=".wav,audio/wav"
      :submitted
      @submit="submitted = 'today'"
    />
    <BlessAssignment
      title="Quiz 1: polar patterns"
      due="Mon 10 Nov"
      :points="20"
      submitted="Mon 10 Nov, 14:02"
      grade="18 / 20"
      feedback="Good work. Look again at the figure-8 pattern: it picks up sound from the back as well."
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessAssignment } from "blessing-ui";

const files = ref<File[]>([]);
const submitted = ref<string>();
</script>
