/**
 * AURA STUDIO - MAIN JAVASCRIPT
 * Handles interactivity: Mobile menu, Theme toggle, Scroll spy,
 * Interactive contact form, Service auto-selection, Toast notifications,
 * and Animated counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. DYNAMIC COPYRIGHT YEAR
  // ==========================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 2. THEME TOGGLE (DARK / LIGHT MODE)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved theme or prefer dark mode
  const savedTheme = localStorage.getItem('aura_theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('aura_theme', nextTheme);

      showToast('Theme Changed', `Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} mode.`);
    });
  }

  // ==========================================
  // 3. STICKY NAVBAR & BACK-TO-TOP BUTTON
  // ==========================================
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar shadow on scroll
    if (scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 4. MOBILE HAMBURGER NAVIGATION
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when any nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close when clicking outside of nav
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // 5. SCROLL SPY (ACTIVE LINK HIGHLIGHTING)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // ==========================================
  // 6. SERVICE SELECTION INTERACTION
  // ==========================================
  const serviceButtons = document.querySelectorAll('.service-select-btn');
  const contactServiceSelect = document.getElementById('contact-service');
  const contactMessage = document.getElementById('contact-message');

  serviceButtons.forEach(button => {
    button.addEventListener('click', () => {
      const serviceName = button.getAttribute('data-service');
      
      // Auto-populate dropdown in contact form
      if (contactServiceSelect) {
        contactServiceSelect.value = serviceName;
      }

      // Add a helpful pre-fill message if empty
      if (contactMessage && !contactMessage.value.trim()) {
        contactMessage.value = `Hi Aura Studio team, I am interested in your "${serviceName}" package and would like to learn more about how we can work together.`;
      }

      // Smooth scroll to the contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      showToast('Service Selected', `"${serviceName}" has been chosen in your inquiry form.`);
    });
  });

  // ==========================================
  // 7. INTERACTIVE CONTACT FORM VALIDATION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const successBox = document.getElementById('form-success-box');
  const successEmailDisplay = document.getElementById('success-email-display');
  const resetFormBtn = document.getElementById('reset-form-btn');

  // Input fields
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  // Helper validation functions
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateField = (input, condition) => {
    const parentGroup = input.closest('.form-group');
    if (!condition) {
      parentGroup.classList.add('has-error');
      return false;
    } else {
      parentGroup.classList.remove('has-error');
      return true;
    }
  };

  // Real-time input clearing
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length > 0) {
        nameInput.closest('.form-group').classList.remove('has-error');
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.remove('has-error');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length > 0) {
        messageInput.closest('.form-group').classList.remove('has-error');
      }
    });
  }

  // Handle Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
      const isEmailValid = validateField(emailInput, isValidEmail(emailInput.value.trim()));
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 5);

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        showToast('Please check your entries', 'Make sure to fill in all required fields.', true);
        return;
      }

      // Show loading spinner simulation
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Display user email in confirmation box
        if (successEmailDisplay) {
          successEmailDisplay.textContent = emailInput.value.trim();
        }

        // Hide form and show success message
        contactForm.style.display = 'none';
        successBox.style.display = 'block';

        // Trigger celebratory toast
        showToast('Message Sent!', 'Thank you! We will get back to you within 24 hours.');
      }, 1000);
    });
  }

  // Allow sending another message
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      contactForm.style.display = 'flex';
      successBox.style.display = 'none';
    });
  }

  // ==========================================
  // 8. NEWSLETTER SUBSCRIPTION FORM
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();

      if (!isValidEmail(email)) {
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        newsletterFeedback.className = 'newsletter-feedback';
        newsletterFeedback.style.color = '#ef4444';
        return;
      }

      newsletterFeedback.textContent = '🎉 You are subscribed! Check your inbox soon.';
      newsletterFeedback.className = 'newsletter-feedback success';
      newsletterEmail.value = '';
      
      showToast('Subscribed!', 'Welcome to the Aura Studio weekly growth newsletter.');
    });
  }

  // ==========================================
  // 9. TOAST NOTIFICATION UTILITY
  // ==========================================
  let toastTimeout;
  const toastNotification = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');

  function showToast(title, message, isError = false) {
    if (!toastNotification) return;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    if (isError) {
      toastNotification.style.borderColor = '#ef4444';
      const icon = toastNotification.querySelector('.toast-icon');
      if (icon) {
        icon.textContent = '!';
        icon.style.background = '#ef4444';
      }
    } else {
      toastNotification.style.borderColor = 'var(--accent-emerald)';
      const icon = toastNotification.querySelector('.toast-icon');
      if (icon) {
        icon.textContent = '✓';
        icon.style.background = 'var(--accent-emerald)';
      }
    }

    toastNotification.classList.add('show');

    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3800);
  }

  // ==========================================
  // 10. ANIMATED STAT COUNTERS ON SCROLL
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const countUp = () => {
    if (statsCounted) return;

    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const rect = aboutSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.75) {
      statsCounted = true;

      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1500;
        const stepTime = Math.abs(Math.floor(duration / target));

        const timer = setInterval(() => {
          current += Math.ceil(target / 40);
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          const suffix = target === 99 ? '%' : '+';
          stat.textContent = current + suffix;
        }, Math.max(stepTime, 25));
      });
    }
  };

  window.addEventListener('scroll', countUp, { passive: true });
  countUp(); // Initial check on load
});
