<script setup lang="ts" generic="T extends string | number">
import { ref, type Ref } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessListbox from "./BlessListbox.vue";
import type { BlessOption } from "./select";

defineOptions({ name: "BlessPickList" });

withDefaults(defineProps<{ sourceLabel?: string; targetLabel?: string; rows?: number }>(), {
  sourceLabel: "Available",
  targetLabel: "Selected",
  rows: 6,
});
const source = defineModel<BlessOption<T>[]>("source", { default: () => [] });
const target = defineModel<BlessOption<T>[]>("target", { default: () => [] });
const pickS = ref([]) as Ref<T[]>;
const pickT = ref([]) as Ref<T[]>;

function transfer(from: "source" | "target", values: T[]) {
  const [a, b] = from === "source" ? [source, target] : [target, source];
  const moving = a.value.filter((o) => values.includes(o.value));
  a.value = a.value.filter((o) => !values.includes(o.value));
  b.value = [...b.value, ...moving];
  pickS.value = [];
  pickT.value = [];
}
</script>

<template>
  <div class="bless-picklist">
    <div class="bless-picklist__col">
      <span class="bless-picklist__title">{{ sourceLabel }} · {{ source.length }}</span>
      <BlessListbox v-model="pickS" :options="source" multiple :rows :label="sourceLabel" />
    </div>
    <div class="bless-picklist__btns">
      <BlessButton
        size="sm"
        variant="outline"
        :disabled="!pickS.length"
        aria-label="Move selected right"
        @click="transfer('source', pickS)"
        >›</BlessButton
      >
      <BlessButton
        size="sm"
        variant="outline"
        :disabled="!source.length"
        aria-label="Move all right"
        @click="
          transfer(
            'source',
            source.map((o) => o.value),
          )
        "
        >»</BlessButton
      >
      <BlessButton
        size="sm"
        variant="outline"
        :disabled="!pickT.length"
        aria-label="Move selected left"
        @click="transfer('target', pickT)"
        >‹</BlessButton
      >
      <BlessButton
        size="sm"
        variant="outline"
        :disabled="!target.length"
        aria-label="Move all left"
        @click="
          transfer(
            'target',
            target.map((o) => o.value),
          )
        "
        >«</BlessButton
      >
    </div>
    <div class="bless-picklist__col">
      <span class="bless-picklist__title">{{ targetLabel }} · {{ target.length }}</span>
      <BlessListbox v-model="pickT" :options="target" multiple :rows :label="targetLabel" />
    </div>
  </div>
</template>

<style>
.bless-picklist {
  display: flex;
  gap: var(--bless-space-3);
  align-items: stretch;
  font-family: var(--bless-font-sans);
}
.bless-picklist__col {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-1);
  flex: 1;
  min-width: 0;
}
.bless-picklist__col .bless-listbox {
  flex: 1;
}
.bless-picklist__title {
  font-size: var(--bless-text-2xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-picklist__btns {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--bless-space-1);
}
@media (max-width: 800px) {
  .bless-picklist {
    flex-direction: column;
  }
  .bless-picklist__btns {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
