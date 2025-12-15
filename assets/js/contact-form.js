// ========================================
// Hectares & Patrimoine - Contact Form
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('main-contact-form');
    
    // Vérifie si le formulaire existe sur la page actuelle
    if (!form) return; 

    // Fonction de validation simple de l'email
    function isValidEmail(email) {
        // Regex standard pour validation d'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Fonction principale de gestion de la soumission
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche l'envoi classique du formulaire

        const nom = document.getElementById('nom');
        const email = document.getElementById('email');
        const objet = document.getElementById('objet');
        const message = document.getElementById('message');
        const consentement = document.getElementById('consentement');
        
        let valid = true;
        
        // Nettoyage des messages d'erreur précédents
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // --- Validation des champs ---
        
        if (nom && nom.value.trim() === '') {
            showError(nom, 'Veuillez entrer votre nom complet.');
            valid = false;
        }

        if (email && (!isValidEmail(email.value) || email.value.trim() === '')) {
            showError(email, 'Veuillez entrer une adresse e-mail valide.');
            valid = false;
        }
        
        if (objet && objet.value === '') {
            showError(objet, 'Veuillez sélectionner l\'objet de votre demande.');
            valid = false;
        }

        if (message && message.value.trim().length < 10) {
            showError(message, 'Votre message est trop court (minimum 10 caractères).');
            valid = false;
        }

        if (consentement && !consentement.checked) {
            showError(consentement.parentNode, 'Vous devez accepter la politique de confidentialité.');
            valid = false;
        }

        // --- Traitement final ---

        if (valid) {
            // Ici, vous enverriez les données au serveur via fetch() ou XMLHttpRequest
            console.log("Formulaire valide. Envoi des données...");
            
            // Simulation d'envoi réussi
            alert('Merci ! Votre message a été envoyé avec succès.');
            
            // Réinitialisation du formulaire
            form.reset();

            // Simulation d'événement Analytics
            if (window.trackEvent) {
                window.trackEvent('Contact', 'Soumission Réussie', objet.value);
            }
            
            // Dans une vraie application, après un fetch réussi:
            // fetch(form.action, { method: form.method, body: new FormData(form) })
            // .then(response => response.json())
            // .then(data => { /* Gérer la réponse serveur */ })
            // .catch(error => { /* Gérer l'erreur */ });
        }
    });

    // Fonction pour afficher le message d'erreur
    function showError(inputElement, message) {
        // Ajout d'une classe CSS pour le style d'erreur (à définir dans styles.css)
        inputElement.classList.add('is-invalid');
        
        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = 'var(--red-500)';
        error.style.fontSize = '0.875rem';
        error.style.marginTop = 'var(--spacing-xs)';
        error.textContent = message;
        
        // Insère le message après l'élément invalide
        inputElement.parentNode.insertBefore(error, inputElement.nextSibling);
    }
    
    // Ajout d'une classe de style pour les champs invalides dans styles.css
    // Vous devez ajouter cette règle à styles.css:
    /*
    .form-group input.is-invalid, 
    .form-group textarea.is-invalid, 
    .form-group select.is-invalid {
        border-color: var(--red-500) !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }
    */
});

