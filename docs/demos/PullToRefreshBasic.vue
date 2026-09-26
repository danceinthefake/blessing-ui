<script setup lang="ts">
import { ref } from "vue";
import {
  BlessButton,
  BlessListItem,
  BlessList,
  BlessMockup,
  BlessPullToRefresh,
  BlessText,
} from "blessing-ui";
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
    <div class="col" style="max-width: 260px">
      <!-- pulling is touch-only: the same reload, for everyone else -->
      <BlessButton size="sm" variant="outline" @click="refresh(() => {})">Refresh</BlessButton>
      <BlessText size="sm" muted
        >Or drag down from the top of the list; past 64px the arrow flips — release to
        refresh.</BlessText
      >
    </div>
  </div>
</template>
