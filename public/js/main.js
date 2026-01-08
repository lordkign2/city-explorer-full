document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleDark');
    const sun = document.getElementById('sunIcon');
    const moon = document.getElementById('moonIcon');
  
    const setMode = (dark) => {
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      if (sun && moon) {
        sun.classList.toggle('hidden', !dark);
        moon.classList.toggle('hidden', dark);
      }
    };
  
    // Dark mode toggle button
    toggle?.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      setMode(!isDark);
    });
  
    // Load saved mode
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setMode(true);
    else if (saved === 'light') setMode(false);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode(true); // default to OS preference
    }
  
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    //sidebar toggle
    document.getElementById("toggleSidebar")?.addEventListener('click', () => {
      const aside = document.querySelector('aside');
      aside.classList.toggle('hidden');
    })
  
    // Init AOS animations
    if (typeof AOS !== 'undefined') {
      AOS.init({ once: true });
    }
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  });