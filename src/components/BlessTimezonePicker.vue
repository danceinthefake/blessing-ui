<template>
  <BlessCombobox v-bind="$attrs" v-model="model" :options="options" :placeholder="placeholder" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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

// Each runtime has its own zone list (Firefox adds Etc/GMT+12 and more than Node has), so the
// full list is read after mount. Before that, the server and the browser both offer only the
// chosen zone, and hydration agrees.
const mounted = ref(false);
const options = computed(() =>
  zoneOptions(
    props.zones ?? (mounted.value ? allZones() : model.value ? [model.value] : []),
    props.at ?? new Date(),
  ),
);
// the device zone is only known in the browser, so it is set after mount, never on the server
onMounted(() => {
  mounted.value = true;
  if (props.detect && !model.value) {
    const z = localZone();
    if (options.value.some((o) => o.value === z)) model.value = z;
  }
});
</script>
