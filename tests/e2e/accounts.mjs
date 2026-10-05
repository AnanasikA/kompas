// Accounts: the three permanent test accounts, logging out and back in, and
// several accounts side by side on one device.
// Usage: npm run build && npm run start -- -p 3100 & node tests/e2e/accounts.mjs
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
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "pl-PL" });
const page = await context.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()} ${m.text()}`));
page.on("pageerror", (e) => errors.push(`${page.url()} pageerror: ${e.message}`));
const btn = (name, opts = {}) => page.getByRole("button", { name, ...opts });

async function signOut() {
  await page.goto(`${BASE}/settings`);
  await btn("Wyloguj", { exact: true }).click();
  await btn("Tak, wyloguj").click();
  await page.waitForURL(`${BASE}/`);
}

const DEMOS = [
  ["CHILD", /Dziecko 8–12/, "Zosia", "dziecko@kompas.test"],
  ["TEEN", /Nastolatek 13–17/, "Kuba", "nastolatek@kompas.test"],
  ["ADULT", /Dorosły 18\+/, "Anna", "dorosly@kompas.test"],
];

// 1. One click opens each test account in its own mode.
for (const [age, label, name, email] of DEMOS) {
  await page.goto(`${BASE}/auth?mode=login`);
  await btn(label).click();
  await page.waitForURL("**/home");
  await page.waitForSelector(`[data-age="${age}"]`);
  check(`${email}: opens the ${age} dashboard`, true);
  check(`${email}: greets ${name}`, (await page.getByText(name).count()) > 0);
  await page.screenshot({ path: `${OUT}/acc-${age.toLowerCase()}-home.png`, fullPage: true });
  await page.goto(`${BASE}/settings`);
  await page.getByRole("heading", { name: "Ustawienia" }).waitFor();
  check(`${email}: settings show the account`, await page.getByText(email).first().isVisible());
  if (age === "CHILD") {
    await page.getByRole("radio", { name: "20 min" }).click();
    check("child: daily goal changed to 20 min", (await page.getByRole("radio", { name: "20 min" }).getAttribute("aria-checked")) === "true");
  }
  await signOut();
}

// 2. Typed e-mail + password works, and the child account kept its change.
await page.goto(`${BASE}/auth?mode=login`);
await page.getByLabel("E-mail").fill("dziecko@kompas.test");
await page.getByLabel("Hasło").fill("zle-haslo");
await btn("Zaloguj się", { exact: true }).last().click();
check("wrong password is refused", await page.getByText("Hasło się nie zgadza").isVisible());
await page.getByLabel("Hasło").fill("kompas123");
await btn("Zaloguj się", { exact: true }).last().click();
await page.waitForURL("**/home");
await page.goto(`${BASE}/settings`);
await page.getByRole("heading", { name: "Ustawienia" }).waitFor();
check(
  "child account kept its settings after logging out and in",
  (await page.getByRole("radio", { name: "20 min" }).getAttribute("aria-checked")) === "true",
);
await page.reload();
await page.waitForSelector('[data-age="CHILD"]');
check("refresh keeps the session", page.url().endsWith("/settings"));
await signOut();

// 3. A test e-mail cannot be taken over by a new sign-up.
await page.goto(`${BASE}/auth?mode=signup`);
await page.getByLabel("E-mail").fill("dorosly@kompas.test");
await page.getByLabel("Hasło").fill("cokolwiek1");
await page.getByText("Akceptuję regulamin").click();
await btn("Utwórz konto").click();
check("sign-up with an existing e-mail is refused", await page.getByText("Konto z tym adresem już istnieje").isVisible());

// 4. A new account lives next to the test accounts and survives logging out.
await page.getByLabel("E-mail").fill("nowa.osoba@poczta.pl");
await btn("Utwórz konto").click();
await page.waitForURL("**/onboarding");
await btn(/Dla mojego dziecka/).click();
await page.waitForURL("**/onboarding/profile");
await page.getByLabel("Cześć! Jak masz na imię?").fill("Ola");
await page.goto(`${BASE}/auth?mode=login`);
await btn(/Nastolatek 13–17/).click();
await page.waitForURL("**/home");
await page.waitForSelector('[data-age="TEEN"]');
await signOut();
await page.goto(`${BASE}/auth?mode=login`);
await page.getByLabel("E-mail").fill("nowa.osoba@poczta.pl");
await page.getByLabel("Hasło").fill("cokolwiek1");
await btn("Zaloguj się", { exact: true }).last().click();
await page.waitForURL("**/onboarding");
await btn(/Dla mojego dziecka/).click();
await page.waitForURL("**/onboarding/profile");
check(
  "new account resumes its own onboarding after another account was used",
  (await page.getByLabel("Cześć! Jak masz na imię?").inputValue()) === "Ola",
);

// 5. The login screen fits a phone.
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "pl-PL", isMobile: true, hasTouch: true });
const p2 = await phone.newPage();
await p2.goto(`${BASE}/auth?mode=login`);
await p2.waitForLoadState("networkidle");
const { scroll, inner } = await p2.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: document.documentElement.clientWidth }));
check("login screen: no sideways scroll on a phone", scroll <= inner + 1, `${scroll}px in ${inner}px`);
await p2.screenshot({ path: `${OUT}/acc-login-phone.png`, fullPage: true });
await page.goto(`${BASE}/auth?mode=login`);
await page.waitForLoadState("networkidle"); // a screenshot before hydration would alter the inputs
await page.screenshot({ path: `${OUT}/acc-login.png`, fullPage: true });

// 6. Test build extras: installable app and the feedback tab.
const manifest = await (await page.request.get(`${BASE}/manifest.webmanifest`)).json();
check("manifest: installable (name, standalone, 192 + 512 icons)", manifest.short_name === "Kompas" && manifest.display === "standalone" && manifest.icons.length === 3);
for (const icon of manifest.icons) check(`manifest: ${icon.src} is served`, (await page.request.get(`${BASE}${icon.src}`)).status() === 200);
await context.grantPermissions(["clipboard-read", "clipboard-write"]);
// The note is posted to a form-to-e-mail service. The test answers in its place: nothing leaves the machine.
const posted = [];
let deliver = true;
await page.route("https://formsubmit.co/**", async (route) => {
  posted.push({ url: route.request().url(), body: route.request().postDataJSON() });
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(deliver ? { success: "true", message: "ok" } : { success: "false", message: "This form needs Activation." }) });
});
await page.goto(`${BASE}/auth?mode=login`);
await page.waitForLoadState("networkidle");
await btn("UWAGI").click();
check("feedback: cannot send an empty note", await btn("Wyślij uwagę").isDisabled());
await page.getByLabel("Twoja uwaga").fill("Przycisk jest za mały");
await btn("Wyślij uwagę").click();
await page.getByText("Dziękujemy! Uwaga wysłana.").waitFor();
const sentNote = posted[0]?.body ?? {};
check("feedback: one click sends the note to the author's inbox", posted.length === 1 && posted[0].url.endsWith("/ajax/anastasiia.kupriianets@outlook.com"), posted[0]?.url);
check("feedback: the note carries the text and the screen it was written on", sentNote.Uwaga === "Przycisk jest za mały" && sentNote.Ekran === "/auth" && String(sentNote._subject).includes("/auth"), JSON.stringify(sentNote).slice(0, 120));
check("feedback: the field is cleared after sending", (await page.getByLabel("Twoja uwaga").inputValue()) === "");
deliver = false;
await page.getByLabel("Twoja uwaga").fill("Druga uwaga");
await btn("Wyślij uwagę").click();
await page.getByText("Nie udało się wysłać.").waitFor();
check("feedback: when sending fails the text is kept", (await page.getByLabel("Twoja uwaga").inputValue()) === "Druga uwaga");
await btn("Skopiuj uwagę").click();
await page.getByText("Skopiowano.").waitFor();
const copied = await page.evaluate(() => navigator.clipboard.readText());
check("feedback: …and can be copied instead", copied.includes("Druga uwaga") && copied.includes("ekran: /auth"), copied.slice(0, 60).replace(/\n/g, " "));
check("feedback: no separate e-mail button", (await page.getByRole("link", { name: "E-mailem" }).count()) === 0);
await btn("Zamknij").click();
check("feedback: the tab stays out of the way on a phone", await (async () => {
  await p2.goto(`${BASE}/auth?mode=login`);
  await p2.waitForLoadState("networkidle");
  const box = await p2.getByRole("button", { name: "UWAGI" }).boundingBox();
  const fits = await p2.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  return fits && !!box && box.width <= 16 && box.x + box.width <= 391;
})());

check("no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
await browser.close();
console.log(problems.length ? `\n${problems.length} problem(s)` : "\nAccounts: all checks passed");
process.exit(problems.length ? 1 : 0);
