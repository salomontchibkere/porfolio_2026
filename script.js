// Loader
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hide');
    }, 1000);
});

// Custom Cursor
const cursor = document.getElementById('customCursor');
const cursorFollower = document.getElementById('cursorFollower');

if (window.innerWidth > 850 && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 4 + 'px';
        cursor.style.top = e.clientY - 4 + 'px';
        
        cursorFollower.style.left = e.clientX - 20 + 'px';
        cursorFollower.style.top = e.clientY - 20 + 'px';
    });
    
    // Hover effect on links and buttons
    const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .service-card, .testimonial-card, .whatsapp-float');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.width = '60px';
            cursorFollower.style.height = '60px';
            cursorFollower.style.borderWidth = '1px';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.style.width = '40px';
            cursorFollower.style.height = '40px';
            cursorFollower.style.borderWidth = '2px';
        });
    });
}

// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu
const menuToggle = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');

const toggleMenu = () => {
    menuToggle.classList.toggle('is-active');
    navList.classList.toggle('active');
    document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : 'initial';
};

menuToggle.addEventListener('click', toggleMenu);
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navList.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Typed.js Animation
const typed = new Typed('#typed', {
    strings: ['Développeur Full-Stack', 'Formateur en Informatique', 'Expert en Maintenance', 'Créateur de Solutions'],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
gsap.from('.hero-text', {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.hero-image', {
    duration: 1,
    scale: 0.8,
    opacity: 0,
    ease: 'back.out(1.2)',
    delay: 0.3
});

// Section Animations
gsap.utils.toArray('.stat-card, .skill-card, .project-card, .timeline-item').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// About Stats Counter
const stats = document.querySelectorAll('.stat-number');
const animateNumbers = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        const updateNumber = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        updateNumber();
    });
};

// Trigger counter when stats come into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

if (stats.length > 0) {
    observer.observe(stats[0].parentElement.parentElement);
}

// Scroll Indicator Click
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('propos');
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission via Fetch API (Formspree)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('#submitBtn');
        const originalBtnContent = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        if (formStatus) {
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';
        }

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                if (formStatus) {
                    formStatus.textContent = '✨ Message envoyé avec succès ! Merci Salomon vous recontactera très rapidement.';
                    formStatus.className = 'form-status success';
                }
                contactForm.reset();
            } else {
                const data = await response.json().catch(() => null);
                if (formStatus) {
                    if (data && data.errors) {
                        formStatus.textContent = '❌ ' + data.errors.map(err => err.message).join(', ');
                    } else {
                        formStatus.textContent = '❌ Une erreur s\'est produite. N\'hésitez pas à me contacter via WhatsApp ou Email direct.';
                    }
                    formStatus.className = 'form-status error';
                }
            }
        } catch (error) {
            if (formStatus) {
                formStatus.textContent = '❌ Problème de connexion. Vous pouvez me joindre directement sur WhatsApp (+237 655 136 824).';
                formStatus.className = 'form-status error';
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });
}

// Smooth Scroll for Navigation Links
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

// Parallax Effect on Hero Shapes
window.addEventListener('scroll', () => {
    const shapes = document.querySelectorAll('.shape');
    const scrolled = window.pageYOffset;
    shapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Hover Animation for Skill Cards
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// ==========================================================================
// Système d'Avis & Témoignages Dynamique
// ==========================================================================
const reviewModal = document.getElementById('reviewModal');
const openReviewModalBtn = document.getElementById('openReviewModal');
const closeReviewModalBtn = document.getElementById('closeReviewModal');
const cancelReviewBtn = document.getElementById('cancelReviewBtn');
const modalOverlay = document.getElementById('modalOverlay');
const reviewForm = document.getElementById('reviewForm');
const starRating = document.getElementById('starRating');
const reviewRatingInput = document.getElementById('reviewRating');
const reviewFormStatus = document.getElementById('reviewFormStatus');
const testimonialsGrid = document.querySelector('.testimonials-grid');

const openModal = () => {
    if (reviewModal) {
        reviewModal.classList.add('active');
        reviewModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
};

const closeModal = () => {
    if (reviewModal) {
        reviewModal.classList.remove('active');
        reviewModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'initial';
        if (reviewFormStatus) {
            reviewFormStatus.style.display = 'none';
        }
    }
};

if (openReviewModalBtn) openReviewModalBtn.addEventListener('click', openModal);
if (closeReviewModalBtn) closeReviewModalBtn.addEventListener('click', closeModal);
if (cancelReviewBtn) cancelReviewBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reviewModal && reviewModal.classList.contains('active')) {
        closeModal();
    }
});

