// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin, if not redirect to login
    const currentUser = getFromStorage('currentUser');
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update admin info in the sidebar
    const adminNameElement = document.getElementById('admin-name');
    const adminEmailElement = document.getElementById('admin-email');
    
    if (adminNameElement && currentUser.name) {
        adminNameElement.textContent = currentUser.name;
    }
    
    if (adminEmailElement && currentUser.email) {
        adminEmailElement.textContent = currentUser.email;
    }
    
    // Sidebar toggle functionality
    const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    const adminMain = document.querySelector('.admin-main');
    
    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (adminMain) {
                adminMain.classList.toggle('expanded');
            }
        });
    }
    
    // Tab switching functionality
    const navItems = document.querySelectorAll('.admin-nav li');
    const contentTabs = document.querySelectorAll('.content-tab');
    
    if (navItems.length > 0 && contentTabs.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active nav item
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Show correct content tab
                const tabId = item.dataset.tab;
                contentTabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.id === tabId) {
                        tab.classList.add('active');
                    }
                });
                
                // Update header title
                const headerTitle = document.querySelector('.header-left h2');
                if (headerTitle) {
                    headerTitle.textContent = `${item.querySelector('span').textContent}`;
                }
                
                // On mobile, close sidebar after selection
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('expanded');
                }
            });
        });
    }
    
    // Admin Logout
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear current user from localStorage
            localStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
    
    // Load data into dashboard
    loadDashboardData();
    
    // Load data into tables
    loadReservationsTable();
    loadRoomsTable();
    loadUsersTable();
    loadPaymentsTable();
    
    // Initialize table filters
    initializeTableFilters();
    
    // Setup action buttons (View, Edit, Delete)
    setupActionButtons();
    
    // Setup pagination
    setupPagination();
    
    // Show dashboard by default
    document.getElementById('dashboard').classList.add('active');
    document.querySelector('[data-tab="dashboard"]').classList.add('active');
});

