<script setup lang="ts">
import {
  BlessAvatar,
  BlessBadge,
  BlessButton,
  BlessChart,
  BlessSidebarNav,
  BlessTable,
  BlessText,
  BlessToolbar,
  type BlessColumn,
  type BlessNavItem,
} from "blessing-ui";
import { VisArea, VisAxis, VisLine, VisXYContainer } from "@unovis/vue";
import StatCard from "./parts/StatCard.vue";
import type { Stat } from "./domain";

const nav: BlessNavItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Orders", href: "#orders", badge: "12" },
  { label: "Customers", href: "#customers" },
  { label: "Products", href: "#products" },
  { label: "Settings", href: "#settings" },
];
const stats: Stat[] = [
  { label: "Revenue", value: 1_284_000, delta: 0.12, format: "currency" },
  { label: "Orders", value: 3_421, delta: 0.04 },
  { label: "Conversion", value: 0.037, delta: -0.006, format: "percent" },
  { label: "Active users", value: 18_902, delta: 0.21 },
];
type Pt = { d: number; v: number };
const trend: Pt[] = Array.from({ length: 30 }, (_, i) => ({
  d: i + 1,
  v: Math.round(60 + 25 * Math.sin(i / 4) + i * 1.5),
}));
type Order = {
  id: string;
  customer: string;
  status: "paid" | "pending" | "refunded";
  total: string;
};
const columns: BlessColumn<Order>[] = [
  { key: "id", label: "Order", header: true },
  { key: "customer", label: "Customer" },
  { key: "status", label: "Status" },
  { key: "total", label: "Total", align: "right" },
];
const orders: Order[] = [
  { id: "#4821", customer: "加藤 恵", status: "paid", total: "¥12,800" },
  { id: "#4820", customer: "澤村 英梨々", status: "pending", total: "¥3,300" },
  { id: "#4819", customer: "霞ヶ丘 詩羽", status: "paid", total: "¥38,500" },
  { id: "#4818", customer: "氷堂 美智留", status: "refunded", total: "¥1,980" },
];
const statusColor = { paid: "success", pending: "warning", refunded: "text" } as const;
</script>

<template>
  <div class="dash">
    <aside class="dash__side">
      <BlessText weight="bold" class="dash__brand">Blessing</BlessText>
      <BlessSidebarNav :items="nav" active="#overview" @select="(_, e) => e.preventDefault()" />
    </aside>
    <div class="dash__main">
      <BlessToolbar class="dash__bar">
        <template #start><BlessText weight="bold">Overview</BlessText></template>
        <template #end>
          <BlessButton size="sm" variant="outline">Export</BlessButton>
          <BlessAvatar name="Tomoya Aki" size="sm" />
        </template>
      </BlessToolbar>
      <div class="dash__stats">
        <StatCard v-for="s in stats" :key="s.label" :stat="s" />
      </div>
      <BlessChart title="Daily revenue" description="last 30 days" height="200px">
        <VisXYContainer :data="trend" :margin="{ top: 8, right: 8 }">
          <VisArea :x="(d: Pt) => d.d" :y="(d: Pt) => d.v" :opacity="0.15" />
          <VisLine :x="(d: Pt) => d.d" :y="(d: Pt) => d.v" :lineWidth="1.5" />
          <VisAxis type="x" :numTicks="6" :gridLine="false" />
          <VisAxis type="y" :numTicks="3" />
        </VisXYContainer>
      </BlessChart>
      <BlessTable :columns :rows="orders" row-key="id" caption="Recent orders" class="dash__table">
        <template #cell-status="{ value }">
          <BlessBadge :color="statusColor[value as Order['status']]">{{ value }}</BlessBadge>
        </template>
      </BlessTable>
    </div>
  </div>
</template>

<style scoped>
.dash {
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: 100%;
}
.dash__side {
  padding: var(--bless-space-6) var(--bless-space-4);
  border-right: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-surface);
}
.dash__brand {
  display: block;
  margin-bottom: var(--bless-space-6);
}
.dash__main {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  min-width: 0;
  padding: var(--bless-space-6);
}
.dash__bar {
  margin: calc(-1 * var(--bless-space-2)) 0;
}
.dash__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--bless-space-4);
}
@media (max-width: 800px) {
  .dash {
    grid-template-columns: 1fr;
  }
  .dash__side {
    display: none; /* on a phone, BlessLayout's left drawer takes over */
  }
}
</style>
