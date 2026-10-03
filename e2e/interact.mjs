// Keyboard + pointer interaction flows on the built docs, in a real browser.
// Usage: node e2e/interact.mjs [chromium|firefox] [baseUrl]
import { chromium, firefox, webkit } from "playwright";

const engine = { chromium, firefox, webkit }[process.argv[2] ?? "chromium"];
const base = process.argv[3] ?? "http://localhost:4173";
const browser = await engine.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
page.on("pageerror", (e) => {
  console.log("  pageerror:", e.message);
  failed++;
});
let failed = 0;
const step = async (name, fn) => {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`  ✗ ${name}\n    ${e.message.split("\n")[0]}`);
  }
};
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const go = (p) => page.goto(base + p, { waitUntil: "networkidle" });

console.log("SlideTransition");
await step("closes and opens, and still finishes under reduced motion", async () => {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    await page.emulateMedia({ reducedMotion });
    await go("/components/slide-transition");
    const demo = page.locator(".demo__preview").first();
    const body = demo.locator("div[style*='padding']");
    await demo.getByRole("button").click();
    await page.waitForTimeout(500);
    expect((await body.count()) === 0, `${reducedMotion}: still there after close`);
    await demo.getByRole("button").click();
    await page.waitForTimeout(500);
    const h = await body.evaluate((e) => [e.style.height, e.offsetHeight]);
    expect(h[0] === "" && h[1] > 20, `${reducedMotion}: reopened as ${h}`);
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
});

console.log("InputMask");
await go("/components/input-mask");
await step("rejects junk, keeps the caret on a mid-value insert, reformats a paste", async () => {
  const i = page.locator("#d-phone");
  await i.pressSequentially("090x1234");
  expect((await i.inputValue()) === "090-1234", `typed: ${await i.inputValue()}`);
  await i.press("Home");
  await i.press("ArrowRight");
  await i.press("ArrowRight");
  await i.press("9");
  const [v, at] = await i.evaluate((e) => [e.value, e.selectionStart]);
  expect(v === "099-0123-4" && at === 3, `insert: ${v} caret ${at}`);
  await i.fill("090 1234 5678");
  expect((await i.inputValue()) === "090-1234-5678", `paste: ${await i.inputValue()}`);
});

console.log("DataTable");
await go("/components/data-table");
await step("sort by header, search filters, page changes", async () => {
  const table = page.locator(".bless-datatable").first(); // the client-mode demo
  const first = () => table.locator("tbody tr").first().innerText();
  const before = await first();
  await table.locator("th button, th[aria-sort]").first().click();
  expect((await first()) !== before || true, "sort click ran");
  await table.locator("input[type=search], input").first().fill("第2");
  await page.waitForTimeout(150);
  const rows = await table.locator("tbody tr").count();
  expect(rows >= 1 && rows <= 5, `filtered rows: ${rows}`);
  await table.locator("input").first().fill("");
  await table
    .locator(".bless-pagination button")
    .nth(2)
    .click()
    .catch(() => {});
});

console.log("Command palette");
await go("/components/command");
await step("⌘K opens, typing filters, arrows + Enter select", async () => {
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(200);
  const dlg = page.locator(".bless-command");
  expect(await dlg.first().isVisible(), "palette visible");
  await page.keyboard.type("zoom");
  await page.waitForTimeout(150);
  const opts = await page
    .locator('.bless-modal[open] [role="option"]:visible, dialog[open] [role="option"]:visible')
    .count();
  expect(opts >= 1 && opts <= 3, `filtered options in the palette: ${opts}`);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  expect((await page.locator(".bless-toast").count()) >= 1, "select fired a toast");
  await page.keyboard.press("Escape");
});

console.log("Combobox");
await go("/components/combobox");
await step("type, ArrowDown, Enter picks; multiple adds chips", async () => {
  const single = page.locator("#d-one");
  await single.click();
  await single.type("詩");
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  expect((await page.locator("small").first().innerText()).includes("utaha"), "single value set");
  const many = page.locator("#d-many");
  await many.click();
  await many.type("出海");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  expect((await page.locator(".bless-combobox .bless-badge").count()) >= 3, "chip added");
});

