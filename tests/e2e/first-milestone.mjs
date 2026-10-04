// End-to-end walk through the first milestone (child path).
// Usage: npm run build && npm run start -- -p 3100 & node tests/e2e/first-milestone.mjs
import { chromium } from "playwright";
import { existsSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = process.env.SHOTS ?? "tests/e2e/screenshots";
const exe = ["/opt/pw-browsers/chromium/chrome", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find((p) => existsSync(p));
mkdirSync(OUT, { recursive: true });

const problems = [];
const log = (msg) => console.log(msg);
function check(name, ok, detail = "") {
  log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) problems.push(name);
}

const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "pl-PL" });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
const text = (t, opts) => page.getByText(t, opts).first();
const button = (name, opts = {}) => page.getByRole("button", { name, ...opts });

// 1. Landing
await page.goto(BASE);
check("1. landing renders", await text("Angielski, który dzieje się naprawdę.").isVisible());
await shot("01-landing");
await page.getByRole("link", { name: "Zacznij naukę →" }).click();

// 2. Sign up
await page.waitForURL("**/auth**");
await button("Utwórz konto").click();
check("2a. empty form shows validation", await text("Wpisz poprawny adres e-mail").isVisible());
await page.getByLabel("E-mail").fill("anna.nowak@poczta.pl");
await page.getByLabel("Hasło").fill("kompas2026");
await page.getByText("Akceptuję regulamin").click();
await shot("02-auth");
await button("Utwórz konto").click();

// 3. Onboarding
await page.waitForURL("**/onboarding");
await shot("03-who");
await button(/Dla mojego dziecka/).click();
await page.waitForURL("**/onboarding/profile");
await page.getByLabel("Cześć! Jak masz na imię?").fill("Kuba");
await button("10", { exact: true }).click();
await shot("04-child-profile");
await button("Dalej", { exact: true }).click();
await page.waitForURL("**/onboarding/interests");
await button(/Gry/).click();
await button(/Szkoła/).click();
await shot("05-child-interests");
await button(/Dalej · wybrano 2/).click();
await page.waitForURL("**/onboarding/level");
await page.getByRole("radio", { name: /Tworzę proste zdania/ }).click();
await page.getByRole("radio", { name: /^15/ }).click();
await page.getByRole("radio", { name: /^10/ }).click();
await shot("06-child-level");
await page.reload();
check("3. onboarding choices survive a refresh", (await page.getByRole("radio", { name: /Tworzę proste zdania/ }).getAttribute("aria-checked")) === "true");
await button(/Krótki test/).click();

// 4. Placement
await page.waitForURL("**/onboarding/placement");
const answers = ["Pod stołem", "piórnik", "is", "Football", "I'm ten."];
for (const [i, a] of answers.entries()) {
  await text(`Pytanie ${i + 1} z 5`).waitFor();
  if (i === 0) {
    await button(/Odtwórz nagranie/).click();
    await shot("07-child-placement");
  }
  await page.getByRole("radio", { name: a }).click();
  await button("Dalej", { exact: true }).click();
}
await page.waitForURL("**/onboarding/result");
check("4. placement gives a level", await text("Twój poziom: A1 Explorer").isVisible());
check("4b. skipped worlds are named", await text(/Pomijasz Hello World i Home/).isVisible());
await shot("08-child-result");
await button("START ADVENTURE →").click();

// 5. Dashboard
await page.waitForURL("**/home");
check("5. dashboard greets the learner", await text("Cześć, Kuba!").isVisible());
check("5b. next mission comes from data", await text("Ordering at a café").first().isVisible());
await shot("09-dashboard-fresh");

// 6. Journey
await page.getByRole("link", { name: /Podróż/ }).first().click();
await page.waitForURL("**/journey");
const island = (name) => page.getByRole("region", { name, exact: true });
await island("Food Town").getByText("TU JESTEŚ").waitFor();
check("6. Food Town is current, on mission 7 of 10", await button("Misja 7: Ordering at a café, tu jesteś").isVisible());
check("6a. level A1 starts at 0 of 400 words and 0 of 50 missions", (await text("0 / 400").isVisible()) && (await text("0 / 50").isVisible()));
check("6a. the map shows every mission of the level", (await page.getByRole("button", { name: /^Misja \d+:/ }).count()) === 50);
await island("City").getByRole("button", { name: /słów/ }).click();
check("6b. City is locked behind Food Town", await text("Odblokujesz po: Food Town").first().isVisible());
await shot("10-journey");
await island("Food Town").getByRole("button", { name: /słów/ }).click();
await page.getByRole("link", { name: "Wejdź do Food Town" }).first().click();