// Function to load dashboard data
function loadDashboardData() {
    try {
        // Get data from localStorage
        const rooms = getFromStorage('rooms') || [];
        const users = getFromStorage('users') || [];
        const reservations = getFromStorage('reservations') || [];
        
        // Calculate dashboard metrics
        const activeReservations = reservations.filter(res => res.status === 'confirmed' || res.status === 'checked-in').length;
        const availableRooms = rooms.length - activeReservations;
        const registeredUsers = users.filter(user => !user.isAdmin).length;
        
        // Calculate monthly revenue (sample for demo)
        let monthlyRevenue = 0;
        reservations.forEach(res => {
            const reservationDate = new Date(res.dateCreated);
            const currentDate = new Date();
            
            // If reservation was made in the current month
            if (reservationDate.getMonth() === currentDate.getMonth() && 
                reservationDate.getFullYear() === currentDate.getFullYear()) {
                monthlyRevenue += parseInt(res.amount);
            }
        });
        
        // Update dashboard summary cards
        const summaryCards = document.querySelectorAll('.summary-card .card-info h3');
        if (summaryCards.length >= 4) {
            summaryCards[0].textContent = activeReservations;
            summaryCards[1].textContent = availableRooms;
            summaryCards[2].textContent = registeredUsers;
            summaryCards[3].textContent = `₱${monthlyRevenue.toLocaleString()}`;
        }
        
        // In a real application, we would also update the charts
        // For this demo, we'll just use placeholders
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Function to load reservations table
function loadReservationsTable() {
    try {
        const reservationsTable = document.querySelector('#reservations .data-table tbody');
        if (!reservationsTable) return;
        
        const reservations = getFromStorage('reservations') || [];
        const users = getFromStorage('users') || [];
        
        // Clear existing rows
        reservationsTable.innerHTML = '';
        
        // Add reservation rows (limited to 5 for demo)
        const recentReservations = reservations.slice(0, 5);
        
        recentReservations.forEach(res => {
            // Find user info
            const user = users.find(u => u.id === res.userId) || { name: 'Guest' };
            
            // Determine status class
            let statusClass = 'status-upcoming';
            if (res.status === 'checked-in') statusClass = 'status-active';
            else if (res.status === 'completed') statusClass = 'status-completed';
            else if (res.status === 'canceled') statusClass = 'status-canceled';
            
            // Create row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${res.reservationId || `RS-${res.id}`}</td>
                <td>${user.name}</td>
                <td>${res.roomType}</td>
                <td>${res.checkIn}</td>
                <td>${res.checkOut}</td>
                <td>₱${res.amount}</td>
                <td><span class="${statusClass}">${res.status || 'Upcoming'}</span></td>
                <td>
                    <button class="btn-view" data-id="${res.id}"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn-edit" data-id="${res.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-delete" data-id="${res.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            
            reservationsTable.appendChild(row);
        });
        
        // If no reservations, show message
        if (recentReservations.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" style="text-align: center; padding: 20px;">No reservations found</td>
            `;
            reservationsTable.appendChild(emptyRow);
        }
        
    } catch (error) {
        console.error('Error loading reservations table:', error);
    }
}

// Function to load rooms table
function loadRoomsTable() {
    try {
        const roomsTable = document.querySelector('#rooms .data-table tbody');
        if (!roomsTable) return;
        
        const rooms = getFromStorage('rooms') || [];
        
        // Clear existing rows
        roomsTable.innerHTML = '';
        
        // Add room rows
        rooms.forEach(room => {
            // Randomly assign a status for demo purposes
            const statuses = ['available', 'occupied', 'maintenance', 'reserved'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Create row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.roomNumber}</td>
                <td>${room.roomType}</td>
                <td>${room.price.toLocaleString()}</td>
                <td>${room.pax}</td>
                <td><span class="status-${randomStatus}">${randomStatus.charAt(0).toUpperCase() + randomStatus.slice(1)}</span></td>
                <td>Apr ${Math.floor(Math.random() * 30) + 1}, 2025</td>
                <td>
                    <button class="btn-view" data-id="${room.id}"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn-edit" data-id="${room.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-delete" data-id="${room.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            
            roomsTable.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading rooms table:', error);
    }
}

// Function to load users table
function loadUsersTable() {
    try {
        const usersTable = document.querySelector('#users .data-table tbody');
        if (!usersTable) return;
        
        const users = getFromStorage('users') || [];
        const reservations = getFromStorage('reservations') || [];
        
        // Clear existing rows
        usersTable.innerHTML = '';
        
        // Add user rows (only non-admin users)
        const regularUsers = users.filter(user => !user.isAdmin);
        
        regularUsers.forEach(user => {
            // Count reservations for this user
            const userReservations = reservations.filter(res => res.userId === user.id).length;
            
            // Create row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id.toString().padStart(3, '0')}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td><span class="status-active">Active</span></td>
                <td>${userReservations}</td>
                <td>
                    <button class="btn-view" data-id="${user.id}"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn-edit" data-id="${user.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-delete" data-id="${user.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            
            usersTable.appendChild(row);
        });
        
        // If no users, show message
        if (regularUsers.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="7" style="text-align: center; padding: 20px;">No users found</td>
            `;
            usersTable.appendChild(emptyRow);
        }
        
    } catch (error) {
        console.error('Error loading users table:', error);
    }
}

// Function to load payments table
function loadPaymentsTable() {
    try {
        const paymentsTable = document.querySelector('#payments .data-table tbody');
        if (!paymentsTable) return;
        
        const reservations = getFromStorage('reservations') || [];
        const users = getFromStorage('users') || [];
        
        // Clear existing rows
        paymentsTable.innerHTML = '';
        
        // Add payment rows (using reservations as payments for demo)
        const recentPayments = reservations.slice(0, 5);
        
        recentPayments.forEach((res, index) => {
            // Find user info
            const user = users.find(u => u.id === res.userId) || { name: 'Guest' };
            
            // Generate payment ID
            const paymentId = `PY-2025-${(index + 121).toString().padStart(4, '0')}`;
            
            // Determine status
            let status = 'successful';
            if (res.status === 'canceled') status = 'refunded';
            
            // Create row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paymentId}</td>
                <td>${res.reservationId || `RS-${res.id}`}</td>
                <td>${user.name}</td>
                <td>${res.amount}</td>
                <td>${res.paymentMethod || 'Credit Card'}</td>
                <td>Apr ${Math.floor(Math.random() * 30) + 1}, 2025</td>
                <td><span class="status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                <td>
                    <button class="btn-view" data-id="${res.id}"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn-receipt" data-id="${res.id}"><i class="fa-solid fa-file-invoice"></i></button>
                </td>
            `;
            
            paymentsTable.appendChild(row);
        });
        
        // If no payments, show message
        if (recentPayments.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" style="text-align: center; padding: 20px;">No payments found</td>
            `;
            paymentsTable.appendChild(emptyRow);
        }
        
    } catch (error) {
        console.error('Error loading payments table:', error);
    }
}

// Function to initialize table filters
function initializeTableFilters() {
    const filters = [
        { id: 'reservation-filter', tableId: 'reservations' },
        { id: 'room-filter', tableId: 'rooms' },
        { id: 'user-filter', tableId: 'users' },
        { id: 'payment-filter', tableId: 'payments' }
    ];
    
    filters.forEach(filter => {
        const filterElement = document.getElementById(filter.id);
        if (filterElement) {
            filterElement.addEventListener('change', () => {
                // In a real app, this would filter the table data
                // For this demo, we'll just show an alert
                alert(`Filtered ${filter.tableId} by: ${filterElement.value}`);
            });
        }
    });
}

// Function to setup action buttons
function setupActionButtons() {
    // View buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            alert(`View details for item ID: ${id}`);
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            alert(`Edit item ID: ${id}`);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (confirm(`Are you sure you want to delete item ID: ${id}?`)) {
                alert(`Item ID: ${id} deleted.`);
                // In a real app, this would delete the item from the database
                // and refresh the table
            }
        });
    });
    
    // Receipt buttons
    document.querySelectorAll('.btn-receipt').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            alert(`Generate receipt for payment ID: ${id}`);
        });
    });
    
    // Add New buttons
    document.querySelectorAll('.btn-add-new').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.closest('section').id;
            alert(`Add new ${section.slice(0, -1)}`);
        });
    });
}