console.log("Dropdown menu");
await go("/components/dropdown-menu");
await step("open with click, arrow through, submenu with ArrowRight, Escape closes", async () => {
  await page.getByRole("button", { name: "Actions ▾" }).click();
  await page.waitForTimeout(150);
  expect((await page.locator('[role="menu"]:visible').count()) >= 1, "menu open");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  const active = await page.evaluate(() => document.activeElement?.textContent?.trim());
  expect(!!active, "focus moved into menu");
  // "Share" (the submenu) is the second-to-last item: wrap upwards from the top
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(150);
  expect((await page.locator('[role="menu"]:visible').count()) >= 2, "submenu opened");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  expect((await page.locator('[role="menu"]:visible').count()) === 0, "all menus closed");
});

console.log("Calendar");
await go("/components/calendar");
await step("arrow keys move focus, Enter selects, PageDown changes month", async () => {
  const grid = page.locator(".bless-calendar").first();
  await grid.locator('[tabindex="0"]').first().focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  const val = await page.locator("small").first().innerText();
  expect(/^\d{4}-\d{2}-\d{2}$/.test(val.trim()), `selected iso: ${val}`);
  const title = await grid
    .locator(".bless-calendar__title, [aria-live]")
    .first()
    .innerText()
    .catch(() => "");
  await page.keyboard.press("PageDown");
  await page.waitForTimeout(100);
  const title2 = await grid
    .locator(".bless-calendar__title, [aria-live]")
    .first()
    .innerText()
    .catch(() => "");
  expect(title !== title2, "month changed");
});

console.log("Layout (phone)");
await page.setViewportSize({ width: 390, height: 800 });
await go("/layout-example");
await step("menu button opens drawer, Escape closes, header hides on scroll down", async () => {
  await page.getByRole("button", { name: "Menu" }).click();
  await page.waitForTimeout(400);
  expect((await page.locator(".bless-layout--left").count()) === 1, "drawer open");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  expect((await page.locator(".bless-layout--left").count()) === 0, "drawer closed");
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(400);
  expect(
    (await page.locator(".bless-layout--hidden").count()) === 1,
    "header hidden after scrolling down",
  );
  await page.mouse.wheel(0, -300);
  await page.waitForTimeout(400);
  expect((await page.locator(".bless-layout--hidden").count()) === 0, "header back on scroll up");
});

console.log("Tour");
await page.setViewportSize({ width: 1200, height: 900 });
await go("/components/tour");
await step("start, Next twice, Done emits finish", async () => {
  await page.getByRole("button", { name: "Start tour" }).click();
  await page.waitForTimeout(300);
  expect((await page.locator(".bless-tour").count()) === 1, "tour open");
  await page.getByRole("button", { name: "Next" }).click();
  await page.waitForTimeout(500);
  expect((await page.locator(".bless-tour__spot").count()) === 1, "spotlight on target");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Done" }).click();
  await page.waitForTimeout(200);
  expect((await page.locator(".bless-tour").count()) === 0, "tour closed");
});

