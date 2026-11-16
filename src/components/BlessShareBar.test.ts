import { flushPromises, mount } from "@vue/test-utils";
import BlessShareBar from "./BlessShareBar.vue";

afterEach(() => {
  delete (navigator as { share?: unknown }).share;
});

test("BlessShareBar: copy link says copied, and your targets are links", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  const w = mount(BlessShareBar, {
    props: {
      url: "https://x.test/ep41",
      targets: [{ label: "Email", href: "mailto:?body=https://x.test/ep41" }],
    },
  });
  expect(w.find(".is-main").exists()).toBe(false);
  await w.find("button").trigger("click");
  await flushPromises();
  expect(writeText).toHaveBeenCalledWith("https://x.test/ep41");
  expect(w.find("[role=status]").text()).toBe("Link copied");
  expect(w.emitted("shared")).toEqual([["copy"]]);
  expect(w.find("a").attributes("href")).toBe("mailto:?body=https://x.test/ep41");
});

test("BlessShareBar: with the Web Share API, a share button opens the system sheet", async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "share", { value: share, configurable: true });
  const w = mount(BlessShareBar, { props: { url: "https://x.test", title: "Ep" } });
  await flushPromises();
  await w.find(".is-main").trigger("click");
  await flushPromises();
  expect(share).toHaveBeenCalledWith({ url: "https://x.test", title: "Ep" });
  expect(w.emitted("shared")).toEqual([["system"]]);
});
