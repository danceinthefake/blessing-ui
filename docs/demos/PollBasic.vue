<script setup lang="ts">
import { ref } from "vue";
import { BlessPoll } from "blessing-ui";

const voted = ref<string>();
const options = ref([
  { value: "tabs", label: "Tabs", votes: 18 },
  { value: "spaces", label: "Spaces", votes: 14 },
  { value: "either", label: "Either, if the formatter runs", votes: 9 },
]);
// the server counts the vote. Here we add it to the list by hand.
function onVote(v: string) {
  const o = options.value.find((x) => x.value === v);
  if (o) o.votes++;
}
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessPoll v-model="voted" question="Tabs or spaces?" :options="options" @vote="onVote" />
    <BlessPoll question="Closed poll" closed :options="options" />
  </div>
</template>
