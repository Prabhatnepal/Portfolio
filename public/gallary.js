
  const gallery = document.querySelector('.photo-gallery');
  const scrollLeft = document.getElementById('scrollLeft');
  const scrollRight = document.getElementById('scrollRight');
  const playButton = document.querySelector('.play i');

  // Manual scroll buttons
  scrollLeft.addEventListener('click', () => {
    gallery.scrollBy({ left: -300, behavior: 'smooth' });
  });
  scrollRight.addEventListener('click', () => {
    gallery.scrollBy({ left: 300, behavior: 'smooth' });
  });

  // Drag to scroll
  let isDown = false;
  let startX;
  let scrollLeftStart;

  gallery.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - gallery.offsetLeft;
    scrollLeftStart = gallery.scrollLeft;
    gallery.style.cursor = 'grabbing';
  });

  gallery.addEventListener('mouseleave', () => {
    isDown = false;
    gallery.style.cursor = 'grab';
  });

  gallery.addEventListener('mouseup', () => {
    isDown = false;
    gallery.style.cursor = 'grab';
  });

  gallery.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed
    gallery.scrollLeft = scrollLeftStart - walk;
  });

  // 🎵 Auto-scroll (slideshow) logic
  let autoScroll;
  let isPlaying = false;

  document.querySelector('.play').addEventListener('click', () => {
    if (!isPlaying) {
      isPlaying = true;
      playButton.classList.replace('fa-play', 'fa-pause');

      autoScroll = setInterval(() => {
        // Scroll forward continuously
        gallery.scrollBy({ left: 2, behavior: 'smooth' });

        // If near the end, scroll back to start
        if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 10) {
          gallery.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }, 20);
    } else {
      isPlaying = false;
      playButton.classList.replace('fa-pause', 'fa-play');
      clearInterval(autoScroll);
    }
  });

  // Optional: allow horizontal scroll via mouse wheel
  gallery.addEventListener('wheel', (e) => {
    e.preventDefault();
    gallery.scrollBy({ left: e.deltaY * 1.2, behavior: 'smooth' });
  });

