document.addEventListener('DOMContentLoaded', () => {
    const typedText = document.getElementById("typed-text");
    const audio = document.getElementById("type-sound");

    const playTypingSound = () => {
      audio.currentTime = 0;
      audio.play();
    };

    const typed = new Typed("#typed-text", {
      strings: [
        "Welcome to my 3D world.",
        "Explore interactive web magic.",
        "Built by Prabhat with 💻 and ❤️"
      ],
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 2000,
      loop: true,
      showCursor: false,
      onStringTyped: () => {
        typedText.classList.add("pulse");
      },
      preStringTyped: () => {
        typedText.classList.remove("pulse");
      },
      onTyping: () => {
        playTypingSound();

        // Trigger glitch on each character typed
        typedText.classList.add("glitch");
        setTimeout(() => typedText.classList.remove("glitch"), 150);
      }
    });
  });