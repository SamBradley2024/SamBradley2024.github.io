// ==== Main App Initialization ====
document.addEventListener('DOMContentLoaded', () => {
    // A11Y: Check if the user has requested reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize all site functionality
    initSmoothScrolling();
    initNav();
    initScrollProgress();
    initProjectFiltering();
    initThemeToggle();

    // Only initialize animations if the user is okay with motion
    if (!prefersReducedMotion) {
        initAnimations();
    } else {
        // If animations are disabled, make sure all elements are visible immediately
        document.querySelectorAll('.fade-in, .fade-slide').forEach(el => el.classList.add('visible'));
    }

    // Initial fade-in for the entire page
    document.body.style.opacity = '1';
    console.log('✅ Portfolio loaded successfully!');
});


// ==== Core Functionality ====

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initNav() {
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]'); // Target sections with an ID

    function updateActiveLink() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Attach to the unified scroll handler
    window.addEventListener('unified-scroll', updateActiveLink);
    updateActiveLink(); // Initial call
}


function initScrollProgress() {
    const progress = document.getElementById('scroll-progress');
    if (!progress) return;

    function update() {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progressWidth = (window.scrollY / totalHeight) * 100;
        progress.style.width = `${progressWidth}%`;
    }

    // Attach to the unified scroll handler
    window.addEventListener('unified-scroll', update);
    update(); // Initial call
}

function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;

            projectCards.forEach(card => {
                const categories = card.dataset.category || '';
                const shouldShow = (filter === 'all' || categories.includes(filter));
                
                // Use a class-based approach for show/hide animations in the future
                // For now, keeping the fade logic as it was:
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

// ==== Animation-Only Functionality ====

function initAnimations() {
    // Parallax hero effect
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        window.addEventListener('unified-scroll', () => {
            heroContent.style.transform = `translateY(${window.scrollY * -0.3}px)`;
        });
    }

    // Intersection Observer for fade-in elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in, .fade-slide').forEach(el => observer.observe(el));
    
    // Typing effect
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent.trim();
        heroTitle.textContent = ''; // Clear it
        setTimeout(() => typeWriter(heroTitle, originalText, 120), 1000);
    }

    // Button ripple effect
    document.querySelectorAll('.btn, .filter-btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// ==== Animation Helpers (only called if motion is not reduced) ====

function typeWriter(element, text, speed) {
    let i = 0;
    element.classList.add('typing');
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing');
        }
    }
    type();
}

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();
    
    button.appendChild(circle);
}

// ==== Performance: Unified Scroll Handler ====

// Debounce function to limit how often a function can run.
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Create a single, debounced scroll event that other functions can listen to.
const debouncedScroll = debounce(() => {
    // This custom event can be listened to by any part of the app.
    window.dispatchEvent(new CustomEvent('unified-scroll'));
}, 16);

window.addEventListener('scroll', debouncedScroll);
