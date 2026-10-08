// `labels` swaps the built-in English for another language: announcements, button text, aria-labels.
import { mount } from "@vue/test-utils";
import BlessSortable from "./components/BlessSortable.vue";
import BlessKanban from "./components/BlessKanban.vue";
import BlessTimer from "./components/BlessTimer.vue";
import BlessShortcutRecorder from "./components/BlessShortcutRecorder.vue";
import BlessCodeBlock from "./components/BlessCodeBlock.vue";
import BlessCalendar from "./components/BlessCalendar.vue";
import BlessInputNumber from "./components/BlessInputNumber.vue";
import BlessOrderList from "./components/BlessOrderList.vue";
import BlessPickList from "./components/BlessPickList.vue";
import BlessLoadingBar from "./components/BlessLoadingBar.vue";

const space = { key: " " };

test("Sortable: grip name, hint, role description and the grab announcement", async () => {
  const w = mount(BlessSortable, {
    props: {
      modelValue: ["a", "b"],
      labels: {
        grip: (i: number) => `Urutkan ${i}`,
        grabbed: (i: number, n: number) => `Diambil ${i} dari ${n}`,
        hint: "Tekan Spasi",
        roleDescription: "item",
      },
    },
  });
  const grip = w.find(".bless-sortable__grip");
  expect(grip.attributes("aria-label")).toBe("Urutkan 1");
  expect(grip.attributes("aria-roledescription")).toBe("item");
  expect(w.find("[hidden]").text()).toBe("Tekan Spasi");
  await grip.trigger("keydown", space);
  expect(w.find(".bless-sortable__live").text()).toBe("Diambil 1 dari 2");
});

test("Kanban: card name and the grab announcement", async () => {
  const w = mount(BlessKanban, {
    props: {
      modelValue: [{ id: "a", title: "Baru", items: ["x"] }],
      labels: { card: (i: number, c: string) => `Pindah kartu ${i} di ${c}`, grabbed: "Diambil" },
    },
  });
  const grip = w.find("[data-grip]");
  expect(grip.attributes("aria-label")).toBe("Pindah kartu 1 di Baru");
  await grip.trigger("keydown", space);
  expect(w.find(".bless-kanban__live").text()).toBe("Diambil");
});

test("Timer: button text", () => {
  const w = mount(BlessTimer, {
    props: { labels: { start: "Mulai", reset: "Ulang" } },
  });
  expect(w.text()).toContain("Mulai");
  expect(w.text()).toContain("Ulang");
});

test("ShortcutRecorder: button name and the recording prompt", async () => {
  const w = mount(BlessShortcutRecorder, {
    props: {
      modelValue: "",
      labels: { button: (l: string) => `${l}: kosong`, pressKeys: "Tekan tombol…" },
    },
  });
  const b = w.find("button");
  expect(b.attributes("aria-label")).toBe("Shortcut: kosong");
  await b.trigger("click");
  expect(b.text()).toBe("Tekan tombol…");
});

test("CodeBlock: copy button", () => {
  const w = mount(BlessCodeBlock, { props: { code: "x", labels: { copy: "Salin" } } });
  expect(w.find(".bless-code__copy").text()).toBe("Salin");
});

test("Calendar, InputNumber and LoadingBar: button and bar names", () => {
  const c = mount(BlessCalendar, {
    props: { labels: { prev: "Bulan lalu", next: "Bulan depan" } },
  });
  expect(c.find(".bless-calendar__nav").attributes("aria-label")).toBe("Bulan lalu");
  const n = mount(BlessInputNumber, { props: { labels: { increase: "Tambah" } } });
  expect(n.find("[aria-label=Tambah]").exists()).toBe(true);
  expect(
    mount(BlessLoadingBar, { props: { label: "Memuat" } })
      .find("[aria-label=Memuat]")
      .exists(),
  ).toBe(true);
});

test("OrderList and PickList: row buttons and announcements", async () => {
  const o = mount(BlessOrderList, {
    props: {
      modelValue: ["a", "b"],
      labels: { up: (p: number) => `Naik ${p}`, moved: (p: number) => `Ke ${p}` },
    },
  });
  const up = o.find("[aria-label='Naik 2']");
  expect(up.exists()).toBe(true);
  await up.trigger("click");
  expect(o.find(".bless-order__live, [aria-live]").text()).toBe("Ke 1");
  const p = mount(BlessPickList, {
    props: { labels: { moveAll: (to: string) => `Semua ke ${to}` }, targetLabel: "Pilihan" },
  });
  expect(p.find("[aria-label='Semua ke Pilihan']").exists()).toBe(true);
});
