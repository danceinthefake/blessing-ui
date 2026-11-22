// Blocks on the built docs: every block frame renders clean on desktop and phone, light and dark,
// and the main flow of each block with a data layer works.
// Usage: node e2e/blocks.mjs [chromium|firefox|webkit] [baseUrl]
import { chromium, firefox, webkit } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const name = process.argv[2] ?? "chromium";
const engine = { chromium, firefox, webkit }[name];
const base = (process.argv[3] ?? "http://localhost:4173") + "/blocks/";
const blocks = JSON.parse(readFileSync("docs/.vitepress/blocks.json", "utf8"));
const axeSrc = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const browser = await engine.launch();
let failed = 0;
const step = async (label, fn) => {
  try {
    await fn();
    console.log(`  ✓ ${label}`);
  } catch (e) {
    failed++;
    console.log(`  ✗ ${label}\n    ${e.message.split("\n")[0]}`);
  }
};
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

// 1. every block: no errors, no sideways scroll; axe in Chromium (same rules as e2e/axe.mjs)
console.log(`Render (${blocks.length} blocks)`);
for (const { slug } of blocks)
  await step(slug, async () => {
    for (const [w, h] of [
      [1280, 800],
      [390, 800],
    ])
      for (const colorScheme of ["light", "dark"]) {
        const p = await browser.newPage({ viewport: { width: w, height: h }, colorScheme });
        // the docs open light on a first visit; "auto" makes them follow the emulated color scheme
        await p.addInitScript(() => localStorage.setItem("vitepress-theme-appearance", "auto"));
        const errs = [];
        p.on("pageerror", (e) => errs.push(e.message));
        p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
        await p.goto(`${base}${slug}-frame`, { waitUntil: "networkidle" });
        await p.waitForTimeout(800);
        const wide = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        let bad = [];
        if (name === "chromium") {
          // the pointer rests at 0,0 and would hover, and so fade, whatever sits there
          await p.mouse.move(w - 1, h - 1);
          await p.waitForTimeout(500);
          await p.addScriptTag({ content: axeSrc });
          bad = await p.evaluate(async () =>
            (await axe.run(document, { resultTypes: ["violations"] })).violations
              .filter(
                (v) => ["serious", "critical"].includes(v.impact) && v.id !== "color-contrast",
              )
              .map((v) => `${v.id}: ${v.nodes[0]?.target.join(" ")}`),
          );
        }
        await p.close();
        const at = `${w}px ${colorScheme}`;
        expect(!errs.length, `${at}: ${errs[0]}`);
        expect(wide <= 0, `${at}: page scrolls sideways by ${wide}px`);
        expect(!bad.length, `${at}: ${bad[0]}`);
      }
  });

// 2. flows
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("pageerror", (e) => {
  console.log("  pageerror:", e.message);
  failed++;
});
const go = (slug) => page.goto(`${base}${slug}-frame`, { waitUntil: "networkidle" });
const text = (sel) => page.locator(sel).first().textContent();

console.log("Community");
await step("a post goes to the top of the feed", async () => {
  await go("community");
  await page.locator(".bless-post textarea").fill("Hello from the block test");
  await page.getByRole("button", { name: /^post$/i }).click();
  expect(
    (await text(".community__posts > li")).includes("Hello from the block test"),
    "not on top",
  );
});
await step("a vote counts", async () => {
  const poll = page.locator(".bless-poll").first();
  await poll.getByText("A: the hill at sunset").click();
  await poll.getByRole("button", { name: /vote/i }).click();
  expect(/49/.test(await poll.textContent()), "the count did not go up");
});

console.log("Project");
await step("the timeline tab and Share work", async () => {
  await go("project");
  await page.getByRole("tab", { name: "Timeline" }).click();
  expect(await page.locator(".bless-gantt").isVisible(), "no timeline");
  await page.getByRole("button", { name: "Share" }).click();
  expect(await page.locator("dialog[open] .bless-access").isVisible(), "no share dialog");
  await page.keyboard.press("Escape");
});

