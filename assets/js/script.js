// ========================================
// Hectares & Patrimoine - JavaScript
// ========================================

// Données des propriétés (Simulées)
const properties = [
    {
        id: 1,
        ref: 'NGN1474',
        title: 'Domaine équestre + de 30 hectares',
        city: 'Louhans',
        price: 1550000,
        rooms: 7,
        surface: 229,
        landSurface: 30,
        image: '../../assets/images/proprietes/propriete-1.jpg',
        agent: { name: 'Nathalie GULLON-NEYRIN', avatar: '../../assets/images/team/agent-1.jpg' },
        exclusive: false,
        status: 'available'
    },
    {
        id: 2,
        ref: 'ND2054',
        title: 'Propriété équestre, 3 maisons, 10 hectares',
        city: 'Riaille',
        price: 622000,
        rooms: 16,
        surface: 400,
        landSurface: 10,
        image: '../../assets/images/proprietes/propriete-2.jpg',
        agent: { name: 'Nicolas DALANCOURT', avatar: '../../assets/images/team/agent-2.jpg' },
        exclusive: false,
        status: 'available',
        fees: '4.01% TTC'
    },
    {
        id: 3,
        ref: '2038',
        title: 'Domaine équestre à 25 kms de PARIS',
        city: 'Marcoussis',
        price: 2278500,
        rooms: 5,
        surface: 143,
        landSurface: 8,
        image: '../../assets/images/proprietes/propriete-3.jpg',
        agent: { name: 'Magali BADIER', avatar: '../../assets/images/team/agent-3.jpg' },
        exclusive: true,
        status: 'available',
        fees: '5% TTC'
    },
    {
        id: 4,
        ref: 'ND1985',
        title: 'Maisons 7 pièce(s) 220 m² gîtes 8 hectares',
        city: 'Ligne',
        price: 650000,
        rooms: 7,
        surface: 220,
        landSurface: 8,
        image: '../../assets/images/proprietes/propriete-4.jpg',
        agent: { name: 'Nicolas DALANCOURT', avatar: '../../assets/images/team/agent-2.jpg' },
        exclusive: false,
        status: 'available',
        fees: '4.84% TTC'
    },
    {
        id: 5,
        ref: 'ND1998',
        title: 'Propriété équestre de 2,6 hectares, maison 187 m²',
        city: 'Héric',
        price: 0,
        rooms: 9,
        surface: 187,
        landSurface: 2.6,
        image: '../../assets/images/proprietes/propriete-5.jpg',
        agent: { name: 'Nicolas DALANCOURT', avatar: '../../assets/images/team/agent-2.jpg' },
        exclusive: false,
        status: 'sold'
    },
    {
        id: 6,
        ref: 'NGN2012',
        title: 'Charmante propriété équestre',
        city: 'Chanoz Châtenay',
        price: 645000,
        rooms: 5,
        surface: 142,
        landSurface: 5,
        image: '../../assets/images/proprietes/propriete-6.jpg',
        agent: { name: 'Nathalie GULLON-NEYRIN', avatar: '../../assets/images/team/agent-1.jpg' },
        exclusive: false,
        status: 'available',
        fees: '4.88% TTC'
    }
];

// État de l'application
let currentTab = 'vente';
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// ========================================
// Fonctions utilitaires
// ========================================

function formatPrice(price) {
    if (price === 0) return 'Vendu';
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR', 
        maximumFractionDigits: 0 
    }).format(price);
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ========================================
// Gestion des favoris
// ========================================

function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        trackEvent('Favoris', 'Suppression', `ID: ${id}`);
    } else {
        favorites.push(id);
        trackEvent('Favoris', 'Ajout', `ID: ${id}`);
    }
    saveFavorites();
    // Re-rendre uniquement si nous sommes sur une page affichant les propriétés
    if (document.getElementById('propertiesGrid')) {
        renderProperties();
    }
}

// ========================================
// Navigation & UI
// ========================================

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function toggleAdvanced() {
    const advanced = document.getElementById('advancedSearch');
    const text = document.getElementById('advancedText');
    
    if (advanced && text) {
        if (advanced.classList.contains('show')) {
            advanced.classList.remove('show');
            text.textContent = 'Plus de critères ▼';
        } else {
            advanced.classList.add('show');
            text.textContent = 'Moins de critères ▲';
        }
    }
}