// 7. World → lesson
await page.waitForURL("**/journey/child.food-town");
await shot("11-food-town");
await page.getByRole("link", { name: /LEKCJA 7 · NASTĘPNA/ }).click();
await page.waitForURL("**/lesson/child.food-town.ordering-at-a-cafe");
await shot("12-lesson-start");
await page.getByRole("link", { name: "START LESSON →" }).click();
await page.waitForURL("**/play");

// 8–9. Exercises
const progressNow = () => page.getByRole("progressbar").getAttribute("aria-valuenow");
const xpText = () => page.locator("header [aria-live=polite]").innerText();

// 8.1 matching (with one mistake)
await text("Połącz pary ze słowami z kawiarni").waitFor();
await button("menu", { exact: true }).click();
await button("rachunek", { exact: true }).click();
check("9a. wrong pair is explained, not just coloured", await text(/Te słowa nie tworzą pary/).isVisible());
await shot("13-ex1-matching-mistake");
for (const [l, r] of [["menu", "karta dań"], ["a cup", "filiżanka"], ["hot", "gorący"], ["the bill", "rachunek"], ["sweet", "słodki"]]) {
  await button(l, { exact: true }).click();
  await button(r, { exact: true }).click();
}
await text("Komplet! Wszystkie pary.").waitFor();
check("9b. XP after a mistake is halved", (await xpText()).includes("+10"), await xpText());
await button("Dalej →").click();

// 8.2 image choice (wrong, then right)
await text("Który obrazek pokazuje…").waitFor();
check("8. progress bar moves", (await progressNow()) === "1");
await page.getByRole("radio", { name: "Obrazek 1" }).click();
await button("CHECK →").click();
await text("Prawie! Spójrz jeszcze raz.").waitFor();
await shot("14-ex2-image-feedback-almost");
await button("Spróbuj ponownie").click();
await page.getByRole("radio", { name: "Obrazek 3" }).click();
await button("CHECK →").click();
await text("Świetnie! A sandwich.").waitFor();
await shot("15-ex2-image-feedback-correct");
await button("Dalej →").click();

// refresh in the middle of the lesson
await text("What did Emma order?").waitFor();
await page.reload();
await text("What did Emma order?").waitFor();
check("16a. refresh mid-lesson resumes on the same task", (await progressNow()) === "2");

// 8.3 listening
await button("Odtwórz nagranie").click();
check("L. play button reports its state", await button(/Zatrzymaj nagranie|Posłuchaj jeszcze raz/).isVisible());
await page.getByRole("radio", { name: "Obrazek 2" }).click();
await shot("16-ex3-listening");
await button("CHECK →").click();
await text("Świetnie! Orange juice.").waitFor();
await button("Dalej →").click();

// 8.4 sentence builder (wrong with "want", undo, reset, right)
await text("Ułóż zamówienie po angielsku").waitFor();
const bank = page.getByRole("group", { name: "Słowa do wyboru" });
for (const w of ["I'd", "want", "a", "hot", "chocolate,", "please."]) await bank.getByRole("button", { name: w, exact: true }).click();
await button("CHECK →").click();
check("11a. distractor gets its own explanation", await text(/„I want…” brzmi w kawiarni zbyt bezpośrednio/).isVisible());
await shot("17-ex4-sentence-almost");
await button("Spróbuj ponownie").click();
await bank.getByRole("button", { name: "I'd", exact: true }).click();
await bank.getByRole("button", { name: "a", exact: true }).click();
await button("Cofnij").click();
check("11b. undo removes the last word", (await page.getByRole("group", { name: "Twoje zdanie" }).getByRole("button").count()) === 1);
await button("Wyczyść").click();
check("11c. reset clears the sentence", (await page.getByRole("group", { name: "Twoje zdanie" }).getByRole("button").count()) === 0);
for (const w of ["I'd", "like", "a", "hot", "chocolate,", "please."]) await bank.getByRole("button", { name: w, exact: true }).click();
await shot("18-ex4-sentence-built");
await button("CHECK →").click();
await text("Idealne zamówienie!").waitFor();
await button("Dalej →").click();

