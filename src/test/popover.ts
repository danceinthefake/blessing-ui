/** jsdom lacks the Popover API; emulate enough for tests */
export function stubPopover() {
  const open = new WeakSet<Element>();
  // jsdom 31 hides a closed [popover] (display: none) and refuses focus() inside it, so an
  // "open" one must be shown, as the browser does
  if (!document.getElementById("stub-popover")) {
    const style = Object.assign(document.createElement("style"), { id: "stub-popover" });
    style.textContent = "[popover][data-open] { display: block; }";
    document.head.append(style);
  }
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
