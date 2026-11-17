<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";

defineOptions({ name: "BlessShareAccess" });
const pack = useLabelPack("BlessShareAccess");

export type BlessAccessRole = "view" | "comment" | "edit";
export interface BlessSharePerson {
  id: string;
  name: string;
  email?: string;
  /** "owner" cannot change and cannot be removed */
  role: BlessAccessRole | "owner";
}

const props = defineProps<{
  /** the link to the file, for the copy button */
  link?: string;
  labels?: Partial<
    Record<BlessAccessRole | "owner", string> & {
      email: string;
      newRole: string;
      invite: string;
      people: string;
      remove: string;
      roleFor: (name: string) => string;
      removeFor: (name: string) => string;
      general: string;
      restricted: string;
      anyone: string;
      restrictedHint: string;
      anyoneHint: (role: string) => string;
      copy: string;
      copied: string;
    }
  >;
}>();
const people = defineModel<BlessSharePerson[]>("people", { default: () => [] });
/** who can open the link: only the people on the list, or anyone with the link at this role */
const linkAccess = defineModel<"restricted" | BlessAccessRole>("linkAccess", {
  default: "restricted",
});
const emit = defineEmits<{ invite: [email: string, role: BlessAccessRole] }>();

const text = computed(() => ({
  view: "Can view",
  comment: "Can comment",
  edit: "Can edit",
  owner: "Owner",
  email: "Add people by email",
  newRole: "Access for the new people",
  invite: "Invite",
  people: "People with access",
  remove: "Remove",
  roleFor: (n: string) => `Access for ${n}`,
  removeFor: (n: string) => `Remove ${n}`,
  general: "General access",
  restricted: "Only people on the list",
  anyone: "Anyone with the link",
  restrictedHint: "Only the people above can open it.",
  anyoneHint: (r: string) => `Anyone with the link: ${r.toLowerCase()}.`,
  copy: "Copy link",
  copied: "Link copied",
  ...pack(),
  ...props.labels,
}));
const ROLES: BlessAccessRole[] = ["view", "comment", "edit"];
const email = ref("");
const role = ref<BlessAccessRole>("view");
const said = ref("");
function invite(e: Event) {
  const f = e.target as HTMLFormElement;
  if (!f.reportValidity()) return;
  emit("invite", email.value.trim(), role.value);
  email.value = "";
}
const setRole = (id: string, r: BlessAccessRole) =>
  (people.value = people.value.map((p) => (p.id === id ? { ...p, role: r } : p)));
const remove = (id: string) => (people.value = people.value.filter((p) => p.id !== id));
const general = computed(() => (linkAccess.value === "restricted" ? "restricted" : "anyone"));
function setGeneral(v: string) {
  linkAccess.value = v === "restricted" ? "restricted" : "view";
}
async function copy() {
  if (!props.link) return;
  await navigator.clipboard?.writeText(props.link).catch(() => {});
  said.value = text.value.copied;
}
</script>

<template>
  <div class="bless-access">
    <form class="bless-access__invite" @submit.prevent="invite">
      <input
        v-model="email"
        type="email"
        required
        :aria-label="text.email"
        :placeholder="text.email"
        autocomplete="email"
      />
      <select v-model="role" :aria-label="text.newRole">
        <option v-for="r in ROLES" :key="r" :value="r">{{ text[r] }}</option>
      </select>
      <button type="submit" class="is-main">{{ text.invite }}</button>
    </form>
    <section class="bless-access__part" :aria-label="text.people">
      <div class="bless-access__title" aria-hidden="true">{{ text.people }}</div>
      <ul class="bless-stagger bless-access__list" role="list">
        <li v-for="p in people" :key="p.id">
          <div class="bless-access__person">
            <BlessAvatar :name="p.name" size="sm" />
            <span class="bless-access__who">
              <strong>{{ p.name }}</strong>
              <span v-if="p.email" class="bless-access__email">{{ p.email }}</span>
            </span>
            <span v-if="p.role === 'owner'" class="bless-access__owner">{{ text.owner }}</span>
            <template v-else>
              <select
                :value="p.role"
                :aria-label="text.roleFor(p.name)"
                @change="
                  setRole(p.id, ($event.target as HTMLSelectElement).value as BlessAccessRole)
                "
              >
                <option v-for="r in ROLES" :key="r" :value="r">{{ text[r] }}</option>
              </select>
              <button type="button" :aria-label="text.removeFor(p.name)" @click="remove(p.id)">
                ✕
              </button>
            </template>
          </div>
        </li>
      </ul>
    </section>
    <section class="bless-access__part" :aria-label="text.general">
      <div class="bless-access__title" aria-hidden="true">{{ text.general }}</div>
      <div class="bless-access__general">
        <select
          :value="general"
          :aria-label="text.general"
          @change="setGeneral(($event.target as HTMLSelectElement).value)"
        >
          <option value="restricted">{{ text.restricted }}</option>
          <option value="anyone">{{ text.anyone }}</option>
        </select>
        <select v-if="linkAccess !== 'restricted'" v-model="linkAccess" :aria-label="text.anyone">
          <option v-for="r in ROLES" :key="r" :value="r">{{ text[r] }}</option>
        </select>
      </div>
      <div class="bless-access__hint">
        {{ linkAccess === "restricted" ? text.restrictedHint : text.anyoneHint(text[linkAccess]) }}
      </div>
    </section>
    <div v-if="link" class="bless-access__foot">
      <button type="button" @click="copy">{{ text.copy }}</button>
      <span role="status" class="bless-access__said">{{ said }}</span>
    </div>
  </div>
</template>

<style>
.bless-access {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 32rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-access__invite {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-access__invite input {
  flex: 1 1 12rem;
  min-inline-size: 0;
}
.bless-access input,
.bless-access select,
.bless-access button {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-access button {
  padding: 0 var(--bless-space-3);
  cursor: pointer;
}
.bless-access button.is-main {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-access :is(input, select, button):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-access__part {
  display: grid;
  gap: var(--bless-space-2);
}
.bless-access__title {
  font-weight: var(--bless-font-weight-bold);
}
.bless-access__list {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-access__person {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-access__who {
  display: grid;
  flex: 1;
  min-inline-size: 0;
}
.bless-access__email {
  overflow: hidden;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-access__owner {
  padding-inline: var(--bless-space-2);
  color: var(--bless-color-text-muted);
}
.bless-access__general {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-access__hint {
  font-size: var(--bless-text-xs);
}
.bless-access__foot {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
}
.bless-access__said:empty {
  display: none;
}
</style>
