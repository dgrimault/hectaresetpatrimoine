// ========================================
// Hectares & Patrimoine - Map Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    
    // Vérifie si l'élément de carte existe sur la page (e.g. contact.html)
    if (!mapContainer) return; 

    // --- 1. Données de l'emplacement (Siège de l'agence) ---
    const agencyLocation = {
        lat: 44.837789, // Latitude de Bordeaux (Exemple)
        lng: -0.579180, // Longitude de Bordeaux (Exemple)
        title: "Siège Hectares et Patrimoine",
        address: "[Votre Adresse Postale Complète]",
        zoom: 13 // Niveau de zoom initial
    };
    
    // --- 2. Simulation ou Initialisation réelle de la carte ---
    
    // VRAIE INTÉGRATION LEAFLET (Commentée)
    /*
    try {
        // Initialiser la carte
        const map = L.map('map-container').setView([agencyLocation.lat, agencyLocation.lng], agencyLocation.zoom);
        
        // Ajouter les tuiles (tiles) d'OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Ajouter un marqueur
        L.marker([agencyLocation.lat, agencyLocation.lng]).addTo(map)
            .bindPopup(`<b>${agencyLocation.title}</b><br>${agencyLocation.address}`).openPopup();

        console.log("Carte Leaflet initialisée.");
    } catch (error) {
        console.error("Erreur lors de l'initialisation de Leaflet. S'assurer que les dépendances sont chargées.", error);
        // Si Leaflet n'est pas chargé, afficher la simulation
        simulateMap();
    }
    */
    
    // --- 3. Fonction de simulation (Affichée si aucune librairie de carte n'est chargée) ---
    
    function simulateMap() {
        mapContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                style="border:0;" 
                loading="lazy" 
                allowfullscreen 
                src="https://www.google.com/maps/embed/v1/place?key=[VOTRE_CLE_API_GOOGLE_ICI]&q=${agencyLocation.lat},${agencyLocation.lng}&zoom=${agencyLocation.zoom}"
            >
            </iframe>
        `;
        mapContainer.style.backgroundColor = 'white'; // Changer la couleur de fond si la simulation Google est affichée
        console.log("Carte simulée avec Google Maps Embed (iframe).");
        
        // Alternative sans Google Maps (si vous ne voulez pas d'API)
        /*
        mapContainer.innerHTML = `
            <div style="text-align: center; padding: 50px; color: var(--gray-600); font-style: italic;">
                [Emplacement de la carte : ${agencyLocation.title}]<br>
                Coordonnées: ${agencyLocation.lat}, ${agencyLocation.lng}<br><br>
                (Intégration Leaflet ou Google Maps requise ici)
            </div>
        `;
        */
    }
    
    // --- 4. Exécution ---
    
    // Pour cet environnement de développement sans dépendance externe (Leaflet, Google Maps), nous appelons la simulation.
    simulateMap();
});