// 8.5 fill the gap
await text("Które słowo pasuje?").waitFor();
await page.getByRole("radio", { name: "Can" }).click();
await shot("19-ex5-fill-gap");
await button("CHECK →").click();
await text("Dobrze! Can I have…?").waitFor();
await button("Dalej →").click();

// 8.6 speaking (headless browser: no working recogniser → honest fallback)
await text("“Can I have a croissant, please?”").waitFor();
await shot("20-ex6-speaking");
const mic = button("Naciśnij i mów");
if (await mic.isVisible()) {
  await mic.click();
  await page.getByText(/Rozpoznawanie mowy nie zadziałało|Nie mamy dostępu do mikrofonu|Nic nie usłyszeliśmy|Ta przeglądarka nie rozpoznaje mowy/).waitFor({ timeout: 15000 });
}
check("10. speaking falls back without pretending to assess", await button("Powiedziałem / powiedziałam na głos").isVisible());
await shot("21-ex6-speaking-fallback");
await button("Powiedziałem / powiedziałam na głos").click();
await text(/Tym razem nie sprawdzaliśmy nagrania/).waitFor();
await button("Dalej →").click();

// 8.7 café dialogue (one wrong reply, then a full branch)
await text("Zamów coś dla siebie").waitFor();
await text("Hi! What would you like?").waitFor();
await button("I like hot chocolate.").click();
check("10b. wrong reply gives a hint and stays on the same turn", await text(/„I like” = lubię/).isVisible());
await shot("22-ex7-dialogue-hint");
for (const [reply, expect] of [
  ["I'd like a hot chocolate, please.", "Sure! Small or large?"],
  ["A large one, please.", "Would you like cream on top?"],
  ["Yes, please!", "Anything else?"],
  ["And a croissant, please.", "That's five pounds ten, please."],
  ["Can I pay by card?", "Of course. Just tap here."],
  ["Thank you!", "Here you go. Enjoy your hot chocolate!"],
]) {
  await button(reply).click();
  await text(expect).waitFor();
}
check("10c. dialogue reached its ending through the chosen branch", await text("Scenka zaliczona! Zamówienie przyjęte.").isVisible());
await shot("23-ex7-dialogue-done");
await button("Zakończ lekcję →").click();

// 11–12. Summary + XP
await page.waitForURL("**/summary");
await text("Teraz potrafisz zamówić napój w kawiarni.").waitFor();
// 4 exercises had a mistake: matching 10, image 5, sentence 8, dialogue 15; clean: 10 + 10 + 15; bonus 10 → 83
check("12. XP is computed from results", await text("+83", { exact: true }).isVisible());
check("11. accuracy is computed from results", await text("43%", { exact: true }).isVisible());
check("11b. mistakes are listed for review", await text("I like ≠ I'd like").isVisible());
await shot("24-summary");
const hasReward = await button("Odbierz nagrodę →").isVisible();
check("12b. no level-up below 100 XP", !hasReward);
await button("Wróć do bazy →").click();

// 13. Saved progress
await page.waitForURL("**/home");
check("13. dashboard shows the finished lesson", await text("OSTATNIA LEKCJA").isVisible() && (await text(/43% trafnych · \+83 XP/).isVisible()));
check("13b. XP bar updated", await text("83 / 100 XP").first().isVisible());
await shot("25-dashboard-after");
await page.getByRole("link", { name: /Podróż/ }).first().click();
await page.waitForURL("**/journey");
await button("Misja 7: Ordering at a café, ukończona").waitFor();
check("13c. one mission is done, Food Town is not: 1 of 10", await island("Food Town").getByText("6 / 80 słów · 1 / 10 misji").isVisible());
check("13d. level A1 counts the lesson's words, not the whole level", (await text("6 / 400").isVisible()) && (await text("1 / 50").isVisible()));
check("13e. A1 is still the current level", (await page.getByRole("tab", { name: /^A1/ }).getAttribute("aria-selected")) === "true" && (await text(/w trakcie · 2%/).isVisible()));
check("15b. City no longer waits for Food Town", await island("City").getByText("W PRZYGOTOWANIU").isVisible());
await shot("26-journey-after");

