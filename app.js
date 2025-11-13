// INOVIT e-Segregator PWA - Main App Logic

let deferredPrompt;
let installBtn;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  registerServiceWorker();
  setupInstallButton();
  setupOfflineIndicator();
  checkOnlineStatus();
  setupDarkMode();
  setupPageTransitions();
  setupScrollAnimations();
  addRippleEffect();
  setupFlipCards();
}

// ===== Service Worker Registration =====
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 New Service Worker version found');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });

    // Handle controller change (when new SW takes over)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  } else {
    console.warn('⚠️ Service Workers are not supported in this browser');
  }
}

// ===== PWA Installation =====
function setupInstallButton() {
  // Create install button
  installBtn = document.createElement('button');
  installBtn.id = 'installBtn';
  installBtn.innerHTML = '📱 Zainstaluj aplikację';
  installBtn.style.display = 'none';
  document.body.appendChild(installBtn);

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💾 PWA install prompt available');
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Store the event for later use
    deferredPrompt = e;
    // Show install button
    installBtn.style.display = 'block';
  });

  // Install button click handler
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install outcome: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('✅ User accepted PWA installation');
    } else {
      console.log('❌ User declined PWA installation');
    }

    // Clear the deferred prompt
    deferredPrompt = null;
    // Hide install button
    installBtn.style.display = 'none';
  });

  // Listen for successful installation
  window.addEventListener('appinstalled', (e) => {
    console.log('🎉 PWA installed successfully');
    installBtn.style.display = 'none';
    showNotification('Aplikacja została zainstalowana!', 'success');
  });
}

// ===== Offline/Online Indicator =====
function setupOfflineIndicator() {
  // Create offline indicator
  const indicator = document.createElement('div');
  indicator.className = 'offline-indicator';
  indicator.id = 'offlineIndicator';
  document.body.prepend(indicator);

  // Listen for online/offline events
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

function checkOnlineStatus() {
  if (!navigator.onLine) {
    handleOffline();
  }
}

function handleOnline() {
  const indicator = document.getElementById('offlineIndicator');
  if (indicator) {
    indicator.textContent = '✅ Połączenie przywrócone';
    indicator.className = 'offline-indicator online-indicator show';

    setTimeout(() => {
      indicator.classList.remove('show');
    }, 3000);
  }
  console.log('🌐 Device is online');
}

function handleOffline() {
  const indicator = document.getElementById('offlineIndicator');
  if (indicator) {
    indicator.textContent = '⚠️ Brak połączenia - Tryb offline';
    indicator.className = 'offline-indicator show';
  }
  console.log('📡 Device is offline');
}

// ===== Update Notification =====
function showUpdateNotification() {
  const updateBanner = document.createElement('div');
  updateBanner.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #007380;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 15px;
  `;

  updateBanner.innerHTML = `
    <span>🔄 Nowa wersja aplikacji jest dostępna!</span>
    <button id="updateBtn" style="
      background: white;
      color: #007380;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    ">Odśwież</button>
  `;

  document.body.appendChild(updateBanner);

  document.getElementById('updateBtn').addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  });
}

// ===== Utility Functions =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: ${type === 'success' ? '#51cf66' : '#007380'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== Dark Mode =====
function setupDarkMode() {
  // Create dark mode toggle button
  const darkModeToggle = document.createElement('button');
  darkModeToggle.id = 'darkModeToggle';
  darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
  darkModeToggle.innerHTML = '🌙';
  document.body.appendChild(darkModeToggle);

  // Check for saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    enableDarkMode();
  }

  // Toggle button click handler
  darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    }
  });
}

function enableDarkMode() {
  document.body.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) toggle.innerHTML = '☀️';
  console.log('🌙 Dark mode enabled');
}

function disableDarkMode() {
  document.body.removeAttribute('data-theme');
  localStorage.setItem('theme', 'light');
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) toggle.innerHTML = '🌙';
  console.log('☀️ Light mode enabled');
}

// ===== Page Transitions =====
function setupPageTransitions() {
  // Add smooth page transitions for internal links
  const links = document.querySelectorAll('a[href^="./"], a[href$=".html"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Only apply to internal links (not external or anchors)
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        e.preventDefault();

        // Add fade out animation
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(-20px)';
        document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        // Navigate after animation
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });

  // Fade in on page load
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transform = 'translateY(0)';
  });
}

// ===== Scroll Animations =====
function setupScrollAnimations() {
  // Check if Intersection Observer is supported
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.content-section > *');
    animateElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }
}

// ===== Ripple Effect =====
function addRippleEffect() {
  const buttons = document.querySelectorAll('button, .btn, .tile');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple element
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
      `;

      this.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation to document
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple {
        from {
          transform: scale(0);
          opacity: 1;
        }
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== Enhanced Loading States =====
function showLoadingState(element) {
  element.classList.add('skeleton');
  element.style.pointerEvents = 'none';
}

function hideLoadingState(element) {
  element.classList.remove('skeleton');
  element.style.pointerEvents = 'auto';
}

// ===== Smooth Scroll =====
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// ===== Performance: Preload on hover =====
document.addEventListener('mouseover', (e) => {
  const link = e.target.closest('a[href$=".html"]');
  if (link && !link.hasAttribute('data-preloaded')) {
    link.setAttribute('data-preloaded', 'true');
    const href = link.getAttribute('href');

    // Preload the page
    const linkTag = document.createElement('link');
    linkTag.rel = 'prefetch';
    linkTag.href = href;
    document.head.appendChild(linkTag);
  }
});

// ===== 3D Flip Cards (Mobile Support) =====
function setupFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card');

  // Check if it's a touch device
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (isTouchDevice) {
    flipCards.forEach(card => {
      let isFlipped = false;

      // Add tap handler for mobile
      card.addEventListener('click', (e) => {
        // If clicking on a link, let it navigate
        if (e.target.tagName === 'A' && e.target.classList.contains('flip-btn')) {
          return; // Allow link navigation
        }

        // If clicking on the front card link
        if (e.target.classList.contains('flip-card-front') ||
            e.target.closest('.flip-card-front')) {
          e.preventDefault();
        }

        // Toggle flip state
        if (!isFlipped) {
          card.classList.add('flipped');
          card.querySelector('.flip-card-inner').style.transform = 'rotateY(180deg)';
          isFlipped = true;
        } else {
          card.classList.remove('flipped');
          card.querySelector('.flip-card-inner').style.transform = 'rotateY(0deg)';
          isFlipped = false;
        }
      });

      // Reset flip on touch outside
      document.addEventListener('touchstart', (e) => {
        if (!card.contains(e.target) && isFlipped) {
          card.classList.remove('flipped');
          card.querySelector('.flip-card-inner').style.transform = 'rotateY(0deg)';
          isFlipped = false;
        }
      });
    });

    console.log('📱 Touch-enabled flip cards activated');
  } else {
    console.log('🖱️ Hover-based flip cards activated');
  }
}

// Log PWA capabilities
console.log('📱 INOVIT e-Segregator PWA initialized');
console.log('Service Worker support:', 'serviceWorker' in navigator);
console.log('Notification support:', 'Notification' in window);
console.log('Push support:', 'PushManager' in window);
console.log('Online status:', navigator.onLine);
console.log('🎨 Advanced animations enabled');
console.log('💫 3D Flip cards enabled');