console.log("Bank");
await step("a transfer checks the amount and the PIN", async () => {
  await go("bank");
  const rows = await page.locator(".bless-txns__list > li").count();
  const sheet = page.locator(".bless-sheet");
  await page.getByRole("button", { name: "Transfer" }).click();
  await page.getByPlaceholder("Name or account number").fill("Megumi Kato");
  const amount = sheet.locator("input").nth(1);
  await amount.fill("999999999");
  await amount.press("Tab");
  await page.getByRole("button", { name: "Next" }).click();
  expect(/more than the balance/.test(await sheet.textContent()), "too much money went on");
  await amount.fill("250000");
  await amount.press("Tab");
  await page.getByRole("button", { name: "Next" }).click();
  const pad = page.locator(".bless-pinpad");
  for (const d of "1111") await pad.getByRole("button", { name: d, exact: true }).click();
  await page.waitForTimeout(300);
  expect(/Wrong PIN/.test(await sheet.textContent()), "a wrong PIN went on");
  await page.waitForTimeout(700);
  for (const d of "1984") await pad.getByRole("button", { name: d, exact: true }).click();
  await page.waitForTimeout(500);
  expect((await page.locator(".bless-txns__list > li").count()) === rows + 1, "no new row");
  expect(
    (await text(".bless-balance__amount")).includes("18.200.000"),
    "the balance did not change",
  );
});

console.log("Course");
await step("a full score passes and opens the next lesson", async () => {
  await go("course");
  const quiz = page.locator(".bless-quiz");
  const answer = async (choice) => {
    await quiz.getByText(choice).click();
    await quiz.getByRole("button", { name: /check/i }).click();
    await quiz.getByRole("button", { name: /next question|see the score/i }).click();
  };
  await answer("A big hair ribbon");
  await answer("The whole circle");
  expect(/Not yet/.test(await text(".pane")), "a wrong answer passed");
  await quiz.getByRole("button", { name: /start again/i }).click();
  await answer("A want that the player did not expect");
  await answer("The whole circle");
  expect(/Lesson done/.test(await text(".pane")), "a full score did not pass");
  await page.getByRole("button", { name: "Branch the routes" }).last().click();
  await page.waitForTimeout(200);
  expect(
    (await text(".pane__title")).includes("Branch the routes"),
    "the next lesson did not open",
  );
  expect(
    await page.evaluate(() => document.activeElement?.classList.contains("pane__title")),
    "focus did not move to the lesson title",
  );
});

console.log("Health");
await step("reschedule, cancel, and undo a visit", async () => {
  await go("health");
  await page.getByRole("button", { name: /reschedule/i }).click();
  await page.locator(".bless-sheet").getByText(/2:30/).click();
  await page.getByRole("button", { name: "Move the visit" }).click();
  await page.waitForTimeout(300);
  expect(/14:30–15:00/.test(await text(".health")), "the visit did not move");
  await page
    .getByRole("button", { name: /cancel/i })
    .first()
    .click();
  expect(/No visit booked/.test(await text(".health")), "cancel did not remove it");
  await page.getByRole("button", { name: "Undo" }).click();
  expect(/Wrist check/.test(await text(".health")), "undo did not bring it back");
});

console.log("Trip");
await step("a picked city replaces the page", async () => {
  await go("trip");
  await page.getByRole("combobox").fill("kyo");
  await page.waitForTimeout(600);
  await page.getByRole("option", { name: /Kyoto/ }).click();
  await page.waitForTimeout(200);
  expect((await text(".trip__city")).includes("Kyoto"), "the city did not change");
});

console.log("Help center");
await step("search, open an article, and go back", async () => {
  await go("help");
  await page.getByRole("searchbox", { name: "Search the help center" }).fill("saves");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("link", { name: "Move your saves to a new computer" }).click();
  await page.waitForTimeout(300);
  expect(page.url().endsWith("#help-saves"), "the article has no link of its own");
  expect(
    await page.evaluate(() => /Move your saves/.test(document.activeElement?.textContent ?? "")),
    "focus did not move to the article title",
  );
  await page.getByRole("link", { name: "← Back" }).click();
  await page.waitForTimeout(300);
  expect(!page.url().includes("#help-"), "Back did not leave the article");
});

console.log("Smart home");
await step("a scene and a device switch stay in step", async () => {
  await go("home");
  const away = page.getByRole("button", { name: /Away/ });
  await away.click();
  const lamp = page.getByRole("switch", { name: "Power, Desk lamp" });
  expect(!(await lamp.isChecked()), "the scene did not turn the lamp off");
  expect((await away.getAttribute("aria-pressed")) === "true", "the scene is not chosen");
  await lamp.click({ force: true }); // the visible track sits over the input
  expect((await away.getAttribute("aria-pressed")) === "false", "the scene stayed chosen");
});