// Function to setup pagination
function setupPagination() {
    // Page buttons
    document.querySelectorAll('.page-numbers button').forEach(btn => {
        btn.addEventListener('click', () => {
            const pageContainer = btn.closest('.pagination');
            const activeButtons = pageContainer.querySelectorAll('.page-numbers button');
            
            // Update active button
            activeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // In a real app, this would load the corresponding page of data
        });
    });
    
    // Previous and Next buttons
    document.querySelectorAll('.btn-prev, .btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const pageContainer = btn.closest('.pagination');
            const activeButton = pageContainer.querySelector('.page-numbers button.active');
            
            if (activeButton) {
                let newActiveButton;
                
                if (btn.classList.contains('btn-prev')) {
                    newActiveButton = activeButton.previousElementSibling;
                    if (!newActiveButton || newActiveButton.tagName !== 'BUTTON') {
                        // If no previous button, go to the last button
                        const buttons = pageContainer.querySelectorAll('.page-numbers button');
                        newActiveButton = buttons[buttons.length - 1];
                    }
                } else {
                    newActiveButton = activeButton.nextElementSibling;
                    if (!newActiveButton || newActiveButton.tagName !== 'BUTTON') {
                        // If no next button, go to the first button
                        newActiveButton = pageContainer.querySelector('.page-numbers button');
                    }
                }
                
                // Update active button
                if (newActiveButton) {
                    activeButton.classList.remove('active');
                    newActiveButton.classList.add('active');
                    
                    // In a real app, this would load the corresponding page of data
                }
            }
        });
    });
}