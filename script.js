// ====================================
// GLASSMORPHISM WEBSITE JAVASCRIPT
// ====================================

// Warten bis DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // ====================================
    // SMOOTH SCROLL NAVIGATION
    // ====================================
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Alle Nav-Links deaktivieren
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Aktiven Link hervorheben
            this.classList.add('active');
            // Zum Ziel-Abschnitt scrollen
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ====================================
    // SCROLL TO TOP BUTTON
    // ====================================
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        // Button Sichtbarkeit steuern
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.transform = 'scale(1)';
            } else {
                scrollTopBtn.style.opacity = '0.7';
                scrollTopBtn.style.transform = 'scale(0.8)';
            }
        });
    }

    // ====================================
    // NAVIGATION ACTIVE STATE ON SCROLL - VERBESSERT
    // ====================================
    function updateActiveNavigation() {
        const sectionIds = ['home', 'about', 'features', 'gallery', 'contact'];
        const sections = [];
        
        // Sammle alle existierenden Sektionen mit ihren Positionen
        sectionIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                sections.push({
                    id: id,
                    element: element,
                    top: element.offsetTop,
                    bottom: element.offsetTop + element.offsetHeight
                });
            }
        });

        if (sections.length === 0) return;

        const scrollPos = window.pageYOffset + 100; // Offset für bessere Erkennung
        const windowBottom = window.pageYOffset + window.innerHeight;
        const documentHeight = document.body.offsetHeight;
        
        let activeSection = null;

        // Spezialfall: Ganz am Ende der Seite - Contact aktivieren
        if (windowBottom >= documentHeight - 10) {
            activeSection = 'contact';
        }
        // Spezialfall: Ganz am Anfang der Seite - Home aktivieren  
        else if (scrollPos <= sections[0].top + 50) {
            activeSection = 'home';
        }
        // Normale Sektionserkennung
        else {
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const nextSection = sections[i + 1];
                
                // Aktuelle Sektion bestimmen basierend auf Scroll-Position
                if (scrollPos >= section.top - 50) {
                    // Wenn es eine nächste Sektion gibt, prüfen ob wir noch in der aktuellen sind
                    if (nextSection && scrollPos < nextSection.top - 50) {
                        activeSection = section.id;
                        break;
                    }
                    // Wenn es keine nächste Sektion gibt, ist diese aktiv
                    else if (!nextSection) {
                        activeSection = section.id;
                        break;
                    }
                    // Sonst diese Sektion als vorläufig aktiv setzen
                    activeSection = section.id;
                }
            }
        }

        // Navigation Links aktualisieren
        if (activeSection) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === '#' + activeSection) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    // Debounced Scroll Event für bessere Performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavigation, 10);
    });

    // Initial ausführen
    updateActiveNavigation();

    // ====================================
    // ANIMATED COUNTER FOR STATS
    // ====================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
            if (numericTarget && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                let current = 0;
                const increment = numericTarget / 50;
                const suffix = target.replace(/[\d]/g, '');
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericTarget) {
                        counter.textContent = numericTarget + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + suffix;
                    }
                }, 40);
            }
        });
    }

    // ====================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ====================================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Counter animieren wenn Header sichtbar wird
                if (entry.target.classList.contains('glass-header')) {
                    setTimeout(animateCounters, 500);
                }
                // Gestaffelte Animation für Feature-Cards
                if (entry.target.classList.contains('features-grid')) {
                    const cards = entry.target.querySelectorAll('.feature-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = `fadeInUp 0.6s ease-out forwards`;
                        }, index * 100);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Zu beobachtende Elemente
    const sectionsToObserve = document.querySelectorAll('.glass-header, .features-grid, .glass-section-features, .glass-section-examples, .glass-section-testimonials, .glass-section-contact');
    sectionsToObserve.forEach(section => observer.observe(section));

    // ====================================
    // DYNAMIC PARTICLE ANIMATION
    // ====================================
    function createParticleEffect() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            // Zufällige Startposition
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            // Zufällige Animationsdauer und Transparenz
            const duration = 6 + Math.random() * 4;
            particle.style.animationDuration = duration + 's';
            const opacity = 0.1 + Math.random() * 0.3;
            particle.style.opacity = opacity;
        });
    }
    createParticleEffect();
    // Partikel bei Fenstergrößeänderung neu positionieren
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createParticleEffect, 250);
    });

    // ====================================
    // GLASS BUTTON INTERACTIONS (Ripple Effekt)
    // ====================================
    const glassButtons = document.querySelectorAll('.glass-btn');
    glassButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple Effekt erstellen
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => { ripple.remove(); }, 600);
        });
    });

    // Ripple Keyframes hinzufügen
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ====================================
    // TESTIMONIAL CAROUSEL (Optional)
    // ====================================
    function initTestimonialCarousel() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        if (testimonials.length > 2) {
            setInterval(() => {
                testimonials.forEach((testimonial, index) => {
                    testimonial.style.opacity = index === currentIndex ? '1' : '0.5';
                    testimonial.style.transform = index === currentIndex ? 'scale(1)' : 'scale(0.95)';
                });
                currentIndex = (currentIndex + 1) % testimonials.length;
            }, 4000);
        }
    }
    initTestimonialCarousel();

    // ====================================
    // ACCESSIBILITY ENHANCEMENTS
    // ====================================

    // Keyboard-Navigation für Nav-Links
    navLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Fokus-Management für Glass-Buttons
    glassButtons.forEach(button => {
        button.addEventListener('focus', function() {
            this.style.outline = '2px solid rgba(255, 255, 255, 0.5)';
            this.style.outlineOffset = '2px';
        });
        button.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Reduced Motion Preference beachten
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ====================================
    // CONSOLE WELCOME MESSAGE
    // ====================================
    console.log(`
    🌟 Glassmorphism Website geladen!
    ╔══════════════════════════════════╗
    ✨ Features aktiviert:
       • Smooth Scroll Navigation (Verbessert)
       • Animierte Counter
       • Intersection Observer Animation
       • Dynamische Partikel
       • Ripple Button Effekt
       • Accessibility Verbesserungen
       • Performance Optimierungen

    🎨 Design by Johann Wohlgemuth
    🔧 Kontakt: johannwohlgemuth139@gmail.com
    `);
});