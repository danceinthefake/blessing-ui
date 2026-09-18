<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAvatar,
  BlessButton,
  BlessHoverCard,
  BlessPopover,
  BlessText,
  BlessTooltip,
  type Placement,
} from "blessing-ui";

const placements: Placement[] = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "right",
];
const manual = ref(false);
</script>

<template>
  <main class="pg">
    <h1>Blessing UI — floating</h1>
    <p>
      <a href="/">← components</a> · <a href="/forms.html">forms</a> ·
      <a href="/stage.html">stage</a>
    </p>

    <section>
      <h2>BlessPopover</h2>
      <div class="row">
        <BlessPopover v-for="p in placements" :key="p" :placement="p" title="Popover">
          <template #trigger
            ><BlessButton variant="outline" size="sm">{{ p }}</BlessButton></template
          >
          <template #default="{ close }">
            <p style="margin: 0 0 8px">Native popover=auto: light dismiss, Esc, top layer.</p>
            <BlessButton size="sm" @click="close">close</BlessButton>
          </template>
        </BlessPopover>
      </div>
      <div class="row">
        <BlessPopover v-model:open="manual" modal title="Manual (modal)">
          <template #trigger
            ><BlessButton color="accent">manual, v-model = {{ manual }}</BlessButton></template
          >
          <template #default="{ close }"
            >No light dismiss. <BlessButton size="sm" @click="close">close</BlessButton></template
          >
        </BlessPopover>
      </div>
    </section>

    <section>
      <h2>BlessTooltip</h2>
      <div class="row" style="align-items: center">
        <BlessTooltip text="Save (⌘S)"><BlessButton>hover me</BlessButton></BlessTooltip>
        <BlessTooltip text="Below" placement="bottom"
          ><BlessButton variant="outline">bottom</BlessButton></BlessTooltip
        >
        <BlessTooltip placement="right" :delay="0"
          ><template #content><b>rich</b> content, no delay</template
          ><BlessButton variant="ghost">right</BlessButton></BlessTooltip
        >
        <BlessTooltip text="focus me with Tab"><a href="#">a link</a></BlessTooltip>
      </div>
    </section>

    <section>
      <h2>BlessHoverCard</h2>
      <p>
        Follow
        <BlessHoverCard>
          <template #trigger
            ><a href="#" style="color: var(--bless-color-accent); font-weight: 700"
              >@saenai_heroine</a
            ></template
          >
          <div style="display: flex; gap: 12px; align-items: center">
            <BlessAvatar name="Saenai Heroine" color="accent" size="lg" />
            <div>
              <BlessText as="p" weight="bold">冴えない彼女の育てかた</BlessText
              ><BlessText as="p" size="xs" muted>TVアニメ公式 · joined 2014</BlessText>
            </div>
          </div>
        </BlessHoverCard>
        for updates.
      </p>
    </section>

    <div style="height: 60vh"></div>
  </main>
</template>
