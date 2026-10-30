"use strict";
const ENDPOINT = "https://script.google.com/macros/s/AKfycbx_bupWlQyNnibUyH7i8xyfuCl41HsblLrSRw7xZLs17YeyoU9ncDyOi9kY8hak-hiSUQ/exec";
const PIXEL_ID = "1801282187897715";
const $ = (id) => document.getElementById(id);
// Individual countdown: preserve the deadline across visits in this browser.
const COUNTDOWN_DURATION_MS = (10 * 3600 + 43 * 60 + 54) * 1000;
const COUNTDOWN_STORAGE_KEY = "registration-countdown-deadline-v1";
let countdownDeadline = Date.now() + COUNTDOWN_DURATION_MS;
try {
  const savedDeadline = Number(localStorage.getItem(COUNTDOWN_STORAGE_KEY));
  if (Number.isFinite(savedDeadline) && savedDeadline > 0) {
    countdownDeadline = savedDeadline;
  } else {
    localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(countdownDeadline));
  }
} catch {}
function updateCountdown() {
  const remaining = Math.max(0, Math.ceil((countdownDeadline - Date.now()) / 1000));
  $("countdown-hours").textContent = String(Math.floor(remaining / 3600)).padStart(2, "0");
  $("countdown-minutes").textContent = String(Math.floor(remaining / 60) % 60).padStart(2, "0");
  $("countdown-seconds").textContent = String(remaining % 60).padStart(2, "0");
  document.querySelector(".deadline").setAttribute("aria-label", remaining > 0
    ? `Tempo para inscrição: ${Math.floor(remaining / 3600)} horas e ${Math.floor(remaining / 60) % 60} minutos`
    : "Contagem encerrada");
  if (remaining === 0) {
    $("countdown-label").textContent = "CONTAGEM ENCERRADA";
    return false;
  }
  return true;
}
if (updateCountdown()) {
  const countdownInterval = setInterval(() => {
    if (!updateCountdown()) clearInterval(countdownInterval);
  }, 1000);
}
let trackingAllowed = false;
let pixelLoaded = false;
let formStarted = false;
let draft = null;
let sending = false;
let completed = false;

function loadPixel() {
  if (pixelLoaded) return;
  pixelLoaded = true;
  const fbq = window.fbq = function () {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
    else fbq.queue.push(arguments);
  };
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("consent", "grant");
  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}
function event(name) {
  // Never send names, ages or phone numbers as Pixel event parameters.
  if (trackingAllowed && window.fbq) window.fbq("trackCustom", name);
}
function setTracking(allowed) {
  trackingAllowed = allowed;
  try { localStorage.setItem("tracking-consent", allowed ? "accepted" : "rejected"); } catch {}
  $("cookie-banner").hidden = true;
  if (allowed) {
    if (pixelLoaded) window.fbq("consent", "grant");
    else loadPixel();
  } else if (pixelLoaded) window.fbq("consent", "revoke");
}
try {
  const choice = localStorage.getItem("tracking-consent");
  if (choice === "accepted" || choice === "rejected") setTracking(choice === "accepted");
} catch {}
$("accept-tracking").addEventListener("click", () => setTracking(true));
$("reject-tracking").addEventListener("click", () => setTracking(false));
$("tracking-settings").addEventListener("click", () => { $("cookie-banner").hidden = false; });

let attendanceEligible = false;
$("attendance-yes").addEventListener("click", () => {
  attendanceEligible = true;
  $("attendance").close();
});
$("attendance-no").addEventListener("click", () => {
  attendanceEligible = false;
  $("registration-page").hidden = true;
  $("lead-form").querySelectorAll("input, button").forEach((input) => { input.disabled = true; });
  $("cookie-banner").hidden = true;
  $("attendance-unavailable").hidden = false;
  $("attendance").close();
  $("unavailable-title").focus();
});
$("attendance").addEventListener("cancel", (e) => e.preventDefault());
$("attendance").showModal();

$("lead-form").addEventListener("input", (e) => {
  if (!formStarted && e.target.matches("input:not([type=checkbox])") && e.target.value.trim()) {
    formStarted = true;
    event("FormStart");
  }
  e.target.setCustomValidity("");
});
function validPhone(phone) {
  if (!/^\+?[\d\s().-]+$/.test(phone)) return false;
  let digits = phone.replace(/\D/g, "");
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) digits = digits.slice(2);
  return [8, 9, 10, 11].includes(digits.length);
}
$("lead-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!attendanceEligible || sending || completed) return;
  const name = $("name").value.trim().replace(/\s+/g, " ");
  const phone = $("phone").value.trim();
  if (name.split(" ").length < 2) {
    $("name").setCustomValidity("Informe seu nome completo.");
    $("name").reportValidity();
    return;
  }
  if (!validPhone(phone)) {
    $("phone").setCustomValidity("Informe um telefone válido, com ou sem DDD.");
    $("phone").reportValidity();
    return;
  }
  draft = { nome: name, idade: $("age").value, telefone: phone };
  $("review-name").textContent = draft.nome;
  $("review-age").textContent = draft.idade + " anos";
  $("review-phone").textContent = draft.telefone;
  $("submit-status").textContent = "";
  event("ReviewData");
  $("confirmation").showModal();
});
$("edit-data").addEventListener("click", () => { if (!sending) $("confirmation").close(); });
$("confirmation").addEventListener("cancel", (e) => { if (sending) e.preventDefault(); });
$("confirm-submit").addEventListener("click", async () => {
  if (!attendanceEligible || sending || completed || !draft) return;
  sending = true;
  $("confirm-submit").disabled = true;
  $("edit-data").disabled = true;
  $("submit-status").textContent = "Enviando seus dados…";
  event("ConfirmSubmit");
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(draft),
      credentials: "omit",
      redirect: "follow"
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const result = await response.json();
    if (result.ok === true && result.codigo === "CADASTRADO") {
      completed = true;
      if (trackingAllowed && window.fbq) window.fbq("track", "Lead");
      $("confirmation").close();
      $("form-status").textContent = "Inscrição realizada! A equipe entrará em contato pelo telefone informado.";
      $("lead-form").querySelectorAll("input, button").forEach((input) => { input.disabled = true; });
    } else if (result.codigo === "DUPLICADO") {
      $("submit-status").textContent = "Este telefone já está cadastrado. Você pode voltar e conferir o número informado.";
    } else {
      $("submit-status").textContent = result.mensagem || "Não foi possível enviar. Tente novamente.";
    }
  } catch {
    $("submit-status").textContent = "Não foi possível confirmar o envio. Confira sua conexão e tente novamente. Se o cadastro já tiver sido salvo, a verificação evitará um novo registro.";
  } finally {
    sending = false;
    $("confirm-submit").disabled = completed;
    $("edit-data").disabled = false;
  }
});
