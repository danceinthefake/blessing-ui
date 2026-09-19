<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

defineOptions({ name: "BlessDeferredContent" });
const props = withDefaults(defineProps<{ rootMargin?: string; minHeight?: string }>(), {
  rootMargin: "200px",
  minHeight: "1px",
});
const emit = defineEmits<{ load: [] }>();
const el = ref<HTMLElement>();
const loaded = ref(false);
let io: IntersectionObserver | undefined;
onMounted(() => {
  if (typeof IntersectionObserver === "undefined") return void (loaded.value = true);
  io = new IntersectionObserver(
    ([e]) => {
      if (e?.isIntersecting) {
        loaded.value = true;
        emit("load");
        io?.disconnect();
      }
    },
    { rootMargin: props.rootMargin },
  );
  io.observe(el.value!);
});
onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <div ref="el" class="bless-deferred" :style="{ minHeight: loaded ? undefined : minHeight }">
    <slot v-if="loaded" />
    <slot v-else name="placeholder" />
  </div>
</template>
