/*
   Efrei ULTRA - RACYWAMA
   Logique & Interactivité Client (Mise à jour)
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- AUTOMATIC BROWSER DETECTION FOR INSTALLATION TAB ---
  const detectBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('firefox')) {
      return 'firefox-guide';
    } else if (
      userAgent.includes('chrome') || 
      userAgent.includes('chromium') || 
      userAgent.includes('safari') || 
      userAgent.includes('edg') || 
      userAgent.includes('brave')
    ) {
      return 'chrome-guide';
    }
    
    return 'manual-guide';
  };

  // --- INSTALLATION TABS ---
  const installTabButtons = document.querySelectorAll('.install-tab-btn');
  const installTabPanes = document.querySelectorAll('.install-tab-pane');

  const switchInstallTab = (tabId) => {
    installTabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    installTabPanes.forEach(pane => {
      if (pane.id === tabId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  };

  installTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchInstallTab(tabId);
    });
  });

  // Activate detected browser tab
  switchInstallTab(detectBrowser());


  // --- SEARCH FILTER FOR SOFTWARES ---
  const searchInput = document.getElementById('sidebar-search');
  const softwareCards = document.querySelectorAll('.software-card');
  const sidebarLinks = document.querySelectorAll('.sidebar-menu li');

  const filterSoftwares = (query) => {
    const cleanQuery = query.toLowerCase().trim();
    
    softwareCards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const desc = card.querySelector('.card-description').textContent.toLowerCase();
      
      if (title.includes(cleanQuery) || desc.includes(cleanQuery)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Also filter the sidebar menu links
    sidebarLinks.forEach(linkLi => {
      const text = linkLi.querySelector('.sidebar-menu-link').textContent.toLowerCase();
      if (text.includes(cleanQuery)) {
        linkLi.style.display = 'block';
      } else {
        linkLi.style.display = 'none';
      }
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterSoftwares(e.target.value);
    });
  }


  // --- DYNAMIC ACTIVE LINK ON SCROLL (HORIZONTAL NAV) ---
  const sections = document.querySelectorAll('.section-block, .hero-card-banner');
  const navLinks = document.querySelectorAll('.h-nav-link');
  let lastActiveId = '';

  const updateActiveNavLink = () => {
    let currentSectionId = 'fonctionnement'; // default fallback

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      // offset calculation for active state threshold
      if (window.scrollY >= (sectionTop - 150)) {
        const id = section.getAttribute('id');
        if (id) {
          currentSectionId = id;
        }
      }
    });

    if (currentSectionId !== lastActiveId) {
      lastActiveId = currentSectionId;
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
          // Smooth scroll active tab into view horizontally (centered) inside its scrollable parent without scrolling the window
          const navBar = link.closest('.horizontal-nav-bar');
          if (navBar) {
            const navBarWidth = navBar.offsetWidth;
            const linkLeft = link.offsetLeft;
            const linkWidth = link.offsetWidth;
            navBar.scrollTo({
              left: linkLeft - (navBarWidth / 2) + (linkWidth / 2),
              behavior: 'smooth'
            });
          }
        }
      });
    }
  };

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // initial check


  const logoBtn = document.getElementById('sidebar-logo');
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      const path = window.location.pathname;
      const isHomePage = path === '/' || path.endsWith('index.html') || path.endsWith('index');
      if (isHomePage) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // --- OFFICE STYLE TABS INTERACTIVENESS ---
  const officeTabs = document.querySelectorAll('.office-tab-item');
  const officePreviews = document.querySelectorAll('.office-preview-content');

  officeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs and change arrow to down
      officeTabs.forEach(t => {
        t.classList.remove('active');
        const arrow = t.querySelector('.office-tab-arrow');
        if (arrow) arrow.textContent = '▼';
      });
      
      // Add active to clicked tab and change arrow to up
      tab.classList.add('active');
      const arrow = tab.querySelector('.office-tab-arrow');
      if (arrow) arrow.textContent = '▲';

      // Hide all previews
      officePreviews.forEach(p => p.classList.remove('active'));
      
      // Show matching preview
      const targetId = tab.getAttribute('data-target');
      const targetPreview = document.getElementById(targetId);
      if (targetPreview) {
        targetPreview.classList.add('active');
      }

      // Update floating badge image depending on whether the target is Moodle, MyEfrei, MyHub or MyMessage
      const badgeImg = document.querySelector('.office-floating-badge img');
      if (badgeImg) {
        if (targetId === 'preview-moodle-chat') {
          badgeImg.src = 'img/logoMyMessageUltra.png';
          badgeImg.alt = 'MyMessage ULTRA logo';
        } else if (targetId === 'preview-ai') {
          badgeImg.src = 'img/logoMyHub.png';
          badgeImg.alt = 'MyHub ULTRA logo';
        } else if (targetId.startsWith('preview-moodle')) {
          badgeImg.src = 'img/logoMyMoodleUltra.png';
          badgeImg.alt = 'myMoodle ULTRA logo';
        } else {
          badgeImg.src = 'img/logomyEfreiUltra.png';
          badgeImg.alt = 'myEfrei ULTRA logo';
        }
      }
    });
  });

  // --- SYNC LOCALSTORAGE TO HOMEPAGE MOCKUPS ---
  const syncHomepageMockups = () => {
    const nameVal = localStorage.getItem('mye_user_name');
    const classVal = localStorage.getItem('mye_user_class');
    const avgVal = localStorage.getItem('mye_user_average');
    const absVal = localStorage.getItem('mye_user_absences');
    const retVal = localStorage.getItem('mye_user_retards');

    const updateText = (selector, value) => {
      document.querySelectorAll(selector).forEach(el => {
        el.textContent = value;
      });
    };

    if (nameVal) {
      updateText('.js-mye-user-name', nameVal);
      updateText('.js-mye-user-period', classVal || 'S6 - 2026');
      
      const avgNum = parseFloat(avgVal);
      const avgStr = isNaN(avgNum) ? '--' : avgNum.toFixed(2).replace('.', ',');
      updateText('.js-mye-user-average', avgStr);

      // Average progress bar
      const ratio = isNaN(avgNum) ? 0 : Math.min(avgNum / 20, 1);
      document.querySelectorAll('.js-mye-user-average-bar').forEach(bar => {
        bar.style.width = `${ratio * 100}%`;
        let color = '#84cc16';
        if (avgNum < 10) color = '#ef4444';
        else if (avgNum < 13) color = '#f59e0b';
        bar.style.backgroundColor = color;
      });

      updateText('.js-mye-user-absences', absVal || '0');
      updateText('.js-mye-user-retards', retVal || '0');
    } else {
      // Unconnected state (dashes & warning style placeholder)
      updateText('.js-mye-user-name', 'Non connecté');
      updateText('.js-mye-user-period', 'Aucune extension');
      updateText('.js-mye-user-average', '--');
      document.querySelectorAll('.js-mye-user-average-bar').forEach(bar => {
        bar.style.width = '0%';
      });
      updateText('.js-mye-user-absences', '--');
  };
  
  const checkExtensionInstalled = () => document.documentElement.dataset.myefreiUltraInstalled === "true";

  if (!checkExtensionInstalled()) {
    localStorage.removeItem('mye_user_name');
    localStorage.removeItem('mye_user_class');
    localStorage.removeItem('mye_user_email');
    localStorage.removeItem('mye_user_id');
    localStorage.removeItem('mye_user_average');
    localStorage.removeItem('mye_user_absences');
    localStorage.removeItem('mye_user_retards');
    localStorage.setItem('mye_user_enabled', 'false');
  }

  syncHomepageMockups();

  // --- MOBILE DRAWER TOGGLE LOGIC ---
  const hamburgerBtn = document.getElementById('mye-hamburger-btn');
  const mobileDrawer = document.getElementById('mye-mobile-drawer');
  const drawerClose = document.getElementById('mye-drawer-close');
  const drawerOverlay = document.getElementById('mye-drawer-overlay');

  if (hamburgerBtn && mobileDrawer && drawerOverlay) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.add('active');
      drawerOverlay.classList.add('active');
    });
  }

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
  };

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // --- MOBILE DRAWER PROFILE SYNC ---
  const updateDrawerProfile = () => {
    const nameVal = localStorage.getItem('mye_user_name');
    const classVal = localStorage.getItem('mye_user_class');
    const drawerName = document.getElementById('drawer-profile-name');
    const drawerClass = document.getElementById('drawer-profile-class');
    const drawerAvatar = document.getElementById('drawer-profile-avatar');

    if (drawerName) drawerName.textContent = nameVal || 'Non connecté';
    if (drawerClass) drawerClass.textContent = classVal || 'Aucune extension';
    if (drawerAvatar) {
      if (nameVal) {
        const initials = nameVal.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        drawerAvatar.textContent = initials;
      } else {
        drawerAvatar.textContent = '--';
      }
    }
  };

  updateDrawerProfile();

  // Listen for data synchronization from the extension content script
  window.addEventListener('mye-sync-data', () => {
    syncHomepageMockups();
    updateDrawerProfile();
  });
  
});

