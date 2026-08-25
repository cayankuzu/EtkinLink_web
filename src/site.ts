import "./styles.css";

const base = import.meta.env.BASE_URL;
const link = (path: string) => `${base}${path.replace(/^\//, "")}`;

const prototypeUrl =
  "https://www.figma.com/proto/RLPPToWydcFxLtnlvTr0mi/EtkinLink?node-id=32-1772&viewport=-607%2C-758%2C0.69&t=BmlrdaiaacIsarlK-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=97%3A386&show-proto-sidebar=1&page-id=12%3A8";

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
          <a href="${link("support.html")}">Destek</a>
          <a class="nav-cta" href="${prototypeUrl}" target="_blank" rel="noreferrer">Canlı prototipi aç <span aria-hidden="true">↗</span></a>
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
          <p>Etkinlik etrafında güvenli sosyalleşme ve karşılıklı eşleşme.</p>
          <p class="footer-note">18 yaş ve üzeri kullanıcılar içindir.</p>
        </div>
        <div class="footer-column">
          <h2>Ürün</h2>
          <a href="${link("index.html#nasil-calisir")}">Nasıl çalışır?</a>
          <a href="${prototypeUrl}" target="_blank" rel="noreferrer">Canlı prototip ↗</a>
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
        <span>Son güncelleme: 7 Ağustos 2026</span>
      </div>
    </footer>`;
}

type TourScreen = {
  src: string;
  label: string;
  alt: string;
};

const tourScreens: TourScreen[] = [
  {
    src: "assets/product/01-discover.png",
    label: "Keşfet",
    alt: "EtkinLink Keşfet ekranı: yaklaşan gerçek etkinlikler",
  },
  {
    src: "assets/product/03-event-detail.png",
    label: "Etkinlik",
    alt: "EtkinLink Karanlıkta Diyalog etkinlik detayı ekranı",
  },
  {
    src: "assets/product/05-event-room.png",
    label: "Oda",
    alt: "EtkinLink etkinlik odası ekranı",
  },
  {
    src: "assets/product/07-match.png",
    label: "Eşleşme",
    alt: "EtkinLink karşılıklı eşleşme ekranı",
  },
  {
    src: "assets/product/08-message.png",
    label: "Mesaj",
    alt: "EtkinLink bire bir mesaj ekranı",
  },
];

function initProductTour(): void {
  const tour = document.querySelector<HTMLElement>("[data-product-tour]");
  const image = document.querySelector<HTMLImageElement>("[data-tour-image]");
  const controls = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-tour-index]"),
  );
  if (!tour || !image || controls.length === 0) return;

  let index = 0;
  let paused = false;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  for (const screen of tourScreens.slice(1)) {
    const preload = new Image();
    preload.src = link(screen.src);
  }

  const show = (next: number): void => {
    index = (next + tourScreens.length) % tourScreens.length;
    const screen = tourScreens[index]!;
    image.classList.add("is-changing");
    window.setTimeout(
      () => {
        image.src = link(screen.src);
        image.alt = screen.alt;
        image.dataset.screen = screen.label;
        image.classList.remove("is-changing");
      },
      reduceMotion ? 0 : 120,
    );
    controls.forEach((control, controlIndex) => {
      const active = controlIndex === index;
      control.classList.toggle("is-active", active);
      control.setAttribute("aria-current", active ? "true" : "false");
    });
  };

  controls.forEach((control, controlIndex) => {
    control.addEventListener("click", () => show(controlIndex));
  });
  for (const eventName of ["pointerenter", "focusin"] as const) {
    tour.addEventListener(eventName, () => {
      paused = true;
    });
  }
  for (const eventName of ["pointerleave", "focusout"] as const) {
    tour.addEventListener(eventName, () => {
      paused = false;
    });
  }
  if (!reduceMotion) {
    window.setInterval(() => {
      if (!paused && document.visibilityState === "visible") show(index + 1);
    }, 2400);
  }
}

if (document.querySelector(".legal-hero"))
  document.body.classList.add("legal-body");
if (document.querySelector(".not-found"))
  document.body.classList.add("not-found-body");
if (document.querySelector(".support-page"))
  document.body.classList.add("support-body");

renderHeader();
renderFooter();
initProductTour();
