"use strict";
// Visual-only prototype: intentionally no Pixel, server events or lead endpoint.
const $ = id => document.getElementById(id);
let eligible = false;
$("attendance-yes").addEventListener("click", () => {
  eligible = true;
  $("attendance").close();
});
$("attendance-no").addEventListener("click", () => {
  eligible = false;
  $("registration-page").hidden = true;
  $("attendance-unavailable").hidden = false;
  $("attendance").close();
  $("unavailable-title").focus();
});
$("attendance").addEventListener("cancel", e => e.preventDefault());
$("attendance").showModal();
$("lead-form").addEventListener("input", e => e.target.setCustomValidity(""));
$("lead-form").addEventListener("submit", e => {
  e.preventDefault();
  if (!eligible) return;
  const name = $("name").value.trim().replace(/\s+/g, " ");
  let phone = $("phone").value.replace(/\D/g, "");
  if ([12,13].includes(phone.length) && phone.startsWith("55")) phone = phone.slice(2);
  if (name.split(" ").length < 2) {
    $("name").setCustomValidity("Informe seu nome completo.");
    $("name").reportValidity();
    return;
  }
  if (![8,9,10,11].includes(phone.length)) {
    $("phone").setCustomValidity("Informe um telefone válido, com ou sem DDD.");
    $("phone").reportValidity();
    return;
  }
  $("review-name").textContent = name;
  $("review-age").textContent = $("age").value + " anos";
  $("review-phone").textContent = $("phone").value;
  $("confirmation").showModal();
});
$("edit-data").addEventListener("click", () => $("confirmation").close());
$("confirm-submit").addEventListener("click", () => {
  $("confirmation").close();
  $("form-status").textContent = "Teste concluído. Nenhum cadastro ou evento de rastreamento foi enviado.";
});
