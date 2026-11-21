<template>
  <div class="bless-perms">
    <table class="bless-perms__table">
      <caption class="bless-sr">
        {{ label ?? text.title }}
      </caption>
      <thead>
        <tr>
          <th scope="col" class="bless-perms__name">{{ text.permission }}</th>
          <th
            v-for="r in roles"
            :key="r.key"
            scope="col"
            class="bless-perms__role"
            :class="{ 'is-locked': r.locked }"
          >
            <span>{{ r.label }}</span>
            <input
              type="checkbox"
              class="bless-perms__check"
              :checked="roleState(r) === true"
              :indeterminate="roleState(r) === 'mixed'"
              :disabled="r.locked"
              :aria-label="text.all(r.label)"
              @change="setRole(r, ($event.target as HTMLInputElement).checked)"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(p, i) in permissions" :key="p.key">
          <tr v-if="startsGroup(i)" class="bless-perms__group">
            <th scope="colgroup" :colspan="roles.length + 1">{{ p.group }}</th>
          </tr>
          <tr>
            <th scope="row" class="bless-perms__name">{{ p.label }}</th>
            <td
              v-for="r in roles"
              :key="r.key"
              class="bless-perms__cell"
              :class="{ 'is-locked': r.locked }"
            >
              <input
                type="checkbox"
                class="bless-perms__check"
                :checked="has(r, p.key)"
                :disabled="r.locked"
                :aria-label="
                  r.locked
                    ? `${text.cell(r.label, p.label)}, ${text.locked}`
                    : text.cell(r.label, p.label)
                "
                @change="toggle(r, p.key, $event)"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { isOn, setCell, type CheckMatrix } from "../composables/checkMatrix";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessPermissionMatrix" });
const pack = useLabelPack("BlessPermissionMatrix");

export interface BlessRole {
  key: string;
  label: string;
  /** has every permission and cannot change, for example the owner */
  locked?: boolean;
}
export interface BlessPermission {
  key: string;
  label: string;
  /** the name of its group; a new name starts a group */
  group?: string;
}

const props = defineProps<{
  roles: BlessRole[];
  permissions: BlessPermission[];
  /** names the table */
  label?: string;
  labels?: Partial<{
    title: string;
    permission: string;
    all: (role: string) => string;
    cell: (role: string, permission: string) => string;
    locked: string;
  }>;
}>();
/** the permissions of each role, by role key */
const grants = defineModel<CheckMatrix>({ default: () => ({}) });

const text = computed(() => ({
  title: "Permissions",
  permission: "Permission",
  all: (r: string) => `All permissions for ${r}`,
  cell: (r: string, p: string) => `${r} can ${p}`,
  locked: "cannot change",
  ...pack(),
  ...props.labels,
}));
const keys = computed(() => props.permissions.map((p) => p.key));
const has = (r: BlessRole, p: string) => !!r.locked || isOn(grants.value, r.key, p);
const roleState = (r: BlessRole) => {
  const n = keys.value.filter((p) => has(r, p)).length;
  return n === 0 ? false : n === keys.value.length ? true : "mixed";
};
const setRole = (r: BlessRole, on: boolean) =>
  (grants.value = keys.value.reduce((m, p) => setCell(m, r.key, p, on), grants.value));
const toggle = (r: BlessRole, p: string, e: Event) =>
  (grants.value = setCell(grants.value, r.key, p, (e.target as HTMLInputElement).checked));
const startsGroup = (i: number) =>
  !!props.permissions[i]!.group && props.permissions[i]!.group !== props.permissions[i - 1]?.group;
</script>

<style>
.bless-perms {
  max-inline-size: 100%;
  overflow-x: auto;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-perms__table {
  inline-size: 100%;
  border-collapse: collapse;
}
.bless-perms__table th,
.bless-perms__table td {
  padding: var(--bless-space-2) var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-perms__name {
  text-align: start;
  font-weight: normal;
}
thead .bless-perms__name {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-perms__role {
  min-inline-size: 5.5rem;
  text-align: center;
}
.bless-perms__role > span {
  display: block;
  margin-block-end: var(--bless-space-1);
  font-weight: var(--bless-font-weight-bold);
}
/* a locked role is a gray column, so its fixed state shows at a glance */
.bless-perms__table .is-locked {
  background: var(--bless-color-surface-2);
}
.bless-perms__cell {
  text-align: center;
}
.bless-perms__check {
  inline-size: 1.1rem;
  block-size: 1.1rem;
  accent-color: var(--bless-color-accent);
  cursor: pointer;
}
.bless-perms__check:disabled {
  cursor: not-allowed;
}
.bless-perms__check:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-perms__group th {
  padding-block-start: var(--bless-space-4);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-align: start;
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
</style>
