<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAlert,
  BlessButton,
  BlessEmpty,
  BlessList,
  BlessListItem,
  BlessSkeleton,
  BlessToggle,
  BlessToggleGroup,
} from "blessing-ui";

type State = "loading" | "empty" | "error" | "ready";
const state = ref<State>("loading");
</script>

<template>
  <div class="states">
    <BlessToggleGroup v-model="state" label="Preview state" class="states__pick">
      <BlessToggle
        v-for="s in ['loading', 'empty', 'error', 'ready']"
        :key="s"
        :value="s"
        size="sm"
        >{{ s }}</BlessToggle
      >
    </BlessToggleGroup>

    <div v-if="state === 'loading'" role="status" aria-busy="true" aria-label="Loading projects">
      <BlessSkeleton width="40%" height="20px" />
      <BlessSkeleton :lines="4" height="14px" style="margin-top: 16px" />
    </div>

    <BlessEmpty
      v-else-if="state === 'empty'"
      title="No projects yet"
      description="Create your first project to start tracking work."
    >
      <template #icon>◇</template>
      <BlessButton color="accent" size="sm">New project</BlessButton>
    </BlessEmpty>

    <BlessAlert
      v-else-if="state === 'error'"
      color="danger"
      title="Couldn't load projects"
      :dismissible="false"
    >
      The server didn't respond (504). Your work is safe.
      <div class="states__actions">
        <BlessButton size="sm" color="danger" variant="outline" @click="state = 'loading'"
          >Retry</BlessButton
        >
        <BlessButton size="sm" variant="ghost" href="#">Status page</BlessButton>
      </div>
    </BlessAlert>

    <BlessList v-else>
      <BlessListItem
        v-for="p in ['Blessing Software', 'cherry blessing', 'Fields Chronicle']"
        :key="p"
        :meta="'2026.09'"
        >{{ p }}</BlessListItem
      >
    </BlessList>
  </div>
</template>

<style scoped>
.states {
  max-width: 560px;
  margin: 0 auto;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.states__pick {
  margin-bottom: var(--bless-space-6);
}
.states__actions {
  display: flex;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-3);
}
</style>
