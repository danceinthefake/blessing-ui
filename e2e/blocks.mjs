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

await step("reply to all leaves the reader out and names each person once", async () => {
  await go("inbox");
  await page.locator(".inbox__list li > *").first().click();
  await page.getByRole("button", { name: "Reply to all" }).click();
  const dlg = page.locator("dialog[open]");
  const people = await dlg.textContent();
  expect(
    /megumi@/.test(people) && /eriri@/.test(people) && /utaha@/.test(people),
    "a person is missing",
  );
  expect(!/tomoya@/.test(people), "the reader is on the reply");
  expect(
    (await dlg.getByLabel("Subject").inputValue()) === "Re: 明日の打ち合わせ",
    "no Re: subject",
  );
  await dlg.getByRole("button", { name: "Send" }).click();
  await page.waitForTimeout(800);
  expect(/Sent to megumi@blessing.example/.test(await page.content()), "no sent toast");
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

console.log("Checkout");
await step(
  "each step says what is missing, a declined card says so, then the order goes through",
  async () => {
    await go("checkout");
    const alert = () => text(".checkout__problem");
    await page.getByRole("button", { name: "Continue" }).click();
    expect(/street, the city and the postal code/.test(await alert()), "no address problem");
    await page.getByLabel("Street and number").fill("Jl. Braga 12");
    await page.getByLabel("City").fill("Bandung");
    await page.getByLabel("Postal code").fill("40111");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    expect(/delivery time/.test(await alert()), "no delivery problem");
    await page.locator(".bless-delivery__window:not(.is-full)").first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Discount code").fill("BLESS10");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.waitForTimeout(700);
    expect(/BLESS10/.test(await text(".bless-ordersum")), "the discount is not in the summary");
    const card = page.getByLabel("Card number");
    await card.fill("4000 0000 0000 0002");
    await page.getByLabel("Expiry date").fill("12/29");
    await page.getByLabel("Security code").fill("123");
    await page.getByRole("button", { name: /^Pay/ }).click();
    await page.waitForTimeout(1000);
    expect(/declined/.test(await alert()), "no decline");
    await card.fill("4242 4242 4242 4242");
    await page.getByRole("button", { name: /^Pay/ }).click();
    await page.waitForTimeout(1000);
    expect(/Order BL-\d{6} is placed/.test(await text(".checkout")), "no thanks");
  },
);

console.log("Product page");
await step(
  "a sold-out size cannot be picked, a missing size is named, then the item goes in the cart",
  async () => {
    await go("product");
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    expect(/Choose a size/.test(await text(".product__buy")), "no size problem");
    expect(await page.getByRole("radio", { name: /^M/ }).isDisabled(), "Ink M is not sold out");
    await page.getByRole("radio", { name: /^L/ }).check({ force: true });
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await page.waitForTimeout(800);
    expect(/Added to cart/.test(await text("body")), "no toast");
    await page.getByRole("tab", { name: "Reviews" }).click();
    expect((await page.locator(".product__review-list > li").count()) === 4, "not four reviews");
  },
);

console.log("Booking");
await step(
  "a day and a time come first, a taken time sends you back, then the visit is booked",
  async () => {
    await go("booking");
    await page.getByRole("button", { name: "Continue" }).click();
    expect(/Pick a day/.test(await text(".booking__problem")), "no day problem");
    await page.getByRole("gridcell", { name: /24 November/ }).click();
    await page.waitForTimeout(500);
    await page.locator(".bless-slots label", { hasText: /16[.:]00/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Name").fill("Budi");
    await page.getByLabel("Email").fill("budi@blessing.test");
    await page.getByRole("button", { name: "Book" }).click();
    await page.waitForTimeout(900);
    expect(/Someone booked 16:00/.test(await text(".booking__problem")), "no taken-time problem");
    await page.locator(".bless-slots label", { hasText: /10[.:]00/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Book" }).click();
    await page.waitForTimeout(900);
    expect(/You are booked/.test(await text(".booking")), "no confirmation");
  },
);

console.log("Profile");
await step("Follow shows at once, and an unfollow that fails offline is undone", async () => {
  await go("profile");
  await page.getByRole("button", { name: /^Follow/ }).click();
  await page.waitForTimeout(600);
  expect(await page.getByRole("button", { name: /^Following/ }).isVisible(), "not following");
  await page.context().setOffline(true);
  await page.getByRole("button", { name: /^Following/ }).click();
  await page.waitForTimeout(700);
  await page.context().setOffline(false);
  expect(/Could not unfollow/.test(await text(".profile__main")), "no error");
  expect(
    await page.getByRole("button", { name: /^Following/ }).isVisible(),
    "the unfollow was not undone",
  );
  await page.getByRole("tab", { name: "Activity" }).click();
  expect(/posted/.test(await text(".profile__main")), "no activity");
});

console.log("File manager");
await step("open a folder, rename with a clash, delete, search, and upload", async () => {
  await go("files");
  await page.getByRole("button", { name: /^Covers/ }).click();
  await page.getByRole("button", { name: /^spring-cover\.png/ }).click();
  await page.getByRole("button", { name: "Rename" }).click();
  await page.getByLabel("Name", { exact: true }).fill("summer-cover.png");
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(300);
  expect(/already has an item named/.test(await text("dialog[open]")), "no clash");
  await page.getByLabel("Name", { exact: true }).fill("cover-1.png");
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(400);
  expect(/cover-1\.png/.test(await text(".files__details")), "not renamed");
  await page.getByRole("button", { name: "Delete" }).click();
  await page.locator("dialog[open]").getByRole("button", { name: "Delete" }).click();
  await page.waitForTimeout(600);
  expect(!/cover-1\.png/.test(await text(".files__main")), "not deleted");
  await page.getByRole("button", { name: "My files" }).click();
  await page.getByLabel("Search in this folder").fill("brief");
  expect(/1 item/.test(await text(".bless-files__count")), "search did not filter");
  await page.getByLabel("Search in this folder").fill("");
  await page.getByRole("button", { name: "Upload" }).click();
  await page
    .locator("dialog[open] input[type=file]")
    .setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
  await page.waitForTimeout(1200);
  await page.keyboard.press("Escape");
  expect(/notes\.txt/.test(await text(".files__main")), "no uploaded file");
});

console.log("Billing");
await step(
  "a too-small plan says what to remove, a bigger plan saves, the overdue invoice is paid, and a cancel is undone",
  async () => {
    await go("billing");
    await page.getByRole("button", { name: "Change plan" }).click();
    await page.locator("dialog[open] label", { hasText: "Starter" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForTimeout(300);
    expect(/Remove 4 of 7 seats/.test(await text("dialog[open]")), "no too-small problem");
    await page.locator("dialog[open] label", { hasText: "Business" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForTimeout(700);
    expect(/Business/.test(await text(".billing__cards")), "the plan did not change");
    await page.getByRole("button", { name: /^Pay INV-2026-011/ }).click();
    await page.getByRole("button", { name: /^Pay Rp/ }).click();
    await page.waitForTimeout(1100);
    expect(!/overdue/i.test(await text(".billing")), "the invoice is still overdue");
    await page.getByRole("button", { name: "Cancel plan" }).click();
    await page.locator("dialog[open]").getByRole("button", { name: "Cancel plan" }).click();
    await page.waitForTimeout(700);
    expect(/Ends on/.test(await text(".billing__cards")), "no end date");
    await page.getByRole("button", { name: "Keep the plan" }).click();
    await page.waitForTimeout(700);
    expect(/Renews on/.test(await text(".billing__cards")), "the cancel was not undone");
  },
);

console.log("Search results");
await step("a popular search, a filter, a misspelling, and the next page", async () => {
  await go("search");
  await page.getByRole("button", { name: "invoice" }).click();
  await page.waitForTimeout(600);
  expect(/results for “invoice”/.test(await text(".search")), "no results");
  await page.getByLabel("Search the help center").fill("plan");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.waitForTimeout(600);
  expect(/of 4 results/.test(await text(".search")), "not four plan results");
  await page.locator(".bless-facets label", { hasText: "PDF" }).click();
  await page.waitForTimeout(600);
  expect(/of 1 results|1 of 1/.test(await text(".search")), "the filter did not narrow");
  await page.getByLabel("Search the help center").fill("invoce");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: "invoice", exact: true }).click();
  await page.waitForTimeout(600);
  expect(/results for “invoice”/.test(await text(".search")), "the better spelling did not run");
  await page.getByLabel("Search the help center").fill("the");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: "Next" }).click();
  await page.waitForTimeout(600);
  expect(/6–10 of/.test(await text(".search")), "not the second page");
});

console.log("Orders");
await step("open an order by its link, cancel one, buy again, and return items", async () => {
  await go("orders");
  await page.getByRole("link", { name: /View order #10442/ }).click();
  await page.getByRole("button", { name: "Cancel order" }).click();
  await page.locator("dialog[open]").getByRole("button", { name: "Cancel order" }).last().click();
  await page.waitForTimeout(800);
  expect(/is cancelled/.test(await text(".orders")), "not cancelled");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: /Buy again #10431/ }).click();
  await page.waitForTimeout(600);
  expect(/4 items are in your cart/.test(await text("body")), "no cart toast");
  await page.getByRole("link", { name: /View order #10398/ }).click();
  expect(/until 10 December 2026/.test(await text(".orders__sheet")), "no return window");
  await page.getByRole("button", { name: "Return items" }).click();
  await page.getByRole("checkbox", { name: "Hand grinder" }).check();
  await page.getByLabel("Reason").selectOption({ index: 1 });
  await page.getByRole("button", { name: "Request the return" }).click();
  await page.waitForTimeout(900);
  expect(/Return R-\d+/.test(await text(".orders__sheet")), "no return number");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await page.getByRole("link", { name: /View order #10215/ }).click();
  expect(/Returns closed on 4 October 2026/.test(await text(".orders__sheet")), "no closed window");
});

console.log("Assistant");
await step(
  "a reply streams with its plan and sources, a stopped reply says so, and a retry finishes it",
  async () => {
    await go("assistant");
    await page.getByRole("button", { name: "My parcel is late. What now?" }).click();
    await page.waitForTimeout(2500);
    const reply = page.locator(".assistant__reply").last();
    expect(/3 of 3 steps done/.test(await reply.textContent()), "the plan did not finish");
    expect(/Late shipments/.test(await reply.textContent()), "no sources");
    await page.getByRole("button", { name: "Model: Steady" }).click();
    await page.getByRole("option", { name: /Deep/ }).click();
    await page.getByLabel("Message").fill("Can I return a gift?");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(900);
    await page.getByRole("button", { name: "Stop" }).click();
    await page.waitForTimeout(300);
    const last = page.locator(".assistant__reply").last();
    expect(/You stopped this reply/.test(await last.textContent()), "no stopped note");
    expect(/Thought for 2 s/.test(await last.textContent()), "no reasoning");
    await last.getByRole("button", { name: "Try again" }).click();
    await page.waitForTimeout(3500);
    expect(
      !/You stopped this reply/.test(await last.textContent()),
      "the retry did not replace the reply",
    );
    expect(/30 days of delivery/.test(await last.textContent()), "the retry did not finish");
    expect(/My parcel is late/.test(await text(".assistant__side")), "the chat is not in the list");
  },
);

console.log("Developers");
await step(
  "a new key shows once, a bad webhook address is refused, a failed delivery goes again, and the log has each change",
  async () => {
    await go("developers");
    await page.getByRole("button", { name: "New key", exact: true }).click();
    await page.getByRole("button", { name: "Make the key" }).click();
    expect(/Give the key a name/.test(await text("dialog[open]")), "no name problem");
    await page.locator("dialog[open]").getByLabel("Name").fill("warehouse SYNC");
    await page.getByRole("button", { name: "Make the key" }).click();
    expect(/exists/.test(await text("dialog[open]")), "no clash");
    await page.locator("dialog[open]").getByLabel("Name").fill("Accounting app");
    await page.getByRole("button", { name: "Make the key" }).click();
    await page.waitForTimeout(700);
    expect(/only time we show all of Accounting app/.test(await text(".dev")), "no copy-now alert");
    await page.getByRole("tab", { name: "Webhooks" }).click();
    await page.waitForTimeout(500);
    await page.getByLabel("Address").fill("http://localhost:3000/hooks");
    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForTimeout(300);
    expect(/must start with https/.test(await text(".dev")), "no https problem");
    await page.getByLabel("Address").fill("https://ops.tokosenja.example/v2/hooks");
    await page.getByText("An order ships", { exact: true }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForTimeout(700);
    expect(!/must start with https/.test(await text(".dev")), "the problem stayed");
    await page.getByRole("button", { name: "Send again" }).click();
    await page.waitForTimeout(900);
    expect(
      !(await page.getByRole("button", { name: "Send again" }).count()),
      "the delivery still failed",
    );
    await page.getByRole("tab", { name: "Log" }).click();
    const log = await text(".dev");
    expect(
      /the key Accounting app/.test(log) && /the webhook/.test(log),
      "the log misses a change",
    );
  },
);

console.log("Calendar");
await step(
  "times follow the zone, an RSVP counts, and a new event says what it overlaps",
  async () => {
    await go("calendar");
    expect(/9:00\s*Standup/.test(await text(".bless-evcal")), "no standup at 9:00");
    await page.getByLabel("Show times in").fill("Tokyo");
    await page.getByRole("option", { name: /Tokyo/ }).first().click();
    await page.waitForTimeout(300);
    expect(/11:00\s*Standup/.test(await text(".bless-evcal")), "the standup did not move to 11:00");
    await page.getByRole("button", { name: /Team dinner/ }).click();
    expect(
      /20:30 to 22:30 \(18:30 in Jakarta\)/.test(await text("dialog[open]")),
      "no own-zone time",
    );
    await page
      .locator("dialog[open]")
      .getByRole("button", { name: /^Going/ })
      .click();
    expect(/4 going/.test(await text("dialog[open]")), "the RSVP did not count");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "New event" }).click();
    const dlg = page.locator("dialog[open]");
    await dlg.getByLabel("Title").fill("Lunch with Sari");
    await dlg.locator(".bless-datepicker__trigger").click();
    await dlg.getByRole("gridcell", { name: "Tuesday, 24 November 2026" }).click();
    await dlg.locator("input[type=time]").fill("11:00");
    expect(/Standup at 11:00/.test(await dlg.textContent()), "no overlap warning");
    await dlg.getByRole("button", { name: "Save" }).click();
    await page.waitForTimeout(700);
    expect(/Lunch with Sari/.test(await text(".bless-evcal")), "the event is not on the calendar");
  },
);

console.log("Status page");
await step(
  "an open incident sets the parts, Refresh moves it on, and a bad email is refused",
  async () => {
    await go("status");
    expect(/partial outage/.test(await text(".bless-status")), "no outage headline");
    expect(/Identified/.test(await text(".st")), "the open incident is not shown");
    await page.getByRole("button", { name: "Refresh" }).click();
    await page.waitForTimeout(700);
    expect(/Monitoring/.test(await text(".bless-incident")), "the incident did not move on");
    await page.getByRole("button", { name: "Refresh" }).click();
    await page.waitForTimeout(700);
    expect(
      /All systems are working/.test(await text(".bless-status")),
      "the parts did not recover",
    );
    expect(!(await page.getByRole("heading", { name: "Now" }).count()), "Now stayed");
    expect(
      /Card payments fail for some banks/.test(await text(".st")),
      "the closed incident is not in the history",
    );
    await page.getByRole("button", { name: "Get updates" }).click();
    const dlg = page.locator("dialog[open]");
    await dlg.getByLabel("Email", { exact: true }).fill("rina@");
    await dlg.getByRole("button", { name: "Subscribe" }).click();
    await page.waitForTimeout(300);
    expect(/Type an email address/.test(await dlg.textContent()), "no email problem");
    await dlg.getByLabel("Email", { exact: true }).fill("rina@example.com");
    await dlg.getByRole("button", { name: "Subscribe" }).click();
    await page.waitForTimeout(800);
    expect(/We will email rina@example.com/.test(await page.content()), "no toast");
  },
);

console.log("Podcast");
await step(
  "a chapter seeks and plays, the transcript follows, and an episode starts where you stopped",
  async () => {
    await go("podcast");
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /The price that we picked/ }).click();
    await page.waitForTimeout(800);
    expect(/1:3\d \/ 2:30/.test(await text(".bless-audio__time")), "the chapter did not seek");
    const toggle = page.locator(".bless-audio__toggle");
    expect((await toggle.getAttribute("aria-pressed")) === "true", "it does not play");
    await page.getByRole("tab", { name: "Transcript" }).click();
    await page.waitForTimeout(500);
    expect(
      /We picked 135,000/.test(await text(".bless-transcript [aria-current=time]")),
      "the transcript does not follow",
    );
    await page.getByRole("button", { name: "Play episode 11: The first hire" }).click();
    await page.waitForTimeout(1000);
    expect(/11\. The first hire/.test(await text("#pod-now")), "the episode did not open");
    expect(/0:5\d \/ 2:00/.test(await text(".bless-audio__time")), "it did not resume at 0:54");
    await toggle.click();
  },
);

console.log("Warehouse");
await step(
  "a picked order ships off the stock, a delivery comes in by barcode, and low items go to the supplier",
  async () => {
    await go("warehouse");
    expect(/2 of 6 items need a reorder/.test(await text(".wh")), "no reorder count");
    await page.getByRole("button", { name: /Order more of 2 items/ }).click();
    await page.getByRole("button", { name: "Send to the supplier" }).click();
    await page.waitForTimeout(900);
    expect(/PO-0042 went to the supplier/.test(await page.content()), "no purchase toast");
    await page.getByRole("tab", { name: "Pick" }).click();
    await page.waitForTimeout(500);
    const scan = page.getByLabel("Scan an item");
    await scan.fill("XYZ");
    await scan.press("Enter");
    expect(/XYZ is not on this list/.test(await text(".wh")), "no unknown-code problem");
    for (const sku of ["HON-KAL-250", "TEA-JAS-100", "TEA-JAS-100", "BOX-GFT-003"]) {
      await scan.fill(sku);
      await scan.press("Enter");
    }
    expect(/All items are picked/.test(await text(".wh")), "the list is not complete");
    await page.getByRole("button", { name: "Ship #10451" }).click();
    await page.waitForTimeout(800);
    expect(/#10452/.test(await text(".wh")), "the next order did not open");
    await page.getByRole("tab", { name: "Receive" }).click();
    await page.waitForTimeout(500);
    await page.getByLabel("Count for each scan").fill("12");
    const code = page.getByLabel("Barcode");
    await code.fill("8991002009998");
    await code.press("Enter");
    await page.waitForTimeout(300);
    expect(/not in the stock list/.test(await text(".wh")), "no unknown-barcode problem");
    await code.fill("8991002001022");
    await code.press("Enter");
    await page.waitForTimeout(400);
    expect(/\+12\s*Oolong tea/.test(await text(".wh")), "the delivery is not listed");
    await page.getByRole("tab", { name: "Stock" }).click();
    await page.waitForTimeout(500);
    // the cells of a row, one by one: their text runs together
    const row = (name) =>
      page.locator("tr", { hasText: name }).first().locator("td, th").allTextContents();
    expect((await row("Jasmine tea")).includes("38"), "the shipped tea is still on the shelf");
    expect((await row("Oolong tea")).includes("24"), "the delivery did not add to the stock");
  },
);

console.log("Study");
await step(
  "a known card moves up a box, a missed card comes back, and a new card is due today",
  async () => {
    await go("study");
    await page.waitForTimeout(400);
    const card = page.locator(".bless-flash__actions");
    const answer = async (know) => {
      await card.getByRole("button", { name: "Show the answer" }).click();
      await card.getByRole("button", { name: know ? "I know it" : "Again" }).click();
    };
    expect(/Berapa harganya/.test(await text(".bless-flash")), "box 1 is not first");
    await answer(false);
    for (let i = 0; i < 4; i++) await answer(true);
    expect(/You knew 3 of 4/.test(await text(".study")), "no score");
    expect(/2 of 7/.test(await text(".study__stats")), "Terima kasih did not reach box 5");
    await page.getByRole("button", { name: "Add a card" }).click();
    const dlg = page.locator("dialog[open]");
    await dlg.getByRole("button", { name: "Add" }).click();
    expect(/Write both sides/.test(await dlg.textContent()), "no problem for an empty card");
    await dlg.getByLabel("Front").fill("Enak sekali");
    await dlg.getByLabel("Back").fill("Very tasty");
    await dlg.getByRole("button", { name: "Add" }).click();
    await page.waitForTimeout(700);
    await page.getByRole("button", { name: "Study the 1 new card" }).click();
    expect(/Enak sekali/.test(await text(".bless-flash")), "the new card is not in the round");
  },
);

console.log("Support desk");
await step(
  "the queue is by deadline, a reply meets the first-reply limit, and a solved ticket leaves the queue",
  async () => {
    await go("support");
    await page.waitForTimeout(400);
    expect(/Late since Mon 10:00/.test(await text(".desk__list")), "no late ticket");
    await page.getByRole("button", { name: /My card was charged twice/ }).click();
    const reply = () => text(".desk__limits .bless-sla");
    expect(/20 min/.test(await reply()), "the urgent limit is not 20 minutes away");
    await page
      .getByRole("textbox", { name: "Reply" })
      .fill("We are sorry. We refund the second payment today.");
    await page.getByRole("button", { name: "Send the reply" }).click();
    await page.waitForTimeout(600);
    expect(
      /We refund the second payment/.test(await text(".desk__ticket")),
      "the reply is not in the ticket",
    );
    expect(!/20 min/.test(await reply()), "the first-reply timer still runs");
    await page.locator(".bless-tkview__status select").selectOption("solved");
    await page.waitForTimeout(500);
    expect(
      !/charged twice/.test(await text(".desk__list")),
      "the solved ticket stayed in the queue",
    );
    await page.getByRole("tab", { name: "Solved" }).click();
    await page.waitForTimeout(500);
    expect(/charged twice/.test(await text(".desk__list")), "the ticket is not in Solved");
  },
);

console.log("Find a time");
await step("a shorter meeting finds a time for everyone, and Book locks the poll", async () => {
  await go("meet");
  await page.waitForTimeout(400);
  expect(/Rina cannot come/.test(await text(".meet__best")), "the 1 hour times are wrong");
  await page.getByLabel("Length").selectOption("30");
  await page.waitForTimeout(300);
  const first = page.locator(".meet__slot").first();
  expect(
    /Tue 24 November, 10:30 to 11:00/.test(await first.textContent()) &&
      /Everyone is free/.test(await first.textContent()),
    "no time for everyone",
  );
  await first.getByRole("button", { name: "Book" }).click();
  await page.waitForTimeout(800);
  expect(/Booked/.test(await text(".meet")), "no booked alert");
  expect(await first.getByRole("button", { name: "Book" }).isDisabled(), "the poll is still open");
});

await browser.close();
console.log(failed ? `\n${failed} block check(s) failed` : "\nall block checks passed");
process.exit(failed ? 1 : 0);
