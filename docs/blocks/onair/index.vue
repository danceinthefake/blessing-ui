<script setup lang="ts">
import {
  BlessBadge,
  BlessSection,
  BlessSeparator,
  BlessTable,
  BlessText,
  type BlessColumn,
} from "blessing-ui";

type Station = { station: string; day: string; time: string; note?: string };
const columns: BlessColumn<Station>[] = [
  { key: "station", label: "放送局", header: true },
  { key: "day", label: "曜日" },
  { key: "time", label: "時間", align: "right" },
  { key: "note", label: "備考" },
];
const stations: Station[] = [
  { station: "TOKYO MX", day: "木曜", time: "24:00〜", note: "先行" },
  { station: "とちぎテレビ", day: "木曜", time: "24:00〜" },
  { station: "群馬テレビ", day: "木曜", time: "24:00〜" },
  { station: "BS11", day: "金曜", time: "23:30〜", note: "全国" },
  { station: "AT-X", day: "土曜", time: "20:30〜", note: "リピートあり" },
];
const streaming = ["ABEMA", "dアニメストア", "Netflix", "Amazon Prime Video", "U-NEXT"];
</script>

<template>
  <BlessSection title="On Air" watermark="On Air" class="onair">
    <BlessText as="p" size="sm" muted class="onair__lead">2026年10月より順次放送開始</BlessText>
    <BlessTable :columns :rows="stations" row-key="station" caption="放送情報" striped>
      <template #cell-note="{ value }">
        <BlessBadge v-if="value" color="text">{{ value }}</BlessBadge>
      </template>
    </BlessTable>
    <BlessSeparator label="配信" color="accent" class="onair__sep" />
    <ul class="onair__stream">
      <li v-for="s in streaming" :key="s">
        <BlessBadge color="accent">{{ s }}</BlessBadge>
      </li>
    </ul>
    <BlessText as="p" size="xs" muted>※放送日時は変更になる場合があります。</BlessText>
  </BlessSection>
</template>

<style scoped>
.onair {
  padding: var(--bless-space-8) var(--bless-space-6);
}
.onair__lead {
  margin-bottom: var(--bless-space-4);
}
.onair__sep {
  margin: var(--bless-space-6) 0 var(--bless-space-3);
}
.onair__stream {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  margin: 0 0 var(--bless-space-4);
  padding: 0;
  list-style: none;
}
</style>
