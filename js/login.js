// Login Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForms = document.querySelectorAll('.login-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabTarget = btn.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show correct form
            loginForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabTarget}-login-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Form switching between login and register
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const guestLoginForm = document.getElementById('guest-login-form');
    const registerForm = document.getElementById('register-form');
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            guestLoginForm.classList.remove('active');
            registerForm.classList.add('active');
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
            guestLoginForm.classList.add('active');
        });
    }
    
    // Guest Login Form Submission
    const guestForm = document.getElementById('guest-login-form');
    if (guestForm) {
        guestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('guest-email').value;
            const phone = document.getElementById('guest-phone').value;
            
            // Get users from localStorage
            const users = getFromStorage('users') || [];
            
            // Find user by email and phone
            const user = users.find(u => u.email === email && u.phone === phone);
            
            if (user) {
                // Check if user is an admin
                if (user.isAdmin) {
                    // Store logged in user in localStorage
                    saveToStorage('currentUser', user);
                    
                    // Redirect to admin dashboard
                    window.location.href = 'admin-dashboard.html';
                } else {
                    // Store logged in user in localStorage
                    saveToStorage('currentUser', user);
                    
                    // Redirect to homepage
                    window.location.href = 'index.html';
                }
            } else {
                showMessage('Invalid email or phone number. Please try again or register.', 'error');
            }
        });
    }
    
    // Admin Login Form Submission
    const adminForm = document.getElementById('admin-login-form');
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            
            // For demo purposes, use a hardcoded admin account
            // In a real app, this would validate against a secure backend
            if (email === 'admin@dahilayanhotel.com' && password === 'admin123') {
                // Get admin user from localStorage
                const users = getFromStorage('users') || [];
                const adminUser = users.find(u => u.email === email && u.isAdmin);
                
                if (adminUser) {
                    // Store logged in admin in localStorage
                    saveToStorage('currentUser', adminUser);
                    
                    // Redirect to admin dashboard
                    window.location.href = 'admin-dashboard.html';
                } else {
                    showMessage('Admin account not found.', 'error');
                }
            } else {
                showMessage('Invalid admin credentials.', 'error');
            }
        });
    }
    
    // Registration Form Submission
    const registerFormElement = document.getElementById('register-form');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            
            // Get users from localStorage
            let users = getFromStorage('users') || [];
            
            // Check if user with this email already exists
            if (users.some(u => u.email === email)) {
                showMessage('An account with this email already exists.', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: generateId(users),
                name,
                email,
                phone
            };
            
            // Add to users array
            users.push(newUser);
            
            // Save updated users to localStorage
            saveToStorage('users', users);
            
            // Store logged in user in localStorage
            saveToStorage('currentUser', newUser);
            
            // Show success message
            showMessage('Registration successful! Redirecting...', 'success');
            
            // Redirect to homepage after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Helper function to show messages
    function showMessage(message, type) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message ${type}`;
        messageContainer.textContent = message;
        
        // Style the message container
        Object.assign(messageContainer.style, {
            padding: '10px 15px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '500',
            animation: 'fadeIn 0.3s ease'
        });
        
        // Add color based on message type
        if (type === 'error') {
            Object.assign(messageContainer.style, {
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                color: '#dc3545',
                border: '1px solid rgba(220, 53, 69, 0.3)'
            });
        } else if (type === 'success') {
            Object.assign(messageContainer.style, {
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                color: '#28a745',
                border: '1px solid rgba(40, 167, 69, 0.3)'
            });
        }
        
        // Find the active form to add the message to
        const activeForm = document.querySelector('.login-form.active');
        activeForm.insertBefore(messageContainer, activeForm.firstChild);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageContainer.style.opacity = '0';
            messageContainer.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                messageContainer.remove();
            }, 300);
        }, 3000);
    }
    
    // Add CSS for message animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});