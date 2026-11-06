"use strict";
(() => {
  const audio = document.getElementById("instruction-audio");
  const button = document.getElementById("audio-toggle");
  const label = document.getElementById("audio-toggle-label");
  const status = document.getElementById("audio-status");
  if (!audio || !button || !label || !status) return;
  let started = false;
  let completed = false;
  audio.controls = false;
  audio.hidden = true;
  button.hidden = false;
  function emit(name) {
    window.dispatchEvent(new CustomEvent("instruction-audio-event", { detail: { name } }));
  }
  function pausedLabel() {
    return audio.ended ? "Ouvir novamente" : audio.currentTime > 0 ? "Continuar instruções" : "Ouvir instruções de inscrição";
  }
  button.addEventListener("click", async () => {
    status.textContent = "";
    if (!audio.paused) {
      audio.pause();
      return;
    }
    button.disabled = true;
    try {
      if (audio.ended) audio.currentTime = 0;
      await audio.play();
    } catch {
      button.setAttribute("aria-pressed", "false");
      label.textContent = pausedLabel();
      status.textContent = "Não foi possível reproduzir. Toque para tentar novamente ou continue pelo formulário.";
    } finally {
      button.disabled = false;
    }
  });
  audio.addEventListener("play", () => {
    label.textContent = "Pausar instruções";
    button.setAttribute("aria-pressed", "true");
    if (!started) {
      started = true;
      emit("AudioInstructionsStart");
    }
  });
  audio.addEventListener("pause", () => {
    label.textContent = pausedLabel();
    button.setAttribute("aria-pressed", "false");
  });
  audio.addEventListener("ended", () => {
    label.textContent = "Ouvir novamente";
    button.setAttribute("aria-pressed", "false");
    if (!completed) {
      completed = true;
      emit("AudioInstructionsComplete");
    }
  });
  audio.addEventListener("error", () => {
    button.disabled = false;
    button.setAttribute("aria-pressed", "false");
    label.textContent = "Tentar ouvir instruções";
    status.textContent = "O áudio não está disponível agora. Você pode continuar pelo formulário.";
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !audio.paused) audio.pause();
  });
})();
