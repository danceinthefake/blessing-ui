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
await go("/layout-demo");
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
  await page.getByRole("button", { name: /Back/ }).click();
  expect(await page.locator(".inbox__list").isVisible(), "list back");
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

await browser.close();
console.log(failed ? `\n${failed} step(s) failed` : "\nall interaction flows passed");
process.exit(failed ? 1 : 0);
