<script setup lang="ts">
import { BlessButton, BlessEmailView } from "blessing-ui";

const body = `Hi Budi,

The edit of episode 41 is ready. I cut the long intro and leveled the two voices. The file is at -16 LUFS.

Can you listen before Thursday? If the sponsor read sounds fine to you, I will send it to Radio Kita.

Thanks,
Ana`;
</script>

<template>
  <BlessEmailView
    subject="Episode 41: the final edit"
    :from="{ name: 'Ana Putri', email: 'ana@homestudio.example' }"
    :to="[{ name: 'Budi Santoso', email: 'budi@homestudio.example' }]"
    :cc="[{ name: 'Citra Dewi', email: 'citra@homestudio.example' }]"
    date="16 Nov 2026, 09:12"
    :body
    :attachments="[
      { name: 'episode-41-final.mp3', description: '48.2 MB · MP3' },
      { name: 'show-notes.pdf', description: '120 KB · PDF' },
    ]"
    style="max-width: 640px"
  >
    <template #actions>
      <BlessButton size="sm">Reply</BlessButton>
      <BlessButton size="sm" variant="outline">Forward</BlessButton>
    </template>
  </BlessEmailView>
</template>
