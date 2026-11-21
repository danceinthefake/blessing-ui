<template>
  <BlessRoomBooking v-model="picked" :rooms :bookings :from="8" :to="17" @book="book" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessRoomBooking, type BlessRoomSlot } from "blessing-ui";

const rooms = [
  { id: "kenanga", name: "Kenanga", seats: 4 },
  { id: "melati", name: "Melati", seats: 8 },
  { id: "anggrek", name: "Anggrek", seats: 16 },
];
const bookings = ref<BlessRoomSlot[]>([
  { room: "kenanga", start: "09:00", end: "10:00", title: "Design review" },
  { room: "melati", start: "10:30", end: "12:00", title: "Sales weekly" },
  { room: "anggrek", start: "13:00", end: "15:00", title: "All hands" },
  { room: "kenanga", start: "14:00", end: "14:30", title: "1:1" },
]);
const picked = ref<BlessRoomSlot | null>(null);
function book(slot: BlessRoomSlot) {
  bookings.value.push({ ...slot, title: "Your meeting" });
  picked.value = null;
}
</script>