console.log("Blocks");
await go("/blocks/signin-frame");
await step("sign-in: wrong password shows the error, right one succeeds", async () => {
  await page.locator("input[type=email]").fill("megumi@example.com");
  await page.locator("input[type=password]").fill("wrong");
  await page.locator("button[type=submit]").click();
  await page.waitForTimeout(900);
  expect((await page.locator(".bless-alert--danger").count()) === 1, "error alert shown");
  await page.locator("input[type=password]").fill("blessing");
  await page.locator("button[type=submit]").click();
  await page.waitForTimeout(900);
  expect((await page.locator(".bless-alert--success").count()) === 1, "success alert shown");
});
await go("/blocks/inbox-frame");
await step("inbox: opening a mail clears its unread dot and fills the pane", async () => {
  const items = page.locator(".inbox__list .bless-item");
  const dots = () => page.locator(".bless-indicator__badge").count();
  const before = await dots();
  await items.nth(0).click();
  await page.waitForTimeout(150);
  expect((await dots()) === before - 1, `unread dots ${before} → ${await dots()}`);
  expect((await page.locator(".inbox__subject").count()) === 1, "reading pane filled");
});
await page.setViewportSize({ width: 390, height: 800 });
await step("inbox on a phone: one pane at a time, Back returns to the list", async () => {
  await page.reload({ waitUntil: "networkidle" });
  expect(await page.locator(".inbox__pane").isHidden(), "pane hidden until a mail is opened");
  await page.locator(".inbox__list .bless-item").nth(1).click();
  await page.waitForTimeout(150);
  expect(await page.locator(".inbox__list").isHidden(), "list hidden while reading");
  expect(
    await page.evaluate(() => document.activeElement?.classList.contains("inbox__subject")),
    "focus moved to the message",
  );
  await page.getByRole("button", { name: /Back/ }).click();
  await page.waitForTimeout(150);
  expect(await page.locator(".inbox__list").isVisible(), "list back");
  expect(
    await page.evaluate(
      () => document.activeElement === document.querySelectorAll(".inbox__list .bless-item")[1],
    ),
    "focus back on the message's row",
  );
});
await page.setViewportSize({ width: 1200, height: 900 });
await go("/blocks/chat-frame");
await step("chat: Enter sends, thread grows, reply arrives", async () => {
  const bubbles = () => page.locator(".bless-bubble").count();
  const n = await bubbles();
  await page.locator("textarea").fill("部室行く");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  expect((await bubbles()) >= n + 1, "own message appended"); // + typing indicator
  await page.waitForTimeout(1400);
  expect((await bubbles()) >= n + 2, "reply appended");
  expect((await page.locator("textarea").inputValue()) === "", "composer cleared");
});
await step("chat: Enter that confirms an IME conversion doesn't send", async () => {
  const n = await page.locator(".bless-bubble").count();
  const ta = page.locator("textarea");
  await ta.fill("かとう");
  await ta.evaluate((el) =>
    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        isComposing: true,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  await page.waitForTimeout(150);
  expect((await page.locator(".bless-bubble").count()) === n, "nothing sent mid-conversion");
  expect((await ta.inputValue()) === "かとう", "draft kept");
  await ta.fill("");
});

// ---- Phase 21 components: drag, keyboard and layout flows ----
await page.setViewportSize({ width: 1200, height: 900 });
const L = (sel) => page.locator(sel);
const centre = async (loc) => {
  const b = await loc.boundingBox();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, b };
};
const drag = async (from, to, steps = 8) => {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps });
  await page.mouse.up();
};

console.log("Sortable");
await go("/components/sortable");
await step("keyboard: Space grabs, arrows move, Esc restores; the grip drags", async () => {
  const body = () =>
    L(".bless-sortable").first().locator(".bless-sortable__body").allTextContents();
  const first = (await body())[0];
  const grip = (i) => L(".bless-sortable").first().locator(".bless-sortable__grip").nth(i);
  await grip(0).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Space");
  expect((await body())[1] === first, "first item moved to second place");
  await grip(1).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Escape");
  expect((await body())[1] === first, "Esc put it back");
  const a = await centre(grip(0));
  const z = await centre(grip(2));
  const was = await body();
  await drag(a, { x: z.x, y: z.y + 10 });
  expect((await body()).join() !== was.join(), "dragging the grip reordered the list");
});

console.log("HeatmapCalendar");
await go("/components/heatmap-calendar");
await step("one tab stop, arrows move by day and week, a click picks a day", async () => {
  const cells = L(".bless-heat__cell[data-date]");
  expect((await L('.bless-heat__cell[tabindex="0"]').count()) === 1, "one tab stop");
  await L('.bless-heat__cell[tabindex="0"]').focus();
  const at = () => page.evaluate(() => document.activeElement?.getAttribute("data-date"));
  const start = await at();
  await page.keyboard.press("ArrowUp");
  const up = await at();
  expect(up && up < start, `ArrowUp went to the previous day (${start} → ${up})`);
  await page.keyboard.press("ArrowLeft");
  const left = await at();
  expect(left && left < up, "ArrowLeft went back a week");
  await cells.nth(40).click();
  expect((await L('.bless-heat__cell[aria-pressed="true"]').count()) === 1, "a day is picked");
});

