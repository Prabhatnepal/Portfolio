            document.addEventListener('DOMContentLoaded', () => {
            const track = document.querySelector('.carousel-track');
            const items = document.querySelectorAll('.carousel-item');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            const indicators = document.querySelectorAll('.indicator');
            
            let currentIndex = 0;
            const itemWidth = items[0].clientWidth;
            const totalItems = items.length;
            
            // Initialize carousel position
            updateCarousel();
            
            // Navigation buttons
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateCarousel();
            });
            
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
            });
            
            // Indicators
            indicators.forEach(indicator => {
                indicator.addEventListener('click', () => {
                    currentIndex = parseInt(indicator.dataset.index);
                    updateCarousel();
                });
            });
            
            // Auto-advance (optional)
            let autoSlide = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
            }, 5000);
            
            // Pause auto-advance on hover
            document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
                clearInterval(autoSlide);
            });
            
            document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
                autoSlide = setInterval(() => {
                    currentIndex = (currentIndex + 1) % totalItems;
                    updateCarousel();
                }, 5000);
            });
            
            function updateCarousel() {
                track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                
                // Update indicators
                indicators.forEach((indicator, index) => {
                    if (index === currentIndex) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
                
                // Restart videos when they become active
                items.forEach((item, index) => {
                    const video = item.querySelector('video');
                    if (index === currentIndex) {
                        video.currentTime = 0;
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            }
            
            // Handle window resize
            window.addEventListener('resize', () => {
                const newItemWidth = items[0].clientWidth;
                if (newItemWidth !== itemWidth) {
                    track.style.transform = `translateX(-${currentIndex * newItemWidth}px)`;
                }
            });
        });

