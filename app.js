// Custom cursor
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mx = -100, my = -100, rx = -100, ry = -100;
 
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
  });
 
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();
 
  document.querySelectorAll('a, button, .module-card, .pillar, .trait-chip, .student-card, .personal-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform += ' scale(2)');
    el.addEventListener('mouseleave', () => cursor.style.transform = cursor.style.transform.replace(' scale(2)', ''));
  });
 
  // Progress bar
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
  });
 
  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  });
 
  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => observer.observe(el));
 
  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  function closeMenu() { mobileMenu.classList.remove('open'); }
 
  // Form submit
  function handleFormSubmit(btn) {
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'rgba(180,125,255,0.2)';
    btn.style.color = 'var(--neon-purple)';
    btn.style.border = '1px solid var(--neon-purple)';
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style = '';
    }, 3000);
  }
 
  // Touch: disable custom cursor on touch devices
  window.addEventListener('touchstart', () => {
    cursor.style.display = 'none';
    cursorRing.style.display = 'none';
    document.body.style.cursor = 'auto';
  }, { once: true });