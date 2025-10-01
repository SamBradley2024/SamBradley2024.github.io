// Reveal sections on scroll
const faders = document.querySelectorAll(".fade-in, .fade-in-up");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

faders.forEach(fader => {
  observer.observe(fader);
});

// Tab functionality
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;

    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tab);
    });
  });
});

// Typing animation for header
const typingEl = document.querySelector('.typing-text');
const textToType = typingEl.dataset.text;
let index = 0;

function type() {
  if (index < textToType.length) {
    typingEl.textContent += textToType[index];
    index++;
    setTimeout(type, 150);
  }
}

type();
