document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const indicators = document.querySelectorAll('.indicator');
  const container = document.querySelector('.carousel-container');

  let currentIndex = 0;
  const totalItems = items.length;
  let autoSlide;

  function updateCarousel() {
    const itemWidth = items[0].clientWidth;
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentIndex);
    });

    items.forEach((item, i) => {
      const video = item.querySelector('video');
      if (video) {
        if (i === currentIndex) {
          video.currentTime = 0;
          video.play().catch(err => console.warn('Play error:', err));
        } else {
          video.pause();
        }
      }
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  });

  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      currentIndex = parseInt(indicator.dataset.index);
      updateCarousel();
    });
  });

  function startAutoSlide() {
    autoSlide = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    }, 5000);
  }

  container.addEventListener('mouseenter', () => clearInterval(autoSlide));
  container.addEventListener('mouseleave', startAutoSlide);

  window.addEventListener('resize', updateCarousel);

  updateCarousel();
  startAutoSlide();
});
