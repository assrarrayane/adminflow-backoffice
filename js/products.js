//  CRUD Functions
function getProductsHTML() {
    return `
        <div class="fade-in">
            <div class="table-header">
                <h2 data-translate="products">Produits</h2>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAddProductForm()">
                        <i class="fas fa-plus me-1"></i>
                        <span data-translate="add">Ajouter</span>
                    </button>
                    <button class="btn btn-success" onclick="exportProductsCSV()">
                        <i class="fas fa-download me-1"></i>
                        <span data-translate="export">Exporter CSV</span>
                    </button>
                </div>
            </div>
            
            <div class="filter-container">
                <div class="filter-row">
                    <div class="flex-grow-1">
                        <input type="text" class="form-control" id="productSearch" placeholder="${translations[currentLang].search || 'Rechercher'}..." onkeyup="filterProducts()">
                    </div>
                    <div>
                        <select class="form-select" id="productStatusFilter" onchange="filterProducts()">
                            <option value="">Tous les statuts</option>
                            <option value="active">Actif</option>
                            <option value="inactive">Inactif</option>
                        </select>
                    </div>
                    <div>
                        <select class="form-select" id="productSortBy" onchange="sortProducts()">
                            <option value="name">Trier par nom</option>
                            <option value="price">Trier par prix</option>
                            <option value="quantity">Trier par quantité</option>
                            <option value="createdAt">Trier par date</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="table-container">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th data-translate="name">Nom</th>
                                <th data-translate="description">Description</th>
                                <th data-translate="price">Prix</th>
                                <th data-translate="quantity">Quantité</th>
                                <th data-translate="status">Statut</th>
                                <th data-translate="date">Date</th>
                                <th data-translate="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="productsTableBody">
                            <tr>
                                <td colspan="8" class="text-center">
                                    <div class="loading-spinner">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="pagination-container">
                    <div class="pagination-info">
                        <span id="productsPaginationInfo">Affichage 0-0 de 0 éléments</span>
                    </div>
                    <div>
                        <nav>
                            <ul class="pagination mb-0" id="productsPagination">
                                <!-- Pagination will be generated here -->
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let currentProductsPage = 1;
const productsPerPage = 10;
let filteredProducts = [];
let productSortField = 'name';
let productSortOrder = 'asc';

function loadProducts() {
    filteredProducts = [...dataStore.products];
    renderProductsTable();
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const statusFilter = document.getElementById('productStatusFilter').value;
    
    filteredProducts = dataStore.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                              product.description.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    currentProductsPage = 1;
    renderProductsTable();
}

function sortProducts() {
    const sortBy = document.getElementById('productSortBy').value;
    
    if (sortBy === productSortField) {
        productSortOrder = productSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        productSortField = sortBy;
        productSortOrder = 'asc';
    }
    
    filteredProducts.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'createdAt') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }
        
        if (productSortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    renderProductsTable();
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    const startIndex = (currentProductsPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    if (pageProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    ${translations[currentLang].noData || 'Aucune donnée disponible'}
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = pageProducts.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.quantity}</td>
            <td>${getStatusBadge(product.status)}</td>
            <td>${formatDate(product.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-info btn-action" onclick="viewProduct(${product.id})" title="Voir">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning btn-action" onclick="editProduct(${product.id})" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="deleteProduct(${product.id})" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    updateProductsPagination();
}

function updateProductsPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pagination = document.getElementById('productsPagination');
    const paginationInfo = document.getElementById('productsPaginationInfo');
    
    const startIndex = (currentProductsPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(currentProductsPage * productsPerPage, filteredProducts.length);
    
    paginationInfo.textContent = `Affichage ${startIndex}-${endIndex} de ${filteredProducts.length} éléments`;
    
    let paginationHTML = '';
    
    //  button precedent
    paginationHTML += `
        <li class="page-item ${currentProductsPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeProductsPage(${currentProductsPage - 1})">Précédent</a>
        </li>
    `;
    
    // Page numero
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentProductsPage - 2 && i <= currentProductsPage + 2)) {
            paginationHTML += `
                <li class="page-item ${i === currentProductsPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeProductsPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentProductsPage - 3 || i === currentProductsPage + 3) {
            paginationHTML += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentProductsPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeProductsPage(${currentProductsPage + 1})">Suivant</a>
        </li>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changeProductsPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentProductsPage = page;
        renderProductsTable();
    }
}