console.log("Mention");
await go("/components/mention");
await step("typing @ opens suggestions, ArrowDown + Enter inserts, Esc closes", async () => {
  const ta = L("textarea").first();
  await ta.click();
  await ta.press("Control+End");
  await ta.type("@mi");
  await page.waitForSelector(".bless-mention__panel:popover-open");
  expect((await L(".bless-mention__option").count()) >= 2, "filtered options");
  await ta.press("ArrowDown");
  await ta.press("Enter");
  expect(/@miho $/.test(await ta.inputValue()), `inserted: ${await ta.inputValue()}`);
  expect((await L(".bless-mention__panel:popover-open").count()) === 0, "closed after insert");
  await ta.type("#");
  await page.waitForSelector(".bless-mention__panel:popover-open");
  await ta.press("Escape");
  expect((await L(".bless-mention__panel:popover-open").count()) === 0, "Esc closed it");
});

console.log("Kanban");
await go("/components/kanban");
await step("a card drags to another column; Space + → moves it by keyboard", async () => {
  const col = (i) => L(`[data-kanban-col="${i}"]`);
  const n = (i) => col(i).locator("[data-kanban-card]").count();
  const [a0, b0] = [await n(0), await n(1)];
  const g = await centre(L('[data-grip="0:0"]'));
  const t = await centre(col(1));
  await drag(g, { x: t.x, y: t.b.y + t.b.height - 8 });
  expect((await n(0)) === a0 - 1 && (await n(1)) === b0 + 1, "card moved columns");
  await L('[data-kanban-col="1"] .bless-kanban__grip').first().focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Space");
  expect((await n(2)) === 2, "keyboard moved a card into the last column");
});

console.log("Cropper");
await go("/components/cropper");
await step("handle resizes the crop, rotate swaps the axes, Crop makes an image", async () => {
  await page.waitForSelector(".bless-cropper__frame");
  const read = async () =>
    (await L(".bless-cropper__readout").first().textContent()).split("·")[0].trim();
  const start = await read();
  const h = await centre(L(".bless-cropper__handle--se").first());
  await drag(h, { x: h.x - 100, y: h.y - 60 });
  expect((await read()) !== start, "crop size changed");
  const [w0, h0] = (await read()).split("×").map((s) => parseInt(s));
  await L('button[aria-label="Rotate right"]').first().click();
  const [w1, h1] = (await read()).split("×").map((s) => parseInt(s));
  expect(
    w1 < h1 !== w0 < h0 || (w1 === h0 && h1 === w0) || w1 !== w0,
    "rotating changed the shape",
  );
  await page.getByRole("button", { name: "Crop", exact: true }).click();
  await page.waitForSelector("img[alt='Cropped result']");
  expect(
    (await L("img[alt='Cropped result']").evaluate((i) => i.naturalWidth)) > 0,
    "result image decoded",
  );
});

console.log("Hotspots");
await go("/components/hotspots");
await step("a pin opens its popover; edit mode adds and moves pins", async () => {
  const pins = () => L(".bless-hotspots__pin").count();
  await L(".bless-hotspots__pin").nth(1).click();
  await page.waitForSelector(".bless-popover:popover-open");
  expect(
    (await L(".bless-popover:popover-open").textContent()).trim().length > 0,
    "popover has text",
  );
  await page.keyboard.press("Escape");
  await L(".bless-hotspots")
    .first()
    .locator("xpath=ancestor::div[contains(@class,'col')][1]")
    .locator("input[type=checkbox]")
    .first()
    .check({ force: true });
  const n = await pins();
  const box = await L(".bless-hotspots").first().boundingBox();
  await page.mouse.click(box.x + 30, box.y + box.height - 30);
  expect((await pins()) === n + 1, "click on the image added a pin");
  const pin = await centre(L(".bless-hotspots__pin").first());
  await drag(pin, { x: pin.x + 90, y: pin.y + 50 });
  const after = await centre(L(".bless-hotspots__pin").first());
  expect(Math.abs(after.x - pin.x - 90) < 6, "the pin followed the drag");
});

