import { mount } from "@vue/test-utils";
import BlessFileTree, { fileIcon, filesToTree } from "./BlessFileTree.vue";

const paths = [
  "readme.md",
  "audio/ep41/raw.wav",
  "audio/ep41/final.mp3",
  "art/cover.png",
  "empty/",
  ".env",
];

test("filesToTree: folders first and by name, ids are paths, icons by type, open by rule", () => {
  const t = filesToTree(paths, (p) => p === "audio");
  expect(t.map((n) => n.label)).toEqual(["art", "audio", "empty", ".env", "readme.md"]);
  expect(t.map((n) => n.icon)).toEqual(["📁", "📁", "📁", "⚙", "📝"]);
  const audio = t[1]!;
  expect(audio.open).toBe(true);
  expect(t[0]!.open).toBe(false);
  expect(audio.children![0]!.id).toBe("audio/ep41");
  expect(audio.children![0]!.children!.map((n) => [n.id, n.icon])).toEqual([
    ["audio/ep41/final.mp3", "🎵"],
    ["audio/ep41/raw.wav", "🎵"],
  ]);
  expect(t[2]!.children).toEqual([]);
  expect(fileIcon("clip.MOV")).toBe("🎬");
  expect(fileIcon("notes")).toBe("📄");
});

test("BlessFileTree: a tree that opens the folders of the selected file and reports a pick", async () => {
  const w = mount(BlessFileTree, {
    props: {
      paths,
      selected: "audio/ep41/raw.wav",
      "onUpdate:selected": (s?: string) => w.setProps({ selected: s }),
    },
  });
  expect(w.find("[role=tree]").attributes("aria-label")).toBe("Files");
  const open = w.findAll("details").filter((d) => d.attributes("open") !== undefined);
  expect(open.map((d) => d.find("summary").text())).toEqual(["›📁audio", "›📁ep41"]);
  expect(w.find(".bless-tree__row--selected").text()).toContain("raw.wav");
  const cover = w.findAll(".bless-tree__label").find((l) => l.text() === "cover.png")!;
  await cover.trigger("click");
  expect(w.props("selected")).toBe("art/cover.png");
  expect(w.emitted("select")![0]).toEqual(["art/cover.png", false]);
});