// Gestion des étoiles interactives
if (starRating) {
    const stars = starRating.querySelectorAll('i');
    
    const updateStars = (rating) => {
        stars.forEach(star => {
            const val = parseInt(star.getAttribute('data-rating'), 10);
            if (val <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    };

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'), 10);
            reviewRatingInput.value = rating;
            updateStars(rating);
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.getAttribute('data-rating'), 10);
            updateStars(rating);
        });
    });

    starRating.addEventListener('mouseleave', () => {
        const currentRating = parseInt(reviewRatingInput.value, 10) || 5;
        updateStars(currentRating);
    });
}

// Fonction pour créer une carte d'avis HTML
const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
};

const createReviewCardHTML = (review, isRecent = false) => {
    const initial = (review.nom || 'A').trim().charAt(0).toUpperCase();
    const rating = parseInt(review.note, 10) || 5;
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }

    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
        <div>
            <div class="testimonial-stars">
                ${starsHTML}
                ${isRecent ? '<span class="badge-recent">Avis récent</span>' : ''}
            </div>
            <p class="testimonial-quote">« ${escapeHTML(review.avis)} »</p>
        </div>
        <div class="testimonial-author-box">
            <div class="testimonial-avatar">${initial}</div>
            <div class="testimonial-author-info">
                <h4>${escapeHTML(review.nom)}</h4>
                <span>${escapeHTML(review.role)}</span>
            </div>
        </div>
    `;
    return card;
};

// Charger les avis enregistrés localement
const loadLocalReviews = () => {
    try {
        const stored = localStorage.getItem('salomon_portfolio_reviews');
        if (stored && testimonialsGrid) {
            const reviews = JSON.parse(stored);
            reviews.forEach(review => {
                const card = createReviewCardHTML(review, false);
                testimonialsGrid.prepend(card);
            });
        }
    } catch (e) {
        console.error(e);
    }
};

loadLocalReviews();

// Soumission du formulaire d'avis
if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitReviewBtn');
        const originalBtnContent = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publication...';

        const reviewData = {
            nom: document.getElementById('reviewName').value.trim(),
            role: document.getElementById('reviewRole').value.trim(),
            note: document.getElementById('reviewRating').value,
            avis: document.getElementById('reviewMessage').value.trim(),
            date: new Date().toLocaleDateString('fr-FR')
        };

        const formData = new FormData(reviewForm);

        try {
            // Envoi par email via FormSubmit AJAX à Salomon
            await fetch(reviewForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            // Sauvegarde dans localStorage
            try {
                const existing = JSON.parse(localStorage.getItem('salomon_portfolio_reviews') || '[]');
                existing.unshift(reviewData);
                localStorage.setItem('salomon_portfolio_reviews', JSON.stringify(existing));
            } catch (err) {
                console.error(err);
            }

            // Ajouter immédiatement la carte dans la grille
            if (testimonialsGrid) {
                const newCard = createReviewCardHTML(reviewData, true);
                testimonialsGrid.prepend(newCard);
                gsap.from(newCard, { opacity: 0, y: -20, duration: 0.5 });
            }

            if (reviewFormStatus) {
                reviewFormStatus.textContent = '✨ Merci infiniment ! Votre avis a été publié et transmis avec succès à Salomon.';
                reviewFormStatus.className = 'form-status success';
                reviewFormStatus.style.display = 'block';
            }

            reviewForm.reset();
            if (starRating) {
                const stars = starRating.querySelectorAll('i');
                stars.forEach(s => s.classList.add('active'));
                reviewRatingInput.value = '5';
            }

            setTimeout(() => {
                closeModal();
            }, 1800);

        } catch (error) {
            // Même si le réseau est lent, sauvegarder et afficher en direct
            try {
                const existing = JSON.parse(localStorage.getItem('salomon_portfolio_reviews') || '[]');
                existing.unshift(reviewData);
                localStorage.setItem('salomon_portfolio_reviews', JSON.stringify(existing));

                if (testimonialsGrid) {
                    const newCard = createReviewCardHTML(reviewData, true);
                    testimonialsGrid.prepend(newCard);
                }
            } catch (err) {}

            if (reviewFormStatus) {
                reviewFormStatus.textContent = '✨ Votre avis a été enregistré sur la page. Merci beaucoup !';
                reviewFormStatus.className = 'form-status success';
                reviewFormStatus.style.display = 'block';
            }
            setTimeout(() => {
                closeModal();
            }, 1800);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });
}


