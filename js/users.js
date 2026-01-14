// CRUD function
function getUsersHTML() {
    return `
        <div class="fade-in">
            <div class="table-header">
                <h2 data-translate="users">Utilisateurs</h2>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAddUserForm()">
                        <i class="fas fa-plus me-1"></i>
                        <span data-translate="add">Ajouter</span>
                    </button>
                    <button class="btn btn-success" onclick="exportUsersCSV()">
                        <i class="fas fa-download me-1"></i>
                        <span data-translate="export">Exporter CSV</span>
                    </button>
                </div>
            </div>
            
            <div class="filter-container">
                <div class="filter-row">
                    <div class="flex-grow-1">
                        <input type="text" class="form-control" id="userSearch" placeholder="${translations[currentLang].search || 'Rechercher'}..." onkeyup="filterUsers()">
                    </div>
                    <div>
                        <select class="form-select" id="userStatusFilter" onchange="filterUsers()">
                            <option value="">Tous les statuts</option>
                            <option value="active">Actif</option>
                            <option value="inactive">Inactif</option>
                        </select>
                    </div>
                    <div>
                        <select class="form-select" id="userSortBy" onchange="sortUsers()">
                            <option value="name">Trier par nom</option>
                            <option value="email">Trier par email</option>
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
                                <th data-translate="email">Email</th>
                                <th data-translate="phone">Téléphone</th>
                                <th data-translate="status">Statut</th>
                                <th data-translate="date">Date</th>
                                <th data-translate="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            <tr>
                                <td colspan="7" class="text-center">
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
                        <span id="usersPaginationInfo">Affichage 0-0 de 0 éléments</span>
                    </div>
                    <div>
                        <nav>
                            <ul class="pagination mb-0" id="usersPagination">
                                <!-- Pagination will be generated here -->
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let currentUsersPage = 1;
const usersPerPage = 10;
let filteredUsers = [];
let userSortField = 'name';
let userSortOrder = 'asc';

function loadUsers() {
    filteredUsers = [...dataStore.users];
    renderUsersTable();
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const statusFilter = document.getElementById('userStatusFilter').value;
    
    filteredUsers = dataStore.users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                              user.email.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    currentUsersPage = 1;
    renderUsersTable();
}

function sortUsers() {
    const sortBy = document.getElementById('userSortBy').value;
    
    if (sortBy === userSortField) {
        userSortOrder = userSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        userSortField = sortBy;
        userSortOrder = 'asc';
    }
    
    filteredUsers.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'createdAt') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }
        
        if (userSortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    renderUsersTable();
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    const startIndex = (currentUsersPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const pageUsers = filteredUsers.slice(startIndex, endIndex);
    
    if (pageUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    ${translations[currentLang].noData || 'Aucune donnée disponible'}
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = pageUsers.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${getStatusBadge(user.status)}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-info btn-action" onclick="viewUser(${user.id})" title="Voir">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning btn-action" onclick="editUser(${user.id})" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="deleteUser(${user.id})" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    updateUsersPagination();
}

function updateUsersPagination() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const pagination = document.getElementById('usersPagination');
    const paginationInfo = document.getElementById('usersPaginationInfo');
    
    const startIndex = (currentUsersPage - 1) * usersPerPage + 1;
    const endIndex = Math.min(currentUsersPage * usersPerPage, filteredUsers.length);
    
    paginationInfo.textContent = `Affichage ${startIndex}-${endIndex} de ${filteredUsers.length} éléments`;
    
    let paginationHTML = '';
    
    // Bouton precedent 
    paginationHTML += `
        <li class="page-item ${currentUsersPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeUsersPage(${currentUsersPage - 1})">Précédent</a>
        </li>
    `;
    
    // Nombres page
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentUsersPage - 2 && i <= currentUsersPage + 2)) {
            paginationHTML += `
                <li class="page-item ${i === currentUsersPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeUsersPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentUsersPage - 3 || i === currentUsersPage + 3) {
            paginationHTML += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }
    }
    
    // Bouton suivant
    paginationHTML += `
        <li class="page-item ${currentUsersPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeUsersPage(${currentUsersPage + 1})">Suivant</a>
        </li>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changeUsersPage(page) {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (page >= 1 && page <= totalPages) {
        currentUsersPage = page;
        renderUsersTable();
    }
}

function showAddUserForm() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajouter un utilisateur</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="addUserForm">
                        <div class="mb-3">
                            <label class="form-label">Nom</label>
                            <input type="text" class="form-control" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" name="email" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Téléphone</label>
                            <input type="tel" class="form-control" name="phone" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Adresse</label>
                            <input type="text" class="form-control" name="address" required>
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
                    <button type="button" class="btn btn-primary" onclick="saveUser()">Enregistrer</button>
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

function saveUser() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    
    const newUser = {
        id: dataStore.users.length + 1,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        status: formData.get('status'),
        createdAt: new Date().toISOString()
    };
    
    dataStore.users.push(newUser);
    loadUsers();
    
    // Close modal
    const modal = document.querySelector('.modal.show');
    bootstrap.Modal.getInstance(modal).hide();
}

function viewUser(id) {
    const user = dataStore.users.find(u => u.id === id);
    if (!user) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Détails de l'utilisateur</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="detail-container">
                        <div class="detail-section">
                            <h5>Informations générales</h5>
                            <div class="detail-row">
                                <div class="detail-label">ID:</div>
                                <div class="detail-value">${user.id}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Nom:</div>
                                <div class="detail-value">${user.name}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Email:</div>
                                <div class="detail-value">${user.email}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Téléphone:</div>
                                <div class="detail-value">${user.phone}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Adresse:</div>
                                <div class="detail-value">${user.address}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Statut:</div>
                                <div class="detail-value">${getStatusBadge(user.status)}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Date de création:</div>
                                <div class="detail-value">${formatDate(user.createdAt)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-danger" onclick="exportUserPDF(${user.id})">Exporter PDF</button>
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

function editUser(id) {
    const user = dataStore.users.find(u => u.id === id);
    if (!user) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modifier l'utilisateur</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editUserForm">
                        <div class="mb-3">
                            <label class="form-label">Nom</label>
                            <input type="text" class="form-control" name="name" value="${user.name}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" name="email" value="${user.email}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Téléphone</label>
                            <input type="tel" class="form-control" name="phone" value="${user.phone}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Adresse</label>
                            <input type="text" class="form-control" name="address" value="${user.address}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Statut</label>
                            <select class="form-select" name="status" required>
                                <option value="active" ${user.status === 'active' ? 'selected' : ''}>Actif</option>
                                <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactif</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick="updateUser(${id})">Mettre à jour</button>
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

function updateUser(id) {
    const user = dataStore.users.find(u => u.id === id);
    if (!user) return;
    
    const form = document.getElementById('editUserForm');
    const formData = new FormData(form);
    
    user.name = formData.get('name');
    user.email = formData.get('email');
    user.phone = formData.get('phone');
    user.address = formData.get('address');
    user.status = formData.get('status');
    
    loadUsers();
    
    // Close modal
    const modal = document.querySelector('.modal.show');
    bootstrap.Modal.getInstance(modal).hide();
}

function deleteUser(id) {
    showConfirmation('Êtes-vous sûr de vouloir supprimer cet utilisateur ?', () => {
        dataStore.users = dataStore.users.filter(u => u.id !== id);
        loadUsers();
    });
}

function exportUsersCSV() {
    exportToCSV(filteredUsers, 'users.csv');
}

function exportUserPDF(id) {
    const user = dataStore.users.find(u => u.id === id);
    if (!user) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('User Details', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`ID: ${user.id}`, 20, 40);
    doc.text(`Name: ${user.name}`, 20, 50);
    doc.text(`Email: ${user.email}`, 20, 60);
    doc.text(`Phone: ${user.phone}`, 20, 70);
    doc.text(`Address: ${user.address}`, 20, 80);
    doc.text(`Status: ${user.status}`, 20, 90);
    doc.text(`Created: ${formatDate(user.createdAt)}`, 20, 100);
    
    doc.save(`user_${user.id}.pdf`);
}
