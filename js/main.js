// Common JavaScript for all pages

// Function to determine if text should be light or dark based on background color
function getContrastColor(backgroundColor) {
    // Convert hex to RGB
    let r, g, b;
    
    if (backgroundColor.startsWith('#')) {
        const hex = backgroundColor.substring(1);
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
    } else if (backgroundColor.startsWith('rgb')) {
        const rgbValues = backgroundColor.match(/\d+/g);
        r = parseInt(rgbValues[0]);
        g = parseInt(rgbValues[1]);
        b = parseInt(rgbValues[2]);
    } else {
        // Default to dark text if color format is unknown
        return 'dark-text';
    }
    
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return light text for dark backgrounds, dark text for light backgrounds
    return luminance > 0.5 ? 'dark-text' : 'light-text';
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// User Authentication Logic
const logoutBtn = document.getElementById('logout-btn');
const userNameElement = document.getElementById('user-name');

// Check if user is logged in from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        
        if (userNameElement) {
            userNameElement.textContent = userData.name;
        }
        
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
    }
});

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Clear user data from localStorage
        localStorage.removeItem('currentUser');
        
        // Reset UI
        if (userNameElement) {
            userNameElement.textContent = 'Guest';
        }
        
        logoutBtn.style.display = 'none';
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Check if page requires authentication
function requireAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize any interactive elements on the page
function initializeInteractiveElements() {
    // FAQ items toggle (if they exist on the page)
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                faqItem.classList.toggle('active');
            });
        });
    }
    
    // Apply dynamic text color to elements with background images
    const elementsWithBgImage = document.querySelectorAll('[data-bg-color]');
    if (elementsWithBgImage.length > 0) {
        elementsWithBgImage.forEach(element => {
            const bgColor = element.dataset.bgColor;
            const contrastClass = getContrastColor(bgColor);
            element.classList.add(contrastClass);
        });
    }
}

// Call interactive elements initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeInteractiveElements);

// Sample Data for Development (would be replaced with API/database calls in production)
const sampleRooms = [
    {
        id: 1,
        roomNumber: '101',
        roomType: 'Deluxe Room',
        price: 3500,
        pax: 2,
        description: 'Spacious room with mountain view, king-sized bed, and modern amenities.',
        images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'],
        amenities: ['Free Wi-Fi', '40" Smart TV', 'Rain Shower', 'Coffee Maker', 'Air Conditioning']
    },
    {
        id: 2,
        roomNumber: '201',
        roomType: 'Executive Suite',
        price: 5200,
        pax: 3,
        description: 'Luxury suite with separate living area, premium amenities, and panoramic views.',
        images: ['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg'],
        amenities: ['Free Wi-Fi', '55" Smart TV', 'Bathtub & Shower', 'Mini Bar', 'Lounge Area', 'Air Conditioning']
    },
    {
        id: 3,
        roomNumber: '301',
        roomType: 'Family Suite',
        price: 6800,
        pax: 5,
        description: 'Perfect for families with two bedrooms, spacious living area, and children\'s amenities.',
        images: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'],
        amenities: ['Free Wi-Fi', 'Multiple TVs', '2 Bathrooms', 'Dining Area', 'Mini Bar', 'Air Conditioning']
    },
    {
        id: 4,
        roomNumber: '401',
        roomType: 'Presidential Suite',
        price: 8500,
        pax: 4,
        description: 'Our finest accommodation with luxury furnishings, butler service, and private balcony.',
        images: ['https://images.pexels.com/photos/6186815/pexels-photo-6186815.jpeg'],
        amenities: ['Premium Wi-Fi', '65" Smart TV', 'Jacuzzi & Shower', 'Dining Area', 'Premium Mini Bar', 'Butler Service', 'Airport Transfer']
    }
];

const sampleUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+63 917 1234567'
    },
    {
        id: 2,
        name: 'Admin User',
        email: 'admin@dahilayanhotel.com',
        phone: '+63 917 9876543',
        isAdmin: true
    }
];

// Initialize localStorage with sample data if not already set
if (!localStorage.getItem('rooms')) {
    localStorage.setItem('rooms', JSON.stringify(sampleRooms));
}

if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
}

if (!localStorage.getItem('reservations')) {
    localStorage.setItem('reservations', JSON.stringify([]));
}

// Helper functions for working with localStorage
function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to generate a unique ID for new items
function generateId(items) {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Format currency (Philippine Peso)
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Calculate number of nights between two dates
function calculateNights(checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate - checkInDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Set minimum date for date inputs to today
function setMinDateForDateInputs() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.min = today;
    });
}

// Call when page loads
document.addEventListener('DOMContentLoaded', setMinDateForDateInputs);