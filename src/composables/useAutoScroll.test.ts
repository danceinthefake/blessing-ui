import { edgeSpeed, useAutoScroll } from "./useAutoScroll";

test("edgeSpeed is 0 in the middle and grows toward each end", () => {
  expect(edgeSpeed(150, 0, 300)).toBe(0);
  expect(edgeSpeed(47, 0, 300)).toBeLessThan(0);
  expect(edgeSpeed(2, 0, 300)).toBeLessThan(edgeSpeed(40, 0, 300));
  expect(edgeSpeed(298, 0, 300)).toBe(18);
  expect(edgeSpeed(-30, 0, 300)).toBe(-18); // past the edge: full speed, no more
  expect(edgeSpeed(10, 0, 60)).toBe(0); // a box too small to have a middle
});

test("scrolls the box while the pointer rests at its edge, then stops", () => {
  let frame: FrameRequestCallback = () => {};
  const raf = vi
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((cb) => ((frame = cb), 1));
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  const box = document.createElement("div");
  box.getBoundingClientRect = () => ({ left: 0, right: 300, top: 0, bottom: 100 }) as DOMRect;
  // jsdom does not clamp scrollLeft, which is all this needs
  let scrolled = 0;
  const onScroll = vi.fn(() => scrolled++);
  const auto = useAutoScroll(() => box, onScroll);
  auto.point(299, 300); // right edge; the page's middle (innerHeight 768)
  auto.start();
  frame(0);
  expect(box.scrollLeft).toBeGreaterThan(0);
  expect(onScroll).toHaveBeenCalled();
  auto.stop();
  raf.mockRestore();
});
