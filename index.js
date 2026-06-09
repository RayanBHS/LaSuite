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

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // initial check


  const logoBtn = document.getElementById('sidebar-logo');
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
      updateText('.js-mye-user-retards', '--');
    }
  syncHomepageMockups();

  // Listen for data synchronization from the extension content script
  window.addEventListener('mye-sync-data', () => {
    syncHomepageMockups();
  });
  
});
