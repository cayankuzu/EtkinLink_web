# EtkinLink Web

EtkinLink mobil uygulamasının yasal/şeffaflık merkezi ile e-posta doğrulama ve şifre yenileme sayfaları. Vite, TypeScript ve Supabase JS ile hazırlanmıştır; GitHub Pages üzerinde statik olarak yayınlanır.

## Sayfalar

- Ana sayfa ve ürün/güvenlik özeti
- KVKK Aydınlatma Metni
- Gizlilik Politikası
- Kullanım Koşulları
- Çocuk Güvenliği Standartları
- Topluluk Kuralları
- Hesap ve Veri Silme
- Navigasyonda gösterilmeyen `/auth/confirm.html`
- Navigasyonda gösterilmeyen `/auth/reset-password.html`

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

## GitHub Pages

`.github/workflows/pages.yml`, `main` dalındaki her push'ta projeyi derleyip Pages artifact'i oluşturur. Repo ayarlarında **Settings → Pages → Source: GitHub Actions** seçilmelidir.

Workflow için iki repository secret gerekir:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Yayın adresi: <https://cayankuzu.github.io/EtkinLink_web/>

## Supabase yapılandırması

Gerekli redirect allow list ve isteğe bağlı güvenli e-posta şablonları [docs/supabase-email-templates.md](./docs/supabase-email-templates.md) içinde açıklanır.

Kimlik doğrulama sayfaları tokenları loglamaz, URL'den temizler ve tarama motorlarına `noindex` bildirir. `robots.txt` ayrıca `/auth/` yolunu taramaya kapatır.
