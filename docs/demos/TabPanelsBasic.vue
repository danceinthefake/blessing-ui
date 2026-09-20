<script setup lang="ts">
import { ref } from "vue";
import { BlessMockup, BlessTabPanels, BlessTabs, BlessText } from "blessing-ui";
const tab = ref("news");
const tabs = [
  { value: "news", label: "News" },
  { value: "story", label: "Story" },
  { value: "cast", label: "Cast" },
];
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessMockup type="phone" style="width: 260px">
      <div style="padding: 8px">
        <BlessTabs v-model="tab" :tabs label="Sections" />
        <BlessTabPanels
          v-model="tab"
          :panels="tabs.map((t) => t.value)"
          loop
          style="padding: 12px 4px"
        >
          <template #default="{ panel, index }">
            <BlessText as="p" weight="bold">{{ tabs[index].label }}</BlessText>
            <BlessText as="p" size="sm" muted>panel “{{ panel }}” — swipe left / right</BlessText>
          </template>
        </BlessTabPanels>
      </div>
    </BlessMockup>
    <BlessText size="sm" muted style="max-width: 260px"
      >Tabs drive the model; the panels also swipe, and loop from the last back to the
      first.</BlessText
    >
  </div>
</template>
