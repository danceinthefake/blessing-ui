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
  useToast,
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
const table = ref<{ state: { selected: Set<unknown> } }>();
const { toast } = useToast();
// remove at once and offer the way back, rather than asking first
function removeSelected() {
  const gone = selected.value;
  const before = rows.value;
  rows.value = rows.value.filter((r) => !gone.includes(r));
  table.value?.state.selected.clear();
  selected.value = [];
  toast({
    title: `Removed ${gone.length} ${gone.length === 1 ? "member" : "members"}`,
    action: { label: "Undo", onClick: () => (rows.value = before) },
  });
}
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
      <BlessButton>Invite</BlessButton>
    </div>
    <BlessDataTable
      ref="table"
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
        <!-- pressing the active filter again clears a single group; cleared means All -->
        <BlessToggleGroup
          :model-value="status"
          label="Filter by status"
          @update:model-value="status = $event ?? 'all'"
        >
          <BlessToggle v-for="f in filters" :key="f.value" :value="f.value" size="sm">{{
            f.label
          }}</BlessToggle>
        </BlessToggleGroup>
        <!-- the count is a status, so selecting a row is heard -->
        <span role="status" class="members__count">{{
          selected.length ? `${selected.length} selected` : ""
        }}</span>
        <div v-if="selected.length" class="members__bulk">
          <BlessButton size="sm" variant="outline">Change role</BlessButton>
          <BlessButton size="sm" variant="outline" color="danger" @click="removeSelected"
            >Remove</BlessButton
          >
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
.members__count {
  font-size: var(--bless-text-sm);
}
.members__bulk {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
</style>
