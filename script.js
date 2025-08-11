// ==== Utils ====
// Debounce function to optimize scroll events
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ==== Smooth Scrolling for nav links ====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ==== Navigation show/hide and active link highlight ====
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

function handleNavOnScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Show/hide nav based on scroll position
  if (nav) {
    if (scrollTop > 100) nav.classList.add('visible');
    else nav.classList.remove('visible');
  }

  // Highlight active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (scrollTop >= sectionTop) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href').substring(1) === current);
  });
}

// ==== Scroll Progress Bar ====
function updateScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  if (!progress) return;
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const progressWidth = (window.scrollY / totalHeight) * 100;
  progress.style.width = `${progressWidth}%`;
}

// Debounced combined scroll handler
const onScroll = debounce(() => {
  handleNavOnScroll();
  updateScrollProgress();
}, 16);

window.addEventListener('scroll', onScroll);
onScroll(); // Initial call on load

// ==== IntersectionObserver for fade-in and reveal animations ====
const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeInObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in, .fade-slide').forEach(el => fadeInObserver.observe(el));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section').forEach(section => {
  section.classList.add('reveal'); // initial hidden styles from CSS
  revealObserver.observe(section);
});

// ==== Project Filtering (single unified logic) ====
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    projectCards.forEach(card => {
      const categories = card.dataset.category || '';
      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = 'block';
        // reset opacity & transform for fade-in
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        // fade out then hide
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// ==== Counter Animation ====
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  if (isNaN(target)) {
    element.textContent = target; // for non-numeric like "A*"
    return;
  }

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, idx) => {
          const number = parseInt(stat.textContent);
          if (!isNaN(number)) {
            setTimeout(() => animateCounter(stat, number, 1500), idx * 200);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsGrid);
}

// ==== Typing Effect for Hero Title ====
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.classList.add('gradient-animate'); 
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      element.style.borderRight = '3px solid #2ecc71';
      element.style.animation = 'blink 1s infinite';
    }
  }
  type();
}

document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => typeWriter(heroTitle, originalText, 120), 1200);
  }
});

// Add blink cursor style once
const blinkStyle = document.createElement('style');
blinkStyle.textContent = `
  @keyframes blink {
    0%, 50% { border-color: #2ecc71; }
    51%, 100% { border-color: transparent; }
  }
`;
document.head.appendChild(blinkStyle);

// ==== Parallax effect for hero content ====
window.addEventListener('scroll', debounce(() => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    heroContent.style.transform = `translateY(${rate}px)`;
  }
}, 16));

// ==== Hover tilt effect on project cards ====
document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });
});

// ==== Skill Tags animation on scroll ====
const skillTagsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const tags = entry.target.querySelectorAll('.skill-tag');
      tags.forEach((tag, idx) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateX(30px)';
        setTimeout(() => {
          tag.style.transition = 'all 0.6s ease';
          tag.style.opacity = '1';
          tag.style.transform = 'translateX(0)';
        }, idx * 100);
      });
      skillTagsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(category => skillTagsObserver.observe(category));

// ==== Dynamic background particles ====
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(46, 204, 113, 0.3);
    border-radius: 50%;
    pointer-events: none;
    animation: float-particle 15s linear infinite;
    left: ${Math.random() * 100}%;
    animation-delay: ${Math.random() * 15}s;
  `;
  return particle;
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes float-particle {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(particleStyle);

setInterval(() => {
  const hero = document.querySelector('.hero');
  if (hero && window.pageYOffset < window.innerHeight) {
    const particle = createParticle();
    hero.appendChild(particle);
    setTimeout(() => {
      if (particle.parentNode) particle.parentNode.removeChild(particle);
    }, 15000);
  }
}, 3000);

// ==== Button interactions and ripple effect ====
document.querySelectorAll('.btn, .filter-btn, .project-link, .contact-link').forEach(button => {
  button.addEventListener('mouseenter', () => {
    button.style.transition = 'all 0.3s ease';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transition = 'all 0.3s ease';
  });
});

// Ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    background-color: rgba(255, 255, 255, 0.6);
    pointer-events: none;
  }
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add('ripple');

  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) ripple.remove();

  button.appendChild(circle);
}

document.querySelectorAll('.btn, .filter-btn').forEach(button => {
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.addEventListener('click', createRipple);
});

// ==== Skill Tag Modal ====
const skillTags = document.querySelectorAll('.skill-tag');
const modal = document.getElementById('skill-modal');
const modalContent = document.getElementById('skill-modal-content');
const modalClose = document.getElementById('skill-modal-close');

skillTags.forEach(tag => {
  tag.addEventListener('click', () => {
    const skillName = tag.textContent;
    modalContent.innerHTML = `<h2>${skillName}</h2><p>Example projects and experience details for ${skillName}...</p>`;
    modal.style.display = 'flex';
  });
});

if (modalClose) {
  modalClose.addEventListener('click', () => (modal.style.display = 'none'));
}

window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

// ==== Initial page load animation ====
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Portfolio loaded successfully!');
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// ==== Dark/Light Mode Toggle ====
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
}

// ==== Add active nav styles (CSS injected once) ====
const navActiveStyle = document.createElement('style');
navActiveStyle.textContent = `
  .nav-links a.active {
    color: #27ae60 !important;
  }
  .nav-links a.active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(navActiveStyle);

// ==== Add reveal styles (CSS injected once) ====
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }
  .reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);
