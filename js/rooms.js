// Rooms Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Set min dates for check-in/out inputs
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    
    if (checkInInput && checkOutInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        checkInInput.min = formatDate(today);
        checkOutInput.min = formatDate(tomorrow);
        
        // Set default values
        checkInInput.value = formatDate(today);
        checkOutInput.value = formatDate(tomorrow);
        
        // Update checkout min date when checkin changes
        checkInInput.addEventListener('change', () => {
            const newCheckInDate = new Date(checkInInput.value);
            const newMinCheckOut = new Date(newCheckInDate);
            newMinCheckOut.setDate(newMinCheckOut.getDate() + 1);
            
            checkOutInput.min = formatDate(newMinCheckOut);
            
            // If current checkout date is before the new minimum, update it
            if (new Date(checkOutInput.value) <= newCheckInDate) {
                checkOutInput.value = formatDate(newMinCheckOut);
            }
        });
    }
    
    // Search form submission
    const searchForm = document.getElementById('booking-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = document.getElementById('guests').value;
            
            // Save search criteria to session storage
            sessionStorage.setItem('searchCriteria', JSON.stringify({
                checkIn,
                checkOut,
                guests
            }));
            
            // In a real app, this would filter available rooms based on the criteria
            // For this demo, we'll just show an alert
            alert(`Searching for rooms available from ${formatDate(checkIn)} to ${formatDate(checkOut)} for ${guests} guests.`);
            
            // Scroll to rooms list
            const roomsList = document.querySelector('.rooms-list');
            if (roomsList) {
                roomsList.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Book Room Button Click Events
    const bookButtons = document.querySelectorAll('.btn-book-room');
    const bookingModal = document.getElementById('booking-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.btn-cancel');
    
    if (bookButtons.length > 0 && bookingModal) {
        bookButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Get room details from data attributes
                const roomId = button.dataset.roomId;
                const roomType = button.dataset.roomType;
                const roomPrice = button.dataset.roomPrice;
                
                // Get search criteria (if any)
                let checkIn, checkOut, guests;
                const searchCriteria = sessionStorage.getItem('searchCriteria');
                
                if (searchCriteria) {
                    const criteria = JSON.parse(searchCriteria);
                    checkIn = criteria.checkIn;
                    checkOut = criteria.checkOut;
                    guests = criteria.guests;
                } else {
                    // Default values if no search was performed
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    
                    checkIn = formatDate(today);
                    checkOut = formatDate(tomorrow);
                    guests = '2';
                }
                
                // Calculate number of nights
                const nights = calculateNights(checkIn, checkOut);
                
                // Calculate total price
                const totalPrice = nights * roomPrice;
                
                // Fill the booking form with the details
                document.getElementById('room-id').value = roomId;
                document.getElementById('selected-room-type').textContent = roomType;
                document.getElementById('selected-room-price').textContent = roomPrice;
                document.getElementById('summary-check-in').textContent = formatDate(checkIn);
                document.getElementById('summary-check-out').textContent = formatDate(checkOut);
                document.getElementById('summary-nights').textContent = nights;
                document.getElementById('summary-guests').textContent = guests;
                document.getElementById('summary-total').textContent = totalPrice;
                
                // Show the modal
                bookingModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                
                // Check if user is logged in
                const currentUser = getFromStorage('currentUser');
                if (currentUser) {
                    // Pre-fill guest information if user is logged in
                    document.getElementById('guest-name').value = currentUser.name;
                    document.getElementById('guest-email').value = currentUser.email;
                    document.getElementById('guest-phone').value = currentUser.phone;
                }
            });
        });
        
        // Close modal when clicking on close button
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                bookingModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Close modal when clicking on cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                bookingModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                bookingModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    if (paymentMethods.length > 0) {
        // Show credit card form by default
        document.getElementById('cc-details').classList.add('active');
        
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                // Hide all payment forms
                paymentForms.forEach(form => {
                    form.classList.remove('active');
                });
                
                // Show the selected payment form
                const selectedPaymentForm = document.getElementById(`${method.value}-details`);
                if (selectedPaymentForm) {
                    selectedPaymentForm.classList.add('active');
                }
            });
        });
    }
    
    // Booking Form Submission
    const bookingForm = document.getElementById('booking-form');
    const confirmationModal = document.getElementById('confirmation-modal');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check if user is logged in
            const currentUser = getFromStorage('currentUser');
            if (!currentUser) {
                alert('Please login first to complete your booking.');
                window.location.href = 'login.html';
                return;
            }
            
            // Get form data
            const roomId = document.getElementById('room-id').value;
            const roomType = document.getElementById('selected-room-type').textContent;
            const checkIn = document.getElementById('summary-check-in').textContent;
            const checkOut = document.getElementById('summary-check-out').textContent;
            const totalAmount = document.getElementById('summary-total').textContent;
            const guestName = document.getElementById('guest-name').value;
            const guestEmail = document.getElementById('guest-email').value;
            const guestPhone = document.getElementById('guest-phone').value;
            const specialRequests = document.getElementById('special-requests').value;
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            // Get existing reservations
            let reservations = getFromStorage('reservations') || [];
            
            // Create new reservation
            const newReservation = {
                id: generateId(reservations),
                reservationId: `RS-${new Date().getFullYear()}-${(reservations.length + 1).toString().padStart(4, '0')}`,
                userId: currentUser.id,
                roomId: parseInt(roomId),
                roomType,
                checkIn,
                checkOut,
                guests: document.getElementById('summary-guests').textContent,
                amount: totalAmount,
                guestName,
                guestEmail,
                guestPhone,
                specialRequests,
                paymentMethod,
                status: 'confirmed',
                dateCreated: new Date().toISOString()
            };
            
            // Add to reservations array
            reservations.push(newReservation);
            
            // Save updated reservations to localStorage
            saveToStorage('reservations', reservations);
            
            // Close booking modal
            bookingModal.style.display = 'none';
            
            // Show confirmation details
            document.getElementById('confirmation-id').textContent = newReservation.reservationId;
            document.getElementById('confirmation-room').textContent = roomType;
            document.getElementById('confirmation-checkin').textContent = checkIn;
            document.getElementById('confirmation-checkout').textContent = checkOut;
            document.getElementById('confirmation-amount').textContent = totalAmount;
            
            // Show confirmation modal
            confirmationModal.style.display = 'block';
        });
    }
    
    // Close Confirmation Modal
    const closeConfirmation = document.querySelector('.btn-close-confirmation');
    if (closeConfirmation && confirmationModal) {
        closeConfirmation.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === confirmationModal) {
                confirmationModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
});

// Function to format dates in a readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}