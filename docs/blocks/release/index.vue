<script setup lang="ts">
import {
  BlessAspectRatio,
  BlessBadge,
  BlessButton,
  BlessCard,
  BlessDataView,
  BlessSection,
  BlessText,
} from "blessing-ui";

type Release = {
  id: string;
  kind: "Blu-ray" | "CD";
  title: string;
  date: string;
  price: string;
  color: string;
  soon?: boolean;
};
const releases: Release[] = [
  {
    id: "bd-box",
    kind: "Blu-ray",
    title: "Blu-ray Disc BOX",
    date: "2026.12.24",
    price: "¥38,500",
    color: "#3d3e3f",
    soon: true,
  },
  {
    id: "op",
    kind: "CD",
    title: "オープニングテーマ「Sky Clad」",
    date: "2026.10.29",
    price: "¥1,980",
    color: "#e85078",
  },
  {
    id: "ed",
    kind: "CD",
    title: "エンディングテーマ「Fine」",
    date: "2026.11.12",
    price: "¥1,980",
    color: "#b878b0",
  },
  {
    id: "ost",
    kind: "CD",
    title: "オリジナル・サウンドトラック",
    date: "2027.01.20",
    price: "¥3,300",
    color: "#4090d0",
    soon: true,
  },
];
</script>

<template>
  <BlessSection title="Release" watermark="BD & CD" class="release">
    <BlessDataView
      :items="releases"
      layout="grid"
      columns="150px"
      :switchable="false"
      :row-key="(r) => r.id"
      label="Releases"
    >
      <template #default="{ item: r }">
        <BlessCard :label="r.kind" :label-color="r.kind === 'Blu-ray' ? 'accent' : 'text'">
          <template #media>
            <BlessAspectRatio :ratio="r.kind === 'CD' ? 1 : 3 / 4">
              <div class="release__cover" :style="{ '--_c': r.color }" aria-hidden="true">
                {{ r.kind === "CD" ? "♪" : "BD" }}
              </div>
            </BlessAspectRatio>
          </template>
          <BlessText as="p" weight="bold" size="sm">{{ r.title }}</BlessText>
          <BlessText as="p" size="xs" muted>{{ r.date }} 発売</BlessText>
          <div class="release__row">
            <BlessText weight="bold">{{ r.price }}</BlessText>
            <BlessBadge v-if="r.soon" color="warning">予約受付中</BlessBadge>
          </div>
          <template #footer
            ><BlessButton
              size="sm"
              :color="r.soon ? 'accent' : 'text'"
              :variant="r.soon ? 'solid' : 'outline'"
              :aria-label="`${r.title} を${r.soon ? '予約' : '購入'}`"
              href="#"
              >{{ r.soon ? "予約" : "購入" }}</BlessButton
            ></template
          >
        </BlessCard>
      </template>
    </BlessDataView>
  </BlessSection>
</template>

<style scoped>
.release {
  padding: var(--bless-space-8) var(--bless-space-6);
}
/* card labels hang above the card edge — leave room under the heading */
.release :deep(.bless-dataview__items) {
  padding-top: var(--bless-space-3);
}
.release__cover {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, var(--_c), color-mix(in srgb, var(--_c) 55%, #000));
  color: #fff;
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-thin);
}
.release__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-2);
}
</style>