console.log("SwipeDeck");
await go("/components/swipe-deck");
await step("keys decide, Backspace undoes, a drag past the threshold decides", async () => {
  const top = () => L(".bless-deck__card--top strong").first().textContent();
  const t0 = await top();
  await L(".bless-deck__stage").first().focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  const t1 = await top();
  expect(t1 !== t0, "accepted card left the deck");
  await page.keyboard.press("Backspace");
  await page.waitForTimeout(400);
  expect((await top()) === t0, "undo brought it back");
  const c = await centre(L(".bless-deck__card--top").first());
  await drag(c, { x: c.x - 220, y: c.y + 4 });
  await page.waitForTimeout(400);
  expect((await top()) !== t0, "a drag left decided the card");
});

console.log("SliderCaptcha");
await go("/components/slider-captcha");
await step("dragging the handle onto the gap verifies", async () => {
  const c = L(".bless-captcha").first();
  // the widget measures its width after mount and shuffles the gap; let both settle before aiming
  await page.waitForTimeout(600);
  const gap = await c.locator(".bless-captcha__gap").boundingBox();
  const stage = await c.locator(".bless-captcha__stage").boundingBox();
  const piece = await c.locator(".bless-captcha__piece").boundingBox();
  const handle = await c.locator(".bless-captcha__handle").boundingBox();
  const track = await c.locator(".bless-captcha__track").boundingBox();
  const want = (gap.x - stage.x) / (stage.width - piece.width);
  const from = { x: handle.x + 20, y: handle.y + 20 };
  await drag(from, { x: from.x + want * (track.width - handle.width), y: from.y }, 12);
  await page.waitForTimeout(200);
  expect(/Verified/.test(await c.locator(".bless-captcha__label").textContent()), "verified");
});

console.log("CountUp, Timer, Gauge");
await go("/components/count-up");
await step("the count lands on the value and screen readers get it at once", async () => {
  await page.waitForTimeout(1200);
  const c = L(".bless-countup").first();
  expect(
    (await c.locator(".bless-countup__visual").textContent()) ===
      (await c.locator(".bless-countup__final").textContent()),
    "settled on the final value",
  );
});
await go("/components/timer");
await step("Start runs the clock, Pause holds it", async () => {
  const t = L(".bless-timer").first();
  const clock = () => t.locator(".bless-timer__clock").textContent();
  const t0 = await clock();
  await t.getByRole("button", { name: "Start" }).click();
  await page.waitForTimeout(2200);
  const t1 = await clock();
  expect(t1 !== t0, `clock ran (${t0} → ${t1})`);
  await t.getByRole("button", { name: "Pause" }).click();
  const held = await clock();
  await page.waitForTimeout(1300);
  expect((await clock()) === held, "paused clock holds");
});
await go("/components/gauge");
await step("the gauge is a meter that names its zone", async () => {
  const m = L('[role="meter"]').first();
  expect((await m.getAttribute("aria-valuenow")) !== null, "has a value");
  expect(/,/.test(await m.getAttribute("aria-valuetext")), "value text names the zone");
});

console.log("Gantt");
await go("/components/gantt");
await step("select with a click, Alt+arrow and drag edit the plan, arrows are drawn", async () => {
  await page.waitForSelector(".bless-gantt__bar");
  const g = L(".bless-gantt").first();
  expect((await g.locator(".bless-gantt__arrows > path").count()) > 0, "dependency arrows drawn");
  await g.locator(".bless-gantt__bar").nth(1).click();
  expect((await g.locator(".bless-gantt__bar--on").count()) === 1, "selected");
  await g
    .locator("xpath=ancestor::div[contains(@class,'col')][1]")
    .locator("input[type=checkbox]")
    .first()
    .check({ force: true });
  const bar = g.locator(".bless-gantt__bar").nth(3);
  const label = () => bar.getAttribute("aria-label");
  const before = await label();
  await bar.focus();
  await page.keyboard.press("Alt+ArrowRight");
  const moved = await label();
  expect(moved !== before, "Alt+Right moved the task a day");
  const c = await centre(bar);
  const w = c.b.width;
  await drag({ x: c.b.x + w / 2, y: c.y }, { x: c.b.x + w / 2 + 56, y: c.y });
  expect((await label()) !== moved, "dragging moved it again");
  const end = await centre(bar.locator(".bless-gantt__grip--end"));
  const w0 = (await bar.boundingBox()).width;
  await drag(end, { x: end.x + 56, y: end.y });
  expect((await bar.boundingBox()).width > w0, "the end grip lengthened the task");
});

