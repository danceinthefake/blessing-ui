<script setup lang="ts">
import { ref } from "vue";
import { BlessListItem, BlessList, BlessMockup, BlessPullToRefresh, BlessText } from "blessing-ui";
const items = ref(Array.from({ length: 6 }, (_, i) => `第${i + 1}話`));
let n = 6;
function refresh(done: () => void) {
  setTimeout(() => {
    items.value.unshift(`第${++n}話 (new)`);
    done();
  }, 900);
}
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessMockup type="phone" style="width: 260px">
      <BlessPullToRefresh style="height: 100%; overflow-y: auto" @refresh="refresh">
        <BlessList>
          <BlessListItem v-for="t in items" :key="t">{{ t }}</BlessListItem>
        </BlessList>
      </BlessPullToRefresh>
    </BlessMockup>
    <BlessText size="sm" muted style="max-width: 260px"
      >Touch or drag with the mouse from the top of the list. Past 64px the arrow flips; release to
      refresh.</BlessText
    >
  </div>
</template>
