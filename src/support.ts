import "./main";

const SUPPORT_EMAIL = "memodee333@gmail.com";

const topicLabels: Readonly<Record<string, string>> = {
  technical: "Teknik destek",
  account: "Hesap işlemleri",
  safety: "Güvenlik bildirimi",
  privacy: "Gizlilik / KVKK",
  other: "Diğer",
};

const form = document.querySelector<HTMLFormElement>("[data-support-form]");
const nameInput = document.querySelector<HTMLInputElement>("#support-name");
const emailInput = document.querySelector<HTMLInputElement>("#support-email");
const topicInput = document.querySelector<HTMLSelectElement>("#support-topic");
const messageInput =
  document.querySelector<HTMLTextAreaElement>("#support-message");
const messageCount = document.querySelector<HTMLElement>(
  "[data-message-count]",
);
const submit = document.querySelector<HTMLButtonElement>("[data-submit]");
const validationSummary = document.querySelector<HTMLElement>(
  "[data-validation-summary]",
);
const state = document.querySelector<HTMLElement>("[data-support-state]");

type FieldName = "email" | "topic" | "message";

function errorTarget(field: FieldName): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
}

function inputFor(
  field: FieldName,
): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  if (field === "email") return emailInput;
  if (field === "topic") return topicInput;
  return messageInput;
}

function setFieldError(field: FieldName, message: string | null): void {
  const target = errorTarget(field);
  const input = inputFor(field);
  if (target) {
    target.textContent = message ?? "";
    target.hidden = message === null;
  }
  input?.setAttribute("aria-invalid", String(message !== null));
}

function fieldError(field: FieldName): string | null {
  if (field === "email") {
    if (!emailInput?.value.trim()) return "E-posta adresini yaz.";
    if (!emailInput.validity.valid) {
      return "Geçerli bir e-posta adresi yaz.";
    }
    return null;
  }

  if (field === "topic") {
    return topicInput?.value ? null : "Bir konu seç.";
  }

  const message = messageInput?.value.trim() ?? "";
  if (!message) return "Mesajını yaz.";
  if (message.length < 20) return "Mesajın en az 20 karakter olmalı.";
  return null;
}

function validateForm(): boolean {
  const fields: FieldName[] = ["email", "topic", "message"];
  let firstInvalid: FieldName | null = null;

  for (const field of fields) {
    const error = fieldError(field);
    setFieldError(field, error);
    if (error && firstInvalid === null) firstInvalid = field;
  }

  if (validationSummary) validationSummary.hidden = firstInvalid === null;
  if (firstInvalid) inputFor(firstInvalid)?.focus();
  return firstInvalid === null;
}

function updateMessageCount(): void {
  if (!messageCount || !messageInput) return;
  messageCount.textContent = `${messageInput.value.length} / 1000`;
}

function setSubmitting(submitting: boolean): void {
  if (!submit || !form) return;
  submit.disabled = submitting;
  submit.innerHTML = submitting
    ? '<span class="loading-dot" aria-hidden="true"></span>E-posta uygulaması açılıyor…'
    : "E-posta taslağını aç";
  form.setAttribute("aria-busy", String(submitting));
}

function showSuccess(): void {
  if (!form || !state) return;
  setSubmitting(false);
  form.hidden = true;
  state.hidden = false;
  state.innerHTML = `
    <div class="status-icon success" aria-hidden="true">✓</div>
    <h2>E-posta taslağın hazır</h2>
    <p>Cihazın destekliyorsa e-posta uygulaması EtkinLink adresi ve mesajınla açıldı. Gönderimi tamamlamak için e-posta uygulamasındaki <strong>Gönder</strong> düğmesini kullan.</p>
    <div class="button-row">
      <button class="button button-secondary" type="button" data-support-retry>Yeni mesaj hazırla</button>
      <a class="button button-ghost" href="mailto:${SUPPORT_EMAIL}">E-postayı yeniden aç</a>
    </div>`;
  state.focus({ preventScroll: true });
}

function showServiceError(): void {
  if (!form || !state) return;
  setSubmitting(false);
  form.hidden = true;
  state.hidden = false;
  state.innerHTML = `
    <div class="status-icon error" aria-hidden="true">!</div>
    <h2>E-posta uygulaması açılamadı</h2>
    <p>Cihazında varsayılan bir e-posta uygulaması tanımlı olmayabilir. Aşağıdaki adresi kullanarak bize doğrudan yazabilirsin.</p>
    <a class="support-email-fallback" href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
    <div class="button-row">
      <button class="button button-secondary" type="button" data-support-retry>Forma dön</button>
    </div>`;
  state.focus({ preventScroll: true });
}

function resetToForm(): void {
  if (!form || !state) return;
  state.hidden = true;
  state.innerHTML = "";
  form.hidden = false;
  setSubmitting(false);
  messageInput?.focus();
}

for (const field of [emailInput, topicInput, messageInput]) {
  field?.addEventListener("blur", () => {
    const fieldName = field.name as FieldName;
    setFieldError(fieldName, fieldError(fieldName));
  });

  field?.addEventListener("input", () => {
    const fieldName = field.name as FieldName;
    if (field.getAttribute("aria-invalid") === "true") {
      setFieldError(fieldName, fieldError(fieldName));
    }
    if (validationSummary) validationSummary.hidden = true;
  });
}

messageInput?.addEventListener("input", updateMessageCount);

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm() || !emailInput || !topicInput || !messageInput) return;

  setSubmitting(true);
  const topic = topicLabels[topicInput.value] ?? "Diğer";
  const senderName = nameInput?.value.trim() || "Belirtilmedi";
  const body = [
    `Ad soyad: ${senderName}`,
    `Yanıt e-postası: ${emailInput.value.trim()}`,
    `Konu: ${topic}`,
    "",
    messageInput.value.trim(),
  ].join("\n");
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `EtkinLink Destek · ${topic}`,
  )}&body=${encodeURIComponent(body)}`;

  try {
    window.location.href = mailtoUrl;
    window.setTimeout(showSuccess, 650);
  } catch {
    showServiceError();
  }
});

state?.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof Element && target.closest("[data-support-retry]")) {
    resetToForm();
  }
});

updateMessageCount();
