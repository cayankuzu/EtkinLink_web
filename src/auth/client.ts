import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getAuthClient(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) {
    throw new Error("Kimlik doğrulama hizmeti yapılandırılmamış.");
  }

  client ??= createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
      flowType: "pkce",
    },
  });
  return client;
}

export function readAuthParameters(): URLSearchParams {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  hash.forEach((value, key) => {
    if (!query.has(key)) query.set(key, value);
  });
  return query;
}

export function clearSensitiveUrl(): void {
  window.history.replaceState(null, document.title, window.location.pathname);
}

export function readableAuthError(value: unknown): string {
  if (!(value instanceof Error))
    return "Beklenmeyen bir hata oluştu. Lütfen yeniden deneyin.";
  const message = value.message.toLocaleLowerCase("tr-TR");
  if (message.includes("expired") || message.includes("invalid")) {
    return "Bu bağlantının süresi dolmuş veya bağlantı daha önce kullanılmış.";
  }
  if (message.includes("password")) {
    return "Bu parola güvenlik koşullarını karşılamıyor veya önceki parolanızla aynı.";
  }
  if (message.includes("rate")) {
    return "Çok fazla deneme yapıldı. Lütfen bir süre sonra yeniden deneyin.";
  }
  return "İşlem tamamlanamadı. Bağlantıyı yeniden açın veya yeni bir bağlantı isteyin.";
}
