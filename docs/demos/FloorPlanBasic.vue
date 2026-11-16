<script setup lang="ts">
import { ref } from "vue";
import { BlessDeviceTile, BlessFloorPlan, type BlessRoom, type BlessRoomDevice } from "blessing-ui";

// a small home studio on a 12 × 8 grid
const rooms: BlessRoom[] = [
  { id: "studio", name: "Studio", x: 0, y: 0, w: 7, h: 5 },
  { id: "booth", name: "Vocal booth", x: 7, y: 0, w: 5, h: 3 },
  { id: "hall", name: "Hall", x: 7, y: 3, w: 5, h: 2 },
  { id: "kitchen", name: "Kitchen", x: 0, y: 5, w: 5, h: 3 },
  { id: "storage", name: "Storage", x: 5, y: 5, w: 7, h: 3 },
];
const devices = ref<BlessRoomDevice[]>([
  { id: "lamp", name: "Desk lamp", room: "studio", icon: "💡", on: true },
  { id: "ac", name: "Air conditioner", room: "studio", icon: "❄️", on: true },
  { id: "sign", name: "On air sign", room: "booth", icon: "🔴" },
  { id: "door", name: "Front door", room: "hall", icon: "🚪" },
  { id: "kettle", name: "Kettle", room: "kitchen", icon: "☕" },
  { id: "dry", name: "Dehumidifier", room: "storage", icon: "💧", on: true },
]);
const open = ref("studio");
const set = (id: string, on: boolean) => {
  const d = devices.value.find((x) => x.id === id);
  if (d) d.on = on;
};
</script>

<template>
  <BlessFloorPlan v-model="open" :rooms :devices style="max-width: 560px">
    <template #room="{ room, devices: list }">
      <h4 style="margin: 0 0 8px">{{ room.name }}</h4>
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 8px;
        "
      >
        <BlessDeviceTile
          v-for="d in list"
          :key="d.id"
          :model-value="!!d.on"
          :name="d.name"
          :icon="d.icon"
          @update:model-value="set(d.id, $event)"
        />
      </div>
    </template>
  </BlessFloorPlan>
</template>
