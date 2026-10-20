// Hello World, the first fully written world (child · Pre-A1): mission 1 from start to end,
// the answer is never given away after a first mistake, and the next mission opens.
// Usage: npm run build && npm run start -- -p 3100 & node tests/e2e/hello-world.mjs
import { chromium } from "playwright";
import { existsSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = process.env.SHOTS ?? "tests/e2e/screenshots";
const exe = ["/opt/pw-browsers/chromium/chrome", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find((p) => existsSync(p));
mkdirSync(OUT, { recursive: true });

const problems = [];
function check(name, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) problems.push(name);
}

const browser = await chromium.launch({ args: ["--no-proxy-server"], ...(exe ? { executablePath: exe } : {}) });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "pl-PL", isMobile: true, hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && !/speech|synthesis/i.test(m.text()) && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));
const btn = (name) => page.getByRole("button", { name, exact: true });
const text = (t) => page.getByText(t).first();
const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);

// The test child starts at the very beginning: Hello World, mission 1.
await page.goto(`${BASE}/auth?mode=login`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Dziecko 8–12/ }).click();
await page.waitForURL("**/home");
check("home: the test child starts in Hello World", await text("Hello World").isVisible() && (await text(/MISJA 1 Z 12/).isVisible()));
await page.getByRole("link", { name: "GRAJ DALEJ →" }).click();
await page.waitForURL("**/lesson/child.hello-world.l01-hello");
check("start: says what the mission is", await text("Po tej misji przywitasz się o każdej porze dnia").isVisible() && (await text("MISJA 1 · HELLO WORLD").isVisible()));
await page.getByRole("link", { name: "ZACZNIJ →" }).click();
await page.waitForURL("**/play");

// 1. The story: five pictures, read aloud, nothing to answer.
await text("Witaj w Kompasie").waitFor();
check("story: Leo and Mia say hello, with the Polish meaning", (await text("Hello! Good morning!").isVisible()) && (await text("Cześć! Dzień dobry!").isVisible()));
for (let i = 0; i < 4; i++) await btn("Dalej →").click();
await page.getByRole("button", { name: /Teraz Ty|Dalej/ }).last().click();

// 2. The conversation: answers in the child's own words (typed here: no microphone in a test browser).
await text("Przywitaj się z Leo, Mią i panią Bell.").waitFor();
const answer = async (words) => {
  if (await btn("wolę napisać").isVisible().catch(() => false)) await btn("wolę napisać").click();
  await page.getByPlaceholder("Napisz po angielsku…").fill(words);
  await btn("Wyślij").click();
  await page.waitForTimeout(400);
};
await answer("Good night!");
check("talk: a wrong greeting gets a friendly correction and a sentence starter", (await text(/Good night\? It's morning!/).isVisible()) && (await text("Spróbuj tak:").isVisible()));
await page.screenshot({ path: `${OUT}/hw-talk-miss.png`, fullPage: true });
await answer("Good morning, Leo!");
await answer("Hi Mia");
await answer("yes");
check("talk: Leo asks for the magic word", await text("Yes… and the magic word?").first().isVisible());
await answer("Yes, please!");
await answer("Thanks!");
await answer("good evening ms bell");
await answer("Good night, Leo!");
await text("Udało się porozumieć po angielsku!").waitFor();
check("talk: the whole conversation is understood", true);
await btn("Dalej →").click();

// 3. The real-life mission: ticked off now, confirmed by a parent later.
await text("Cały dzień po angielsku").waitFor();
check("real task: cannot be reported before the steps are ticked", await btn("Zrobione! ✓").isDisabled());
for (const box of await page.getByRole("checkbox").all()) await box.click();
await btn("Zrobione! ✓").click();
await page.waitForURL("**/summary");
check("summary: the mission's outcome", await text("Teraz potrafisz przywitać się po angielsku.").isVisible());
// The summary leads to the map, where the avatar walks from mission 1 to mission 2.
await btn("Dalej na mapę →").click();
await page.waitForURL(/\/journey/);
const bubble = page.getByRole("status").filter({ hasText: "Misja 2 czeka!" });
await bubble.waitFor({ timeout: 5000 });
check("map: the walk to mission 2 plays once", await bubble.isVisible());
await page.screenshot({ path: `${OUT}/hw-walk.png` });
await bubble.waitFor({ state: "detached", timeout: 6000 });
check("map: the address bar no longer asks for the walk", !page.url().includes("done="));
const hello = page.getByRole("region", { name: "Hello World", exact: true });
check("map: mission 1 done, mission 2 is next", (await hello.getByRole("button", { name: "Misja 1: Hello!, ukończona" }).isVisible()) && (await hello.getByRole("button", { name: "Misja 2: What's your name?, tu jesteś" }).isVisible()));
check("map: Hello World counts its first 10 words", await hello.getByText("10 / 100 słów · 1 / 12 misji").isVisible());

// A parent confirms the real-life mission; the stamp lands in the passport.
await page.goto(`${BASE}/parent`, { waitUntil: "networkidle" });
check("parent: the reported mission waits for confirmation", await text("dziecko zgłosiło wykonanie").isVisible());
await btn("Potwierdzam, zrobione").first().click();
await text(/potwierdzone · pieczątka „Pierwsze słowa”/).waitFor();
await page.goto(`${BASE}/passport`, { waitUntil: "networkidle" });
check("passport: one stamp collected", await text("TWÓJ PASZPORT · 1 PIECZĄTKA").isVisible());
await btn("9").first().click();
check("passport: the child's sentence grows with their details", await text("“Hi! I'm Zosia. I'm nine.”").isVisible());
check("passport: fits a phone", await fits());
await page.screenshot({ path: `${OUT}/hw-passport.png`, fullPage: true });

check("no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
await browser.close();
console.log(problems.length ? `\n${problems.length} problem(s): ${problems.join("; ")}` : "\nHello World: all checks passed");
process.exit(problems.length ? 1 : 0);
