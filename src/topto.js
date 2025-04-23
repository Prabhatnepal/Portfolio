  const toTopBtn = document.getElementById("toTopBtn");

  window.onscroll = function () {
    toTopBtn.style.display =
      document.documentElement.scrollTop > 300 ? "block" : "none";
  };

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  toTopBtn.addEventListener("mouseenter", () => {
    toTopBtn.src = "https://img.icons8.com/?size=64&id=119214&format=png"; // hover image
  });

  toTopBtn.addEventListener("mouseleave", () => {
    toTopBtn.src = "https://img.icons8.com/?size=64&id=gTETsxFOVhzG&format=png"; // normal image
  });
