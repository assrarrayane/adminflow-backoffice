// Dashboard Functions
function getDashboardHTML() {
    return `
        <div class="fade-in">
            <h1 class="mb-4" data-translate="dashboard">Tableau de bord</h1>
            
            <!-- Stats Cards -->
            <div class="row mb-4">
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="stat-card">
                        <div class="stat-icon text-primary">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-value" id="totalUsers">0</div>
                        <div class="stat-label" data-translate="users">Utilisateurs</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="stat-card">
                        <div class="stat-icon text-success">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-value" id="totalProducts">0</div>
                        <div class="stat-label" data-translate="products">Produits</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="stat-card">
                        <div class="stat-icon text-warning">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="stat-value" id="totalOrders">0</div>
                        <div class="stat-label" data-translate="orders">Commandes</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="stat-card">
                        <div class="stat-icon text-info">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <div class="stat-value" id="totalInvoices">0</div>
                        <div class="stat-label" data-translate="invoices">Factures</div>
                    </div>
                </div>
            </div>
            
            <!-- Charts Row 1 -->
            <div class="row mb-4">
                <div class="col-md-6 mb-4">
                    <div class="dashboard-card">
                        <h5 class="mb-3">Répartition des statuts de commandes</h5>
                        <div class="chart-container">
                            <canvas id="orderStatusChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="dashboard-card">
                        <h5 class="mb-3">Évolution des ventes</h5>
                        <div class="chart-container">
                            <canvas id="salesChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Charts Row 2 -->
            <div class="row mb-4">
                <div class="col-md-6 mb-4">
                    <div class="dashboard-card">
                        <h5 class="mb-3">Produits par catégorie</h5>
                        <div class="chart-container">
                            <canvas id="productCategoryChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="dashboard-card">
                        <h5 class="mb-3">Revenus mensuels</h5>
                        <div class="chart-container">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Charts Row 3 -->
            <div class="row mb-4">
                <div class="col-md-6 mb-4">
                    <div class="dashboard-card">
                        <h5 class="mb-3">Distribution des clients</h5>
                        <div class="chart-container">
                            <canvas id="customerDistributionChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="dashboard-card">
                        <h5 class="mb-3">Statut des factures</h5>
                        <div class="chart-container">
                            <canvas id="invoiceStatusChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeDashboard() {
    updateDashboardStats();
    createOrderStatusChart();
    createSalesChart();
    createProductCategoryChart();
    createRevenueChart();
    createCustomerDistributionChart();
    createInvoiceStatusChart();
}

function updateDashboardStats() {
    document.getElementById('totalUsers').textContent = dataStore.users.length;
    document.getElementById('totalProducts').textContent = dataStore.products.length;
    document.getElementById('totalOrders').textContent = dataStore.orders.length;
    document.getElementById('totalInvoices').textContent = dataStore.invoices.length;
}

function createOrderStatusChart() {
    const ctx = document.getElementById('orderStatusChart').getContext('2d');
    const statusCounts = _.countBy(dataStore.orders, 'status');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts).map(status => translations[currentLang][status] || status),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Pour generer les ventes mensuelles
    const monthlySales = Array.from({length: 12}, (_, i) => {
        const monthOrders = dataStore.orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === i;
        });
        return monthOrders.reduce((sum, order) => sum + order.total, 0);
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [{
                label: 'Ventes',
                data: monthlySales,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createProductCategoryChart() {
    const ctx = document.getElementById('productCategoryChart').getContext('2d');
    
    // Simulation de catergories
    const categories = ['Électronique', 'Vêtements', 'Alimentation', 'Maison', 'Sports'];
    const categoryData = categories.map(() => Math.floor(Math.random() * 30) + 10);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Produits',
                data: categoryData,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Generer les revenue mensuelles
    const monthlyRevenue = Array.from({length: 12}, (_, i) => {
        const monthInvoices = dataStore.invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.createdAt);
            return invoiceDate.getMonth() === i;
        });
        return monthInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [{
                label: 'Revenus',
                data: monthlyRevenue,
                backgroundColor: '#4BC0C0'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createCustomerDistributionChart() {
    const ctx = document.getElementById('customerDistributionChart').getContext('2d');
    
    // Distrib pour client par region
    const regions = ['Nord', 'Sud', 'Est', 'Ouest', 'Centre'];
    const regionData = regions.map(() => Math.floor(Math.random() * 20) + 5);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: regions,
            datasets: [{
                data: regionData,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createInvoiceStatusChart() {
    const ctx = document.getElementById('invoiceStatusChart').getContext('2d');
    const statusCounts = _.countBy(dataStore.invoices, 'status');
    
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Factures',
                data: Object.entries(statusCounts).map(([status, count], index) => ({
                    x: index * 10 + Math.random() * 10,
                    y: count
                })),
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
