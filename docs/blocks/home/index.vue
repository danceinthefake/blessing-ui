<template>
  <div class="home">
    <section class="home__scenes" aria-labelledby="home-scenes">
      <BlessText id="home-scenes" as="h2" size="sm" weight="bold">Scenes</BlessText>
      <BlessSceneButtons v-model="scene" :scenes />
    </section>
    <BlessFloorPlan v-model="room" :rooms :devices class="home__plan">
      <template #room="{ room: r, devices: list }">
        <BlessText as="h3" size="sm" weight="bold">{{ r.name }}</BlessText>
        <div class="home__tiles">
          <BlessDeviceTile
            v-for="d in list"
            :key="d.id"
            :model-value="!!d.on"
            :name="d.name"
            :icon="d.icon"
            :reading="
              (d as Device).battery !== undefined ? `Battery ${(d as Device).battery}%` : undefined
            "
            @update:model-value="set(d.id, $event)"
          />
        </div>
      </template>
    </BlessFloorPlan>
    <aside class="home__side">
      <BlessThermostat v-model="target" v-model:mode="mode" :current="26.5" />
      <section aria-labelledby="home-batteries">
        <BlessText id="home-batteries" as="h2" size="sm" weight="bold">Batteries</BlessText>
        <ul role="list" class="home__batteries">
          <li v-for="d in batteries" :key="d.id">
            <span class="home__device">{{ d.name }}</span>
            <BlessBatteryLevel :level="d.battery!" :label="d.name" />
          </li>
        </ul>
      </section>
    </aside>
  </div>
</template>

<script setup lang="ts">
import {
  BlessBatteryLevel,
  BlessDeviceTile,
  BlessFloorPlan,
  BlessSceneButtons,
  BlessText,
  BlessThermostat,
  type BlessThermostatMode,
} from "blessing-ui";
import { computed, onMounted, ref } from "vue";
import { mockHomeApi } from "./api";
import { apply, matching, type BlessRoom, type Device, type Scene } from "./domain";

const rooms = ref<BlessRoom[]>([]);
const devices = ref<Device[]>([]);
const scenes = ref<Scene[]>([]);
const room = ref("club");
onMounted(async () => {
  [rooms.value, devices.value, scenes.value] = await Promise.all([
    mockHomeApi.rooms(),
    mockHomeApi.devices(),
    mockHomeApi.scenes(),
  ]);
});
// the chosen scene follows the devices: a switch by hand can leave every scene
const scene = computed({
  get: () => matching(devices.value, scenes.value) ?? "",
  set: (id) => {
    const s = scenes.value.find((x) => x.id === id);
    if (!s) return;
    devices.value = apply(devices.value, s);
    for (const [d, on] of Object.entries(s.sets)) mockHomeApi.set(d, on);
  },
});
function set(id: string, on: boolean) {
  const d = devices.value.find((x) => x.id === id);
  if (d) d.on = on;
  mockHomeApi.set(id, on);
}
const target = ref(23);
const mode = ref<BlessThermostatMode>("cool");
const batteries = computed(() =>
  devices.value.filter((d) => d.battery !== undefined).sort((a, b) => a.battery! - b.battery!),
);
</script>

<style scoped>
.home {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
  gap: var(--bless-space-6);
  padding: var(--bless-space-6);
  align-items: start;
}
.home > * {
  min-width: 0;
}
.home__scenes {
  grid-column: 1 / -1;
}
.home h2,
.home h3 {
  margin: 0 0 var(--bless-space-2);
}
.home__tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--bless-space-2);
}
.home__side {
  display: grid;
  gap: var(--bless-space-6);
}
.home__batteries li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-3);
  font-size: var(--bless-text-sm);
}
.home__batteries {
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
@media (max-width: 760px) {
  .home {
    grid-template-columns: minmax(0, 1fr);
    padding: var(--bless-space-4);
  }
}
</style>
