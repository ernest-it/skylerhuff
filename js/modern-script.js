// Main JavaScript for Skyler Huff PT site

document.addEventListener('DOMContentLoaded', function() {

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');

      // Prevent scrolling when menu is open on mobile
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking on a nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
      if (!isClickInsideNav && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Navbar shadow on scroll
  const navbar = document.getElementById('navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add shadow when scrolled
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Only prevent default if the href is not just "#"
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar

          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.service-card, .stat-card, .info-item, .contact-card, .cert-detail');
  animateElements.forEach(el => {
    observer.observe(el);
  });

  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .service-card,
    .stat-card,
    .info-item,
    .contact-card,
    .cert-detail {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .service-card.animate-in,
    .stat-card.animate-in,
    .info-item.animate-in,
    .contact-card.animate-in,
    .cert-detail.animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    /* Stagger animation for grid items */
    .services-grid .service-card:nth-child(1) { transition-delay: 0.1s; }
    .services-grid .service-card:nth-child(2) { transition-delay: 0.2s; }
    .services-grid .service-card:nth-child(3) { transition-delay: 0.3s; }

    .stats-grid .stat-card:nth-child(1) { transition-delay: 0.1s; }
    .stats-grid .stat-card:nth-child(2) { transition-delay: 0.2s; }
    .stats-grid .stat-card:nth-child(3) { transition-delay: 0.3s; }

    .contact-methods .contact-card:nth-child(1) { transition-delay: 0.1s; }
    .contact-methods .contact-card:nth-child(2) { transition-delay: 0.2s; }

    .certification-info .cert-detail:nth-child(1) { transition-delay: 0.1s; }
    .certification-info .cert-detail:nth-child(2) { transition-delay: 0.2s; }
    .certification-info .cert-detail:nth-child(3) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-link');

  navLinksAll.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Progress bar
  function createScrollProgress() {
    // Check if we're on a page with enough content to scroll
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    // Only add progress bar if page is long enough
    if (height > window.innerHeight * 1.5) {
      const progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
      document.body.appendChild(progressBar);

      // Add CSS for progress bar
      const progressStyle = document.createElement('style');
      progressStyle.textContent = `
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: transparent;
          z-index: 9999;
          pointer-events: none;
        }

        .scroll-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #FF6B35 0%, #E55A2B 100%);
          width: 0%;
          transition: width 0.1s ease;
        }
      `;
      document.head.appendChild(progressStyle);

      // Update progress on scroll
      window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        const progressBarEl = document.querySelector('.scroll-progress-bar');
        if (progressBarEl) {
          progressBarEl.style.width = progress + '%';
        }
      });
    }
  }

  createScrollProgress();

  // Button ripple effect
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.className = 'ripple';

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Console message
  console.log('%c🏋️ Skyler Huff Personal Training', 'font-size: 20px; font-weight: bold; color: #FF6B35;');

});

// Stop animations during resize
let resizeTimer;
window.addEventListener('resize', function() {
  document.body.classList.add('resize-animation-stopper');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    document.body.classList.remove('resize-animation-stopper');
  }, 400);
});

// CSS for resize
const resizeStyle = document.createElement('style');
resizeStyle.textContent = `
  .resize-animation-stopper * {
    animation: none !important;
    transition: none !important;
  }
`;
document.head.appendChild(resizeStyle);
