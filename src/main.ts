// Shared header and footer for every page except the archived legal texts.
// `src/site.ts` and `src/styles.css` are frozen: they only serve the pages
// whose published bytes must not change (see README, "Sürümlü yasal
// metinler"). Change the site here and in `src/main.css`.
import "./main.css";

const base = import.meta.env.BASE_URL;
const link = (path: string) => `${base}${path.replace(/^\//, "")}`;

function brandMarkup(footer = false): string {
  return `
    <a class="brand${footer ? " brand-footer" : ""}" href="${link("index.html")}" aria-label="EtkinLink ana sayfa">
      <img class="brand-symbol" src="${link("assets/brand/symbol.png")}" alt="" width="48" height="48" />
      <span>EtkinLink</span>
    </a>`;
}

function renderHeader(): void {
  const target = document.querySelector<HTMLElement>("[data-site-header]");
  if (!target) return;
  target.innerHTML = `
    <a class="skip-link" href="#main-content">İçeriğe geç</a>
    <header class="site-header">
      <div class="container header-inner">
        ${brandMarkup()}
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">
          <span class="sr-only">Menüyü aç</span>
          <span></span><span></span><span></span>
        </button>
        <nav id="site-nav" class="site-nav" aria-label="Ana navigasyon">
          <a href="${link("index.html#nasil-calisir")}">Nasıl çalışır?</a>
          <a href="${link("legal/child-safety.html")}">Güvenlik</a>
          <a href="${link("legal/account-deletion.html")}">Hesap silme</a>
          <a class="nav-cta" href="${link("support.html")}">Destek</a>
        </nav>
      </div>
    </header>`;

  const button = target.querySelector<HTMLButtonElement>(".menu-button");
  const nav = target.querySelector<HTMLElement>(".site-nav");
  const label = button?.querySelector<HTMLElement>(".sr-only");

  const setMenu = (open: boolean): void => {
    if (!button || !nav) return;
    button.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (label) label.textContent = open ? "Menüyü kapat" : "Menüyü aç";
  };

  button?.addEventListener("click", () => {
    setMenu(button.getAttribute("aria-expanded") !== "true");
  });
  nav?.addEventListener("click", (event) => {
    if ((event.target as Element).closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      button?.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      button.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (
      button?.getAttribute("aria-expanded") === "true" &&
      !target.contains(event.target as Node)
    ) {
      setMenu(false);
    }
  });
}

function renderFooter(): void {
  const target = document.querySelector<HTMLElement>("[data-site-footer]");
  if (!target) return;
  target.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-intro">
          ${brandMarkup(true)}
          <p>Etkinlik keşfi ve etkinlik odaları.</p>
          <p class="footer-note">18 yaş ve üzeri kullanıcılar içindir.</p>
        </div>
        <div class="footer-column">
          <h2>Ürün</h2>
          <a href="${link("index.html#nasil-calisir")}">Nasıl çalışır?</a>
          <a href="${link("support.html")}">Destek</a>
        </div>
        <div class="footer-column">
          <h2>Güvenlik</h2>
          <a href="${link("legal/child-safety.html")}">Çocuk Güvenliği</a>
          <a href="${link("legal/community.html")}">Topluluk Kuralları</a>
          <a href="${link("legal/account-deletion.html")}">Hesap ve Veri Silme</a>
        </div>
        <div class="footer-column">
          <h2>Yasal</h2>
          <a href="${link("legal/kvkk.html")}">KVKK</a>
          <a href="${link("legal/privacy.html")}">Gizlilik</a>
          <a href="${link("legal/terms.html")}">Kullanım Koşulları</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© ${new Date().getFullYear()} EtkinLink · MeMoDe</span>
        <span>Son güncelleme: 26 Ekim 2026</span>
      </div>
    </footer>`;
}

if (document.querySelector(".legal-hero"))
  document.body.classList.add("legal-body");
if (document.querySelector(".not-found"))
  document.body.classList.add("not-found-body");
if (document.querySelector(".support-page"))
  document.body.classList.add("support-body");

renderHeader();
renderFooter();
