<script setup lang="ts">
import { computed, onMounted } from "vue";
import BlessCombobox from "./BlessCombobox.vue";
import { allZones, localZone, zoneOptions } from "./timezone";

defineOptions({ name: "BlessTimezonePicker", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** zones to offer. The default is every IANA zone of the runtime. */
    zones?: string[];
    /** the moment that sets the offsets, so summer time shows right. Default: now. */
    at?: Date;
    /** choose the zone of this device after mount when the value is empty */
    detect?: boolean;
    placeholder?: string;
  }>(),
  { placeholder: "Search a city or an offset" },
);
/** the IANA name, for example `Asia/Jakarta` */
const model = defineModel<string | undefined>();

const options = computed(() => zoneOptions(props.zones ?? allZones(), props.at ?? new Date()));
// the device zone is only known in the browser, so it is set after mount, never on the server
onMounted(() => {
  if (props.detect && !model.value) {
    const z = localZone();
    if (options.value.some((o) => o.value === z)) model.value = z;
  }
});
</script>

<template>
  <BlessCombobox v-bind="$attrs" v-model="model" :options="options" :placeholder="placeholder" />
</template>
