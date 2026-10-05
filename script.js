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


