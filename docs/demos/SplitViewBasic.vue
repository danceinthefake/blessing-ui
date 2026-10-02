<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessSplitView } from "blessing-ui";

const mails = [
  {
    id: 1,
    from: "Mika",
    subject: "Docs review",
    body: "The new component pages read well. Two typos on the Gantt page.",
  },
  {
    id: 2,
    from: "Ken",
    subject: "Release 0.2",
    body: "Can we cut it on Friday? The e2e run is green on all three browsers.",
  },
  {
    id: 3,
    from: "Miho",
    subject: "Screenshots",
    body: "Regenerated for dark mode; they are in the shared folder.",
  },
];
const picked = ref(mails[0]!.id);
const detail = ref(false);
const mail = computed(() => mails.find((m) => m.id === picked.value)!);
const size = ref(35);
</script>

<template>
  <div style="height: 260px; border: 1px solid var(--bless-color-border)">
    <BlessSplitView
      v-model="size"
      v-model:detail="detail"
      storage-key="docs-split-demo"
      :breakpoint="480"
    >
      <template #master="{ open }">
        <ul style="list-style: none; margin: 0; padding: 0">
          <li v-for="m in mails" :key="m.id">
            <button
              type="button"
              :aria-current="picked === m.id || undefined"
              style="
                display: block;
                width: 100%;
                padding: 0.6rem 0.75rem;
                text-align: start;
                border: 0;
                border-bottom: 1px solid var(--bless-color-border);
                background: none;
                color: inherit;
                font: inherit;
                cursor: pointer;
              "
              :style="picked === m.id ? { fontWeight: 600 } : undefined"
              @click="((picked = m.id), open())"
            >
              {{ m.from }}<br /><small>{{ m.subject }}</small>
            </button>
          </li>
        </ul>
      </template>
      <template #detail>
        <div style="padding: 0.75rem">
          <h3 style="margin: 0 0 0.5rem">{{ mail.subject }}</h3>
          <p style="margin: 0">{{ mail.body }}</p>
        </div>
      </template>
    </BlessSplitView>
  </div>
</template>
