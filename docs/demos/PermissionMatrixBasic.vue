<template>
  <BlessPermissionMatrix v-model="grants" :roles :permissions style="max-width: 640px" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessPermissionMatrix } from "blessing-ui";

const roles = [
  { key: "owner", label: "Owner", locked: true },
  { key: "producer", label: "Producer" },
  { key: "editor", label: "Editor" },
  { key: "guest", label: "Guest" },
];
const permissions = [
  { key: "upload", label: "upload audio", group: "Episodes" },
  { key: "edit", label: "edit show notes", group: "Episodes" },
  { key: "publish", label: "publish episodes", group: "Episodes" },
  { key: "stats", label: "see statistics", group: "Show" },
  { key: "invite", label: "invite people", group: "Show" },
  { key: "billing", label: "change billing", group: "Account" },
];
const grants = ref<Record<string, string[]>>({
  producer: ["upload", "edit", "publish", "stats", "invite"],
  editor: ["upload", "edit"],
  guest: ["stats"],
});
</script>
