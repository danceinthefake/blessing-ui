<script setup lang="ts">
import { ref } from "vue";
import {
  BlessBadge,
  BlessButton,
  BlessCalendar,
  BlessCarousel,
  BlessCombobox,
  BlessCommand,
  BlessDataTable,
  BlessDatePicker,
  BlessInputOTP,
  BlessKbd,
  BlessLabel,
  BlessNavigationMenu,
  BlessResizable,
  BlessText,
  BlessToaster,
  useToast,
  type BlessCommandItem,
  type BlessDataColumn,
  type BlessOption,
  BlessThemeToggle,
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
type Ep = { id: number; title: string; air: string; views: number; status: "aired" | "upcoming" };
const eps: Ep[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  title: `第${i + 1}話 ${["プロローグ", "運命の出会い", "フラグの立たない", "冴えない彼女", "同人誌", "夏合宿", "文化祭", "クリスマス"][i % 8]}`,
  air: `2017-04-${String((i % 28) + 1).padStart(2, "0")}`,
  views: Math.round(1200 + Math.sin(i) * 500 + i * 37),
  status: i < 20 ? "aired" : "upcoming",
}));
const epCols: BlessDataColumn<Ep>[] = [
  { key: "id", label: "#", sortable: true, width: "56px", hideable: false },
  { key: "title", label: "Title", sortable: true, header: true },
  { key: "air", label: "Aired", sortable: true },
  { key: "views", label: "Views", sortable: true, align: "right" },
  { key: "status", label: "Status" },
];
const selectedEps = ref<Ep[]>([]);
const split = ref(40);
const slide = ref(0);
const navItems = [
  { label: "Home", href: "#", active: true },
  {
    label: "Heroines",
    items: [
      { label: "加藤恵", href: "#megumi", description: "メインヒロイン" },
      { label: "英梨々", href: "#eriri", description: "幼馴染・イラスト担当" },
      { label: "詩羽", href: "#utaha", description: "先輩・シナリオ担当" },
      { label: "美智留", href: "#michiru", description: "従姉・音楽担当" },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "Blu-ray & DVD", href: "#bd" },
      { label: "Music", href: "#music" },
      { label: "Books", href: "#books" },
    ],
  },
  { label: "News", href: "#news" },
];
const day = ref<string | undefined>("2019-09-25");
const stay = ref<[string, string] | undefined>();
const picked = ref<string>();
const otp = ref("");
const otpState = ref<"idle" | "ok" | "bad">("idle");
function checkOtp(code: string) {
  otpState.value = code === "123456" ? "ok" : "bad";
  toast(
    otpState.value === "ok"
      ? { title: "Verified", color: "success" }
      : { title: "Wrong code", color: "danger" },
  );
}
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
    <div class="row" style="align-items: center">
      <p>
        <a href="/">← components</a> · <a href="/forms.html">forms</a> ·
        <a href="/floating.html">floating</a> · <a href="/stage.html">stage</a>
      </p>
      <BlessThemeToggle />
    </div>

    <section>
      <h2>Command</h2>
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
      <h2>Combobox</h2>
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

    <section>
      <h2>Calendar</h2>
      <div class="row">
        <div class="col" style="max-width: none; width: auto">
          <BlessText as="p" size="xs" muted>single · min 2019-09-10 · ja-JP</BlessText
          ><BlessCalendar v-model="day" min="2019-09-10" /><small>{{ day }}</small>
        </div>
        <div class="col" style="max-width: none; width: auto">
          <BlessText as="p" size="xs" muted>range · en-US · Sunday start</BlessText
          ><BlessCalendar
            v-model="stay"
            range
            locale="en-US"
            :week-start="0"
            month="2019-09"
          /><small>{{ stay }}</small>
        </div>
        <div class="col" style="max-width: none; width: auto">
          <BlessText as="p" size="xs" muted>weekends disabled</BlessText
          ><BlessCalendar
            :disabled-dates="(iso) => [0, 6].includes(new Date(iso).getDay())"
            locale="en-US"
            month="2019-09"
          />
        </div>
      </div>
    </section>

    <section>
      <h2>DatePicker</h2>
      <div class="row">
        <div class="col">
          <BlessLabel for="dp">Release date</BlessLabel
          ><BlessDatePicker id="dp" v-model="picked" locale="en-US" /><small>{{ picked }}</small>
        </div>
        <div class="col">
          <BlessLabel for="dr">Stay</BlessLabel
          ><BlessDatePicker
            id="dr"
            v-model="stay"
            range
            placeholder="Check-in – check-out"
            locale="en-US"
          />
        </div>
        <div class="col">
          <BlessLabel>States</BlessLabel
          ><BlessDatePicker model-value="2019-09-25" invalid size="sm" /><BlessDatePicker
            disabled
          />
        </div>
      </div>
      <BlessText as="p" size="xs" muted
        >on touch devices (pointer: coarse) single mode renders native &lt;input
        type=date&gt;</BlessText
      >
    </section>

    <section>
      <h2>InputOTP</h2>
      <div class="col" style="max-width: none">
        <BlessInputOTP
          v-model="otp"
          :separators="[3]"
          :invalid="otpState === 'bad'"
          @complete="checkOtp"
        />
        <small>code: {{ otp || "—" }} · try 123456 · paste works</small>
        <BlessInputOTP :length="4" :numeric="false" masked label="PIN" />
        <BlessInputOTP :length="4" model-value="42" disabled />
      </div>
    </section>

    <section>
      <h2>NavigationMenu</h2>
      <BlessNavigationMenu
        :items="navItems"
        @select="
          (i, e) => {
            e.preventDefault();
            toast(i.label);
          }
        "
      />
    </section>

    <section>
      <h2>DataTable</h2>
      <BlessDataTable
        :rows="eps"
        :columns="epCols"
        row-key="id"
        selectable
        searchable
        :search-keys="['title', 'air']"
        :page-size="5"
        caption="Episodes"
        @update:selected="selectedEps = $event"
      >
        <template #toolbar="{ selected }"
          ><BlessButton
            v-if="selected.length"
            size="sm"
            color="danger"
            variant="outline"
            @click="toast(`${selected.length} removed`)"
            >Delete {{ selected.length }}</BlessButton
          ></template
        >
        <template #cell-status="{ value }"
          ><BlessBadge :color="value === 'aired' ? 'success' : 'warning'" :scaled="false">{{
            value
          }}</BlessBadge></template
        >
        <template #cell-views="{ value }">{{ Number(value).toLocaleString() }}</template>
      </BlessDataTable>
    </section>

    <section>
      <h2>Carousel</h2>
      <div class="row">
        <div style="width: 480px">
          <BlessCarousel v-model="slide" :autoplay="3000" loop label="Key visuals"
            ><div
              v-for="n in 5"
              :key="n"
              style="
                height: 200px;
                display: grid;
                place-items: center;
                font-size: 48px;
                color: var(--bless-color-on-accent);
                background: var(--bless-color-accent);
              "
            >
              {{ n }}
            </div></BlessCarousel
          ><small>slide {{ slide + 1 }} · autoplay 3s, loops, pauses on hover</small>
        </div>
        <div style="width: 480px">
          <BlessCarousel :per-view="2.5" gap="8px" :dots="false"
            ><div
              v-for="n in 7"
              :key="n"
              style="
                height: 200px;
                display: grid;
                place-items: center;
                font-size: 32px;
                background: var(--bless-color-surface);
              "
            >
              {{ n }}
            </div></BlessCarousel
          ><small>perView 2.5 (peek), swipe / scroll-snap, ← →</small>
        </div>
      </div>
    </section>

    <section>
      <h2>Resizable</h2>
      <div style="height: 200px; max-width: 720px; border: 1px solid var(--bless-color-border)">
        <BlessResizable v-model="split" :min="20" :max="80">
          <template #a
            ><div style="padding: 16px">
              Pane A — {{ split }}%<br /><small>drag, ← →, Home/End, dbl-click resets</small>
            </div></template
          >
          <template #b>
            <BlessResizable direction="vertical">
              <template #a><div style="padding: 16px">Pane B1</div></template>
              <template #b><div style="padding: 16px">Pane B2 (nested vertical)</div></template>
            </BlessResizable>
          </template>
        </BlessResizable>
      </div>
    </section>
  </main>
</template>
