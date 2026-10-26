# EtkinLink Web

EtkinLink mobil uygulamasının minimal ürün sitesi, yasal/şeffaflık merkezi, destek sayfası ile e-posta doğrulama ve şifre yenileme ekranları. Figma’daki responsive tasarım sistemi Vite, TypeScript ve Supabase JS ile uygulanır; GitHub Pages üzerinde statik olarak yayınlanır.

## Sayfalar

- Ana sayfa ve beş adımlık “Nasıl çalışır?” bölümü (Keşfet, Etkinlik, Oda, Mesajlar, Profil)
- Destek sayfası: e-posta adresi, form (`mailto:` üzerinden cihazın e-posta uygulamasına güvenli aktarım) ve hesap silme bağlantısı
- KVKK Aydınlatma Metni
- Gizlilik Politikası
- Kullanım Koşulları
- Çocuk Güvenliği Standartları
- Topluluk Kuralları
- Hesap ve Veri Silme
- Sürümlü yasal metinler: `legal/<belge>-<tarih>.html` (aşağıya bakın)
- Navigasyonda gösterilmeyen `/auth/confirm.html`
- Navigasyonda gösterilmeyen `/auth/reset-password.html`
- Özel 404 sayfası

Sitede şu an ürün ekran görüntüsü yoktur: 1.0.18 prototipinin ve Figma tasarımının görselleri kaldırıldı, “Nasıl çalışır?” bölümü yalnız metindir. 1.0.19’un gerçek ekran görüntüleri hazır olduğunda eklenir. Marka görselleri (bilet + konuşma balonu) mobil uygulamanın `mobile/src/assets/images/etkinlink-*.png` varlıklarından küçültülmüştür; fontlar mobil uygulamanın takip edilen varlıklarından alınmıştır. Placeholder veya uydurma profil/etkinlik verisi üretilmez.

## Sürümlü yasal metinler

Uygulama Kullanım Koşulları, Gizlilik Politikası ve KVKK metnini sürüm kimliğiyle kaydeder. Her kimliğin metni kendi değişmez adresinde kalır:

| Kimlik                                                      | Adres                                                                                        |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `terms-2026-09-14`, `privacy-2026-09-14`, `kvkk-2026-09-14` | `legal/terms-2026-09-14.html`, `legal/privacy-2026-09-14.html`, `legal/kvkk-2026-09-14.html` |
| `terms-2026-10-21`, `privacy-2026-10-21`, `kvkk-2026-10-21` | `legal/terms-2026-10-21.html`, `legal/privacy-2026-10-21.html`, `legal/kvkk-2026-10-21.html` |

`legal/terms.html`, `legal/privacy.html` ve `legal/kvkk.html` güncel metnin birebir kopyasıdır; uygulama bu adresleri açar. Güncel kopya, sunucudaki kimlik değiştiği oturumda (production `db push`) değiştirilir. Yayımlanmış bir sürüm dosyası düzenlenmez; her düzeltme yeni kimlik ve yeni dosya alır.

`*-2026-09-14.html` arşivleri, yayımlandıkları baytlarla aynı kalmalıdır. Bu yüzden:

- `src/site.ts` ve `src/styles.css` yalnız bu üç arşiv sayfası tarafından yüklenir; diğer bütün sayfalar `src/main.ts` ve `src/main.css` kullanır. Site değişiklikleri bu iki dosyaya yapılır.
- Arşiv HTML'i `assets/site-BzGedLMH.js` ve `assets/site-E29y09jf.css` adlarını içerir. `src/styles.css` **dondurulmuştur**; CSS dosyasının adı içeriğinden hesaplanır.
- `src/site.ts` arşivlerin başlığını ve altbilgisini çizer. İçeriği değişebilir, ama `vite.config.ts` bu chunk'ın adını `assets/site-BzGedLMH.js` olarak sabitler (`frozenSiteChunk`). 26 Ekim 2026'da prototip bağlantıları, eski ürün turu ve eski altbilgi cümlesi bu dosyadan kaldırıldı; arşiv HTML'i değişmedi.
- `keepFrozenSiteChunk` eklentisi, Vite'ın modulepreload polyfill'ini yalnız `src/site.ts` yükleyen sayfalarda bırakır. Aksi halde polyfill ayrı bir chunk'a taşınır ve arşiv sayfalarına yeni bir `<link rel="modulepreload">` eklenir.
- Derlemeden sonra `dist/legal/*-2026-09-14.html` dosyalarının SHA-256 değerini aşağıdaki yayımlanmış değerlerle karşılaştırın. Vite veya Rollup sürümü yükseltilirse bu kontrolü mutlaka yapın.

| Dosya                           | SHA-256                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| `legal/terms-2026-09-14.html`   | `fd86673c01373f95281be0280cdda106f8e70317c5981f3fe7cb0dfb11e9328b` |
| `legal/privacy-2026-09-14.html` | `39b92c9eb0d2e6d093fe2964cd2a798a73344871073a24bee16c5c60b57216f4` |
| `legal/kvkk-2026-09-14.html`    | `f9c8f7f562af5798fbf488593cb6b97a75ef5eadd6a4383f2f36e86f9d3fe8cb` |

Destek sayfası herhangi bir sunucuda form verisi saklamaz. Doğrulanan form alanları cihazdaki varsayılan e-posta uygulamasında `memodee333@gmail.com` adresli bir taslağa dönüştürülür; mesaj ancak kullanıcı e-posta uygulamasında **Gönder** düğmesine bastığında iletilir.

Şifre yenileme formu tek parola alanı kullanır; tekrar alanı yoktur. Parola 10–72 karakter olmalı, büyük/küçük harf ve rakam içermelidir. Göz düğmesi görünürlüğü değiştirir.

## Yerel geliştirme

Node.js 22 veya üstü gerekir.

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

`.env` içine yalnızca Supabase proje URL'si ve **publishable** anahtarı eklenir:

```text
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

`service_role`, secret key, SMTP anahtarı veya veritabanı parolası istemci tarafına eklenmez.

## Kalite kontrolleri

```powershell
npm run check
npm run build
```

Responsive QA hedefleri: Desktop 1440, Tablet 1024, Mobile 390 ve Small Mobile 320.

## GitHub Pages

`.github/workflows/pages.yml`, `main` dalındaki her push'ta projeyi derleyip Pages artifact'i oluşturur. Repo ayarlarında **Settings → Pages → Source: GitHub Actions** seçilmelidir.

Workflow için iki repository secret gerekir:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Yayın adresi: <https://cayankuzu.github.io/EtkinLink_web/>

## Supabase yapılandırması

Gerekli redirect allow list ve isteğe bağlı güvenli e-posta şablonları [docs/supabase-email-templates.md](./docs/supabase-email-templates.md) içinde açıklanır.

Kimlik doğrulama sayfaları tokenları loglamaz, URL'den temizler ve tarama motorlarına `noindex` bildirir. `robots.txt` ayrıca `/auth/` yolunu taramaya kapatır.
