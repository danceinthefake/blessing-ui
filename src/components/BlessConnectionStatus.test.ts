import { mount } from "@vue/test-utils";
import BlessConnectionStatus from "./BlessConnectionStatus.vue";

const setOnline = (on: boolean) => {
  Object.defineProperty(navigator, "onLine", { configurable: true, get: () => on });
  dispatchEvent(new Event(on ? "online" : "offline"));
};
afterEach(() => {
  setOnline(true);
  vi.useRealTimers();
});

test("BlessConnectionStatus: quiet while online, a line for a problem, then back online for a moment", async () => {
  vi.useFakeTimers();
  const w = mount(BlessConnectionStatus);
  expect(w.attributes("role")).toBe("status");
  expect(w.text()).toBe("");
  await w.setProps({ state: "connecting" });
  expect(w.text()).toBe("Reconnecting…");
  expect(w.classes()).toContain("bless-conn--connecting");
  await w.setProps({ state: "online" });
  expect(w.text()).toBe("Back online");
  vi.advanceTimersByTime(4000);
  await w.vm.$nextTick();
  expect(w.text()).toBe("");
});

test("BlessConnectionStatus: the browser's offline state wins over the socket", async () => {
  const w = mount(BlessConnectionStatus, { props: { state: "online" }, attachTo: document.body });
  setOnline(false);
  await w.vm.$nextTick();
  expect(w.text()).toBe("You are offline");
  expect(w.classes()).toContain("bless-conn--offline");
  setOnline(true);
  await w.vm.$nextTick();
  expect(w.text()).toBe("Back online");
  w.unmount();
});

test("BlessConnectionStatus: always shows the online state; labels change the words", () => {
  const w = mount(BlessConnectionStatus, { props: { always: true, labels: { online: "Live" } } });
  expect(w.text()).toBe("Live");
});
