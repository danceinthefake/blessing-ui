<script setup lang="ts">
import { BlessDataView, BlessText } from "blessing-ui";
import { shots } from "./_data";
const eps = shots.map((s, i) => ({
  id: i,
  title: `第${i + 1}話`,
  src: s.src,
  air: `2019.04.${String(i + 4).padStart(2, "0")}`,
}));
</script>

<template>
  <BlessDataView :items="eps" :page-size="4" :row-key="(e) => e.id" columns="140px">
    <template #header="{ layout }"
      ><BlessText size="xs" muted>{{ eps.length }} episodes · {{ layout }}</BlessText></template
    >
    <template #default="{ item, layout }">
      <div
        :style="layout === 'list' ? 'display:flex;gap:12px;align-items:center;padding:8px 0' : ''"
      >
        <img :src="item.src" alt="" :style="layout === 'list' ? 'width:72px' : 'width:100%'" />
        <div>
          <BlessText as="p" weight="bold" size="sm">{{ item.title }}</BlessText
          ><BlessText as="p" size="xs" muted>{{ item.air }}</BlessText>
        </div>
      </div>
    </template>
  </BlessDataView>
</template>
