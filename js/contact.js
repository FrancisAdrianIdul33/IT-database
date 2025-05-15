// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // FAQ Toggle Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                // Toggle active class on the parent element
                const faqItem = question.parentElement;
                faqItem.classList.toggle('active');
                
                // Update the icon
                const icon = question.querySelector('i');
                if (faqItem.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        });
    }
    
    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form fields
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // In a real application, this would send the form data to a server
            // For this demo, we'll just show a success message
            
            // Create a "message" object to store in localStorage
            const contactMessage = {
                id: Date.now(), // use timestamp as a simple unique ID
                name,
                email,
                phone,
                subject,
                message,
                date: new Date().toISOString(),
                status: 'new'
            };
            
            // Get existing messages from localStorage or initialize an empty array
            let messages = getFromStorage('contactMessages') || [];
            
            // Add the new message
            messages.push(contactMessage);
            
            // Save back to localStorage
            saveToStorage('contactMessages', messages);
            
            // Show success notification
            showNotification('Your message has been sent successfully! We will contact you soon.', 'success');
            
            // Reset the form
            contactForm.reset();
        });
    }
    
    // Helper function to show notifications
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            maxWidth: '400px',
            padding: '15px 20px',
            backgroundColor: type === 'success' ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)',
            color: '#ffffff',
            borderRadius: '5px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });
        
        // Style the icon
        const iconDiv = notification.querySelector('.notification-icon');
        Object.assign(iconDiv.style, {
            marginRight: '15px',
            fontSize: '1.5rem'
        });
        
        // Append to body
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
    
    // Map Interaction (In a real app, this would use the Google Maps API)
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        // Add a slight zoom effect on hover
        mapContainer.addEventListener('mouseenter', () => {
            const iframe = mapContainer.querySelector('iframe');
            if (iframe) {
                iframe.style.transition = 'transform 0.3s ease';
                iframe.style.transform = 'scale(1.02)';
            }
        });
        
        mapContainer.addEventListener('mouseleave', () => {
            const iframe = mapContainer.querySelector('iframe');
            if (iframe) {
                iframe.style.transform = 'scale(1)';
            }
        });
    }
    
    // Pre-fill form with user data if logged in
    const currentUser = getFromStorage('currentUser');
    if (currentUser && contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        
        if (nameInput && currentUser.name) {
            nameInput.value = currentUser.name;
        }
        
        if (emailInput && currentUser.email) {
            emailInput.value = currentUser.email;
        }
        
        if (phoneInput && currentUser.phone) {
            phoneInput.value = currentUser.phone;
        }
    }
    
    // Animate contact info items on page load
    const infoItems = document.querySelectorAll('.info-item');
    
    if (infoItems.length > 0) {
        infoItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 200 + (index * 100));
        });
    }
});