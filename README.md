# AdminFlow - Backoffice de Gestion

## Description

AdminFlow est une application backoffice complète développée en JavaScript Vanilla, HTML5 et CSS3, sans utilisation de frameworks modernes comme React ou Angular. L'application permet de gérer 5 entités principales avec des fonctionnalités CRUD complètes et un tableau de bord analytique.

## Fonctionnalités

### 🔐 Authentification
- Page de connexion avec identifiants statiques (admin/admin)
- Session persistante via localStorage

### 📊 Tableau de Bord
- 6 types de graphiques différents (doughnut, line, bar, pie, scatter)
- Statistiques en temps réel
- Cartes d'indicateurs clés
- Design responsive et moderne

### 👥 Gestion des Entités (CRUD)

#### 1. Utilisateurs
- Création, lecture, mise à jour, suppression
- Filtrage par statut et recherche
- Export CSV et PDF
- Pagination

#### 2. Produits
- Gestion complète du catalogue
- Suivi des stocks
- Prix et descriptions
- Statuts actifs/inactifs

#### 3. Commandes
- Suivi des commandes clients
- Statuts (en attente, terminé, annulé)
- Calcul des totaux
- Historique des dates

#### 4. Clients
- Base de données clients
- Informations de contact
- Sociétés et adresses
- Statuts de compte

#### 5. Factures
- Gestion des factures
- Montants et échéances
- Statuts de paiement
- Lien avec les commandes

### 🌍 Internationalisation
- Support multilingue : Français, Anglais, Arabe
- Changement dynamique de langue
- Support RTL pour l'arabe

### 📱 Design Responsive
- Compatible mobile, tablette, desktop
- Menu latéral rétractable
- Interface adaptative
- Animations fluides

## Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec animations
- **JavaScript Vanilla** : Logique applicative
- **Bootstrap 5** : Framework CSS pour le responsive
- **Font Awesome** : Icônes professionnelles

### Bibliothèques JavaScript
- **Chart.js** : Graphiques et visualisations
- **jsPDF** : Génération de PDF
- **Lodash** : Utilitaires JavaScript

### Données
- **Données simulées** : Génération dynamique de données de test
- **LocalStorage** : Persistance des sessions

## Structure du Projet

```
projet d js/
├── index.html              # Page principale
├── css/
│   └── style.css          # Styles personnalisés
├── js/
│   ├── app.js             # Logique principale
│   ├── dashboard.js       # Fonctionnalités tableau de bord
│   ├── users.js           # CRUD utilisateurs
│   ├── products.js        # CRUD produits
│   └── (autres fichiers JS)
├── images/
│   └── logoadminflow.PNG  #logo initial 
│   └── logoadminwhite.PNG  #logo blanc      
└── README.md              # Documentation
```

## Installation et Démarrage

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (optionnel mais recommandé)

### Démarrage Rapide

1. **Cloner ou télécharger le projet**
   ```bash
   # Si vous avez un repository Git
   git clone [URL-du-repository]
   cd "AdminFlow"
   ```

2. **Lancer l'application**
   
   **Option 1 : Directement dans le navigateur**
   - Ouvrir `index.html` directement dans le navigateur
   
   **Option 2 : Avec un serveur local (recommandé)**
   ```bash
   # Avec Python
   python -m http.server 8000
   
   # Avec Node.js (si installé)
   npx serve .
   
   # Avec PHP
   php -S localhost:8000
   ```
   - Accéder à `http://localhost:8000`

3. **Se connecter**
   - Identifiant : `admin`
   - Mot de passe : `admin`

## Déploiement

### GitHub Pages
1. Pousser le code sur GitHub
2. Activer GitHub Pages dans les settings du repository
3. Sélectionner la branche principale (main/master)
4. L'application sera disponible à l'URL fournie


## Fonctionnalités Techniques

### CRUD 
- **Create** : Formulaires modaux de création
- **Read** : Tableaux avec pagination et filtres
- **Update** : Édition en place avec validation
- **Delete** : Suppression avec confirmation

### Export de Données
- **CSV** : Export des données filtrées
- **PDF** : Génération de fiches détaillées

### Recherche et Filtrage
- Recherche textuelle en temps réel
- Filtres par statut
- Tri multi-colonnes
- Pagination intelligente

### Sécurité
- Validation des formulaires
- Confirmation des suppressions
- Gestion des sessions basique

## API et Données

### Données Simulées
L'application utilise des données générées dynamiquement :
- 50 utilisateurs
- 100 produits
- 200 commandes
- 75 clients
- 150 factures

### Extensibilité
Le code est structuré pour facilement :
- Ajouter de nouvelles entités
- Intégrer des APIs externes
- Modifier les sources de données
- Étendre les fonctionnalités

## Support et Maintenance

### Tests Recommandés
- Tester sur différents navigateurs
- Vérifier le responsive design
- Valider les fonctionnalités CRUD
- Tester l'export de données

### Améliorations Possibles
- Intégration avec des APIs REST
- Gestion des permissions utilisateurs
- Notifications en temps réel
- Sauvegarde automatique

## Auteurs

Développé dans le cadre du projet de backoffice de gestion JavaScript Vanilla.

## Licence

Projet éducatif - Usage académique autorisé.
