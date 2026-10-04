// CEFR program on the map, and endless topic rounds.
// Usage: npm run build && npm run start -- -p 3100 & node tests/e2e/program-rounds.mjs
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
const errors = [];

async function open(viewport, label) {
  const context = await browser.newContext({ viewport, locale: "pl-PL", isMobile: viewport.width < 600, hasTouch: viewport.width < 600 });
  const page = await context.newPage();
  page.on("console", (m) => m.type() === "error" && !/speech|synthesis/i.test(m.text()) && errors.push(`${page.url()} ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${page.url()} pageerror: ${e.message}`));
  await page.goto(`${BASE}/auth?mode=login`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: label }).click();
  await page.waitForURL("**/home");
  return { context, page };
}

const fits = (page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
const savedRound = (page, account) => page.evaluate((id) => JSON.parse(localStorage.getItem(`kompas.state.${id}`)), account);

/* ---------------- CHILD: map ---------------- */
{
  const { context, page } = await open({ width: 1440, height: 900 }, /Dziecko 8–12/);
  const btn = (name, opts = {}) => page.getByRole("button", { name, ...opts });
  const island = (name) => page.getByRole("region", { name, exact: true });

  await page.goto(`${BASE}/journey`, { waitUntil: "networkidle" });
  check("map: opens on the learner's level", (await page.getByRole("tab", { name: /^A1/ }).getAttribute("aria-selected")) === "true");
  check("map: Pre-A1 counts as passed in the placement test", /✓/.test(await page.getByRole("tab", { name: /^Pre-A1/ }).innerText()));
  check("map: A1 has 5 worlds and 50 numbered missions", (await page.getByRole("region").count()) === 5 && (await btn(/^Misja \d+:/).count()) === 50);
  check("map: the learner stands on mission 7 of Food Town", await island("Food Town").getByRole("button", { name: "Misja 7: Ordering at a café, tu jesteś" }).isVisible());
  await btn("Misja 1: Fruit & veg, w przygotowaniu").click();
  check("map: a planned mission says what it will teach", (await page.getByText("Misja w przygotowaniu").isVisible()) && (await page.getByText(/10 słów/).first().isVisible()));
  await btn("Misja 7: Ordering at a café, tu jesteś").click();
  check("map: the current mission can be started from the map", await page.getByRole("link", { name: "Start →" }).isVisible());

  await page.getByText("Co trzeba umieć, żeby zaliczyć A1").click();
  check("program: A1 lists its 11 grammar topics", (await page.getByText("GRAMATYKA · 11").isVisible()) && (await page.getByText("there is / there are").isVisible()));
  check("program: each topic says where it is taught", await page.getByText("gdzie: Food Town").first().isVisible());
  await page.screenshot({ path: `${OUT}/pr-child-map.png`, fullPage: true });

  check("gate: says what A1 takes", await page.getByText(/Otworzy się po całym programie A1: 400 słów, 11 zagadnień gramatycznych i 50 misji/).isVisible());
  await btn(/Zobacz, co jest dalej: A2/).click();
  check("gate: the next level can be previewed", (await page.getByRole("tab", { name: /^A2/ }).getAttribute("aria-selected")) === "true" && (await page.getByRole("region").count()) === 6 && (await btn(/^Misja \d+:/).count()) === 72);
  check("program: A2 is 600 words", await page.getByText("/ 600").first().isVisible());
  await page.getByRole("tab", { name: /^B2/ }).click();
  check("map: the road is laid out to the end of B2", (await page.getByRole("region").count()) === 10 && (await page.getByText("META PODRÓŻY").isVisible()));

  /* ---------------- CHILD: endless rounds ---------------- */
  await page.goto(`${BASE}/practice`, { waitUntil: "networkidle" });
  check("practice: 12 topics to play", (await page.getByRole("link", { name: /Graj rundę/ }).count()) === 12);
  await page.screenshot({ path: `${OUT}/pr-child-practice.png`, fullPage: true });
  await page.getByRole("link", { name: /Jedzenie i picie/ }).click();
  await page.waitForURL("**/practice/topic/food");

  async function playRound({ mistakeOnStep = -1 } = {}) {
    for (let i = 0; i < 8; i++) {
      await page.getByRole("progressbar").waitFor();
      const state = await savedRound(page, "demo-child");
      const { exercise } = state.round.steps[state.round.index];
      if (exercise.type === "MATCHING") {
        for (const pair of exercise.pairs) {
          await btn(pair.left, { exact: true }).click();
          await btn(pair.right, { exact: true }).click();
        }
      } else {
        if (exercise.type === "LISTENING") await btn("Odtwórz nagranie").click();
        const text = (id) => exercise.options.find((o) => o.id === id).text;
        if (i === mistakeOnStep) {
          const wrong = exercise.options.find((o) => o.id !== exercise.correctOptionId);
          await page.getByRole("radio", { name: wrong.text, exact: true }).click();
          await btn("CHECK →").click();
          await btn("Spróbuj ponownie").click();
        }
        await page.getByRole("radio", { name: text(exercise.correctOptionId), exact: true }).click();
        await btn("CHECK →").click();
      }
      if (i === 0) await page.screenshot({ path: `${OUT}/pr-child-round.png`, fullPage: true });
      await btn(/Dalej →|Zakończ rundę →/).click();
    }
    await page.getByText("Runda skończona!").waitFor();
  }

  const before = (await savedRound(page, "demo-child")).user.xp;
  const firstLevels = (await savedRound(page, "demo-child")).round.steps.flatMap((s) => s.wordIds);
  await playRound();
  let state = await savedRound(page, "demo-child");
  check("round: 8 tasks, all right → 22 XP", state.round.summary.xp === 22 && state.user.xp === before + 22, `xp ${state.user.xp}`);
  check("round: result is shown", (await page.getByText("8 / 8").isVisible()) && (await page.getByText("+22 XP").isVisible()));
  check("round: every word of the round is now tracked", Object.keys(state.wordStats).length === 8 && firstLevels.every((id) => state.wordStats[id]));
  await page.screenshot({ path: `${OUT}/pr-child-round-summary.png`, fullPage: true });

  await page.reload();
  await page.getByText("Runda skończona!").waitFor();
  check("round: refresh keeps the result", true);

  await btn("Następna runda →").click();
  await page.getByRole("progressbar").waitFor();
  state = await savedRound(page, "demo-child");
  const secondWords = state.round.steps.flatMap((s) => s.wordIds);
  check("round: the next round brings new words", secondWords.some((id) => !firstLevels.includes(id)), `${new Set(secondWords).size} words`);
  await playRound({ mistakeOnStep: 1 });
  state = await savedRound(page, "demo-child");
  check("round: a mistake costs XP and the word comes back", state.round.summary.xp < 22 && (await page.getByText("wróci w następnej rundzie").first().isVisible()));
  const missed = state.round.results.flatMap((r) => r.missed)[0];
  await btn("Następna runda →").click();
  await page.getByRole("progressbar").waitFor();
  state = await savedRound(page, "demo-child");
  check("round: the missed word is in the very next round", state.round.steps.some((s) => s.wordIds.includes(missed)));
  await btn("← Trening").click();
  await page.waitForURL("**/practice");
  check("round: leaving closes it", (await savedRound(page, "demo-child")).round === null);
  await context.close();
}

/* ---------------- TEEN + ADULT ---------------- */
for (const [tag, label, account, firstTab] of [
  ["teen", /Nastolatek 13–17/, "demo-teen", "A2"],
  ["adult", /Dorosły 18\+/, "demo-adult", "A2"],
]) {
  const { context, page } = await open({ width: 1440, height: 900 }, label);
  await page.goto(`${BASE}/journey`, { waitUntil: "networkidle" });
  check(`${tag}: path opens on ${firstTab} with its program`, (await page.getByRole("tab", { name: new RegExp(`^${firstTab}`) }).getAttribute("aria-selected")) === "true" && (await page.getByText("/ 600").first().isVisible()));
  await page.getByText(`What it takes to clear ${firstTab}`).click();
  check(`${tag}: program lists grammar`, await page.getByText("GRAMMAR · 11").isVisible());
  await page.getByRole("tab", { name: /^B2/ }).click();
  check(`${tag}: later levels are laid out`, await page.getByText("/ 1500").first().isVisible());
  await page.screenshot({ path: `${OUT}/pr-${tag}-b2.png`, fullPage: true });
  await page.goto(`${BASE}/practice`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/pr-${tag}-practice.png`, fullPage: true });
  await page.getByRole("link", { name: /^Hotel/ }).click();
  await page.waitForURL("**/practice/topic/hotel");
  await page.getByText("Match the pairs").waitFor();
  const state = await savedRound(page, account);
  check(`${tag}: hotel round is built at the learner's level`, state.round.level === "A2" && state.round.steps.length === 8);
  await page.screenshot({ path: `${OUT}/pr-${tag}-round.png`, fullPage: true });
  await context.close();
}

/* ---------------- PHONE ---------------- */
for (const [tag, label] of [
  ["child", /Dziecko 8–12/],
  ["teen", /Nastolatek 13–17/],
  ["adult", /Dorosły 18\+/],
]) {
  const { context, page } = await open({ width: 390, height: 844 }, label);
  for (const path of ["/home", "/journey", "/practice", "/me", "/practice/topic/clothes"]) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    check(`phone ${tag} ${path}: fits the screen`, await fits(page));
    await page.screenshot({ path: `${OUT}/pr-m-${tag}${path.replaceAll("/", "-")}.png` });
  }
  if (tag === "child") {
    await page.goto(`${BASE}/journey`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const box = await page.getByRole("link", { name: "Start →" }).boundingBox();
    check("phone child: the Start button of the current mission is on screen", !!box && box.y > 0 && box.y + box.height < 844 - 84, JSON.stringify(box));
  }
  await context.close();
}

check("no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
await browser.close();
console.log(problems.length ? `\n${problems.length} problem(s): ${problems.join("; ")}` : "\nProgram and rounds: all checks passed");
process.exit(problems.length ? 1 : 0);
