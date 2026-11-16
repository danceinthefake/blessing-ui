<script setup lang="ts">
import { ref } from "vue";
import { BlessDeviceTile } from "blessing-ui";

const lamp = ref(true);
const sign = ref(false);
const ac = ref(true);
</script>

<template>
  <div
    style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px"
  >
    <BlessDeviceTile
      v-model="lamp"
      name="Desk lamp"
      room="Studio"
      icon="💡"
      reading="Brightness 80%"
    />
    <BlessDeviceTile v-model="sign" name="On air sign" room="Studio" icon="🔴" />
    <BlessDeviceTile v-model="ac" name="Air conditioner" room="Studio" icon="❄️" reading="22 °C" />
    <BlessDeviceTile name="Door" room="Hall" icon="🚪" reading="Closed" sensor />
    <BlessDeviceTile name="Dehumidifier" room="Storage" icon="💧" offline />
  </div>
</template>
