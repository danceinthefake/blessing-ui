<script setup lang="ts">
import { nextTick, ref } from "vue";
import { BlessAlert, BlessButton } from "blessing-ui";
const open = ref(true);
const failed = ref(false);
const again = ref<InstanceType<typeof BlessButton>>();
// the alert is gone, and focus with it: hand it to what comes next
async function dismissed() {
  await nextTick();
  again.value?.$el.focus();
}
</script>

<template>
  <div class="col" style="max-width: 560px">
    <BlessAlert v-model="open" title="Blu-ray BOX" dismissible @dismiss="dismissed">
      2019.09.25 発売。<template #icon>★</template>
    </BlessAlert>
    <BlessAlert title="Heads up" color="warning">Tickets sell out fast.</BlessAlert>
    <BlessAlert v-if="failed" color="danger" live="alert">Payment failed. Try again.</BlessAlert>
    <BlessAlert color="success">Saved.</BlessAlert>
    <BlessAlert color="info" title="New episode" dismissible>
      Episode 0 streams from Friday.
    </BlessAlert>
    <div class="row">
      <BlessButton v-if="!open" ref="again" size="sm" @click="open = true">show again</BlessButton>
      <BlessButton size="sm" variant="outline" color="danger" @click="failed = !failed">{{
        failed ? "clear" : "fail a payment"
      }}</BlessButton>
    </div>
  </div>
</template>
