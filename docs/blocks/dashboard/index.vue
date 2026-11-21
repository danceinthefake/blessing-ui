<template>
  <div class="dash">
    <aside class="dash__side">
      <BlessText weight="bold" class="dash__brand">Blessing</BlessText>
      <BlessSidebarNav :items="nav" active="#overview" @select="(_, e) => e.preventDefault()" />
    </aside>
    <div class="dash__main">
      <BlessToolbar label="Page actions" class="dash__bar">
        <template #start><BlessText weight="bold">Overview</BlessText></template>
        <template #end>
          <BlessToggleGroup
            :model-value="days"
            label="Period"
            @update:model-value="(v) => typeof v === 'number' && (days = v as Period)"
          >
            <BlessToggle :value="7" size="sm">7 days</BlessToggle>
            <BlessToggle :value="30" size="sm">30 days</BlessToggle>
          </BlessToggleGroup>
          <BlessButton size="sm" variant="outline">Export</BlessButton>
          <BlessAvatar name="Tomoya Aki" size="sm" />
        </template>
      </BlessToolbar>
      <div class="dash__stats" :aria-busy="loading">
        <template v-if="data && !loading">
          <StatCard v-for="s in data.stats" :key="s.label" :stat="s" />
        </template>
        <BlessSkeleton v-for="i in 4" v-else :key="i" height="88px" />
      </div>
      <BlessChart
        title="Daily revenue"
        :description="`Last ${days} days: a rise with a dip in the middle`"
        height="200px"
      >
        <BlessSkeleton v-if="loading || !data" height="200px" />
        <VisXYContainer v-else :data="data.trend" :margin="{ top: 8, right: 8 }">
          <VisArea :x="(d: Point) => d.d" :y="(d: Point) => d.v" :opacity="0.15" />
          <VisLine :x="(d: Point) => d.d" :y="(d: Point) => d.v" :lineWidth="1.5" />
          <VisAxis type="x" :numTicks="6" :gridLine="false" />
          <VisAxis type="y" :numTicks="3" />
        </VisXYContainer>
      </BlessChart>
      <BlessSkeleton v-if="loading || !data" :lines="5" class="dash__table" />
      <BlessTable
        v-else
        :columns
        :rows="data.orders"
        row-key="id"
        caption="Recent orders"
        class="dash__table"
      >
        <template #cell-status="{ value }">
          <BlessBadge :color="statusColor[value as Order['status']]">{{ value }}</BlessBadge>
        </template>
      </BlessTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BlessAvatar,
  BlessBadge,
  BlessButton,
  BlessChart,
  BlessSidebarNav,
  BlessTable,
  BlessSkeleton,
  BlessText,
  BlessToggle,
  BlessToggleGroup,
  BlessToolbar,
  type BlessColumn,
  type BlessNavItem,
} from "blessing-ui";
import { VisArea, VisAxis, VisLine, VisXYContainer } from "@unovis/vue";
import { ref, watch } from "vue";
import StatCard from "./parts/StatCard.vue";
import { mockDashboardApi } from "./api";
import { statusColor, type Order, type Overview, type Period, type Point } from "./domain";

const nav: BlessNavItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Orders", href: "#orders", badge: "12" },
  { label: "Customers", href: "#customers" },
  { label: "Products", href: "#products" },
  { label: "Settings", href: "#settings" },
];
const days = ref<Period>(30);
const data = ref<Overview>();
const loading = ref(true);
watch(
  days,
  async (d) => {
    loading.value = true;
    data.value = await mockDashboardApi.overview(d);
    loading.value = false;
  },
  { immediate: true },
);
const columns: BlessColumn<Order>[] = [
  { key: "id", label: "Order", header: true },
  { key: "customer", label: "Customer" },
  { key: "status", label: "Status" },
  { key: "total", label: "Total", align: "right" },
];
</script>

<style scoped>
.dash {
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: 100%;
}
.dash__side {
  padding: var(--bless-space-6) var(--bless-space-4);
  border-inline-end: var(--bless-border-width) solid var(--bless-color-border);
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
  /* on a phone the sidebar becomes a strip above the page, its nav scrolling sideways */
  .dash__side {
    display: flex;
    align-items: center;
    gap: var(--bless-space-4);
    padding: var(--bless-space-2) var(--bless-space-4);
    border-inline-end: 0;
    border-bottom: var(--bless-border-width) solid var(--bless-color-border);
    overflow-x: auto;
  }
  .dash__brand {
    margin: 0;
  }
  .dash__side :deep(.bless-sidebar-nav__list) {
    display: flex;
    gap: var(--bless-space-2);
  }
}
</style>
