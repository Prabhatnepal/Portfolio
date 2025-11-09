// Disable Right-Click
document.addEventListener("contextmenu", (e) => e.preventDefault());

// Disable Specific Keys
document.addEventListener("keydown", (e) => {
  // Block F12
  if (e.key === "F12") e.preventDefault();

  // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) e.preventDefault();

  // Block Ctrl+U (View Source)
  if (e.ctrlKey && e.key === "U") e.preventDefault();

  // Block Ctrl+S (Save)
  if (e.ctrlKey && e.key === "S") e.preventDefault();
});