function setActiveTab(tab) {
    currentTab = tab;
    const btnVente = document.getElementById('btnVente');
    const btnSold = document.getElementById('btnSold');
    const sectionTitle = document.getElementById('sectionTitle');
    
    // Mettre à jour les classes actives
    if (btnVente && btnSold) {
        if (tab === 'vente') {
            btnVente.classList.add('active');
            btnSold.classList.remove('active');
        } else {
            btnSold.classList.add('active');
            btnVente.classList.remove('active');
        }
    }

    if (sectionTitle) {
        sectionTitle.textContent = (tab === 'vente') ? 'Nos propriétés équestres à vendre' : 'Nos propriétés vendues';
    }
    
    filterProperties();
    trackEvent('Recherche', 'Changement Onglet', tab);
}

// ========================================
// Filtrage des propriétés
// ========================================

function filterProperties() {
    // Les champs de recherche existent uniquement sur index.html et pages/proprietes/liste.html
    const location = document.getElementById('searchLocation')?.value.toLowerCase() || '';
    const surfaceMin = parseInt(document.getElementById('searchSurface')?.value) || 0;
    const budgetMax = parseInt(document.getElementById('searchBudget')?.value) || Infinity;
    
    // Critères avancés (disponibles uniquement sur index.html)
    const landMin = parseInt(document.getElementById('searchLandMin')?.value) || 0;
    const landMax = parseInt(document.getElementById('searchLandMax')?.value) || Infinity;

    const filtered = properties.filter(prop => {
        // Filtrer par onglet
        if (currentTab === 'sold' && prop.status !== 'sold') return false;
        if (currentTab === 'vente' && prop.status === 'sold') return false;
        
        // Filtres de base
        if (location && !prop.city.toLowerCase().includes(location)) return false;
        if (prop.surface < surfaceMin) return false;
        if (prop.price > budgetMax && prop.price !== 0) return false;
        
        // Filtres avancés
        if (prop.landSurface < landMin) return false;
        if (prop.landSurface > landMax) return false;
        
        return true;
    });

    renderProperties(filtered);
}

// ========================================
// Rendu des propriétés
// ========================================

