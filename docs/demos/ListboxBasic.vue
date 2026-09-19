<script setup lang="ts">
import { ref } from "vue";
import { BlessListbox } from "blessing-ui";
const options = [
  { value: "megumi", label: "加藤恵" },
  { value: "eriri", label: "澤村・スペンサー・英梨々" },
  { value: "utaha", label: "霞ヶ丘詩羽" },
  { value: "michiru", label: "氷堂美智留", disabled: true },
  { value: "izumi", label: "波島出海" },
];
const one = ref("megumi");
const many = ref<string[]>(["eriri", "utaha"]);
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessListbox v-model="one" :options label="Heroine" />
      <small>{{ one }}</small>
    </div>
    <div class="col">
      <BlessListbox v-model="many" :options multiple :rows="3" label="Heroines" />
      <small>{{ many }} · 3 rows then scroll · type to jump</small>
    </div>
  </div>
</template>
