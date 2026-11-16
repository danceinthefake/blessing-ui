<script setup lang="ts">
import { ref } from "vue";
import { BlessWorkOrderCard, type BlessWorkOrderState } from "blessing-ui";

const state = ref<BlessWorkOrderState>("running");
const done = ref(128);
</script>

<template>
  <div
    style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px"
  >
    <BlessWorkOrderCard
      number="WO-2026-0091"
      product="Desk mic kit, black"
      :target="200"
      :done
      station="Assembly line 2"
      due="16 Nov, 15:00"
      :state
      @pause="state = 'paused'"
      @start="state = 'running'"
      @finish="((state = 'done'), (done = 200))"
    />
    <BlessWorkOrderCard
      number="WO-2026-0092"
      product="Pop filter"
      :target="500"
      station="Line 1"
      due="17 Nov"
      state="queued"
    />
    <BlessWorkOrderCard
      number="WO-2026-0088"
      product="USB-C cable kit"
      :target="300"
      :done="120"
      station="Packing"
      state="blocked"
    />
  </div>
</template>
