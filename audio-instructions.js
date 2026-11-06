"use strict";
(() => {
  const audio = document.getElementById("instruction-audio");
  const status = document.getElementById("audio-status");
  if (!audio || !status) return;
  let started = false;
  let completed = false;
  let playPending = false;
  let unavailable = false;
  let leaving = false;

  function emit(name) {
    window.dispatchEvent(new CustomEvent("instruction-audio-event", { detail: { name } }));
  }
  async function playAudio() {
    if (unavailable || leaving || playPending || (!audio.paused && !audio.ended)) return;
    playPending = true;
    try {
      if (audio.ended) audio.currentTime = 0;
      // Call play inside the gesture handler when autoplay needs user activation.
      await audio.play();
      status.textContent = "";
    } catch (error) {
      // Blocked autoplay waits for a real interaction, independently of tracking.
      if (!["NotAllowedError", "AbortError"].includes(error.name)) {
        status.textContent = "O áudio não está disponível agora. Você pode continuar pelo formulário.";
      }
    } finally {
      playPending = false;
    }
  }
  function startOnInteraction(e) {
    if (!e.isTrusted || (e.type === "keydown" && (e.ctrlKey || e.metaKey || e.altKey))) return;
    void playAudio();
  }
  document.addEventListener("click", startOnInteraction, { passive: true });
  document.addEventListener("touchend", startOnInteraction, { passive: true });
  document.addEventListener("keydown", startOnInteraction);

  audio.addEventListener("playing", () => {
    if (!started) {
      started = true;
      emit("AudioInstructionsStart");
    }
  });
  audio.addEventListener("ended", () => {
    if (!completed) {
      completed = true;
      emit("AudioInstructionsComplete");
    }
    // Native loop suppresses ended; restart explicitly to record completion once.
    void playAudio();
  });
  audio.addEventListener("error", () => {
    unavailable = true;
    status.textContent = "O áudio não está disponível agora. Você pode continuar pelo formulário.";
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) void playAudio();
  });
  window.addEventListener("pagehide", () => {
    leaving = true;
    audio.pause();
  });
  window.addEventListener("pageshow", () => {
    leaving = false;
    void playAudio();
  });
  void playAudio();
})();
