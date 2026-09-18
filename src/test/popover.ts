/** jsdom lacks the Popover API; emulate enough for tests */
export function stubPopover() {
  const open = new WeakSet<Element>();
  Object.assign(HTMLElement.prototype, {
    showPopover(this: HTMLElement) {
      open.add(this);
      this.setAttribute("data-open", "");
      this.dispatchEvent(
        Object.assign(new Event("toggle"), { newState: "open", oldState: "closed" }),
      );
    },
    hidePopover(this: HTMLElement) {
      open.delete(this);
      this.removeAttribute("data-open");
      this.dispatchEvent(
        Object.assign(new Event("toggle"), { newState: "closed", oldState: "open" }),
      );
    },
  });
  const orig = Element.prototype.matches;
  Element.prototype.matches = function (this: Element, sel: string) {
    if (sel === ":popover-open") return open.has(this);
    return orig.call(this, sel);
  } as typeof orig;
}
