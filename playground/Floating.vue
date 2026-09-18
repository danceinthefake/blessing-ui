<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAlertDialog,
  BlessAvatar,
  BlessButton,
  BlessContextMenu,
  BlessDrawer,
  BlessDropdownMenu,
  BlessHoverCard,
  BlessMenubar,
  BlessPopover,
  BlessSheet,
  BlessText,
  BlessToaster,
  BlessTooltip,
  useToast,
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
const sheet = ref(false);
const sheetSide = ref<"left" | "right" | "top" | "bottom">("right");
const drawer = ref(false);
const confirm = ref(false);
const busy = ref(false);
const { toast, success, error, warning, info } = useToast();
function reload() {
  location.reload();
}
function openSheet(side: typeof sheetSide.value) {
  sheetSide.value = side;
  sheet.value = true;
}
async function doDelete() {
  busy.value = true;
  await new Promise((r) => setTimeout(r, 800));
  busy.value = false;
  confirm.value = false;
  success({
    title: "Deleted",
    description: "Project removed",
    action: { label: "Undo", onClick: () => info("Restored") },
  });
}
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

    <section>
      <h2>BlessSheet + BlessDrawer</h2>
      <div class="row">
        <BlessButton
          v-for="s in ['right', 'left', 'top', 'bottom'] as const"
          :key="s"
          variant="outline"
          @click="openSheet(s)"
          >{{ s }}</BlessButton
        >
        <BlessButton color="accent" @click="drawer = true">drawer (bottom, draggable)</BlessButton>
      </div>
      <BlessSheet v-model="sheet" :side="sheetSide" title="Filters">
        <BlessText as="p">Native &lt;dialog&gt; side panel. Esc / backdrop / × close it.</BlessText>
        <template #footer
          ><BlessButton variant="outline" @click="sheet = false">Cancel</BlessButton
          ><BlessButton color="accent" @click="sheet = false">Apply</BlessButton></template
        >
      </BlessSheet>
      <BlessDrawer v-model="drawer" title="Share">
        <BlessText as="p">Drag the handle down 80px to close.</BlessText>
        <div class="row" style="margin-top: 12px">
          <BlessButton size="sm">Twitter</BlessButton
          ><BlessButton size="sm" variant="outline">Copy link</BlessButton>
        </div>
      </BlessDrawer>
    </section>

    <section>
      <h2>BlessAlertDialog</h2>
      <BlessButton color="danger" @click="confirm = true">Delete project</BlessButton>
      <BlessAlertDialog
        v-model="confirm"
        title="Delete project?"
        description="This permanently removes the project and its 12 files."
        confirm-label="Delete"
        :loading="busy"
        @confirm="doDelete"
      />
    </section>

    <section>
      <h2>BlessToaster + useToast</h2>
      <div class="row">
        <BlessButton size="sm" @click="toast('Plain toast')">toast</BlessButton>
        <BlessButton size="sm" @click="success({ title: 'Saved', description: '2 fields updated' })"
          >success</BlessButton
        >
        <BlessButton
          size="sm"
          @click="error({ title: 'Failed', description: 'Network error', duration: 0 })"
          >error (sticky)</BlessButton
        >
        <BlessButton size="sm" @click="warning('Low disk space')">warning</BlessButton>
        <BlessButton
          size="sm"
          @click="info({ title: 'Update', action: { label: 'Reload', onClick: reload } })"
          >info + action</BlessButton
        >
      </div>
      <BlessToaster />
    </section>

    <div style="height: 60vh"></div>
  </main>
</template>