function renderProperties(filteredProps = properties) {
    const grid = document.getElementById('propertiesGrid');
    const count = document.getElementById('propertyCount');
    
    if (!grid) return; // Ne pas exécuter si nous ne sommes pas sur la page liste/index

    // Filtrer par onglet actif
    const filtered = filteredProps.filter(prop => {
        if (currentTab === 'sold') return prop.status === 'sold';
        return prop.status !== 'sold';
    });
    
    if (count) {
        count.textContent = `${filtered.length} propriété(s) ${currentTab === 'vente' ? 'disponible(s)' : 'vendue(s)'}`;
    }


    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
                <p style="font-size: 1.5rem; color: #9ca3af; margin-bottom: 1rem;">🔍</p>
                <p style="font-size: 1.25rem; font-weight: 600; color: #4b5563; margin-bottom: 0.5rem;">
                    Aucune propriété trouvée
                </p>
                <p style="color: #9ca3af;">
                    Essayez de modifier vos critères de recherche
                </p>
            </div>
        `;
        return;
    }
    
    // Le chemin vers detail.html doit être ajusté en fonction de la page
    // Depuis index.html, le chemin est pages/proprietes/detail.html
    // Depuis pages/proprietes/liste.html, le chemin est detail.html
    const detailPath = document.querySelector('body').classList.contains('page-index') ? 'pages/proprietes/detail.html' : 'detail.html';

    grid.innerHTML = filtered.map(prop => `
        <div class="property-card">
            <div class="property-image-wrapper">
                <img 
                    src="${prop.image}" 
                    alt="${prop.title}"
                    class="property-image"
                    loading="lazy"
                />
                ${prop.exclusive ? `
                    <div class="badge-exclusive">Exclusif</div>
                ` : ''}
                ${prop.status === 'sold' ? `
                    <div class="badge-sold">
                        <span>VENDU</span>
                    </div>
                ` : ''}
                <button 
                    onclick="toggleFavorite(${prop.id})"
                    class="favorite-btn ${favorites.includes(prop.id) ? 'active' : ''}"
                    aria-label="Ajouter aux favoris"
                >
                    <svg fill="${favorites.includes(prop.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                </button>
            </div>

            <div class="property-content">
                <div class="agent-info">
                    <img 
                        src="${prop.agent.avatar}" 
                        alt="${prop.agent.name}"
                        class="agent-avatar"
                    />
                    <div>
                        <p class="agent-label">Agent</p>
                        <p class="agent-name">${prop.agent.name}</p>
                    </div>
                </div>

                <h4 class="property-title">${prop.title}</h4>
                
                <div class="property-location">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>${prop.city}</span>
                </div>

                <div class="property-stats">
                    <div class="stat">
                        <span>🏠</span>
                        <span>${prop.rooms} pièces</span>
                    </div>
                    <div class="stat">
                        <span>📐</span>
                        <span>${prop.surface} m²</span>
                    </div>
                    <div class="stat">
                        <span>🌾</span>
                        <span>${prop.landSurface} ha</span>
                    </div>
                </div>

                <div class="property-footer">
                    <div>
                        <p class="property-price">${formatPrice(prop.price)}</p>
                        ${prop.fees ? `<p class="property-fees">dont ${prop.fees} d'honoraires</p>` : ''}
                    </div>
                    <span class="property-ref">Réf: ${prop.ref}</span>
                </div>

                <a href="${detailPath}?ref=${prop.ref}" class="btn-view-property">
                    Voir le bien
                </a>
            </div>
        </div>
    `).join('');
}

// ========================================
// Actions sur les propriétés
// ========================================

// Fonction de simulation de redirection
function viewProperty(ref) {
    // Dans la version production, nous utiliserions window.location.href = `proprietes/detail.html?ref=${ref}`;
    console.log(`Ouverture de la propriété réf: ${ref}`);
}

// ========================================
// Analytics
// ========================================

function trackEvent(category, action, label) {
    console.log('Event:', category, action, label);
}

// ========================================
// Initialisation
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Ajout de la gestion des événements de l'UI ---
    
    // Boutons des onglets de recherche
    const btnVente = document.getElementById('btnVente');
    const btnSold = document.getElementById('btnSold');
    if (btnVente) btnVente.addEventListener('click', () => setActiveTab('vente'));
    if (btnSold) btnSold.addEventListener('click', () => setActiveTab('sold'));

    // Bouton de menu mobile
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);

    // Bouton de recherche avancée
    const advancedToggle = document.getElementById('advancedToggle');
    if (advancedToggle) advancedToggle.addEventListener('click', toggleAdvanced);

    // Champs de recherche pour le filtrage en direct/après soumission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        // Appliquer les filtres à la soumission du formulaire de recherche
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            filterProperties();
            trackEvent('Recherche', 'Soumission Formulaire', 'Filtres appliqués');
        });
        
        // Ou en direct pour les champs de la recherche rapide sur la page liste
        const quickSearchInputs = document.querySelectorAll('#searchBox input, #searchBox select');
        quickSearchInputs.forEach(input => {
            input.addEventListener('change', filterProperties);
            input.addEventListener('input', filterProperties); // Pour les saisies en temps réel
        });
    }

    // --- 2. Initialisation de l'affichage ---
    
    // Ajout d'une classe au body pour gérer les chemins conditionnels (e.g. index.html vs pages/proprietes/liste.html)
    if (document.body.classList.contains('page-index')) {
        // Si c'est la page d'accueil, active l'onglet "vente" par défaut
        setActiveTab('vente'); 
    } else if (document.getElementById('propertiesGrid')) {
        // Si c'est la page de liste de propriétés, initialiser l'affichage
        setActiveTab(currentTab);
    }
    
    // --- 3. Animations et Smooth Scroll ---
    
    // Smooth scroll pour tous les liens avec ancre
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Fermer le menu mobile si ouvert
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // Animation au scroll des cards de propriétés (Laisse votre logique telle quelle)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observation une fois l'animation jouée
            }
        });
    }, observerOptions);
    
    // Observer les cards de propriétés
    setTimeout(() => {
        document.querySelectorAll('.property-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }, 100);
});

// Exporter les fonctions globales pour l'usage inline dans le HTML
window.toggleMobileMenu = toggleMobileMenu;
window.toggleAdvanced = toggleAdvanced;
window.setActiveTab = setActiveTab;
window.scrollToContact = () => document.getElementById('contact-details')?.scrollIntoView({ behavior: 'smooth' });
window.filterProperties = filterProperties;
window.toggleFavorite = toggleFavorite;
window.viewProperty = viewProperty;
