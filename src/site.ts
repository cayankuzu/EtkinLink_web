import "./styles.css";

const base = import.meta.env.BASE_URL;
const link = (path: string) => `${base}${path.replace(/^\//, "")}`;

function renderHeader(): void {
  const target = document.querySelector<HTMLElement>("[data-site-header]");
  if (!target) return;
  target.innerHTML = `
    <a class="skip-link" href="#main-content">İçeriğe geç</a>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="${link("index.html")}" aria-label="EtkinLink ana sayfa">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" role="img"><path d="M15.5 11.5h-2a8.5 8.5 0 0 0 0 17h5a8.5 8.5 0 0 0 7.7-4.9"/><path d="M24.5 28.5h2a8.5 8.5 0 0 0 0-17h-5a8.5 8.5 0 0 0-7.7 4.9"/><path d="M14.5 20h11"/></svg>
          </span>
          <span>EtkinLink</span>
        </a>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">
          <span class="sr-only">Menüyü aç</span>
          <span></span><span></span><span></span>
        </button>
        <nav id="site-nav" class="site-nav" aria-label="Ana navigasyon">
          <a href="${link("index.html#guvenlik")}">Güvenlik</a>
          <a href="${link("index.html#nasil-calisir")}">Nasıl çalışır?</a>
          <a href="${link("index.html#yasal")}">Yasal</a>
          <a class="nav-cta" href="${link("legal/child-safety.html")}">Çocuk Güvenliği</a>
        </nav>
      </div>
    </header>`;

  const button = target.querySelector<HTMLButtonElement>(".menu-button");
  const nav = target.querySelector<HTMLElement>(".site-nav");
  button?.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    nav?.classList.toggle("is-open", !expanded);
  });
}

function renderFooter(): void {
  const target = document.querySelector<HTMLElement>("[data-site-footer]");
  if (!target) return;
  target.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="brand brand-footer" href="${link("index.html")}">
            <span class="brand-mark" aria-hidden="true">↔</span><span>EtkinLink</span>
          </a>
          <p>Etkinlik etrafında güvenli sosyalleşme ve eşleşme platformu.</p>
          <p class="footer-note">18 yaş ve üzeri kullanıcılar içindir.</p>
        </div>
        <div>
          <h2>Güvenlik</h2>
          <a href="${link("legal/child-safety.html")}">Çocuk Güvenliği Standartları</a>
          <a href="${link("legal/community.html")}">Topluluk Kuralları</a>
          <a href="${link("legal/account-deletion.html")}">Hesap ve Veri Silme</a>
        </div>
        <div>
          <h2>Yasal</h2>
          <a href="${link("legal/kvkk.html")}">KVKK Aydınlatma Metni</a>
          <a href="${link("legal/privacy.html")}">Gizlilik Politikası</a>
          <a href="${link("legal/terms.html")}">Kullanım Koşulları</a>
        </div>
        <div>
          <h2>İletişim</h2>
          <a href="mailto:memodee333@gmail.com">memodee333@gmail.com</a>
          <a href="https://github.com/cayankuzu/EtkinLink_web/issues" rel="noreferrer">Güvenlik ve destek bildirimi</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© ${new Date().getFullYear()} EtkinLink · MeMoDe</span>
        <span>Son güncelleme: 7 Ağustos 2026</span>
      </div>
    </footer>`;
}

renderHeader();
renderFooter();
