// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les cartes pour l'animation
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Gestion des formulaires
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation basique
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545';
                } else {
                    field.style.borderColor = '#28a745';
                }
            });
            
            if (isValid) {
                // Simulation d'envoi
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Envoi en cours...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Votre demande a été envoyée avec succès ! Nous vous recontacterons rapidement.');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Reset des bordures
                    requiredFields.forEach(field => {
                        field.style.borderColor = '';
                    });
                }, 2000);
            } else {
                alert('Veuillez remplir tous les champs obligatoires.');
            }
        });
    });

    // Navigation sticky
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });

    // Animation des compteurs (si présents)
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    }

    // Observer pour les compteurs
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Gestion des modales (si nécessaire)
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Fermer les modales en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Gestion du calendrier de réservation
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Définir la date minimum à aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
        
        // Définir la date maximum à 3 mois
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        input.max = maxDate.toISOString().split('T')[0];
    });

    // Validation email en temps réel
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#dc3545';
                this.setCustomValidity('Veuillez entrer une adresse email valide');
            } else {
                this.style.borderColor = '';
                this.setCustomValidity('');
            }
        });
    });

    // Gestion des sélecteurs de prix
    const experienceSelects = document.querySelectorAll('select[id="experience"]');
    experienceSelects.forEach(select => {
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const priceInfo = selectedOption.textContent.match(/(\d+€|Sur devis)/);
            
            if (priceInfo) {
                let priceDisplay = document.querySelector('.price-display');
                if (!priceDisplay) {
                    priceDisplay = document.createElement('div');
                    priceDisplay.className = 'price-display';
                    priceDisplay.style.cssText = `
                        margin-top: 1rem;
                        padding: 1rem;
                        background: var(--bg-secondary);
                        border-radius: 8px;
                        text-align: center;
                        font-weight: 600;
                        color: var(--accent);
                    `;
                    this.parentNode.appendChild(priceDisplay);
                }
                priceDisplay.textContent = `Prix: ${priceInfo[0]}`;
            }
        });
    });

    console.log('AirHub - Site initialisé avec succès');
});

// Fonctions utilitaires
function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// Export pour utilisation dans d'autres scripts
window.AirHub = {
    openModal,
    closeModal,
    validateForm,
    formatDate
};