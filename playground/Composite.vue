<script setup lang="ts">
import { ref } from "vue";
import {
  BlessButton,
  BlessCombobox,
  BlessCommand,
  BlessKbd,
  BlessLabel,
  BlessText,
  BlessToaster,
  useToast,
  type BlessCommandItem,
  type BlessOption,
} from "blessing-ui";

const { toast } = useToast();
const cmdOpen = ref(false);
const commands: BlessCommandItem[] = [
  {
    label: "New project",
    value: "new",
    group: "File",
    shortcut: "⌘N",
    icon: "＋",
    keywords: ["create"],
  },
  { label: "Open recent…", value: "open", group: "File", shortcut: "⌘O" },
  { label: "Save all", value: "save", group: "File", shortcut: "⌥⌘S" },
  { label: "Toggle sidebar", value: "sidebar", group: "View", shortcut: "⌘B" },
  { label: "Toggle theme", value: "theme", group: "View", disabled: true },
  { label: "Zoom in", value: "zoomin", group: "View", shortcut: "⌘+" },
  {
    label: "Go to character…",
    value: "chara",
    group: "Navigate",
    keywords: ["heroine", "megumi", "eriri"],
  },
  { label: "Go to news", value: "news", group: "Navigate" },
];
const heroines = ref<BlessOption<string>[]>([
  { value: "megumi", label: "加藤恵" },
  { value: "eriri", label: "澤村・スペンサー・英梨々" },
  { value: "utaha", label: "霞ヶ丘詩羽" },
  { value: "michiru", label: "氷堂美智留" },
  { value: "izumi", label: "波島出海" },
  { value: "tomoya", label: "安芸倫也", disabled: true },
]);
const one = ref<string>();
const many = ref<string[]>(["megumi", "eriri"]);
function create(label: string) {
  const value = label.toLowerCase().replace(/\s+/g, "-");
  heroines.value.push({ value, label });
  many.value.push(value);
}
</script>

<template>
  <BlessToaster />
  <main class="pg">
    <h1>Blessing UI — composite</h1>
    <p>
      <a href="/">← components</a> · <a href="/forms.html">forms</a> ·
      <a href="/floating.html">floating</a> · <a href="/stage.html">stage</a>
    </p>

    <section>
      <h2>BlessCommand</h2>
      <div class="row" style="align-items: center">
        <BlessButton color="accent" @click="cmdOpen = true">Command palette</BlessButton>
        <span>or press <BlessKbd :keys="['⌘', 'K']" /></span>
      </div>
      <BlessCommand
        v-model:open="cmdOpen"
        :items="commands"
        @select="toast({ title: $event.label, color: 'accent' })"
      >
        <template #footer
          ><span><BlessKbd>↑↓</BlessKbd> navigate</span><span><BlessKbd>↵</BlessKbd> select</span
          ><span><BlessKbd>esc</BlessKbd> close</span></template
        >
      </BlessCommand>
      <div style="max-width: 480px; margin-top: var(--bless-space-4)">
        <BlessText as="p" size="xs" muted>inline mode:</BlessText>
        <BlessCommand
          :items="commands"
          inline
          placeholder="Filter commands…"
          @select="toast($event.label)"
        />
      </div>
    </section>

    <section>
      <h2>BlessCombobox</h2>
      <div class="row">
        <div class="col">
          <BlessLabel for="one">Single</BlessLabel>
          <BlessCombobox id="one" v-model="one" :options="heroines" placeholder="Search heroine…" />
          <small>value: {{ one }}</small>
        </div>
        <div class="col">
          <BlessLabel for="many">Multiple + creatable</BlessLabel>
          <BlessCombobox
            id="many"
            v-model="many"
            :options="heroines"
            multiple
            creatable
            placeholder="Add…"
            @create="create"
          />
          <small>values: {{ many }}</small>
        </div>
        <div class="col">
          <BlessLabel>Disabled / invalid</BlessLabel>
          <BlessCombobox :options="heroines" model-value="megumi" disabled />
          <BlessCombobox :options="heroines" invalid placeholder="invalid" size="sm" />
        </div>
      </div>
    </section>
  </main>
</template>
