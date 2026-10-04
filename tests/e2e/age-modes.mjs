// Teen and adult paths end to end + phone-size checks for all three age modes.
// Usage: BASE_URL=http://localhost:3100 node tests/e2e/age-modes.mjs
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

const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const errors = [];

async function open(viewport, storageState) {
  const context = await browser.newContext({ viewport, storageState, locale: "pl-PL", hasTouch: viewport.width < 600, isMobile: viewport.width < 600 });
  const page = await context.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()} ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${page.url()} pageerror: ${e.message}`));
  return { context, page };
}

async function signUp(page, email) {
  await page.goto(`${BASE}/auth?mode=signup`);
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Hasło").fill("kompas2026");
  await page.getByText("Akceptuję regulamin").click();
  await page.getByRole("button", { name: "Utwórz konto" }).click();
  await page.waitForURL("**/onboarding");
}

const btn = (page, name, opts = {}) => page.getByRole("button", { name, ...opts });
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });

async function noOverflow(page, label) {
  const { scroll, inner } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: document.documentElement.clientWidth }));
  check(`no sideways scroll: ${label}`, scroll <= inner + 1, `${scroll}px content in ${inner}px`);
}

/** Opens pages at phone size with the saved learner state and checks the layout. */
async function phonePass(tag, storageState, paths) {
  const { context, page } = await open({ width: 390, height: 844 }, storageState);
  for (const [name, path] of paths) {
    await page.goto(`${BASE}${path}`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(350);
    await noOverflow(page, `${tag} ${path}`);
    await shot(page, `m-${tag}-${name}`);
  }
  await context.close();
}

/* ---------------- TEEN ---------------- */
{
  const { context, page } = await open({ width: 1440, height: 900 });
  await signUp(page, "maja.k@poczta.pl");
  await btn(page, /Dla mnie/).click();
  await btn(page, /13–17/).click();
  await page.waitForURL("**/onboarding/profile");
  await page.getByLabel("YOUR HANDLE").fill("maja.k");
  await btn(page, "15", { exact: true }).click();
  await shot(page, "t-01-profile");
  await btn(page, "Next →").click();
  await page.waitForURL("**/onboarding/goals");
  await btn(page, /TRAVEL/).click();
  await btn(page, /GAMES/).click();
  await btn(page, "Speaking").click();
  await shot(page, "t-02-goals");
  await btn(page, "Calibrate my level →").click();
  await page.waitForURL("**/onboarding/placement");
  for (const a of ["7:15", "I'm running a bit late. I'll be there around 7:15.", "been", "boring", "Doing homework together"]) {
    await page.getByRole("radio", { name: a }).click();
    await btn(page, "Next →").click();
  }
  await page.waitForURL("**/onboarding/result");
  check("teen: placement 3/5 → A2", await page.getByText("A2.").first().isVisible());
  await shot(page, "t-03-result");
  await btn(page, "Go to Home").click();
  await page.waitForURL("**/home");
  check("teen: dark Player home, next mission from data", await page.getByRole("heading", { name: "Flight delayed" }).isVisible());
  await shot(page, "t-04-home");
  await page.getByRole("link", { name: /Journey/ }).first().click();
  await page.waitForURL("**/journey");
  check("teen: opens on the level set by calibration", (await page.getByRole("tab", { name: /^A2/ }).getAttribute("aria-selected")) === "true");
  check("teen: A1 passed in calibration", /✓/.test(await page.getByRole("tab", { name: /^A1/ }).innerText()));
  check("teen: A2 program is 600 words over 48 missions", (await page.getByText("/ 600").first().isVisible()) && (await page.getByText("/ 48").first().isVisible()));
  await shot(page, "t-05-journey");
  await page.getByRole("link", { name: /Flight delayed/ }).click();
  await page.waitForURL("**/lesson/teen.travel.flight-delayed");
  await shot(page, "t-06-mission");
  await page.getByRole("link", { name: "Start mission →" }).click();
  await page.waitForURL("**/play");

  await page.getByRole("radio", { name: "karta pokładowa" }).click();
  await btn(page, "Check →").click();
  await shot(page, "t-07-speed-round");
  await btn(page, "Continue →").click();
  await page.getByRole("radio", { name: "odwołany" }).click();
  await btn(page, "Check →").click();
  check("teen: wrong answer explained", await page.getByText(/„Odwołany” to/).isVisible());
  await btn(page, "Try again").click();
  await page.getByRole("radio", { name: "opóźniony" }).click();
  await btn(page, "Check →").click();
  await btn(page, "Continue →").click();
  await btn(page, "Play").click();
  await page.getByRole("radio", { name: "Go to gate B12" }).click();
  await shot(page, "t-08-listening");
  await btn(page, "Check →").click();
  await btn(page, "Continue →").click();
  const bank = page.getByRole("group", { name: "Słowa do wyboru" });
  for (const w of ["Which", "gate", "does", "the", "flight", "leave", "from?"]) await bank.getByRole("button", { name: w, exact: true }).click();
  await shot(page, "t-09-sentence");
  await btn(page, "Check →").click();
  await btn(page, "Continue →").click();
  await shot(page, "t-10-speaking");
  await btn(page, "Can't speak right now").click();
  await page.getByText("Hi there. Can I help you?").waitFor();
  await btn(page, "Where's the nearest coffee shop?").click();
  check("teen: off-mission reply gets a hint", await page.getByText(/Off-mission/).isVisible());
  for (const r of ["Yeah — my gate changed. Where's B12?", "How long does it take?", "Thanks! Since it's delayed, can I get a food voucher?", "Thank you so much. Bye!"]) await btn(page, r).click();
  await page.getByText("Mission complete.").waitFor();
  await shot(page, "t-11-scenario");
  await btn(page, "Debrief →").click();
  await page.waitForURL("**/summary");
  await page.getByRole("heading", { name: /You can now handle a delayed flight/ }).waitFor();
  // 5 + 3 (mistake) + 10 + 15 + 0 (skipped) + 15 (mistake) + 10 bonus
  check("teen: XP from results", await page.getByText("+58", { exact: true }).isVisible());
  await shot(page, "t-12-summary");
  await btn(page, "Back to Home →").click();
  await page.waitForURL("**/home");
  await page.getByRole("link", { name: /Practice/ }).first().click();
  await page.waitForURL("**/practice");
  check("teen: mistakes are in practice", (await page.getByText("delayed", { exact: true }).isVisible()) && (await page.getByText("Where's B12?").isVisible()));
  await shot(page, "t-13-practice");
  const state = await context.storageState();
  await context.close();
  await phonePass("teen", state, [
    ["home", "/home"],
    ["journey", "/journey"],
    ["practice", "/practice"],
    ["mission", "/lesson/teen.travel.flight-delayed"],
    ["play", "/lesson/teen.travel.flight-delayed/play"],
    ["stats", "/me"],
  ]);
}

/* ---------------- ADULT ---------------- */
{
  const { context, page } = await open({ width: 1440, height: 900 });
  await signUp(page, "anna.nowak@poczta.pl");
  await btn(page, /Dla mnie/).click();
  await btn(page, /18\+/).click();
  await page.waitForURL("**/onboarding/goals");
  await btn(page, "Work").click();
  await btn(page, "Travel").click();
  await shot(page, "a-01-goals");
  await btn(page, /Continue/).click();
  await page.waitForURL("**/onboarding/focus");
  await btn(page, "Speaking confidently").click();
  await btn(page, "15 min").click();
  await shot(page, "a-02-focus");
  await btn(page, /Find my level/).click();
  await page.waitForURL("**/onboarding/placement");
  for (const a of ["To change an appointment", "have lived", "Use public transport", "Find my room now.", "tell"]) {
    await page.getByRole("radio", { name: a }).click();
    await btn(page, /Continue/).click();
  }
  await page.waitForURL("**/onboarding/result");
  check("adult: placement 3/5 → A2 · Elementary", await page.getByRole("heading", { name: /A2 · Elementary/ }).isVisible());
  await shot(page, "a-03-result");
  await btn(page, /START MY PLAN/).click();
  await page.waitForURL("**/home");
  check("adult: calm Navigator home with a name from the e-mail", await page.getByRole("heading", { name: /, Anna\./ }).isVisible());
  await shot(page, "a-04-home");
  await page.getByRole("link", { name: "Ścieżka" }).click();
  await page.waitForURL("**/journey");
  await shot(page, "a-05-path");
  await page.getByRole("link", { name: /Open: Hotel check-in/ }).click();
  await page.waitForURL("**/lesson/adult.hotels.check-in");
  await shot(page, "a-06-lesson-start");
  await page.getByRole("link", { name: /START LESSON/ }).click();
  await page.waitForURL("**/play");

  await page.getByRole("radio", { name: "reception" }).click();
  check("adult: gap-fill answers on tap and shows the right word", await page.getByText("Not quite — this one returns in review.").isVisible());
  await shot(page, "a-07-vocab");
  await btn(page, "Continue →").click();
  await page.getByRole("radio", { name: "included" }).click();
  await btn(page, "Continue →").click();
  await btn(page, "Play").click();
  await page.getByRole("radio", { name: "At 11:00" }).click();
  await shot(page, "a-08-listening");
  await btn(page, "Check", { exact: true }).click();
  await btn(page, "Continue →").click();
  await page.getByRole("radio", { name: "booked", exact: true }).click();
  await btn(page, "Continue →").click();
  await shot(page, "a-09-speaking");
  await btn(page, "I can't speak right now").click();
  await page.getByText("Good evening. Do you have a reservation?").waitFor();
  for (const r of ["Yes, it's under Kowalska.", "That's strange. I booked it online last week — I have a confirmation email.", "Yes, it's KX4471.", "Thank you. Could I have a late check-out, please?"]) await btn(page, r).click();
  await page.getByText("Of course — until one o'clock. Enjoy your stay!").waitFor();
  await shot(page, "a-10-scenario");
  await btn(page, "Finish lesson →").click();
  await page.waitForURL("**/summary");
  await page.getByRole("heading", { name: /You can now check into a hotel/ }).waitFor();
  await shot(page, "a-11-summary");
  await btn(page, "Review now").click();
  await page.waitForURL("**/practice");
  check("adult: the missed word is in review", await page.getByText("reservation", { exact: true }).isVisible());
  await shot(page, "a-12-review");
  await page.getByRole("link", { name: /Start review/ }).click();
  await page.waitForURL("**/practice/session");
  await page.getByRole("radio", { name: "reservation" }).click();
  await btn(page, /Finish →|Continue →/).click();
  await page.getByRole("heading", { name: "Review complete." }).waitFor();
  check("adult: review session finishes", true);
  const state = await context.storageState();
  await context.close();
  await phonePass("adult", state, [
    ["home", "/home"],
    ["path", "/journey"],
    ["review", "/practice"],
    ["lesson", "/lesson/adult.hotels.check-in"],
    ["play", "/lesson/adult.hotels.check-in/play"],
    ["progress", "/me"],
    ["settings", "/settings"],
  ]);
}

/* ---------------- CHILD on a phone ---------------- */
{
  const { context, page } = await open({ width: 390, height: 844 });
  await page.goto(BASE);
  await noOverflow(page, "landing");
  await shot(page, "m-child-00-landing");
  await signUp(page, "rodzic@poczta.pl");
  await noOverflow(page, "who");
  await btn(page, /Dla mojego dziecka/).click();
  await page.getByLabel("Cześć! Jak masz na imię?").fill("Zosia");
  await btn(page, "9", { exact: true }).click();
  await noOverflow(page, "child profile");
  await shot(page, "m-child-01-profile");
  await btn(page, "Dalej", { exact: true }).click();
  await btn(page, /Zwierzęta/).click();
  await noOverflow(page, "child interests");
  await btn(page, /Dalej · wybrano 1/).click();
  await page.getByRole("radio", { name: /Tworzę proste zdania/ }).click();
  await noOverflow(page, "child level");
  await shot(page, "m-child-02-level");
  await btn(page, "Pomiń test — zacznę od mojej oceny").click();
  await page.waitForURL("**/onboarding/result");
  check("child: skipping the test uses the self-assessment", await page.getByText(/na podstawie Twojej oceny/i).isVisible());
  await noOverflow(page, "child result");
  await shot(page, "m-child-03-result");
  await btn(page, "START ADVENTURE →").click();
  await page.waitForURL("**/home");
  await noOverflow(page, "child home");
  await shot(page, "m-child-04-home");
  await page.getByRole("link", { name: /Podróż/ }).click();
  await page.waitForURL("**/journey");
  await noOverflow(page, "child journey");
  await shot(page, "m-child-05-journey");
  await page.getByRole("region", { name: "Food Town", exact: true }).getByRole("button", { name: /słów/ }).click();
  await page.getByRole("link", { name: "Wejdź do Food Town" }).click();
  await page.waitForURL("**/journey/child.food-town");
  await noOverflow(page, "child world");
  await shot(page, "m-child-06-world");
  await page.getByRole("link", { name: /LEKCJA 7/ }).click();
  await noOverflow(page, "child lesson start");
  await shot(page, "m-child-07-lesson-start");
  await page.getByRole("link", { name: "START LESSON →" }).click();
  await page.getByRole("heading", { name: "Połącz pary ze słowami z kawiarni" }).waitFor();
  await noOverflow(page, "matching");
  await shot(page, "m-child-08-matching");
  for (const [l, r] of [["menu", "karta dań"], ["a cup", "filiżanka"], ["hot", "gorący"], ["the bill", "rachunek"], ["sweet", "słodki"]]) {
    await btn(page, l, { exact: true }).click();
    await btn(page, r, { exact: true }).click();
  }
  await btn(page, "Dalej →").click();
  await page.getByRole("radio", { name: "Obrazek 1" }).click();
  await btn(page, "CHECK →").click();
  await page.waitForTimeout(500);
  await noOverflow(page, "image choice feedback");
  await shot(page, "m-child-09-image-almost");
  check("child phone: feedback sheet does not hide the retry button", await btn(page, "Spróbuj ponownie").isVisible());
  await btn(page, "Spróbuj ponownie").click();
  await page.getByRole("radio", { name: "Obrazek 3" }).click();
  await btn(page, "CHECK →").click();
  await btn(page, "Dalej →").click();
  await noOverflow(page, "listening");
  await shot(page, "m-child-10-listening");
  await page.getByRole("radio", { name: "Obrazek 2" }).click();
  await btn(page, "CHECK →").click();
  await btn(page, "Dalej →").click();
  for (const w of ["I'd", "like", "a", "hot", "chocolate,", "please."]) await page.getByRole("group", { name: "Słowa do wyboru" }).getByRole("button", { name: w, exact: true }).click();
  await noOverflow(page, "sentence builder");
  await shot(page, "m-child-11-sentence");
  await btn(page, "CHECK →").click();
  await btn(page, "Dalej →").click();
  await page.getByRole("radio", { name: "Can" }).click();
  await shot(page, "m-child-12-gap");
  await btn(page, "CHECK →").click();
  await btn(page, "Dalej →").click();
  await noOverflow(page, "speaking");
  await shot(page, "m-child-13-speaking");
  await btn(page, "Nie mogę teraz mówić").click();
  await page.getByText("Hi! What would you like?").waitFor();
  await noOverflow(page, "dialogue");
  await shot(page, "m-child-14-dialogue");
  for (const r of ["I'd like a hot chocolate, please.", "Small, please.", "Yes, please!", "No, thanks. How much is it?", "Here you are."]) await btn(page, r).click();
  await btn(page, "Zakończ lekcję →").click();
  await page.waitForURL("**/summary");
  await noOverflow(page, "summary");
  await shot(page, "m-child-15-summary");
  await btn(page, "Odbierz nagrodę →").click();
  await page.getByRole("heading", { name: "Level 2 odblokowany!" }).waitFor();
  await noOverflow(page, "reward");
  await shot(page, "m-child-16-reward");
  await btn(page, "Wróć do bazy →").click();
  await page.waitForURL("**/home");
  for (const [name, path] of [["practice", "/practice"], ["me", "/me"], ["settings", "/settings"], ["parent", "/parent"]]) {
    await page.goto(`${BASE}${path}`);
    await page.waitForLoadState("networkidle");
    await noOverflow(page, `child ${path}`);
    await shot(page, `m-child-17-${name}`);
  }
  await context.close();
}

const relevant = errors.filter((e) => !/speech|synthesis/i.test(e));
check("console is clean", relevant.length === 0, relevant.slice(0, 5).join(" | "));
await browser.close();
console.log(problems.length ? `\n${problems.length} problem(s): ${problems.join("; ")}` : "\nAll checks passed.");
process.exit(problems.length ? 1 : 0);
