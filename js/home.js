// Home Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Hero Banner Animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Featured Rooms Animation
    const roomCards = document.querySelectorAll('.room-card');
    if (roomCards.length > 0) {
        roomCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 + (index * 150));
        });
    }
    
    // Reason Cards Animation
    const reasonCards = document.querySelectorAll('.reason-card');
    if (reasonCards.length > 0) {
        reasonCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 500 + (index * 150));
        });
    }
    
    // About Preview Animation
    const aboutImage = document.querySelector('.about-image');
    const aboutContent = document.querySelector('.about-content');
    
    if (aboutImage && aboutContent) {
        aboutImage.style.opacity = '0';
        aboutImage.style.transform = 'translateX(-30px)';
        aboutContent.style.opacity = '0';
        aboutContent.style.transform = 'translateX(30px)';
        
        // Check if element is in viewport
        const isInViewport = (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0
            );
        };
        
        // Animate when scrolled into view
        const animateOnScroll = () => {
            if (isInViewport(aboutImage)) {
                aboutImage.style.transition = 'opacity 1s ease, transform 1s ease';
                aboutImage.style.opacity = '1';
                aboutImage.style.transform = 'translateX(0)';
                
                aboutContent.style.transition = 'opacity 1s ease, transform 1s ease';
                aboutContent.style.opacity = '1';
                aboutContent.style.transform = 'translateX(0)';
                
                window.removeEventListener('scroll', animateOnScroll);
            }
        };
        
        window.addEventListener('scroll', animateOnScroll);
        // Trigger once on page load
        animateOnScroll();
    }
    
    // Load featured rooms dynamically from data
    function loadFeaturedRooms() {
        const roomContainer = document.querySelector('.room-container');
        if (!roomContainer) return;
        
        try {
            const rooms = getFromStorage('rooms');
            if (!rooms) return;
            
            // We'll use the sample data already in the HTML for this example
            // This function would be expanded in a real application to dynamically
            // generate room cards from the database data
        } catch (error) {
            console.error('Error loading featured rooms:', error);
        }
    }
    
    // Initialize featured rooms
    loadFeaturedRooms();
    
    // Book Now Button Click Event
    const bookNowBtn = document.querySelector('.btn-book-now');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add a pulse animation when clicked
            bookNowBtn.classList.add('pulse-animation');
            
            // Remove the animation class after it completes
            setTimeout(() => {
                bookNowBtn.classList.remove('pulse-animation');
                // Navigate to rooms page
                window.location.href = 'rooms.html';
            }, 300);
        });
    }
    
    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-animation {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }
        
        .pulse-animation {
            animation: pulse-animation 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});