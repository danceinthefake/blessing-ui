import { mount } from "@vue/test-utils";
import BlessArtifactPanel from "./BlessArtifactPanel.vue";

test("BlessArtifactPanel: newest version first, older and newer, copy, writing, and close", async () => {
  const w = mount(BlessArtifactPanel, {
    props: {
      title: "Launch plan",
      versions: ["v1 text", "v2 text", "v3 text"],
      writing: true,
      "onUpdate:version": (v: number | undefined) => w.setProps({ version: v }),
    },
  });
  expect(w.find("aside").attributes("aria-label")).toBe("Document: Launch plan");
  expect(w.find(".bless-artifact__versions").text()).toBe("‹ Version 3 of 3 ›");
  expect(w.find(".bless-artifact__text").text()).toBe("v3 text");
  expect(w.find(".bless-artifact__writing").text()).toBe("Writing…");
  expect(w.find('[aria-label="Newer version"]').attributes("disabled")).toBeDefined();
  await w.find('[aria-label="Older version"]').trigger("click");
  expect(w.find(".bless-artifact__text").text()).toBe("v2 text");
  expect(w.find(".bless-artifact__writing").exists()).toBe(false);
  const write = vi.fn(() => Promise.resolve());
  Object.assign(navigator, { clipboard: { writeText: write } });
  await w.find(".bless-artifact__actions button").trigger("click");
  await Promise.resolve();
  expect(write).toHaveBeenCalledWith("v2 text");
  expect(w.find("[role=status]").text()).toBe("Copied");
  await w.find('[aria-label="Close the panel"]').trigger("click");
  expect(w.emitted("close")).toHaveLength(1);
  await w.setProps({ lang: "ts" });
  expect(w.find(".bless-artifact__text").exists()).toBe(false);
});
