document.addEventListener("DOMContentLoaded", () => {
    
    // Set Header Date
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }

    // ==========================================
    // MOCK DATA 
    // ==========================================
    
    let activities = [
        { id: 1, type: 'asset', icon: 'laptop', title: 'Laptop AF-0114 allocated to you', desc: 'Hardware assignment completed.', date: '2026-07-12', time: '09:15 AM', status: 'Allocated' },
        { id: 2, type: 'booking', icon: 'calendar', title: 'Meeting Room B2 booked', desc: 'Booking confirmed for July 14th.', date: '2026-07-11', time: '02:30 PM', status: 'Confirmed' },
        { id: 3, type: 'maintenance', icon: 'wrench', title: 'Maintenance request approved', desc: 'Projector AF-0062 repair approved.', date: '2026-07-11', time: '11:05 AM', status: 'Approved' },
        { id: 4, type: 'asset', icon: 'arrow-right-left', title: 'Transfer request submitted', desc: 'Monitor AF-0342 requested to IT.', date: '2026-07-10', time: '04:20 PM', status: 'Pending' },
        { id: 5, type: 'asset', icon: 'check-circle', title: 'Projector AF-0078 returned', desc: 'Return acknowledged by Asset Manager.', date: '2026-07-09', time: '10:00 AM', status: 'Returned' },
        { id: 6, type: 'notification', icon: 'bell', title: 'Asset return reminder received', desc: 'iPad Pro 12.9 due in 2 days.', date: '2026-07-08', time: '08:00 AM', status: 'Warning' },
        { id: 7, type: 'maintenance', icon: 'wrench', title: 'Maintenance completed', desc: 'Keyboard repair finished.', date: '2026-07-05', time: '01:15 PM', status: 'Resolved' },
        { id: 8, type: 'booking', icon: 'x-circle', title: 'Booking cancelled', desc: 'Conference Room A cancelled.', date: '2026-07-02', time: '09:45 AM', status: 'Cancelled' }
    ];

    let notifications = [
        { id: 1, type: 'Asset', icon: 'package', title: 'Asset Assigned', desc: 'MacBook Pro 16" (AF-0114) has been assigned to you.', time: '10 mins ago', read: false },
        { id: 2, type: 'Booking', icon: 'clock', title: 'Booking Reminder', desc: 'Meeting Room B starts in 30 minutes.', time: '1 hour ago', read: false },
        { id: 3, type: 'Maintenance', icon: 'check-circle', title: 'Maintenance Approved', desc: 'Your request for Projector AF-0062 was approved.', time: '3 hours ago', read: false },
        { id: 4, type: 'Asset', icon: 'arrow-right-left', title: 'Transfer Approved', desc: 'Transfer of Monitor AF-0342 is approved.', time: 'Yesterday', read: true },
        { id: 5, type: 'Asset', icon: 'alert-circle', title: 'Return Reminder', desc: 'iPad Pro 12.9 is due for return tomorrow.', time: 'Yesterday', read: true },
        { id: 6, type: 'Maintenance', icon: 'wrench', title: 'Maintenance Completed', desc: 'Keyboard replacement finished.', time: '2 days ago', read: true },
        { id: 7, type: 'System', icon: 'clipboard-list', title: 'Audit Reminder', desc: 'Please verify your assigned assets by Friday.', time: '3 days ago', read: true },
        { id: 8, type: 'Booking', icon: 'x-circle', title: 'Booking Cancelled', desc: 'Your booking for SUV Ford was cancelled by Admin.', time: 'Last Week', read: true }
    ];

    let assets = [
        { id: 'AF-0114', name: 'MacBook Pro 16"', category: 'Electronics', condition: 'Good', status: 'Allocated', allocDate: '2026-01-10', returnDate: '2027-01-10', icon: 'laptop' },
        { id: 'AF-0089', name: 'iPad Pro 12.9', category: 'Electronics', condition: 'Fair', status: 'Allocated', allocDate: '2026-03-05', returnDate: '2026-07-10', icon: 'tablet' },
        { id: 'AF-0342', name: 'Dell UltraSharp 27"', category: 'Peripherals', condition: 'New', status: 'Allocated', allocDate: '2026-01-10', returnDate: '2027-01-10', icon: 'monitor' },
        { id: 'AF-0401', name: 'ErgoChair Pro', category: 'Furniture', condition: 'Good', status: 'Allocated', allocDate: '2025-11-20', returnDate: 'N/A', icon: 'armchair' },
        { id: 'AF-0062', name: 'Sony Projector', category: 'Electronics', condition: 'Damaged', status: 'Under Maintenance', allocDate: '2025-09-15', returnDate: '2026-07-20', icon: 'projector' },
        { id: 'AF-0199', name: 'Logic Trainer', category: 'Electronics', condition: 'Good', status: 'Returned', allocDate: '2026-06-01', returnDate: '2026-07-01', icon: 'cpu' }
    ];

    let bookings = [
        { id: 'BK-101', name: 'Conference Room A', type: 'Room', date: '2026-07-15', start: '10:00 AM', end: '11:00 AM', location: 'Floor 2', status: 'Upcoming' },
        { id: 'BK-102', name: 'Meeting Room B', type: 'Room', date: '2026-07-12', start: '02:00 PM', end: '03:00 PM', location: 'Floor 1', status: 'Ongoing' },
        { id: 'BK-103', name: 'Company SUV (Ford)', type: 'Vehicle', date: '2026-07-18', start: '09:00 AM', end: '05:00 PM', location: 'Basement', status: 'Upcoming' },
        { id: 'BK-104', name: 'Smart Classroom 3', type: 'Room', date: '2026-07-10', start: '01:00 PM', end: '03:00 PM', location: 'Floor 3', status: 'Completed' },
        { id: 'BK-105', name: 'AV Equipment Cart', type: 'Equipment', date: '2026-07-14', start: '11:00 AM', end: '01:00 PM', location: 'IT Dept', status: 'Cancelled' }
    ];

    let maintenance = [
        { id: 'MR-501', assetName: 'Sony Projector', assetTag: 'AF-0062', issue: 'Lamp replacement required', priority: 'High', date: '2026-07-10', tech: 'Rahul V.', status: 'In Progress', expected: '2026-07-14' },
        { id: 'MR-502', assetName: 'MacBook Pro 16"', assetTag: 'AF-0114', issue: 'Keyboard sticking', priority: 'Low', date: '2026-07-11', tech: 'Unassigned', status: 'Pending', expected: 'TBD' },
        { id: 'MR-503', assetName: 'Dell UltraSharp', assetTag: 'AF-0342', issue: 'Flickering display', priority: 'Medium', date: '2026-07-08', tech: 'Amit K.', status: 'Approved', expected: '2026-07-15' },
        { id: 'MR-504', assetName: 'QR Scanner Module', assetTag: 'AF-0220', issue: 'Lens scratched', priority: 'Critical', date: '2026-07-01', tech: 'Priya S.', status: 'Resolved', expected: '2026-07-05' },
        { id: 'MR-505', assetName: 'Logic Analyzer', assetTag: 'AF-0300', issue: 'Calibration needed', priority: 'Medium', date: '2026-07-05', tech: 'Sana I.', status: 'Rejected', expected: 'N/A' }
    ];

    // ==========================================
    // RENDER FUNCTIONS
    // ==========================================

    window.renderActivity = function() {
        const container = document.getElementById('activity-timeline');
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = activities.map(act => `
            <div class="act-item" onclick="this.classList.toggle('expanded')">
                <div class="act-icon"><i data-lucide="${act.icon}"></i></div>
                <div class="act-content">
                    <div class="act-header">
                        <span class="act-title">${act.title}</span>
                        <span class="status-badge badge-${act.status.split(' ')[0]} m-0">${act.status}</span>
                    </div>
                    <div class="act-desc">${act.desc}</div>
                    <div class="act-time"><i data-lucide="clock" style="width:12px; display:inline; margin-bottom:-2px;"></i> ${act.date} at ${act.time}</div>
                    <div class="act-details">Additional system log details: ID-${act.id} recorded successfully by the AssetFlow core tracking engine.</div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    };

    window.renderNotifications = function() {
        const list = document.getElementById('notifications-list');
        const filter = document.getElementById('notif-filter').value;
        
        let filtered = notifications.filter(n => {
            if (filter === 'all') return true;
            if (filter === 'unread') return !n.read;
            return n.type === filter;
        });

        list.innerHTML = filtered.map(n => `
            <div class="notif-card ${n.read ? '' : 'unread'}">
                <div class="notif-icon"><i data-lucide="${n.icon}"></i></div>
                <div class="notif-content">
                    <div class="notif-header">
                        <span class="notif-title">${n.title}</span>
                        <span class="notif-time">${n.time}</span>
                    </div>
                    <div class="notif-desc">${n.desc}</div>
                    <div class="notif-actions">
                        ${!n.read ? `<button class="btn-outline" style="padding:4px 8px; font-size:11px;" onclick="markRead(${n.id})">Mark Read</button>` : ''}
                        <button class="btn-outline" style="padding:4px 8px; font-size:11px;" onclick="openModal('details-modal')">View Details</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        updateBadgeCount();
        lucide.createIcons();
    };

    function renderAssets() {
        const grid = document.getElementById('assets-grid');
        const searchTerm = document.getElementById('asset-search').value.toLowerCase();
        const categoryFilter = document.getElementById('asset-category-filter').value;
        const statusFilter = document.getElementById('asset-status-filter').value;
        const sortOrder = document.getElementById('asset-sort').value;

        let filtered = assets.filter(a => {
            return (a.name.toLowerCase().includes(searchTerm) || a.id.toLowerCase().includes(searchTerm)) &&
                   (categoryFilter === 'all' || a.category === categoryFilter) &&
                   (statusFilter === 'all' || a.status === statusFilter);
        });

        filtered.sort((a, b) => sortOrder === 'name-asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

        grid.innerHTML = filtered.map(a => `
            <div class="modern-card">
                <div class="status-badge badge-${a.status.split(' ')[0]}">${a.status}</div>
                <div class="card-top">
                    <div><h3 class="card-title">${a.name}</h3><span class="card-tag">${a.id}</span></div>
                    <div class="asset-icon-box"><i data-lucide="${a.icon}"></i></div>
                </div>
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Category</span><span class="info-value">${a.category}</span></div>
                    <div class="info-item"><span class="info-label">Condition</span><span class="info-value">${a.condition}</span></div>
                    <div class="info-item"><span class="info-label">Allocated</span><span class="info-value">${a.allocDate}</span></div>
                    <div class="info-item"><span class="info-label">Return By</span><span class="info-value">${a.returnDate}</span></div>
                </div>
                <div class="card-actions">
                    <button class="btn-outline" onclick="openModal('details-modal')"><i data-lucide="eye"></i> Details</button>
                    <div class="qr-placeholder"><i data-lucide="qr-code"></i></div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    function renderBookings() {
        const grid = document.getElementById('bookings-grid');
        const searchTerm = document.getElementById('booking-search').value.toLowerCase();
        const statusFilter = document.getElementById('booking-status-filter').value;

        let filtered = bookings.filter(b => {
            return b.name.toLowerCase().includes(searchTerm) && (statusFilter === 'all' || b.status === statusFilter);
        });
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

        grid.innerHTML = filtered.map(b => `
            <div class="modern-card">
                <div class="status-badge badge-${b.status}">${b.status}</div>
                <div class="card-top">
                    <div><h3 class="card-title">${b.name}</h3><span class="card-tag">${b.type} • ${b.location}</span></div>
                </div>
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Date</span><span class="info-value">${b.date}</span></div>
                    <div class="info-item"><span class="info-label">Time</span><span class="info-value">${b.start} - ${b.end}</span></div>
                </div>
                <div class="card-actions">
                    ${b.status !== 'Cancelled' && b.status !== 'Completed' ? `
                        <button class="btn-outline" onclick="openModal('reschedule-modal')"><i data-lucide="clock"></i> Reschedule</button>
                        <button class="btn-danger" onclick="cancelBooking('${b.id}')"><i data-lucide="x-circle"></i> Cancel</button>
                    ` : `<button class="btn-outline" onclick="openModal('details-modal')"><i data-lucide="eye"></i> Details</button>`}
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    function renderMaintenance() {
        const grid = document.getElementById('maintenance-grid');
        const priorityFilter = document.getElementById('maint-priority-filter').value;
        const statusFilter = document.getElementById('maint-status-filter').value;

        let filtered = maintenance.filter(m => {
            return (priorityFilter === 'all' || m.priority === priorityFilter) && (statusFilter === 'all' || m.status === statusFilter);
        });

        grid.innerHTML = filtered.map(m => `
            <div class="modern-card">
                <div style="display:flex; gap:8px;">
                    <div class="status-badge badge-${m.status.split(' ')[0]}">${m.status}</div>
                    <div class="status-badge badge-${m.priority}">${m.priority}</div>
                </div>
                <div class="card-top">
                    <div><h3 class="card-title">${m.assetName}</h3><span class="card-tag">${m.assetTag}</span></div>
                </div>
                <p style="font-size:13px; color:var(--text-main); margin-bottom:16px;"><strong>Issue:</strong> ${m.issue}</p>
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Submitted</span><span class="info-value">${m.date}</span></div>
                    <div class="info-item"><span class="info-label">Technician</span><span class="info-value">${m.tech}</span></div>
                    <div class="info-item"><span class="info-label">Expected</span><span class="info-value">${m.expected}</span></div>
                </div>
                <div class="card-actions">
                    <button class="btn-outline" onclick="openModal('details-modal')"><i data-lucide="file-text"></i> View</button>
                    <button class="btn-primary" onclick="trackProgress('${m.status}')"><i data-lucide="activity"></i> Track</button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    // ==========================================
    // NOTIFICATION HANDLERS
    // ==========================================
    
    window.markRead = function(id) {
        const notif = notifications.find(n => n.id === id);
        if(notif) notif.read = true;
        renderNotifications();
    };

    window.markAllRead = function() {
        notifications.forEach(n => n.read = true);
        renderNotifications();
    };

    window.clearAllNotifs = function() {
        if(confirm("Clear all notifications?")) {
            notifications = [];
            renderNotifications();
        }
    };

    window.updateBadgeCount = function() {
        const unreadCount = notifications.filter(n => !n.read).length;
        const globalBadge = document.getElementById('global-notif-badge');
        const panelBadge = document.getElementById('panel-notif-count');
        
        if (globalBadge) {
            globalBadge.textContent = unreadCount;
            globalBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        if (panelBadge) {
            panelBadge.textContent = unreadCount;
            panelBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
        }
    };

    // ==========================================
    // UI HANDLERS & LISTENERS
    // ==========================================

    document.getElementById('notif-filter').addEventListener('change', renderNotifications);

    document.getElementById('asset-search').addEventListener('input', renderAssets);
    document.getElementById('asset-category-filter').addEventListener('change', renderAssets);
    document.getElementById('asset-status-filter').addEventListener('change', renderAssets);
    document.getElementById('asset-sort').addEventListener('change', renderAssets);

    document.getElementById('booking-search').addEventListener('input', renderBookings);
    document.getElementById('booking-status-filter').addEventListener('change', renderBookings);

    document.getElementById('maint-priority-filter').addEventListener('change', renderMaintenance);
    document.getElementById('maint-status-filter').addEventListener('change', renderMaintenance);

    // Ripple Effect Logic
    const actionButtons = document.querySelectorAll('.qa-action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('mousedown', function (e) {
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) existingRipple.remove();

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x - size / 2}px`;
            ripple.style.top = `${y - size / 2}px`;

            this.appendChild(ripple);
        });
    });

    window.cancelBooking = function(id) {
        if(confirm(`Are you sure you want to cancel booking ${id}?`)) {
            let booking = bookings.find(b => b.id === id);
            if(booking) booking.status = 'Cancelled';
            renderBookings();
        }
    };

    window.submitReschedule = function() {
        alert("Booking rescheduled successfully!");
        closeModal('reschedule-modal');
    };

    window.trackProgress = function(currentStatus) {
        const stages = ['Pending', 'Approved', 'In Progress', 'Resolved'];
        const container = document.getElementById('workflow-container');
        let currentIndex = stages.indexOf(currentStatus);
        if (currentStatus === 'Rejected') currentIndex = -1;

        container.innerHTML = stages.map((stage, index) => {
            let stateClass = '';
            let dateStr = 'Pending...';
            if (index < currentIndex || currentStatus === 'Resolved') { stateClass = 'completed'; dateStr = 'Completed'; } 
            else if (index === currentIndex) { stateClass = 'active'; dateStr = 'Current Stage'; }
            if (currentStatus === 'Rejected') { stateClass = ''; dateStr = stage === 'Pending' ? 'Completed' : 'Halted'; }
            return `<div class="workflow-step ${stateClass}"><div class="step-dot"></div><div class="step-content"><div class="step-title">${stage}</div><div class="step-desc">${dateStr}</div></div></div>`;
        }).join('');
        openModal('track-modal');
    };

    window.openModal = function(id) {
        document.getElementById('modal-overlay').classList.add('active');
        document.getElementById(id).classList.add('active');
    };

    window.closeModal = function(id) {
        document.getElementById('modal-overlay').classList.remove('active');
        document.getElementById(id).classList.remove('active');
    };

    document.getElementById('modal-overlay').addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.getElementById('modal-overlay').classList.remove('active');
    });

    // Execute Initial Renders on Load
    renderActivity();
    renderNotifications();
    renderAssets();
    renderBookings();
    renderMaintenance();
});