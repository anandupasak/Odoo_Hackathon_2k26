document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    // ==========================================
    // MOCK ERP MASTER DATA
    // ==========================================
    let departments = [
        { id: 1, name: 'Engineering', head: 'Aditi Rao', parent: '--', count: 42, status: 'Active', date: '2024-01-15' },
        { id: 2, name: 'Human Resources', head: 'Priya Shah', parent: '--', count: 12, status: 'Active', date: '2024-01-20' },
        { id: 3, name: 'Finance', head: 'Amit Kumar', parent: '--', count: 8, status: 'Active', date: '2024-01-25' },
        { id: 4, name: 'Marketing', head: 'Neha Gupta', parent: '--', count: 15, status: 'Active', date: '2024-02-01' },
        { id: 5, name: 'Operations', head: 'Rohan Mehta', parent: '--', count: 65, status: 'Active', date: '2024-02-10' },
        { id: 6, name: 'IT Support', head: 'Rahul Verma', parent: 'Operations', count: 18, status: 'Active', date: '2024-02-15' },
        { id: 7, name: 'Sales', head: 'Sanjay Patel', parent: '--', count: 24, status: 'Active', date: '2024-03-01' },
        { id: 8, name: 'Field Ops (East)', head: 'Sana Iqbal', parent: 'Operations', count: 0, status: 'Inactive', date: '2024-05-12' }
    ];

    let categories = [
        { id: 1, name: 'Electronics', desc: 'Laptops, Tablets, Monitors', warranty: 12, interval: 90, assets: 450, status: 'Active' },
        { id: 2, name: 'Furniture', desc: 'Desks, Chairs, Cabinets', warranty: 36, interval: 365, assets: 820, status: 'Active' },
        { id: 3, name: 'Vehicles', desc: 'Company cars and vans', warranty: 60, interval: 30, assets: 15, status: 'Active' },
        { id: 4, name: 'Networking Eq.', desc: 'Routers, Switches, Servers', warranty: 24, interval: 60, assets: 125, status: 'Active' },
        { id: 5, name: 'Office Equipment', desc: 'Whiteboards, Shredders', warranty: 12, interval: 180, assets: 60, status: 'Active' },
        { id: 6, name: 'Printers', desc: 'Laser and 3D Printers', warranty: 12, interval: 45, assets: 32, status: 'Active' },
        { id: 7, name: 'Security Devices', desc: 'Cameras, Access Readers', warranty: 24, interval: 90, assets: 105, status: 'Active' },
        { id: 8, name: 'Laboratory Eq.', desc: 'Testing scopes and kits', warranty: 12, interval: 30, assets: 0, status: 'Inactive' }
    ];

    let employees = [
        { id: 'EMP-001', name: 'Aditi Rao', email: 'aditi@assetflow.com', phone: '+91 9876543210', dept: 'Engineering', role: 'Department Head', manager: 'System Admin', status: 'Active' },
        { id: 'EMP-042', name: 'Anand Sharma', email: 'anand@assetflow.com', phone: '+91 9876543211', dept: 'Engineering', role: 'Employee', manager: 'Aditi Rao', status: 'Active' },
        { id: 'EMP-015', name: 'Priya Shah', email: 'priya@assetflow.com', phone: '+91 9876543212', dept: 'Human Resources', role: 'Department Head', manager: 'System Admin', status: 'Active' },
        { id: 'EMP-089', name: 'Rohan Mehta', email: 'rohan@assetflow.com', phone: '+91 9876543213', dept: 'Operations', role: 'Department Head', manager: 'System Admin', status: 'Active' },
        { id: 'EMP-102', name: 'Sana Iqbal', email: 'sana@assetflow.com', phone: '+91 9876543214', dept: 'Operations', role: 'Asset Manager', manager: 'Rohan Mehta', status: 'On Leave' },
        { id: 'EMP-145', name: 'Amit Kumar', email: 'amit@assetflow.com', phone: '+91 9876543215', dept: 'Finance', role: 'Department Head', manager: 'System Admin', status: 'Active' },
        { id: 'EMP-201', name: 'Rahul Verma', email: 'rahul@assetflow.com', phone: '+91 9876543216', dept: 'IT Support', role: 'Asset Manager', manager: 'Rohan Mehta', status: 'Active' },
        { id: 'EMP-304', name: 'Neha Gupta', email: 'neha@assetflow.com', phone: '+91 9876543217', dept: 'Marketing', role: 'Employee', manager: 'System Admin', status: 'Inactive' }
    ];

    // ==========================================
    // STATE & CONFIG
    // ==========================================
    const ITEMS_PER_PAGE = 5;
    let state = {
        deptPage: 1,
        catPage: 1,
        empPage: 1
    };

    // ==========================================
    // TAB LOGIC
    // ==========================================
    window.switchTab = function(tabId) {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    };

    // ==========================================
    // RENDER LOGIC
    // ==========================================
    function getBadgeClass(status) {
        if(status === 'Active') return 'b-active';
        if(status === 'Inactive') return 'b-inactive';
        if(status === 'On Leave') return 'b-leave';
        return 'b-inactive';
    }

    function getRoleBadge(role) {
        if(role === 'Admin') return 'b-role-admin';
        if(role === 'Department Head') return 'b-role-head';
        if(role === 'Asset Manager') return 'b-role-manager';
        return 'b-role-employee';
    }

    function renderPagination(totalItems, currentPage, containerId, renderCallback) {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
        const container = document.getElementById(containerId);
        
        let start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        let end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
        if (totalItems === 0) { start = 0; end = 0; }

        container.innerHTML = `
            <span>Showing ${start} to ${end} of ${totalItems} entries</span>
            <div class="page-controls">
                <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="${renderCallback}(${currentPage - 1})">Prev</button>
                <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="${renderCallback}(${currentPage + 1})">Next</button>
            </div>
        `;
    }

    // --- DEPARTMENTS RENDER ---
    window.renderDepartments = function(page = 1) {
        state.deptPage = page;
        const tbody = document.getElementById('dept-table-body');
        const search = document.getElementById('dept-search').value.toLowerCase();
        const status = document.getElementById('dept-status-filter').value;
        const sort = document.getElementById('dept-sort').value;

        let filtered = departments.filter(d => 
            (d.name.toLowerCase().includes(search) || d.head.toLowerCase().includes(search)) &&
            (status === 'all' || d.status === status)
        );

        if(sort === 'name-asc') filtered.sort((a,b) => a.name.localeCompare(b.name));
        if(sort === 'name-desc') filtered.sort((a,b) => b.name.localeCompare(a.name));
        if(sort === 'count-desc') filtered.sort((a,b) => b.count - a.count);

        const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

        tbody.innerHTML = paginated.map(d => `
            <tr>
                <td><strong>${d.name}</strong></td>
                <td>${d.head}</td>
                <td>${d.parent}</td>
                <td>${d.count}</td>
                <td><span class="badge ${getBadgeClass(d.status)}">${d.status}</span></td>
                <td>${d.date}</td>
                <td class="action-cell">
                    <button class="action-btn" title="Edit" onclick="openSpecificModal('dept-modal')"><i data-lucide="edit"></i></button>
                    <button class="action-btn" title="Delete" onclick="confirmAction('Delete Department')"><i data-lucide="trash-2"></i></button>
                </td>
            </tr>
        `).join('');

        renderPagination(filtered.length, page, 'dept-pagination', 'renderDepartments');
        lucide.createIcons();
    };

    // --- CATEGORIES RENDER ---
    window.renderCategories = function(page = 1) {
        state.catPage = page;
        const tbody = document.getElementById('cat-table-body');
        const search = document.getElementById('cat-search').value.toLowerCase();
        const status = document.getElementById('cat-status-filter').value;
        const sort = document.getElementById('cat-sort').value;

        let filtered = categories.filter(c => 
            (c.name.toLowerCase().includes(search)) &&
            (status === 'all' || c.status === status)
        );

        if(sort === 'name-asc') filtered.sort((a,b) => a.name.localeCompare(b.name));
        if(sort === 'assets-desc') filtered.sort((a,b) => b.assets - a.assets);

        const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

        tbody.innerHTML = paginated.map(c => `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td><span style="max-width:200px; display:inline-block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${c.desc}">${c.desc}</span></td>
                <td>${c.warranty} mos</td>
                <td>${c.interval} days</td>
                <td>${c.assets}</td>
                <td><span class="badge ${getBadgeClass(c.status)}">${c.status}</span></td>
                <td class="action-cell">
                    <button class="action-btn" title="Edit" onclick="openSpecificModal('cat-modal')"><i data-lucide="edit"></i></button>
                    <button class="action-btn" title="Delete" onclick="confirmAction('Delete Category')"><i data-lucide="trash-2"></i></button>
                </td>
            </tr>
        `).join('');

        renderPagination(filtered.length, page, 'cat-pagination', 'renderCategories');
        lucide.createIcons();
    };

    // --- EMPLOYEES RENDER ---
    window.renderEmployees = function(page = 1) {
        state.empPage = page;
        const tbody = document.getElementById('emp-table-body');
        const search = document.getElementById('emp-search').value.toLowerCase();
        const dept = document.getElementById('emp-dept-filter').value;
        const role = document.getElementById('emp-role-filter').value;
        const status = document.getElementById('emp-status-filter').value;
        const sort = document.getElementById('emp-sort').value;

        let filtered = employees.filter(e => 
            (e.name.toLowerCase().includes(search) || e.id.toLowerCase().includes(search) || e.email.toLowerCase().includes(search)) &&
            (dept === 'all' || e.dept === dept) &&
            (role === 'all' || e.role === role) &&
            (status === 'all' || e.status === status)
        );

        if(sort === 'name-asc') filtered.sort((a,b) => a.name.localeCompare(b.name));
        if(sort === 'dept-asc') filtered.sort((a,b) => a.dept.localeCompare(b.dept));

        const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

        tbody.innerHTML = paginated.map(e => `
            <tr>
                <td>
                    <div class="emp-cell">
                        <div class="emp-avatar">${e.name.charAt(0)}</div>
                        <div>
                            <strong>${e.name}</strong>
                            <span class="sub-text">${e.id}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="font-size:12px;">${e.email}</div>
                    <div class="sub-text">${e.phone}</div>
                </td>
                <td>${e.dept}</td>
                <td><span class="badge ${getRoleBadge(e.role)}">${e.role}</span></td>
                <td>${e.manager}</td>
                <td><span class="badge ${getBadgeClass(e.status)}">${e.status}</span></td>
                <td class="action-cell">
                    <button class="action-btn" title="Edit/Promote" onclick="openSpecificModal('emp-modal')"><i data-lucide="user-cog"></i></button>
                    <button class="action-btn" title="Reset Password" onclick="confirmAction('Reset Password')"><i data-lucide="key-round"></i></button>
                </td>
            </tr>
        `).join('');

        renderPagination(filtered.length, page, 'emp-pagination', 'renderEmployees');
        lucide.createIcons();
    };

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    document.getElementById('dept-search').addEventListener('input', () => renderDepartments(1));
    document.getElementById('dept-status-filter').addEventListener('change', () => renderDepartments(1));
    document.getElementById('dept-sort').addEventListener('change', () => renderDepartments(1));

    document.getElementById('cat-search').addEventListener('input', () => renderCategories(1));
    document.getElementById('cat-status-filter').addEventListener('change', () => renderCategories(1));
    document.getElementById('cat-sort').addEventListener('change', () => renderCategories(1));

    document.getElementById('emp-search').addEventListener('input', () => renderEmployees(1));
    document.getElementById('emp-dept-filter').addEventListener('change', () => renderEmployees(1));
    document.getElementById('emp-role-filter').addEventListener('change', () => renderEmployees(1));
    document.getElementById('emp-status-filter').addEventListener('change', () => renderEmployees(1));
    document.getElementById('emp-sort').addEventListener('change', () => renderEmployees(1));


    // ==========================================
    // MODAL & UI LOGIC
    // ==========================================
    window.openMasterModal = function() {
        openModal('master-add-modal');
    };

    window.openModal = function(id) {
        document.getElementById('modal-overlay').classList.add('active');
        document.getElementById(id).classList.add('active');
    };

    window.closeModal = function(id) {
        document.getElementById(id).classList.remove('active');
        // Only remove overlay if no other modals are open
        if(document.querySelectorAll('.modal.active').length === 0) {
            document.getElementById('modal-overlay').classList.remove('active');
        }
    };

    window.openSpecificModal = function(targetId, currentId = null) {
        if(currentId) closeModal(currentId);
        // Slight timeout to allow CSS transition of closing modal
        setTimeout(() => { openModal(targetId); }, currentId ? 200 : 0);
    };

    window.confirmAction = function(actionName) {
        document.getElementById('confirm-message').innerHTML = `Are you sure you want to <strong>${actionName}</strong>? This action cannot be undone.`;
        openModal('confirm-modal');
    };

    window.simulateSave = function(modalId, msg, isConfirm = false) {
        closeModal(modalId);
        showToast(msg);
        // Refresh tables to simulate data update
        if(!isConfirm) {
            if(modalId === 'dept-modal') renderDepartments(state.deptPage);
            if(modalId === 'cat-modal') renderCategories(state.catPage);
            if(modalId === 'emp-modal') renderEmployees(state.empPage);
        }
    };

    window.showToast = function(message) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-message').textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    };

    // Close Modals on Overlay Click
    document.getElementById('modal-overlay').addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.getElementById('modal-overlay').classList.remove('active');
    });

    // Initialize
    renderDepartments();
    renderCategories();
    renderEmployees();
});