<script setup lang="ts">
import { BlessTimeline } from "blessing-ui";
const items = [
  {
    time: "2019.09.25",
    datetime: "2019-09-25",
    title: "Blu-ray Disc BOX",
    description: "全25話収録",
  },
  {
    time: "2019.10.26",
    datetime: "2019-10-26",
    title: "劇場版 Fine 公開",
    color: "success" as const,
  },
  { time: "2019.11.01", datetime: "2019-11-01", title: "舞台挨拶", description: "新宿ピカデリー" },
  { time: "2020.04.01", datetime: "2020-04-01", title: "配信開始" },
];
</script>

<template>
  <BlessTimeline :items style="max-width: 420px" />
</template>