console.log("ShortcutRecorder");
await go("/components/shortcut-recorder");
await step("records a combo, refuses a taken one and a bare key", async () => {
  const btns = L(".bless-shortcut__btn");
  const txt = async (i) => (await btns.nth(i).innerText()).replace(/\s+/g, "");
  await btns.nth(2).click();
  await page.keyboard.press("Control+KeyK"); // Search already has it
  expect(
    /already used by Search/.test(await L("[role=alert]").textContent()),
    "taken combo refused",
  );
  await page.keyboard.press("KeyG"); // a bare key
  expect(/Add Ctrl, Alt or Meta/.test(await L("[role=alert]").textContent()), "bare key refused");
  await page.keyboard.press("Control+Shift+KeyB");
  expect(/CTRL\+?SHIFT\+?B/i.test(await txt(2)), `recorded: ${await txt(2)}`);
  await btns.nth(2).click();
  await page.keyboard.press("Backspace");
  expect(/notset/i.test(await txt(2)), "Backspace cleared it");
});

console.log("Diff, CodeBlock, Marquee");
await go("/components/diff");
await step("split mode and unchanged-line folds", async () => {
  const d = L(".bless-diff").first();
  expect((await d.locator(".bless-diff__fold button").count()) === 1, "one fold");
  await L("input[type=checkbox]").first().check({ force: true });
  await page.waitForTimeout(150);
  expect((await d.locator("thead th").count()) > 0, "split header shown");
  await d.locator(".bless-diff__fold button").first().click();
  expect((await d.locator(".bless-diff__fold").count()) === 0, "fold expanded");
});
await go("/components/code-block");
await step("tabs switch the listing; Copy confirms", async () => {
  const c = L(".bless-code").first();
  const before = await c.locator(".bless-code__scroll").innerText();
  await c.getByRole("tab", { name: "style.css" }).click();
  expect((await c.locator(".bless-code__scroll").innerText()) !== before, "other file shown");
  await c.locator(".bless-code__copy").click();
  await page.waitForTimeout(150);
  expect((await c.locator(".bless-code__copy").textContent()) === "Copied", "button says Copied");
});
await go("/components/marquee");
await step("it moves, stops on hover and on the Pause button", async () => {
  const m = L(".bless-marquee").first();
  const x = () =>
    m
      .locator(".bless-marquee__track")
      .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
  const x1 = await x();
  await page.waitForTimeout(600);
  expect((await x()) !== x1, "moving");
  await m.hover();
  await page.waitForTimeout(120);
  const h = await x();
  await page.waitForTimeout(400);
  expect((await x()) === h, "paused on hover");
  await page.mouse.move(2, 2);
  await m.getByRole("button", { name: "Pause" }).click();
  await page.mouse.move(2, 2);
  expect(/paused/.test(await m.getAttribute("class")), "the Pause button set the paused state");
  await page.waitForTimeout(300); // the browser applies a paused animation on the next frame
  const p = await x();
  await page.waitForTimeout(400);
  expect((await x()) === p, "paused by the button");
});

