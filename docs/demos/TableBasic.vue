<script setup lang="ts">
import { BlessBadge, BlessTable, type BlessColumn } from "blessing-ui";
type Row = { station: string; day: string; time: string; note: string };
const columns: BlessColumn<Row>[] = [
  { key: "station", label: "放送局", header: true },
  { key: "day", label: "曜日" },
  { key: "time", label: "時間", align: "right" },
  { key: "note", label: "備考" },
];
const rows: Row[] = [
  { station: "TOKYO MX", day: "木", time: "24:00", note: "先行" },
  { station: "とちぎテレビ", day: "木", time: "24:00", note: "" },
  { station: "BS11", day: "金", time: "23:30", note: "全国" },
  { station: "AbemaTV", day: "木", time: "24:00", note: "配信" },
];
</script>

<template>
  <BlessTable :columns :rows row-key="station" caption="On Air" striped style="max-width: 640px">
    <template #cell-note="{ value }">
      <BlessBadge v-if="value" color="text" :scaled="false">{{ value }}</BlessBadge>
    </template>
  </BlessTable>
</template>