// 14–15. Practice
await page.getByRole("link", { name: /Trening/ }).first().click();
await page.waitForURL("**/practice");
for (const concept of ["menu", "the bill", "a sandwich", "I like ≠ I'd like", "I'd like + a + … + please"]) {
  check(`15. practice lists “${concept}”`, await page.getByRole("listitem").filter({ hasText: concept }).first().isVisible());
}
await shot("27-practice");
await page.getByRole("link", { name: /Start powtórki/ }).click();
await page.waitForURL("**/practice/session");
let guard = 0;
while (!(await text("Powtórka skończona!").isVisible()) && guard++ < 12) {
  const group = page.getByRole("group", { name: "Słowa do wyboru" });
  if (await group.isVisible()) {
    for (const w of ["I'd", "like", "a", "sandwich,", "please."]) await group.getByRole("button", { name: w, exact: true }).click();
  } else {
    await page.getByRole("radio").first().click();
  }
  if (guard === 1) await shot("28-practice-session");
  await button("CHECK →").click();
  const retry = button("Spróbuj ponownie");
  const next = page.getByRole("button", { name: /Dalej →|Zakończ powtórkę →/ });
  await retry.or(next).first().waitFor();
  while (await retry.isVisible()) {
    // wrong first pick: try the remaining options one by one
    await retry.click();
    const radios = page.getByRole("radio");
    const n = await radios.count();
    for (let i = 1; i < n; i++) {
      await radios.nth(i).click();
      await button("CHECK →").click();
      await retry.or(next).first().waitFor();
      if (await next.isVisible()) break;
      await retry.click();
    }
  }
  await next.click();
}
check("14. practice session runs to the end", await text("Powtórka skończona!").isVisible());
await shot("29-practice-done");
await button("Wróć do Treningu").click();
await page.waitForURL("**/practice");

// 16. Refresh
await page.reload();
await text(/Wszystkie powtórki/).waitFor();
await page.goto(`${BASE}/home`);
await text("Cześć, Kuba!").waitFor();
check("16. progress survives a full reload", await text("83 / 100 XP").first().isVisible());
await page.goto(`${BASE}/me`);
await page.getByRole("heading", { name: "Ukończone lekcje" }).waitFor();
await shot("30-me");
await page.goto(`${BASE}/parent`);
await text("Postęp: Kuba").waitFor();
await shot("31-parent");

// Second run: clean replay → level up and reward screen
await page.goto(`${BASE}/lesson/child.food-town.ordering-at-a-cafe`);
await page.getByRole("link", { name: "POWTÓRZ LEKCJĘ →" }).click();
await text("Połącz pary ze słowami z kawiarni").waitFor();
for (const [l, r] of [["menu", "karta dań"], ["a cup", "filiżanka"], ["hot", "gorący"], ["the bill", "rachunek"], ["sweet", "słodki"]]) {
  await button(l, { exact: true }).click();
  await button(r, { exact: true }).click();
}
await button("Dalej →").click();
await page.getByRole("radio", { name: "Obrazek 3" }).click();
await button("CHECK →").click();
await button("Dalej →").click();
await page.getByRole("radio", { name: "Obrazek 2" }).click();
await button("CHECK →").click();
await button("Dalej →").click();
for (const w of ["I'd", "like", "a", "hot", "chocolate,", "please."]) await page.getByRole("group", { name: "Słowa do wyboru" }).getByRole("button", { name: w, exact: true }).click();
await button("CHECK →").click();
await button("Dalej →").click();
await page.getByRole("radio", { name: "Can" }).click();
await button("CHECK →").click();
await button("Dalej →").click();
await button("Nie mogę teraz mówić").click();
for (const reply of ["I'd like a hot chocolate, please.", "Small, please.", "No, thank you.", "No, thanks. How much is it?", "Here you are."]) await button(reply).click();
await text("That's two pounds eighty, please.").waitFor();
await button("Zakończ lekcję →").click();
await page.waitForURL("**/summary");
check("R. replay pays only the improvement and levels up", await button("Odbierz nagrodę →").isVisible());
await button("Odbierz nagrodę →").click();
await text("Level 2 odblokowany!").waitFor();
await shot("32-reward");
await button("Wróć do bazy →").click();
await page.waitForURL("**/home");
// best run: 105 (speaking skipped) → +22 on top of 83
check("R2. total XP after replay", await text("Level 2").first().isVisible() && (await text("5 / 200 XP").first().isVisible()));

const relevant = consoleErrors.filter((e) => !/speech|synthesis/i.test(e));
check("console is clean", relevant.length === 0, relevant.slice(0, 5).join(" | "));

await browser.close();
log(problems.length ? `\n${problems.length} problem(s): ${problems.join("; ")}` : "\nAll checks passed.");
process.exit(problems.length ? 1 : 0);
