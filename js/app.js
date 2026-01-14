// Application State
let currentUser = null;
let currentLang = 'fr';
let currentPage = 'dashboard';
let dataStore = {
    users: [],
    products: [],
    orders: [],
    customers: [],
    invoices: []
};

// Traduction
const translations = {
    fr: {
        login: 'Se connecter',
        logout: 'Déconnexion',
        username: 'Nom d\'utilisateur',
        password: 'Mot de passe',
        dashboard: 'Tableau de bord',
        users: 'Utilisateurs',
        products: 'Produits',
        orders: 'Commandes',
        customers: 'Clients',
        invoices: 'Factures',
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
        view: 'Voir',
        search: 'Rechercher',
        filter: 'Filtrer',
        export: 'Exporter',
        save: 'Enregistrer',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        loading: 'Chargement...',
        noData: 'Aucune donnée disponible',
        total: 'Total',
        page: 'Page',
        of: 'sur',
        items: 'éléments',
        name: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        address: 'Adresse',
        status: 'Statut',
        price: 'Prix',
        quantity: 'Quantité',
        date: 'Date',
        description: 'Description',
        actions: 'Actions',
        active: 'Actif',
        inactive: 'Inactif',
        pending: 'En attente',
        completed: 'Terminé'
    },
    en: {
        login: 'Login',
        logout: 'Logout',
        username: 'Username',
        password: 'Password',
        dashboard: 'Dashboard',
        users: 'Users',
        products: 'Products',
        orders: 'Orders',
        customers: 'Customers',
        invoices: 'Invoices',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        loading: 'Loading...',
        noData: 'No data available',
        total: 'Total',
        page: 'Page',
        of: 'of',
        items: 'items',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        status: 'Status',
        price: 'Price',
        quantity: 'Quantity',
        date: 'Date',
        description: 'Description',
        actions: 'Actions',
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        completed: 'Completed'
    },
    ar: {
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
        username: 'اسم المستخدم',
        password: 'كلمة المرور',
        dashboard: 'لوحة التحكم',
        users: 'المستخدمون',
        products: 'المنتجات',
        orders: 'الطلبات',
        customers: 'العملاء',
        invoices: 'الفواتير',
        add: 'إضافة',
        edit: 'تعديل',
        delete: 'حذف',
        view: 'عرض',
        search: 'بحث',
        filter: 'تصفية',
        export: 'تصدير',
        save: 'حفظ',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        loading: 'جاري التحميل...',
        noData: 'لا توجد بيانات متاحة',
        total: 'المجموع',
        page: 'صفحة',
        of: 'من',
        items: 'عناصر',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        address: 'العنوان',
        status: 'الحالة',
        price: 'السعر',
        quantity: 'الكمية',
        date: 'التاريخ',
        description: 'الوصف',
        actions: 'الإجراءات',
        active: 'نشط',
        inactive: 'غير نشط',
        pending: 'في الانتظار',
        completed: 'مكتمل'
    }
};

// Initialisation d' Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    //  event listeners
    setupEventListeners();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    }
    
    // Load initial data
    loadMockData();
}

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Language dropdown
    document.querySelectorAll('[data-lang]').forEach(item => {
        item.addEventListener('click', handleLanguageChange);
    });
    
    // Navigation
    document.querySelectorAll('[data-page]').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'admin') {
        currentUser = { username: 'admin', role: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainApp();
    } else {
        alert('Identifiants incorrects. Utilisez admin/admin');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
}

function showLogin() {
    document.getElementById('loginPage').classList.remove('d-none');
    document.getElementById('mainApp').classList.add('d-none');
}

function showMainApp() {
    document.getElementById('loginPage').classList.add('d-none');
    document.getElementById('mainApp').classList.remove('d-none');
    loadPage('dashboard');
}

// Language Functions
function handleLanguageChange(e) {
    e.preventDefault();
    const lang = e.target.dataset.lang;
    currentLang = lang;
    updateLanguage();
}

function updateLanguage() {
    // Update current language display
    const langNames = { fr: 'Français', en: 'English', ar: 'العربية' };
    document.getElementById('currentLang').textContent = langNames[currentLang];
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    
    // Update RTL for Arabic
    if (currentLang === 'ar') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }
    
    // Reload current page with new language
    loadPage(currentPage);
}

