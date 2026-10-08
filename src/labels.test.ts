// `labels` swaps the built-in English for another language: announcements, button text, aria-labels.
import { mount } from "@vue/test-utils";
import BlessSortable from "./components/BlessSortable.vue";
import BlessKanban from "./components/BlessKanban.vue";
import BlessTimer from "./components/BlessTimer.vue";
import BlessShortcutRecorder from "./components/BlessShortcutRecorder.vue";
import BlessCodeBlock from "./components/BlessCodeBlock.vue";

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
