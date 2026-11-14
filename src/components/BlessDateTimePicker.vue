<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useFieldId } from "../composables/useFieldId";
import { useLabelPack } from "../composables/useLabels";
import BlessDatePicker from "./BlessDatePicker.vue";
import BlessTimePicker from "./BlessTimePicker.vue";

defineOptions({ name: "BlessDateTimePicker" });
const pack = useLabelPack("BlessDateTimePicker");

const props = withDefaults(
  defineProps<{
    id?: string;
    /** earliest moment, `YYYY-MM-DDTHH:MM` */
    min?: string;
    /** latest moment, `YYYY-MM-DDTHH:MM` */
    max?: string;
    /** minutes between the suggested times */
    step?: number;
    hour12?: boolean;
    locale?: string;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    size?: "sm" | "md" | "lg";
    labels?: Partial<{ time: string }>;
  }>(),
  { step: 15, size: "md" },
);
/** `YYYY-MM-DDTHH:MM` in local time, as `<input type="datetime-local">` holds it; unset until both parts are chosen */
const model = defineModel<string | undefined>();

// the group claims the field's id and gives it to the date part, so the field's label names it
const id = useFieldId(props);
const text = computed(() => ({ time: "Time", ...pack(), ...props.labels }));

const date = ref<string | undefined>(model.value?.slice(0, 10));
const time = ref(model.value?.slice(11, 16) ?? "");
watch(model, (v) => {
  date.value = v?.slice(0, 10);
  time.value = v?.slice(11, 16) ?? "";
});
watch([date, time], ([d, t]) => {
  const next = d && t ? `${d}T${t}` : undefined;
  if (next !== model.value) model.value = next;
});

// the time limits only hold on the first and the last allowed day
const minTime = computed(() =>
  props.min && date.value === props.min.slice(0, 10) ? props.min.slice(11, 16) : undefined,
);
const maxTime = computed(() =>
  props.max && date.value === props.max.slice(0, 10) ? props.max.slice(11, 16) : undefined,
);
</script>

<template>
  <div class="bless-datetime" role="group">
    <BlessDatePicker
      :id="id()"
      v-model="date"
      :min="min?.slice(0, 10)"
      :max="max?.slice(0, 10)"
      :locale
      :placeholder
      :disabled
      :invalid
      :size
    />
    <BlessTimePicker
      :id="`${id()}-time`"
      v-model="time"
      :min="minTime"
      :max="maxTime"
      :step
      :hour12
      :disabled
      :invalid
      :size
      :label="text.time"
    />
  </div>
</template>

<style>
/* fuse when grouped: one field in two parts, with no gap between them */
.bless-datetime {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0;
}
.bless-datetime > * + * {
  margin-inline-start: calc(-1 * var(--bless-border-width));
}
</style>
