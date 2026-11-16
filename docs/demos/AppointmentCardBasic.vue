<script setup lang="ts">
import { ref } from "vue";
import { BlessAppointmentCard } from "blessing-ui";

const said = ref("");
</script>

<template>
  <div style="display: grid; gap: 16px; max-width: 520px">
    <BlessAppointmentCard
      title="Hearing test"
      date="2026-11-20"
      time="09:30–10:00"
      :person="{ name: 'Dr. Sari Wibowo', role: 'Audiologist' }"
      place="Klinik Dengar, Jl. Cikini Raya 7, Jakarta"
      @reschedule="said = 'Reschedule the hearing test'"
      @cancel="said = 'Cancel the hearing test'"
    />
    <BlessAppointmentCard
      title="Voice care follow-up"
      date="2026-11-24"
      time="16:00–16:20"
      :person="{ name: 'Dr. Budi Hartono', role: 'ENT doctor' }"
      video
      status="pending"
      @join="said = 'Join the call'"
    />
    <BlessAppointmentCard
      title="Physiotherapy"
      date="2026-11-12"
      time="11:00–11:45"
      :person="{ name: 'Citra Dewi', role: 'Physiotherapist' }"
      place="Sehat Clinic, Kemang"
      status="cancelled"
    />
  </div>
  <p v-if="said" style="margin-top: 12px">{{ said }}</p>
</template>
