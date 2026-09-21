<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  BlessBadge,
  BlessBreadcrumb,
  BlessButton,
  BlessDataTable,
  BlessText,
  BlessToggle,
  BlessToggleGroup,
  type BlessDataColumn,
} from "blessing-ui";
import { statusColor, type Member, type Status } from "./domain";
import { mockMemberApi } from "./api";

const rows = ref<Member[]>([]);
const loading = ref(true);
onMounted(async () => {
  rows.value = await mockMemberApi.list();
  loading.value = false;
});
const status = ref<Status | "all">("all");
const filtered = computed(() =>
  rows.value.filter((r) => status.value === "all" || r.status === status.value),
);
const selected = ref<Member[]>([]);
const columns: BlessDataColumn<Member>[] = [
  { key: "name", label: "Name", sortable: true, header: true },
  { key: "email", label: "Email", hideable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "joined", label: "Joined", sortable: true, align: "right", hideable: true },
];
const filters: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "suspended", label: "Suspended" },
];
</script>

<template>
  <div class="members">
    <BlessBreadcrumb :items="[{ label: 'Workspace', href: '#' }, { label: 'Members' }]" />
    <div class="members__head">
      <div>
        <BlessText as="h1" size="lg" weight="light">Members</BlessText>
        <BlessText as="p" size="sm" muted>{{ rows.length }} people in this workspace</BlessText>
      </div>
      <BlessButton color="accent">Invite</BlessButton>
    </div>
    <BlessDataTable
      @update:selected="selected = $event"
      :columns
      :rows="filtered"
      row-key="id"
      :page-size="6"
      selectable
      searchable
      :search-keys="['name', 'email']"
      search-placeholder="Search name or email"
      :loading
      caption="Members"
    >
      <template #toolbar>
        <BlessToggleGroup v-model="status" label="Filter by status">
          <BlessToggle v-for="f in filters" :key="f.value" :value="f.value" size="sm">{{
            f.label
          }}</BlessToggle>
        </BlessToggleGroup>
        <div v-if="selected.length" class="members__bulk">
          <BlessText size="sm">{{ selected.length }} selected</BlessText>
          <BlessButton size="sm" variant="outline">Change role</BlessButton>
          <BlessButton size="sm" variant="outline" color="danger">Remove</BlessButton>
        </div>
      </template>
      <template #cell-status="{ value }">
        <BlessBadge :color="statusColor[value as Status]">{{ value }}</BlessBadge>
      </template>
    </BlessDataTable>
  </div>
</template>

<style scoped>
.members {
  padding: var(--bless-space-6);
}
.members__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--bless-space-4);
  margin: var(--bless-space-4) 0 var(--bless-space-6);
}
.members__bulk {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
</style>
