<script setup lang="ts">
import { ref } from "vue";
import { BlessInfiniteScroll, BlessList, BlessListItem, BlessMockup } from "blessing-ui";
const items = ref(Array.from({ length: 12 }, (_, i) => i + 1));
const box = ref<HTMLElement>();
function load(done: (finished?: boolean) => void) {
  setTimeout(() => {
    const n = items.value.length;
    items.value.push(...Array.from({ length: 10 }, (_, i) => n + i + 1));
    done(items.value.length >= 52);
  }, 700);
}
</script>

<template>
  <BlessMockup type="phone" style="width: 260px">
    <div ref="box" style="height: 100%; overflow-y: auto">
      <BlessInfiniteScroll :root="box" done-text="that's all 52" @load="load">
        <BlessList>
          <BlessListItem v-for="i in items" :key="i">第{{ i }}話</BlessListItem>
        </BlessList>
      </BlessInfiniteScroll>
    </div>
  </BlessMockup>
</template>
