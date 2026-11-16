import { mount } from "@vue/test-utils";
import BlessFileBrowser from "./BlessFileBrowser.vue";

const items = [
  { id: "3", name: "notes 10.txt", size: 2400, modified: "2026-11-02" },
  { id: "2", name: "notes 9.txt", size: 980 },
  { id: "1", name: "Photos", folder: true },
  { id: "4", name: "mix.wav", size: 48_300_000 },
];

test("BlessFileBrowser: folders first and natural order, sizes, views, path, and open", async () => {
  const w = mount(BlessFileBrowser, {
    props: {
      items,
      path: [
        { id: "root", label: "My files" },
        { id: "p", label: "Podcast" },
      ],
      "onUpdate:view": (v: "grid" | "list") => w.setProps({ view: v }),
    },
  });
  expect(w.findAll(".bless-files__name").map((n) => n.text())).toEqual([
    "Photos",
    "mix.wav",
    "notes 9.txt",
    "notes 10.txt",
  ]);
  expect(w.findAll(".bless-files__meta").map((n) => n.text())).toEqual([
    "Folder",
    "48.3 MB",
    "980 byte",
    "2.4 kB",
  ]);
  expect(w.find("svg text").text()).toBe("WAV");
  expect(w.find("[aria-current]").text()).toBe("Podcast");
  await w.find(".bless-files__path button").trigger("click");
  expect(w.emitted("navigate")).toEqual([["root"]]);
  await w.findAll(".bless-files__tile")[0]!.trigger("click");
  expect(w.emitted("open")![0]).toEqual([items[2]]);
  await w.findAll(".bless-files__views button")[1]!.trigger("click");
  const rows = w.findAll("tbody tr");
  expect(rows[3]!.text().replace(/\s+/g, " ")).toBe("· notes 10.txtNov 2, 20262.4 kB");
  expect(w.find(".bless-files__count").text()).toBe("4 items");
});
