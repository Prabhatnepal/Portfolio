// 🎆 New Year Effect (Only on Jan 1)
const today = new Date();
const isNewYear =
  today.getMonth() === 0 && today.getDate() === 1;

if (!isNewYear) {
  const overlay = document.getElementById("newYearOverlay");
  if (overlay) overlay.remove();
} else {
  // Confetti
  import("https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js")
    .then(({ default: confetti }) => {
      const duration = 5000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 6,
          spread: 80,
          origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    });
}
