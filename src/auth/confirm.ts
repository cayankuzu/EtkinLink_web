import type { EmailOtpType } from "@supabase/supabase-js";

import "../styles.css";
import {
  clearSensitiveUrl,
  getAuthClient,
  readAuthParameters,
  readableAuthError,
} from "./client";

const state = document.querySelector<HTMLElement>("[data-confirm-state]");

function render(
  kind: "loading" | "success" | "error",
  title: string,
  message: string,
): void {
  if (!state) return;
  const icon = kind === "success" ? "✓" : kind === "error" ? "!" : "•";
  const iconClass = kind === "loading" ? "" : kind;
  state.innerHTML = `
    <div class="status-icon ${iconClass}" aria-hidden="true">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    ${
      kind === "success"
        ? `<div class="button-row">
            <a class="button" href="etkinlink://auth/callback?verified=1">EtkinLink'i aç</a>
            <a class="button button-secondary" href="/EtkinLink_web/">Ana sayfaya dön</a>
          </div>`
        : kind === "error"
          ? `<div class="button-row">
              <a class="button" href="etkinlink://auth/callback?verification=retry">Uygulamaya dön</a>
              <a class="button button-secondary" href="mailto:memodee333@gmail.com?subject=EtkinLink%20Doğrulama%20Yardımı">Destek al</a>
            </div>`
          : ""
    }
    <div class="auth-security-note">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
      <span>EtkinLink bu sayfada şifrenizi istemez. Doğrulama bağlantınızı kimseyle paylaşmayın.</span>
    </div>`;
}

async function confirmEmail(): Promise<void> {
  render(
    "loading",
    "E-posta doğrulanıyor",
    "Güvenli bağlantı kontrol ediliyor, lütfen bekleyin…",
  );
  const params = readAuthParameters();
  const error = params.get("error_description") ?? params.get("error");
  const tokenHash = params.get("token_hash");
  const code = params.get("code");

  try {
    if (error) throw new Error(error);

    if (tokenHash) {
      const otpType = (params.get("type") ?? "email") as EmailOtpType;
      const { error: verificationError } = await getAuthClient().auth.verifyOtp(
        {
          token_hash: tokenHash,
          type: otpType,
        },
      );
      if (verificationError) throw verificationError;
      await getAuthClient().auth.signOut({ scope: "local" });
    } else if (!code && params.get("verified") !== "1") {
      throw new Error("invalid confirmation link");
    }

    clearSensitiveUrl();
    render(
      "success",
      "E-posta adresin doğrulandı",
      "Hesabın hazır. EtkinLink’i açtığında doğrulama durumu kontrol edilecek ve güvenli biçimde giriş yapılacak.",
    );
  } catch (errorValue) {
    clearSensitiveUrl();
    render("error", "Bağlantı kullanılamadı", readableAuthError(errorValue));
  }
}

void confirmEmail();
