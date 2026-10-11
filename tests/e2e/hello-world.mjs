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

// 1. pairs
for (const [l, r] of [["hello", "cześć / dzień dobry"], ["yes", "tak"], ["no", "nie"], ["please", "proszę"], ["thank you", "dziękuję"]]) {
  await btn(l).click();
  await btn(r).click();
}
await text("Komplet! Wszystkie pary.").waitFor();
await btn("Dalej →").click();

// Picture options are mixed the same way as data/curriculum/child/kit.ts does it.
const spread = (seed, n) => { let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h % n; };
const position = (seed, items, wanted) => {
  const shift = spread(seed, items.length);
  return [...items.slice(shift), ...items.slice(0, shift)].indexOf(wanted) + 1;
};
const TIMES = ["morning", "afternoon", "evening", "night"];

// 2. pictures: two mistakes, then the answer is shown and the lesson moves on
await text("good morning").waitFor();
const right = position("hw1.morning", TIMES, "morning");
const [w1, w2] = [1, 2, 3, 4].filter((i) => i !== right);
await page.getByRole("radio", { name: `Obrazek ${w1}` }).click();
await btn("SPRAWDŹ →").click();
await text("Prawie! Spróbuj jeszcze raz.").waitFor();
check("first mistake: a hint, the answer is not given away", (await text("Poszukaj obrazka, na którym słońce dopiero wschodzi.").isVisible()) && !(await text("Dobra odpowiedź").isVisible()));
await page.screenshot({ path: `${OUT}/hw-first-mistake.png`, fullPage: true });
await btn("Spróbuj ponownie").click();
await page.getByRole("radio", { name: `Obrazek ${w2}` }).click();
await btn("SPRAWDŹ →").click();
await text("Dobra odpowiedź: good morning").waitFor();
check("second mistake: the answer is shown and the lesson moves on", await btn("Dalej →").isVisible());
await btn("Dalej →").click();

// 3. listening with pictures; Leo says "Good night"
await text("Kiedy Leo to mówi?").waitFor();
await page.getByRole("radio", { name: `Obrazek ${position("hw1.listen", ["night", "morning", "afternoon", "evening"], "night")}` }).click();
await btn("SPRAWDŹ →").click();
await btn("Dalej →").click();

// 4. quiz, 5. gap
await page.getByRole("radio", { name: "Good evening!", exact: true }).click();
await btn("SPRAWDŹ →").click();
await btn("Dalej →").click();
await page.getByRole("radio", { name: "you", exact: true }).click();
await btn("SPRAWDŹ →").click();
await btn("Dalej →").click();

// 6. sentence
const bank = page.getByRole("group", { name: "Słowa do wyboru" });
for (const t of ["Good", "morning,", "Leo!"]) await bank.getByRole("button", { name: t, exact: true }).click();
await btn("SPRAWDŹ →").click();
await text("Świetnie ułożone!").waitFor();
await btn("Dalej →").click();

// 7. speaking: no microphone in a headless browser
await text("“Hello! Good morning!”").waitFor();
await btn("Nie mogę teraz mówić").click();

// 8. scene in the park, with one wrong reply
await text("Przywitaj się z Leo").waitFor();
await btn("Good night!").click();
check("scene: a wrong reply gets a hint", await text(/Jest rano!/).isVisible());
for (const [reply, line] of [["Good morning, Leo!", "Do you want an apple?"], ["Yes, please!", "Here you are!"], ["Thank you!", "You're welcome!"]]) {
  await btn(reply).click();
  await text(line).waitFor();
}
check("scene: the park scene is drawn for a phone without sideways scroll", await fits());
await page.screenshot({ path: `${OUT}/hw-scene.png`, fullPage: true });
await btn("Zakończ lekcję →").click();

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

check("no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
await browser.close();
console.log(problems.length ? `\n${problems.length} problem(s): ${problems.join("; ")}` : "\nHello World: all checks passed");
process.exit(problems.length ? 1 : 0);