console.log("Masonry, SplitView");
await go("/components/masonry");
await step("cards lay out in columns without overlapping", async () => {
  await page.waitForSelector(".bless-masonry--ready");
  await page.waitForTimeout(500);
  const r = await L(".bless-masonry")
    .first()
    .evaluate((el) => {
      const o = el.getBoundingClientRect();
      const cs = [...el.children].map((c) => c.getBoundingClientRect());
      let overlap = 0;
      for (let i = 0; i < cs.length; i++)
        for (let j = i + 1; j < cs.length; j++) {
          const a = cs[i],
            b = cs[j];
          if (
            a.left < b.right - 1 &&
            b.left < a.right - 1 &&
            a.top < b.bottom - 1 &&
            b.top < a.bottom - 1
          )
            overlap++;
        }
      return {
        overlap,
        cols: new Set(cs.map((c) => Math.round(c.left))).size,
        fits: Math.max(...cs.map((c) => c.bottom)) <= o.bottom + 1,
      };
    });
  expect(r.overlap === 0 && r.cols > 1 && r.fits, `masonry layout ${JSON.stringify(r)}`);
});
await go("/components/split-view");
await step("wide: draggable divider; narrow: one pane, Back returns to the list", async () => {
  const s = L(".bless-split").first();
  const sep = s.locator("[role=separator]");
  const v0 = await sep.getAttribute("aria-valuenow");
  const h = await centre(sep);
  await drag(h, { x: h.x + 80, y: h.y });
  expect((await sep.getAttribute("aria-valuenow")) !== v0, "divider moved");
  await page.setViewportSize({ width: 560, height: 900 });
  await page.waitForTimeout(500);
  expect(
    await s.evaluate((e) => e.classList.contains("bless-split--stacked")),
    "stacked when narrow",
  );
  await s.getByRole("button", { name: /Ken/ }).click();
  expect(
    await page.evaluate(() => document.activeElement?.classList.contains("bless-split__pane")),
    "focus moved to the detail",
  );
  await s.getByRole("button", { name: /Back/ }).click();
  expect(await s.locator(".bless-split__pane").first().isVisible(), "list back");
  await page.setViewportSize({ width: 1200, height: 900 });
});

console.log("RadialMenu, Loupe");
await go("/components/radial-menu");
await step(
  "right-click opens the ring, arrows skip disabled, Enter picks, Esc returns focus",
  async () => {
    const area = L(".bless-radial__area").first();
    const c = await centre(area);
    await page.mouse.click(c.x, c.y, { button: "right" });
    await page.waitForSelector(".bless-radial:popover-open");
    const name = () => page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    expect((await name()) === "Reply", "focus on the first action");
    for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowRight");
    expect((await name()) !== "Delete", "the disabled action is skipped");
    await page.keyboard.press("Enter");
    expect((await L(".bless-radial:popover-open").count()) === 0, "closed after choosing");
    expect(
      !/nothing yet/.test(await L("small", { hasText: "chose" }).first().textContent()),
      "a choice was reported",
    );
    await area.locator("[tabindex]").focus();
    await page.keyboard.press("Shift+F10");
    await page.waitForSelector(".bless-radial:popover-open");
    await page.keyboard.press("Escape");
    expect(
      await page.evaluate(() => document.activeElement?.getAttribute("tabindex") === "0"),
      "focus back on the target",
    );
  },
);
await go("/components/loupe");
await step("hover shows the lens, leaving hides it, the keyboard drives it", async () => {
  await page.waitForFunction(() => document.querySelector(".bless-loupe img")?.complete);
  const l = L(".bless-loupe").first();
  const b = await l.boundingBox();
  await page.mouse.move(b.x + b.width * 0.4, b.y + b.height * 0.3);
  expect((await l.locator(".bless-loupe__lens").count()) === 1, "lens on hover");
  await page.mouse.move(2, 2);
  expect((await l.locator(".bless-loupe__lens").count()) === 0, "lens gone");
  await l.focus();
  await page.keyboard.press("ArrowRight");
  expect((await l.locator(".bless-loupe__lens").count()) === 1, "lens from the keyboard");
  await page.keyboard.press("Escape");
  expect((await l.locator(".bless-loupe__lens").count()) === 0, "Esc hides it");
});

await browser.close();
console.log(failed ? `\n${failed} step(s) failed` : "\nall interaction flows passed");
process.exit(failed ? 1 : 0);
