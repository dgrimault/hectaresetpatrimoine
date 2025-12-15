// ========================================
// Hectares & Patrimoine - Property Detail Script
// Ce script gère l'affichage dynamique des détails d'un bien
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Assurez-vous que l'objet 'properties' est disponible (il est exporté dans script.js)
    if (typeof properties === 'undefined') {
        console.error("L'objet 'properties' est manquant. Assurez-vous que script.js est chargé avant property-detail.js.");
        return;
    }

    // --- 1. Récupérer la référence du bien dans l'URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    if (!ref) {
        document.querySelector('main').innerHTML = `
            <section class="container" style="text-align: center; padding: 5rem 0;">
                <h2>Propriété non trouvée</h2>
                <p class="lead">Aucune référence de bien n'a été spécifiée dans l'URL.</p>
                <a href="liste.html" class="btn btn-primary">Retour à la liste</a>
            </section>
        `;
        return;
    }

    // --- 2. Trouver la propriété correspondante ---
    const property = properties.find(p => p.ref === ref);

    if (!property) {
        document.querySelector('main').innerHTML = `
            <section class="container" style="text-align: center; padding: 5rem 0;">
                <h2>Propriété non trouvée</h2>
                <p class="lead">La référence ${ref} ne correspond à aucun bien dans notre base de données.</p>
                <a href="liste.html" class="btn btn-primary">Retour à la liste</a>
            </section>
        `;
        return;
    }

    // --- 3. Remplir le contenu dynamique (Mise à jour du DOM) ---
    
    document.title = `${property.title} (Réf: ${property.ref}) - Hectares et Patrimoine`;
    
    // A. En-tête de la page
    const headerPropriete = document.querySelector('.header-propriete');
    if (headerPropriete) {
        headerPropriete.querySelector('h1').textContent = property.title;
        headerPropriete.querySelector('.prix').textContent = window.formatPrice ? window.formatPrice(property.price) : `${property.price} €`;
        headerPropriete.querySelector('.reference').textContent = `Réf: ${property.ref}`;
        
        const badgeStatus = headerPropriete.querySelector('.badge-status');
        badgeStatus.textContent = property.status === 'sold' ? 'VENDU' : 'À Vendre';
        badgeStatus.style.backgroundColor = property.status === 'sold' ? 'var(--gray-600)' : 'var(--color-primary-light)';

        const badgeExclusive = headerPropriete.querySelector('.badge-exclusive');
        if (badgeExclusive) badgeExclusive.style.display = property.exclusive ? 'inline-block' : 'none';
    }

    // B. Caractéristiques principales
    const caracs = document.querySelector('.caracteristiques-grid');
    if (caracs) {
        caracs.innerHTML = `
            <div class="caracteristique-item"><h5>Prix Total</h5><p>${window.formatPrice ? window.formatPrice(property.price) : `${property.price} €`}</p></div>
            <div class="caracteristique-item"><h5>Surface Habitable</h5><p>${property.surface} m²</p></div>
            <div class="caracteristique-item"><h5>Terres / Hectares</h5><p>${property.landSurface} ha</p></div>
            <div class="caracteristique-item"><h5>Nombre de Pièces</h5><p>${property.rooms}</p></div>
            <div class="caracteristique-item"><h5>Charges FAI</h5><p>${property.fees || 'Inclus'}</p></div>
            <div class="caracteristique-item"><h5>Statut</h5><p>${property.status === 'sold' ? 'Vendu' : 'Disponible'}</p></div>
        `;
    }
    
    // C. Sidebar de l'Agent
    const agentBox = document.querySelector('.contact-agent-box');
    if (agentBox) {
        agentBox.querySelector('.agent-photo').src = property.agent.avatar;
        agentBox.querySelector('.agent-name').textContent = property.agent.name;
        
        const contactLink = agentBox.querySelector('.btn-primary');
        // Mise à jour du lien pour inclure l'objet "Question sur une propriété" et la référence
        contactLink.href = `../contact.html?objet=propriete&ref=${property.ref}`; 
    }
    
    // D. Gestion de la Galerie Photo (avec les images définies dans script.js)
    const mainImage = document.getElementById('main-image');
    const vignettesContainer = document.querySelector('.vignettes-photos');
    
    // Nous utilisons ici l'image principale définie dans l'objet 'property'
    // Pour une galerie complète, il faudrait que l'objet 'property' contienne un tableau d'URLs de photos
    if (mainImage && vignettesContainer) {
        
        // Image par défaut (la première de la liste de script.js)
        mainImage.src = property.image;
        mainImage.alt = property.title;
        
        // Simulation de vignettes (en utilisant les images simulées dans la vue HTML)
        const vignettes = vignettesContainer.querySelectorAll('img');

        // Réutiliser la fonction de la page detail.html (pour une implémentation simple)
        vignettes.forEach(vignette => {
            vignette.addEventListener('click', function() {
                mainImage.src = this.getAttribute('data-full-src');
                vignettes.forEach(v => v.style.borderColor = 'transparent');
                this.style.borderColor = 'var(--color-secondary)';
            });
        });

        // Appliquer le style actif à la première vignette au chargement
        if (vignettes.length > 0) {
            vignettes[0].style.borderColor = 'var(--color-secondary)';
        }
    }
    
    // E. (Optionnel) Simulation de l'événement Analytics
    if (window.trackEvent) {
        window.trackEvent('Propriété', 'Vue Détail', property.ref);
    }
});

