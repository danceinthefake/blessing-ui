<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessMockup, BlessSlideItem, BlessText, useToast } from "blessing-ui";
const { toast } = useToast();
const rows = ref(["加藤恵", "英梨々", "詩羽", "美智留"]);
function remove(name: string, reset: () => void) {
  rows.value = rows.value.filter((r) => r !== name);
  toast(`Removed ${name}`);
  reset();
}
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessMockup type="phone" style="width: 260px">
      <BlessSlideItem
        v-for="r in rows"
        :key="r"
        style="border-bottom: 1px solid var(--bless-color-border)"
        @right="(reset) => remove(r, reset)"
        @left="(reset) => (toast(`Pinned ${r}`), reset())"
      >
        <template #left><BlessButton style="height: 100%">Pin</BlessButton></template>
        <div style="padding: 14px 16px">{{ r }}</div>
        <template #right
          ><BlessButton color="danger" style="height: 100%">Delete</BlessButton></template
        >
      </BlessSlideItem>
    </BlessMockup>
    <BlessText size="sm" muted style="max-width: 260px"
      >Swipe a row left to delete, right to pin. Drag with the mouse on desktop. Actions fire on
      release past 80px; <code>sticky</code> keeps them open instead.</BlessText
    >
  </div>
</template>
