// About Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Testimonial Slider Functionality
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentSlide = 0;
    
    // If testimonial elements exist on the page
    if (testimonialSlides.length > 0 && dots.length > 0) {
        // Function to show a specific slide
        function showSlide(n) {
            // Hide all slides
            testimonialSlides.forEach(slide => {
                slide.style.display = 'none';
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show the active slide
            testimonialSlides[n].style.display = 'block';
            dots[n].classList.add('active');
            
            // Update current slide index
            currentSlide = n;
        }
        
        // Function to show the next slide
        function nextSlide() {
            let next = currentSlide + 1;
            if (next >= testimonialSlides.length) {
                next = 0;
            }
            showSlide(next);
        }
        
        // Function to show the previous slide
        function prevSlide() {
            let prev = currentSlide - 1;
            if (prev < 0) {
                prev = testimonialSlides.length - 1;
            }
            showSlide(prev);
        }
        
        // Add click event to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Add click events to next and prev buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        // Automatic slideshow
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause slideshow when hovering over the slider
        const testimonialSlider = document.querySelector('.testimonial-slider');
        if (testimonialSlider) {
            testimonialSlider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            testimonialSlider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        // Initialize with first slide
        showSlide(0);
    }
    
    // Animation for feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        // Function to animate cards when they come into view
        function animateFeatureCards() {
            featureCards.forEach((card, index) => {
                if (isInViewport(card) && !card.classList.contains('animated')) {
                    // Add animated class to prevent re-animation
                    card.classList.add('animated');
                    
                    // Apply animation with delay based on index
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }
        
        // Set initial state for cards
        featureCards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Animate on scroll
        window.addEventListener('scroll', animateFeatureCards);
        
        // Initial check on page load
        animateFeatureCards();
    }
    
    // Animation for team members on scroll
    const teamMembers = document.querySelectorAll('.team-member');
    if (teamMembers.length > 0) {
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        // Function to animate team members when they come into view
        function animateTeamMembers() {
            teamMembers.forEach((member, index) => {
                if (isInViewport(member) && !member.classList.contains('animated')) {
                    // Add animated class to prevent re-animation
                    member.classList.add('animated');
                    
                    // Apply animation with delay based on index
                    setTimeout(() => {
                        member.style.opacity = '1';
                        member.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }
        
        // Set initial state for team members
        teamMembers.forEach((member) => {
            member.style.opacity = '0';
            member.style.transform = 'translateY(30px)';
            member.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        // Animate on scroll
        window.addEventListener('scroll', animateTeamMembers);
        
        // Initial check on page load
        animateTeamMembers();
    }
    
    // Animation for mission cards
    const missionCards = document.querySelectorAll('.mission-card');
    if (missionCards.length > 0) {
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        // Function to animate mission cards when they come into view
        function animateMissionCards() {
            missionCards.forEach((card, index) => {
                if (isInViewport(card) && !card.classList.contains('animated')) {
                    // Add animated class to prevent re-animation
                    card.classList.add('animated');
                    
                    // Apply animation with delay based on index
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }
        
        // Set initial state for mission cards
        missionCards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        // Animate on scroll
        window.addEventListener('scroll', animateMissionCards);
        
        // Initial check on page load
        animateMissionCards();
    }
});