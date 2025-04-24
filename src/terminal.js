const lines = [
    "> :INITIATE PROTOCOL_13",
    "> _// Decryption in progress..._",
    "",
    "> [●] SIGNAL FOUND",
    "> [●] SOURCE: UNKNOWN",
    "> [●] ID: ███████ – ALIAS: “PRABHAT”",
    "",
    "> _He doesn't speak in code…_",
    "> _He **is** the code._",
    "",
    "—",
    "> You’ve followed the static.",
    "> You’ve heard the fragments.",
    "> Now you’re here.",
    "> But why?",
    "",
    "> There is no homepage.",
    "> No “About Me.”",
    "> Only fragments—",
    "> scattered across time,",
    "> hidden behind glass and shadows.",
    "",
    "> █ ACCESS LEVEL: RESTRICTED █",
    "> 🜃 Enter the archive.",
    "> 🜄 Decode the signals.",
    "> 🜁 Follow the patterns.",
    "> 🜂 Uncover the architect.",
    "",
    "> _Begin._"
  ];
  
  const output = document.getElementById("crypticText");
  const staticSound = document.getElementById("staticSound");
  const startScreen = document.getElementById("start-screen");
  const startBtn = document.getElementById("start-btn");
  
  let line = 0;
  let char = 0;
  
  function typeNextChar() {
    if (line < lines.length) {
      const currentLine = lines[line];
      if (char < currentLine.length) {
        output.textContent += currentLine.charAt(char);
        char++;
        setTimeout(typeNextChar, 30);
      } else {
        output.textContent += "\n";
        line++;
        char = 0;
        setTimeout(typeNextChar, 400);
      }
    } else {
      // After typing ends
      setTimeout(() => {
        document.querySelector(".terminal-intro").classList.add("fade-out");
        staticSound.pause();
        setTimeout(() => {
          window.location.href = "/prabhat/main.html"; // <-- redirect target
        }, 1500);
      }, 1500);
    }
  }
  
  startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    document.querySelector(".terminal-intro").style.display = "flex";
    staticSound.play().catch((err) => console.log("Autoplay blocked:", err));
    typeNextChar();
  });
  