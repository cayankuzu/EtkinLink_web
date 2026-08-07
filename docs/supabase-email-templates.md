# Supabase e-posta bağlantıları

EtkinLink web sayfaları hem Supabase'in varsayılan `ConfirmationURL` akışını hem de aşağıdaki doğrudan `TokenHash` akışını destekler. Özel şablon kullanılacaksa bağlantıları değiştirmeden kopyalayın.

## Kayıt doğrulama

Supabase Dashboard → Authentication → Emails → Templates → Confirm sign up:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">
  E-posta adresimi doğrula
</a>
```

Mobil istemci `emailRedirectTo` olarak şu adresi gönderir:

```text
https://cayankuzu.github.io/EtkinLink_web/auth/confirm.html
```

## Şifre yenileme

Supabase Dashboard → Authentication → Emails → Templates → Reset password:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery">
  Şifremi yenile
</a>
```

Mobil istemci `redirectTo` olarak şu adresi gönderir:

```text
https://cayankuzu.github.io/EtkinLink_web/auth/reset-password.html
```

## Redirect allow list

Supabase Dashboard → Authentication → URL Configuration → Redirect URLs alanına iki tam adresi ekleyin:

```text
https://cayankuzu.github.io/EtkinLink_web/auth/confirm.html
https://cayankuzu.github.io/EtkinLink_web/auth/reset-password.html
```

`service_role` veya secret API anahtarı hiçbir zaman şablona, bu web sitesine veya mobil uygulamaya eklenmemelidir.
