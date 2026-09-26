<script setup lang="ts">
import { ref } from "vue";
import { BlessCalendar, BlessText } from "blessing-ui";
const day = ref<string | undefined>("2019-09-25");
const stay = ref<[string, string]>(["2019-09-10", "2019-09-16"]);
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div>
      <BlessText as="p" size="xs" muted>single · min 2019-09-10</BlessText>
      <BlessCalendar v-model="day" min="2019-09-10" />
      <small>{{ day }}</small>
    </div>
    <div>
      <BlessText as="p" size="xs" muted>range · en-US · Sunday start</BlessText>
      <BlessCalendar v-model="stay" range locale="en-US" :week-start="0" month="2019-09" />
      <small>{{ stay }}</small>
    </div>
    <div>
      <BlessText as="p" size="xs" muted>weekends disabled</BlessText>
      <BlessCalendar
        :disabled-dates="(iso) => [0, 6].includes(new Date(iso).getDay())"
        locale="en-US"
        month="2019-09"
      />
    </div>
  </div>
</template>
