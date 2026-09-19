<script setup lang="ts">
import { ref } from "vue";
import { BlessCombobox, BlessLabel, type BlessOption } from "blessing-ui";
const options = ref<BlessOption<string>[]>([
  { value: "megumi", label: "加藤恵" },
  { value: "eriri", label: "澤村・スペンサー・英梨々" },
  { value: "utaha", label: "霞ヶ丘詩羽" },
  { value: "michiru", label: "氷堂美智留" },
  { value: "izumi", label: "波島出海" },
  { value: "tomoya", label: "安芸倫也", disabled: true },
]);
const one = ref<string>();
const many = ref<string[]>(["megumi", "eriri"]);
function create(label: string) {
  const value = label.toLowerCase().replace(/\s+/g, "-");
  options.value.push({ value, label });
  many.value.push(value);
}
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessLabel for="d-one">Single</BlessLabel>
      <BlessCombobox id="d-one" v-model="one" :options placeholder="Search heroine…" />
      <small>value: {{ one }}</small>
    </div>
    <div class="col">
      <BlessLabel for="d-many">Multiple + creatable</BlessLabel>
      <BlessCombobox
        id="d-many"
        v-model="many"
        :options
        multiple
        creatable
        placeholder="Add…"
        @create="create"
      />
      <small>values: {{ many }}</small>
    </div>
    <div class="col">
      <BlessLabel>Disabled / invalid</BlessLabel>
      <BlessCombobox :options model-value="megumi" disabled />
      <BlessCombobox :options invalid placeholder="invalid" size="sm" />
    </div>
  </div>
</template>
