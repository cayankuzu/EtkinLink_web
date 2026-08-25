import type { EmailOtpType } from "@supabase/supabase-js";

import "../styles.css";
import {
  clearSensitiveUrl,
  getAuthClient,
  readAuthParameters,
  readableAuthError,
} from "./client";

const state = document.querySelector<HTMLElement>("[data-reset-state]");
const form = document.querySelector<HTMLFormElement>("[data-reset-form]");
const password = document.querySelector<HTMLInputElement>("#new-password");
const toggle = document.querySelector<HTMLButtonElement>(
  "[data-password-toggle]",
);
const meter = document.querySelector<HTMLElement>("[data-password-meter]");
const hint = document.querySelector<HTMLElement>("[data-password-hint]");
const submit = document.querySelector<HTMLButtonElement>("[data-submit]");
const card = document.querySelector<HTMLElement>("[data-reset-card]");
const base = import.meta.env.BASE_URL;
const link = (path: string) => `${base}${path.replace(/^\//, "")}`;

let recoveryReady = false;
let tokenHash: string | null = null;
let tokenType: EmailOtpType = "recovery";

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function setResetState(value: string): void {
  if (card) card.dataset.state = value;
}

function renderReady(): void {
  setResetState("ready");
  if (state) {
    state.innerHTML = `
      <div class="status-icon" aria-hidden="true">⌁</div>
      <h1>Yeni şifreni belirle</h1>
      <p>Hatırlayabileceğin, başka hesaplarında kullanmadığın güçlü bir şifre seç.</p>`;
  }
  if (form) form.hidden = false;
}

function scorePassword(value: string): number {
  let score = 0;
  if (value.length >= 10) score += 1;
  if (/[a-zçğıöşü]/u.test(value) && /[A-ZÇĞİÖŞÜ]/u.test(value)) score += 1;
  if (/\d/u.test(value)) score += 1;
  if (value.length >= 14 || /[^\p{L}\p{N}]/u.test(value)) score += 1;
  return score;
}

function validatePassword(value: string): string | null {
  if (value.length < 10) return "Parola en az 10 karakter olmalı.";
  if (value.length > 72) return "Parola en fazla 72 karakter olabilir.";
  if (
    !/[a-zçğıöşü]/u.test(value) ||
    !/[A-ZÇĞİÖŞÜ]/u.test(value) ||
    !/\d/u.test(value)
  ) {
    return "En az bir büyük harf, bir küçük harf ve bir rakam kullanın.";
  }
  return null;
}

function renderFailure(message: string): void {
  setResetState("invalid");
  if (form) form.hidden = true;
  if (!state) return;
  state.innerHTML = `
    <div class="status-icon error" aria-hidden="true">!</div>
    <h1>Bağlantı kullanılamadı</h1>
    <p>${escapeHtml(message)}</p>
    <div class="button-row">
      <a class="button" href="etkinlink://auth/reset-password?request=new">Yeni bağlantı iste</a>
      <a class="button button-secondary" href="${link("support.html")}">Destek al</a>
    </div>`;
}

function renderSuccess(): void {
  setResetState("success");
  if (form) form.hidden = true;
  if (!state) return;
  state.innerHTML = `
    <div class="status-icon success" aria-hidden="true">✓</div>
    <h1>Şifren yenilendi</h1>
    <p>Yeni şifren artık aktif. EtkinLink’e dönüp e-posta adresin ve yeni şifrenle giriş yapabilirsin.</p>
    <div class="button-row">
      <a class="button" href="etkinlink://auth/reset-password?updated=1">EtkinLink'i aç</a>
      <a class="button button-secondary" href="${link("index.html")}">Ana sayfaya dön</a>
    </div>`;
}

async function prepareRecovery(): Promise<void> {
  const params = readAuthParameters();
  const error = params.get("error_description") ?? params.get("error");
  tokenHash = params.get("token_hash");
  tokenType = (params.get("type") ?? "recovery") as EmailOtpType;
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const code = params.get("code");

  try {
    if (error) throw new Error(error);
    const client = getAuthClient();

    if (accessToken && refreshToken) {
      const { error: sessionError } = await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) throw sessionError;
      recoveryReady = true;
    } else if (code) {
      const { error: exchangeError } =
        await client.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;
      recoveryReady = true;
    } else if (!tokenHash) {
      throw new Error("invalid recovery link");
    }

    clearSensitiveUrl();
    renderReady();
    submit?.removeAttribute("disabled");
    password?.focus();
  } catch (errorValue) {
    clearSensitiveUrl();
    renderFailure(readableAuthError(errorValue));
  }
}

toggle?.addEventListener("click", () => {
  if (!password) return;
  const visible = password.type === "text";
  password.type = visible ? "password" : "text";
  toggle.setAttribute(
    "aria-label",
    visible ? "Şifreyi göster" : "Şifreyi gizle",
  );
  toggle.setAttribute("aria-pressed", String(!visible));
  password.focus();
});

password?.addEventListener("input", () => {
  const error = validatePassword(password.value);
  setResetState(password.value && error ? "validation-error" : "ready");
  const score = password.value ? scorePassword(password.value) : 0;
  meter?.setAttribute("data-score", String(score));
  password.setAttribute(
    "aria-invalid",
    String(Boolean(password.value && error)),
  );
  if (hint) {
    hint.className = password.value && error ? "field-error" : "field-hint";
    hint.textContent =
      password.value && error
        ? error
        : "10–72 karakter; büyük harf, küçük harf ve rakam kullanın.";
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!password || !submit) return;
  const validationError = validatePassword(password.value);
  if (validationError) {
    password.setAttribute("aria-invalid", "true");
    if (hint) {
      hint.className = "field-error";
      hint.textContent = validationError;
    }
    password.focus();
    return;
  }

  submit.disabled = true;
  setResetState("submitting");
  submit.innerHTML = '<span class="loading-dot"></span>Şifre yenileniyor…';
  try {
    const client = getAuthClient();
    if (!recoveryReady && tokenHash) {
      const { error: verificationError } = await client.auth.verifyOtp({
        token_hash: tokenHash,
        type: tokenType,
      });
      if (verificationError) throw verificationError;
      recoveryReady = true;
    }
    if (!recoveryReady) throw new Error("invalid recovery session");

    const { error: updateError } = await client.auth.updateUser({
      password: password.value,
    });
    if (updateError) throw updateError;
    password.value = "";
    tokenHash = null;
    await client.auth.signOut({ scope: "local" });
    renderSuccess();
  } catch (errorValue) {
    setResetState("update-error");
    submit.disabled = false;
    submit.textContent = "Şifreyi yenile";
    if (hint) {
      hint.className = "field-error";
      hint.textContent = readableAuthError(errorValue);
    }
  }
});

void prepareRecovery();
