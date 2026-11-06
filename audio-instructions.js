"use strict";
(() => {
  const audio = document.getElementById("instruction-audio");
  const button = document.getElementById("audio-toggle");
  const label = document.getElementById("audio-toggle-label");
  const status = document.getElementById("audio-status");
  if (!audio || !button || !label || !status) return;
  let started = false;
  let completed = false;
  let continuousPlayback = false;
  audio.controls = false;
  audio.hidden = true;
  button.hidden = false;
  function emit(name) {
    window.dispatchEvent(new CustomEvent("instruction-audio-event", { detail: { name } }));
  }
  function pausedLabel() {
    return audio.ended ? "Ouvir novamente" : audio.currentTime > 0 ? "Continuar instruções" : "Ouvir instruções de inscrição";
  }
  async function playAudio() {
    continuousPlayback = true;
    status.textContent = "";
    button.disabled = true;
    try {
      if (audio.ended) audio.currentTime = 0;
      await audio.play();
    } catch {
      const wasRequested = continuousPlayback;
      continuousPlayback = false;
      button.setAttribute("aria-pressed", "false");
      label.textContent = pausedLabel();
      if (wasRequested) status.textContent = "Não foi possível reproduzir. Toque para tentar novamente ou continue pelo formulário.";
    } finally {
      button.disabled = false;
    }
  }
  function stopAudio() {
    continuousPlayback = false;
    audio.pause();
  }
  document.getElementById("attendance-yes")?.addEventListener("click", () => { void playAudio(); });
  button.addEventListener("click", () => {
    if (!audio.paused) stopAudio();
    else void playAudio();
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
    // Restart explicitly so completion can be recorded once before repeating.
    if (continuousPlayback && !document.hidden) {
      audio.currentTime = 0;
      void playAudio();
    }
  });
  audio.addEventListener("error", () => {
    continuousPlayback = false;
    button.disabled = false;
    button.setAttribute("aria-pressed", "false");
    label.textContent = "Tentar ouvir instruções";
    status.textContent = "O áudio não está disponível agora. Você pode continuar pelo formulário.";
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAudio();
  });
  window.addEventListener("pagehide", stopAudio);
})();
