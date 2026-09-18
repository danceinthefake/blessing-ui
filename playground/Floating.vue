<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAvatar,
  BlessButton,
  BlessContextMenu,
  BlessDropdownMenu,
  BlessHoverCard,
  BlessMenubar,
  BlessPopover,
  BlessText,
  BlessTooltip,
  type BlessMenuItem,
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
const checked = ref<Record<string, boolean>>({ grid: true });
const radios = ref<Record<string, string>>({ size: "s" });
const last = ref("");
const menu: BlessMenuItem[] = [
  { type: "label", label: "Heroine" },
  { label: "New project", shortcut: "⌘N", value: "new", icon: "＋" },
  { label: "Open…", shortcut: "⌘O", value: "open" },
  { label: "Locked", value: "lock", disabled: true },
  { type: "separator" },
  { type: "checkbox", label: "Show grid", value: "grid" },
  { type: "checkbox", label: "Snap", value: "snap" },
  { type: "separator" },
  { type: "radio", label: "Small", value: "s", group: "size" },
  { type: "radio", label: "Large", value: "l", group: "size" },
  {
    type: "sub",
    label: "Share",
    items: [
      { label: "Twitter", value: "tw" },
      { label: "Copy link", value: "cp", shortcut: "⌘C" },
      { type: "sub", label: "More", items: [{ label: "Deep item", value: "deep" }] },
    ],
  },
  { type: "separator" },
  { label: "Delete", value: "del", danger: true, shortcut: "⌫" },
];
const fileMenu: BlessMenuItem[] = [
  { label: "New", shortcut: "⌘N", value: "n" },
  { label: "Open", shortcut: "⌘O", value: "o" },
  { type: "separator" },
  { label: "Quit", value: "q" },
];
const editMenu: BlessMenuItem[] = [
  { label: "Undo", shortcut: "⌘Z", value: "u" },
  { label: "Redo", shortcut: "⇧⌘Z", value: "r" },
];
const viewMenu: BlessMenuItem[] = [
  { type: "checkbox", label: "Sidebar", value: "sb" },
  { type: "checkbox", label: "Status bar", value: "st" },
];
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

    <section>
      <h2>BlessDropdownMenu</h2>
      <div class="row" style="align-items: center">
        <BlessDropdownMenu
          :items="menu"
          v-model:checked="checked"
          v-model:radios="radios"
          @select="last = 'label' in $event ? $event.label : ''"
        >
          <template #trigger><BlessButton>Actions ▾</BlessButton></template>
        </BlessDropdownMenu>
        <BlessDropdownMenu :items="menu" placement="bottom-end" :checked :radios>
          <template #trigger><BlessButton variant="outline">end-aligned</BlessButton></template>
        </BlessDropdownMenu>
        <small>last: {{ last }} · checked: {{ checked }} · size: {{ radios.size }}</small>
      </div>
    </section>

    <section>
      <h2>BlessContextMenu</h2>
      <BlessContextMenu
        :items="menu"
        :checked
        :radios
        @select="last = 'label' in $event ? $event.label : ''"
      >
        <div
          style="
            display: grid;
            place-items: center;
            height: 120px;
            max-width: 480px;
            border: 1px dashed var(--bless-color-text-muted);
          "
        >
          right-click here
        </div>
      </BlessContextMenu>
    </section>

    <section>
      <h2>BlessMenubar</h2>
      <BlessMenubar label="App">
        <BlessDropdownMenu :items="fileMenu"
          ><template #trigger><button>File</button></template></BlessDropdownMenu
        >
        <BlessDropdownMenu :items="editMenu"
          ><template #trigger><button>Edit</button></template></BlessDropdownMenu
        >
        <BlessDropdownMenu :items="viewMenu" :checked
          ><template #trigger><button>View</button></template></BlessDropdownMenu
        >
      </BlessMenubar>
      <BlessText as="p" size="xs" muted
        >← → moves between menus; open one then hover others</BlessText
      >
    </section>

    <div style="height: 60vh"></div>
  </main>
</template>