// Navigation Functions
function handleNavigation(e) {
    e.preventDefault();
    const page = e.target.dataset.page;
    loadPage(page);
}

function loadPage(page) {
    currentPage = page;
    
    // Update active navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Load page content
    const contentArea = document.getElementById('contentArea');
    
    switch(page) {
        case 'dashboard':
            contentArea.innerHTML = getDashboardHTML();
            setTimeout(() => initializeDashboard(), 100);
            break;
        case 'users':
            contentArea.innerHTML = getUsersHTML();
            setTimeout(() => loadUsers(), 100);
            break;
        case 'products':
            contentArea.innerHTML = getProductsHTML();
            setTimeout(() => loadProducts(), 100);
            break;
        case 'orders':
            contentArea.innerHTML = getOrdersHTML();
            setTimeout(() => loadOrders(), 100);
            break;
        case 'customers':
            contentArea.innerHTML = getCustomersHTML();
            setTimeout(() => loadCustomers(), 100);
            break;
        case 'invoices':
            contentArea.innerHTML = getInvoicesHTML();
            setTimeout(() => loadInvoices(), 100);
            break;
    }
}

// Mock Data Generation
function loadMockData() {
    // Generate mock users
    dataStore.users = Array.from({length: 50}, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `+123456789${i}`,
        address: `Address ${i + 1}, City`,
        status: Math.random() > 0.3 ? 'active' : 'inactive',
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    // Generate mock products
    dataStore.products = Array.from({length: 100}, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        description: `Description for product ${i + 1}`,
        price: Math.floor(Math.random() * 1000) + 10,
        quantity: Math.floor(Math.random() * 100) + 1,
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    // Generate mock orders
    dataStore.orders = Array.from({length: 200}, (_, i) => ({
        id: i + 1,
        customerId: Math.floor(Math.random() * 50) + 1,
        customerName: `Customer ${Math.floor(Math.random() * 50) + 1}`,
        total: Math.floor(Math.random() * 5000) + 100,
        status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    // Generate mock customers
    dataStore.customers = Array.from({length: 75}, (_, i) => ({
        id: i + 1,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+987654321${i}`,
        address: `Customer Address ${i + 1}, City`,
        company: `Company ${i + 1}`,
        status: Math.random() > 0.25 ? 'active' : 'inactive',
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    // Generate mock invoices
    dataStore.invoices = Array.from({length: 150}, (_, i) => ({
        id: i + 1,
        customerId: Math.floor(Math.random() * 75) + 1,
        customerName: `Customer ${Math.floor(Math.random() * 75) + 1}`,
        orderId: Math.floor(Math.random() * 200) + 1,
        amount: Math.floor(Math.random() * 10000) + 500,
        status: ['paid', 'pending', 'overdue'][Math.floor(Math.random() * 3)],
        dueDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : currentLang === 'fr' ? 'fr-FR' : 'en-US');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat(currentLang === 'ar' ? 'ar-SA' : currentLang === 'fr' ? 'fr-FR' : 'en-US', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function getStatusBadge(status) {
    const statusClasses = {
        active: 'status-active',
        inactive: 'status-inactive',
        pending: 'status-pending',
        completed: 'status-completed',
        paid: 'status-active',
        overdue: 'status-inactive',
        cancelled: 'status-inactive'
    };
    
    return `<span class="status-badge ${statusClasses[status] || 'status-pending'}">${translations[currentLang][status] || status}</span>`;
}

function exportToCSV(data, filename) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showConfirmation(message, onConfirm) {
    document.getElementById('confirmMessage').textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
    
    document.getElementById('confirmBtn').onclick = function() {
        onConfirm();
        modal.hide();
    };
}

// Dashboard Functions
function getDashboardHTML() {
    return `
        <div class="fade-in">
            <h1 class="mb-4" data-translate="dashboard">Tableau de bord</h1>
            <div class="row mb-4">
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="stat-card">
                        <div class="stat-icon text-primary"><i class="fas fa-users"></i></div>
                        <div class="stat-value" id="totalUsers">${dataStore.users.length}</div>
                        <div class="stat-label" data-translate="users">Utilisateurs</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="stat-card">
                        <div class="stat-icon text-success"><i class="fas fa-box"></i></div>
                        <div class="stat-value" id="totalProducts">${dataStore.products.length}</div>
                        <div class="stat-label" data-translate="products">Produits</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="stat-card">
                        <div class="stat-icon text-warning"><i class="fas fa-shopping-cart"></i></div>
                        <div class="stat-value" id="totalOrders">${dataStore.orders.length}</div>
                        <div class="stat-label" data-translate="orders">Commandes</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="stat-card">
                        <div class="stat-icon text-info"><i class="fas fa-file-invoice"></i></div>
                        <div class="stat-value" id="totalInvoices">${dataStore.invoices.length}</div>
                        <div class="stat-label" data-translate="invoices">Factures</div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-4"><div class="dashboard-card"><div class="chart-container"><canvas id="chart1"></canvas></div></div></div>
                <div class="col-md-6 mb-4"><div class="dashboard-card"><div class="chart-container"><canvas id="chart2"></canvas></div></div></div>
                <div class="col-md-6 mb-4"><div class="dashboard-card"><div class="chart-container"><canvas id="chart3"></canvas></div></div></div>
                <div class="col-md-6 mb-4"><div class="dashboard-card"><div class="chart-container"><canvas id="chart4"></canvas></div></div></div>
                <div class="col-md-6 mb-4"><div class="dashboard-card"><div class="chart-container"><canvas id="chart5"></canvas></div></div></div>
                <div class="col-md-6 mb-4"><div class="dashboard-card"><div class="chart-container"><canvas id="chart6"></canvas></div></div></div>
            </div>
        </div>
    `;
}

function initializeDashboard() {
    const statusCounts = _.countBy(dataStore.orders, 'status');
    new Chart(document.getElementById('chart1'), {
        type: 'doughnut',
        data: { labels: Object.keys(statusCounts), datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }] }
    });
    
    new Chart(document.getElementById('chart2'), {
        type: 'line',
        data: { labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'], datasets: [{ label: 'Ventes', data: [1200, 1900, 3000, 2500, 2700, 3500], borderColor: '#36A2EB' }] }
    });
    
    new Chart(document.getElementById('chart3'), {
        type: 'bar',
        data: { labels: ['Électronique', 'Vêtements', 'Alimentation'], datasets: [{ label: 'Produits', data: [30, 25, 20], backgroundColor: '#4BC0C0' }] }
    });
    
    new Chart(document.getElementById('chart4'), {
        type: 'bar',
        data: { labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'], datasets: [{ label: 'Revenus', data: [5000, 7000, 9000, 8000, 8500, 10000], backgroundColor: '#9966FF' }] }
    });
    
    new Chart(document.getElementById('chart5'), {
        type: 'pie',
        data: { labels: ['Nord', 'Sud', 'Est', 'Ouest'], datasets: [{ data: [15, 20, 25, 18], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }] }
    });
    
    const invoiceStatus = _.countBy(dataStore.invoices, 'status');
    new Chart(document.getElementById('chart6'), {
        type: 'scatter',
        data: { datasets: [{ label: 'Factures', data: Object.entries(invoiceStatus).map(([s, c], i) => ({ x: i * 10, y: c })), backgroundColor: '#36A2EB' }] }
    });
}

// Generic CRUD HTML Generator
function getCRUDHTML(entity, translations) {
    return `
        <div class="fade-in">
            <div class="table-header">
                <h2>${translations.title}</h2>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAdd${entity}Form()">
                        <i class="fas fa-plus me-1"></i>Ajouter
                    </button>
                    <button class="btn btn-success" onclick="export${entity}CSV()">
                        <i class="fas fa-download me-1"></i>Exporter CSV
                    </button>
                </div>
            </div>
            <div class="filter-container">
                <div class="filter-row">
                    <input type="text" class="form-control" id="${entity.toLowerCase()}Search" placeholder="Rechercher..." onkeyup="filter${entity}s()">
                    <select class="form-select" id="${entity.toLowerCase()}StatusFilter" onchange="filter${entity}s()">
                        <option value="">Tous les statuts</option>
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="pending">En attente</option>
                        <option value="completed">Terminé</option>
                    </select>
                </div>
            </div>
            <div class="table-container">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead><tr>${translations.headers.map(h => `<th>${h}</th>`).join('')}<th>Actions</th></tr></thead>
                        <tbody id="${entity.toLowerCase()}sTableBody">
                            <tr><td colspan="${translations.headers.length + 1}" class="text-center"><div class="loading-spinner"><div class="spinner-border text-primary"></div></div></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Products Functions
function getProductsHTML() {
    return getCRUDHTML('Product', {
        title: 'Produits',
        headers: ['ID', 'Nom', 'Description', 'Prix', 'Quantité', 'Statut', 'Date']
    });
}

function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = dataStore.products.map(p => `
        <tr>
            <td>${p.id}</td><td>${p.name}</td><td>${p.description}</td><td>${formatCurrency(p.price)}</td><td>${p.quantity}</td>
            <td>${getStatusBadge(p.status)}</td><td>${formatDate(p.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewProduct(${p.id})"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-warning" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Orders Functions
function getOrdersHTML() {
    return getCRUDHTML('Order', {
        title: 'Commandes',
        headers: ['ID', 'Client', 'Total', 'Statut', 'Date']
    });
}

function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = dataStore.orders.map(o => `
        <tr>
            <td>${o.id}</td><td>${o.customerName}</td><td>${formatCurrency(o.total)}</td>
            <td>${getStatusBadge(o.status)}</td><td>${formatDate(o.date)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewOrder(${o.id})"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-warning" onclick="editOrder(${o.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteOrder(${o.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Customers Functions
function getCustomersHTML() {
    return getCRUDHTML('Customer', {
        title: 'Clients',
        headers: ['ID', 'Nom', 'Email', 'Téléphone', 'Société', 'Statut', 'Date']
    });
}

function loadCustomers() {
    const tbody = document.getElementById('customersTableBody');
    tbody.innerHTML = dataStore.customers.map(c => `
        <tr>
            <td>${c.id}</td><td>${c.name}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.company}</td>
            <td>${getStatusBadge(c.status)}</td><td>${formatDate(c.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewCustomer(${c.id})"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-warning" onclick="editCustomer(${c.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${c.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Invoices Functions
function getInvoicesHTML() {
    return getCRUDHTML('Invoice', {
        title: 'Factures',
        headers: ['ID', 'Client', 'Commande', 'Montant', 'Statut', 'Date', 'Échéance']
    });
}

function loadInvoices() {
    const tbody = document.getElementById('invoicesTableBody');
    tbody.innerHTML = dataStore.invoices.map(i => `
        <tr>
            <td>${i.id}</td><td>${i.customerName}</td><td>#${i.orderId}</td><td>${formatCurrency(i.amount)}</td>
            <td>${getStatusBadge(i.status)}</td><td>${formatDate(i.createdAt)}</td><td>${formatDate(i.dueDate)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewInvoice(${i.id})"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-warning" onclick="editInvoice(${i.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteInvoice(${i.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Initialize the application
initializeApp();