function showAddProductForm() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajouter un produit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="addProductForm">
                        <div class="mb-3">
                            <label class="form-label">Nom</label>
                            <input type="text" class="form-control" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" name="description" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Prix</label>
                            <input type="number" class="form-control" name="price" step="0.01" min="0" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Quantité</label>
                            <input type="number" class="form-control" name="quantity" min="0" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Statut</label>
                            <select class="form-select" name="status" required>
                                <option value="active">Actif</option>
                                <option value="inactive">Inactif</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick="saveProduct()">Enregistrer</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function saveProduct() {
    const form = document.getElementById('addProductForm');
    const formData = new FormData(form);
    
    const newProduct = {
        id: dataStore.products.length + 1,
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        quantity: parseInt(formData.get('quantity')),
        status: formData.get('status'),
        createdAt: new Date().toISOString()
    };
    
    dataStore.products.push(newProduct);
    loadProducts();
    
    // Close modal
    const modal = document.querySelector('.modal.show');
    bootstrap.Modal.getInstance(modal).hide();
}

function viewProduct(id) {
    const product = dataStore.products.find(p => p.id === id);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Détails du produit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="detail-container">
                        <div class="detail-section">
                            <h5>Informations générales</h5>
                            <div class="detail-row">
                                <div class="detail-label">ID:</div>
                                <div class="detail-value">${product.id}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Nom:</div>
                                <div class="detail-value">${product.name}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Description:</div>
                                <div class="detail-value">${product.description}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Prix:</div>
                                <div class="detail-value">${formatCurrency(product.price)}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Quantité:</div>
                                <div class="detail-value">${product.quantity}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Statut:</div>
                                <div class="detail-value">${getStatusBadge(product.status)}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Date de création:</div>
                                <div class="detail-value">${formatDate(product.createdAt)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-danger" onclick="exportProductPDF(${product.id})">Exporter PDF</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function editProduct(id) {
    const product = dataStore.products.find(p => p.id === id);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modifier le produit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editProductForm">
                        <div class="mb-3">
                            <label class="form-label">Nom</label>
                            <input type="text" class="form-control" name="name" value="${product.name}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" name="description" rows="3" required>${product.description}</textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Prix</label>
                            <input type="number" class="form-control" name="price" step="0.01" min="0" value="${product.price}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Quantité</label>
                            <input type="number" class="form-control" name="quantity" min="0" value="${product.quantity}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Statut</label>
                            <select class="form-select" name="status" required>
                                <option value="active" ${product.status === 'active' ? 'selected' : ''}>Actif</option>
                                <option value="inactive" ${product.status === 'inactive' ? 'selected' : ''}>Inactif</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick="updateProduct(${id})">Mettre à jour</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function updateProduct(id) {
    const product = dataStore.products.find(p => p.id === id);
    if (!product) return;
    
    const form = document.getElementById('editProductForm');
    const formData = new FormData(form);
    
    product.name = formData.get('name');
    product.description = formData.get('description');
    product.price = parseFloat(formData.get('price'));
    product.quantity = parseInt(formData.get('quantity'));
    product.status = formData.get('status');
    
    loadProducts();
    
    // Close modal
    const modal = document.querySelector('.modal.show');
    bootstrap.Modal.getInstance(modal).hide();
}

function deleteProduct(id) {
    showConfirmation('Êtes-vous sûr de vouloir supprimer ce produit ?', () => {
        dataStore.products = dataStore.products.filter(p => p.id !== id);
        loadProducts();
    });
}
//exportation du csv concernant les produits
function exportProductsCSV() {
    exportToCSV(filteredProducts, 'products.csv');
}

function exportProductPDF(id) {
    const product = dataStore.products.find(p => p.id === id);
    if (!product) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Product Details', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`ID: ${product.id}`, 20, 40);
    doc.text(`Name: ${product.name}`, 20, 50);
    doc.text(`Description: ${product.description}`, 20, 60);
    doc.text(`Price: ${formatCurrency(product.price)}`, 20, 70);
    doc.text(`Quantity: ${product.quantity}`, 20, 80);
    doc.text(`Status: ${product.status}`, 20, 90);
    doc.text(`Created: ${formatDate(product.createdAt)}`, 20, 100);
    
    doc.save(`product_${product.id}.pdf`);
}