console.log("Station");
await step("a unit goes through the steps and the check", async () => {
  await go("station");
  const work = page.locator(".station__work");
  for (let i = 0; i < 3; i++) await work.getByRole("button", { name: "Next step" }).click();
  await work.getByRole("button", { name: "Finish" }).click();
  expect(
    await page.evaluate(() => document.activeElement?.id === "station-check"),
    "focus did not move to the check",
  );
  await page.locator(".bless-quality input[type=number]").fill("650");
  await page.locator(".bless-quality input[type=number]").press("Tab");
  for (const r of await page.locator(".bless-quality").getByLabel(/Pass/).all())
    await r.check({ force: true });
  await page.getByRole("button", { name: "Save the check" }).click();
  await page.waitForTimeout(300);
  expect(/118/.test(await text(".station__order")), "the good unit did not count");
});
await step("pause stops the line with a reason", async () => {
  await page.getByRole("button", { name: /pause/i }).click();
  await page.locator(".bless-sheet").getByText("Sealer jam").click();
  await page.locator(".bless-sheet").getByRole("button", { name: /save/i }).click();
  await page.waitForTimeout(300);
  expect(/line is stopped/.test(await text(".station__work")), "the line did not stop");
});

console.log("Dashboard");
await step("a new period loads again", async () => {
  await go("dashboard");
  await page.waitForTimeout(600);
  const before = await text(".dash__stats");
  await page.getByRole("button", { name: "7 days" }).click();
  expect(
    (await page.locator(".dash__stats").getAttribute("aria-busy")) === "true",
    "no loading state",
  );
  await page.waitForTimeout(700);
  expect((await text(".dash__stats")) !== before, "the stats did not change");
});

console.log("Chat");
await step("the answer comes after a typing indicator", async () => {
  await go("chat");
  await page.locator("textarea").fill("テスト");
  await page.locator("textarea").press("Enter");
  await page.waitForTimeout(200);
  expect(/typing/.test(await text("body")), "no typing indicator");
  await page.waitForTimeout(1500);
  expect(/了解。/.test(await text("body")), "no answer");
});

console.log("Settings");
await step("the profile loads, and save waits for the api", async () => {
  await go("settings");
  await page.waitForTimeout(300);
  const field = page.getByLabel(/^Name/).first();
  expect((await field.inputValue()) === "加藤 恵", "the profile did not load");
  await field.fill("加藤 恵 (edited)");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForTimeout(800);
  expect(/Settings saved/.test(await text("body")), "no toast after save");
});

console.log("Onboarding");
await step("finish makes the workspace", async () => {
  await go("onboarding");
  await page.getByLabel(/name/i).first().fill("Blessing Software");
  for (let i = 0; i < 3; i++) {
    await page
      .getByRole("button", { name: /next|finish/i })
      .last()
      .click();
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(900);
  expect(/You're set, Blessing Software/.test(await text("body")), "no done screen");
});

console.log("Inbox");
await step("an empty inbox says so", async () => {
  await go("inbox");
  for (let i = 0; i < 5; i++) {
    await page.locator(".inbox__list li > *").first().click();
    await page.getByRole("button", { name: "Archive" }).click();
    await page.waitForTimeout(150);
  }
  expect(/Inbox zero/.test(await text(".inbox")), "no empty state");
});

console.log("Site header");
await step("on a phone, the menu button opens the links in a sheet", async () => {
  await page.setViewportSize({ width: 390, height: 800 });
  await go("header");
  expect(!(await page.locator(".site-header__nav").isVisible()), "nav still in the bar");
  await page.getByRole("button", { name: "Menu" }).click();
  const sheet = page.locator("dialog[open]");
  expect(await sheet.getByRole("link", { name: "Pricing" }).isVisible(), "no links in the sheet");
  await sheet.getByRole("link", { name: "Pricing" }).click();
  expect(!(await sheet.count()), "a link did not close the sheet");
  await page.setViewportSize({ width: 1280, height: 900 });
});

console.log("Site footer");
await step("the newsletter says why it refused, then takes a new address", async () => {
  await go("footer");
  const field = page.getByRole("textbox", { name: /email/i });
  await field.fill("fan@example.com");
  await page.getByRole("button", { name: /subscribe/i }).click();
  await page.waitForTimeout(900);
  expect(/already on the list/.test(await text(".site-footer")), "no reason shown");
  await field.fill("fan@blessing.test");
  await page.getByRole("button", { name: /subscribe/i }).click();
  await page.waitForTimeout(900);
  expect(await page.locator(".bless-newsletter__done").isVisible(), "no done message");
});

await browser.close();
console.log(failed ? `\n${failed} block check(s) failed` : "\nall block checks passed");
process.exit(failed ? 1 : 0);
