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
