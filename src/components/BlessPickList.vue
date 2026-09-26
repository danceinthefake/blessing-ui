<script setup lang="ts" generic="T extends string | number">
import { nextTick, ref, type Ref } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessListbox from "./BlessListbox.vue";
import type { BlessOption } from "./select";

defineOptions({ name: "BlessPickList" });

const props = withDefaults(
  defineProps<{ sourceLabel?: string; targetLabel?: string; rows?: number }>(),
  {
    sourceLabel: "Available",
    targetLabel: "Selected",
    rows: 6,
  },
);
const source = defineModel<BlessOption<T>[]>("source", { default: () => [] });
const target = defineModel<BlessOption<T>[]>("target", { default: () => [] });
const pickS = ref([]) as Ref<T[]>;
const pickT = ref([]) as Ref<T[]>;
const root = ref<HTMLElement>();
const live = ref("");

function transfer(from: "source" | "target", values: T[]) {
  const [a, b] = from === "source" ? [source, target] : [target, source];
  const moving = a.value.filter((o) => values.includes(o.value));
  a.value = a.value.filter((o) => !values.includes(o.value));
  b.value = [...b.value, ...moving];
  pickS.value = [];
  pickT.value = [];
  // the clicked button is now disabled and would drop focus: follow the items to their list
  const to = from === "source" ? props.targetLabel : props.sourceLabel;
  live.value = `Moved ${moving.length} to ${to}`;
  nextTick(() =>
    root.value?.querySelectorAll<HTMLElement>("[role=listbox]")[from === "source" ? 1 : 0]?.focus(),
  );
}
</script>

<template>
  <div ref="root" class="bless-picklist">
    <div class="bless-picklist__col">
      <span class="bless-picklist__title">{{ sourceLabel }} · {{ source.length }}</span>
      <BlessListbox v-model="pickS" :options="source" multiple :rows :label="sourceLabel" />
    </div>
    <div class="bless-picklist__btns">
      <BlessButton
        size="sm"
        variant="outline"
        :disabled="!pickS.length"
        :aria-label="`Move selected to ${targetLabel}`"
        @click="transfer('source', pickS)"
        ><span class="bless-picklist__arrow" aria-hidden="true">›</span></BlessButton
      >
      <BlessButton
        size="sm"
        variant="outline"
        :disabled="!source.length"
        :aria-label="`Move all to ${targetLabel}`"
        @click="
          transfer(
            'source',
            source.map((o) => o.value),
          )
        "
        ><span class="bless-picklist__arrow" aria-hidden="true">»</span></BlessButton
      >
      <BlessButton
        size="sm"
        variant="outline"
        :disabled="!pickT.length"
        :aria-label="`Move selected to ${sourceLabel}`"
        @click="transfer('target', pickT)"
        ><span class="bless-picklist__arrow" aria-hidden="true">‹</span></BlessButton
      >
      <BlessButton
        size="sm"
        variant="outline"
        :disabled="!target.length"
        :aria-label="`Move all to ${sourceLabel}`"
        @click="
          transfer(
            'target',
            target.map((o) => o.value),
          )
        "
        ><span class="bless-picklist__arrow" aria-hidden="true">«</span></BlessButton
      >
    </div>
    <div class="bless-picklist__col">
      <span class="bless-picklist__title">{{ targetLabel }} · {{ target.length }}</span>
      <BlessListbox v-model="pickT" :options="target" multiple :rows :label="targetLabel" />
    </div>
    <span class="bless-picklist__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-picklist__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.bless-picklist {
  display: flex;
  gap: var(--bless-space-3);
  align-items: stretch;
  font-family: var(--bless-font-sans);
}
.bless-picklist__col {
  border-radius: var(--bless-radius);
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
/* the arrows point at the list they move to: mirrored in RTL, down/up when the lists stack */
.bless-picklist__arrow {
  display: inline-block;
}
[dir="rtl"] .bless-picklist__arrow {
  transform: scaleX(-1);
}
@media (max-width: 800px) {
  .bless-picklist {
    flex-direction: column;
  }
  .bless-picklist__arrow,
  [dir="rtl"] .bless-picklist__arrow {
    transform: rotate(90deg);
  }
  .bless-picklist__btns {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
