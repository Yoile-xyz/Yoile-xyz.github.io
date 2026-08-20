
// Variable afuera para guardar la referencia del temporizador
let bootTimeout = null;

// FUNCIÓN PARA LA TERMINAL DE CARGA
function startBoot() {
  const lines = [
    "> INITIALIZING WITCHCODEX...",
    "> LOADING ARTWORK MODULES [OK]",
    "> YOILÉ'S PORTFOLIO [OK]",
    "> MULTIMEDIA ARTIST [OK]",
    "> SYSTEM READY."
  ];

  const target = document.getElementById('boot-text');
  if (!target) return;

  // Cancelamos el temporizador anterior si aún estaba escribiendo
  if (bootTimeout) clearTimeout(bootTimeout);

  // Limpiamos la pantalla
  target.textContent = "";
  let lineIdx = 0;
  let charIdx = 0;

  function type() {
    if (lineIdx < lines.length) {
      if (charIdx < lines[lineIdx].length) {
        target.textContent += lines[lineIdx].charAt(charIdx);
        charIdx++;
        bootTimeout = setTimeout(type, 30);
      } else {
        target.textContent += "\n";
        lineIdx++;
        charIdx = 0;
        bootTimeout = setTimeout(type, 250);
      }
    }
  }

  type();
}

// LÓGICA PRINCIPAL DEL PORTAFOLIO
document.addEventListener('DOMContentLoaded', () => {
  // Desactivar clic derecho y arrastrar imágenes
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());

  const cards = document.querySelectorAll('.card');

  // OCULTAR LINKS CUANDO EL MENÚ DE FILTROS ESTÁ ABIERTO EN MÓVIL
  const sidebar = document.querySelector('.sidebar');
  const navLinks = document.querySelector('.mobile-nav-links');

  if (sidebar && navLinks) {
    sidebar.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-btn') || e.target.innerText === 'X' || e.target.innerText === 'x') {
        navLinks.style.display = 'flex';
      } else {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      }
    });
  }

  // FUNCIÓN DE FILTRADO
  function filterCards(selectedTag) {
    cards.forEach(card => {
      const tech = (card.getAttribute('data-tech') || '').toLowerCase();
      const year = (card.getAttribute('data-year') || '').toLowerCase();
      const media = (card.getAttribute('data-media') || '').toLowerCase();

      if (selectedTag === 'all' || selectedTag === 'todas' || tech === selectedTag || year === selectedTag || media === selectedTag) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // BOTÓN DE INICIO (CLIC EN EL LOGO/HEADER)
  const brandHomeBtn = document.getElementById('brand-home-btn');
  if (brandHomeBtn) {
    brandHomeBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-item').forEach(item => {
        item.classList.remove('active');
      });

      filterCards('all');

      const bootTerminal = document.querySelector('.boot-terminal');
      if (bootTerminal) {
        bootTerminal.style.display = 'block';
        startBoot();
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // MARCAR FILTRO "ALL" COMO ACTIVO AL INICIO
  document.querySelectorAll('.filter-item').forEach(item => {
    const spanText = item.querySelector('span')?.textContent.trim().toLowerCase();
    item.classList.remove('active');

    if (spanText === 'all' || spanText === 'todos' || spanText === 'todas') {
      item.classList.add('active');
    }
  });

  // MOSTRAR TODAS LAS TARJETAS AL INICIO
  filterCards('all');

  // INICIAR TERMINAL
  const bootTerminal = document.querySelector('.boot-terminal');
  if (bootTerminal) {
    bootTerminal.style.display = 'block';
    startBoot();
  }

  // EVENTO DE CLIC EN FILTROS DESKTOP
  const filterItems = document.querySelectorAll('aside .filter-item');
  filterItems.forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const rawTag = item.querySelector('span').textContent.trim();
      const selectedTag = rawTag.toLowerCase();

      filterCards(selectedTag);

      // CONTROL DE LA TERMINAL DE INICIO
      if (bootTerminal) {
        if (selectedTag === 'todas' || selectedTag === 'all' || selectedTag === 'todos') {
          bootTerminal.style.display = 'block';
          startBoot();
        } else {
          bootTerminal.style.display = 'none';
        }
      }
    });
  });

  // LÓGICA MÓVIL (MENÚ DESPLEGABLE)
  const mobileTagsBtn = document.getElementById('mobile-tags-btn');
  const filterDrawer = document.getElementById('filter-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerContentTarget = document.getElementById('drawer-content-target');

  if (drawerContentTarget) {
    const filterGroups = document.querySelectorAll('aside .filter-group');
    filterGroups.forEach(group => {
      const clone = group.cloneNode(true);
      drawerContentTarget.appendChild(clone);
    });
  }

  if (mobileTagsBtn && filterDrawer) {
    mobileTagsBtn.addEventListener('click', () => {
      filterDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      filterDrawer.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

    if (drawerContentTarget) {
      drawerContentTarget.addEventListener('click', (e) => {
        const item = e.target.closest('.filter-item');
        if (!item) return;

        document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const selectedTag = item.querySelector('span').textContent.trim().toLowerCase();
        filterCards(selectedTag);
        closeDrawer();
      });
    }
  }

  // MODAL DE PROYECTOS
  const modal = document.getElementById('project-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const modalMediaContainer = document.getElementById('modal-media-container');
  const modalTitle = document.getElementById('modal-title');
  const modalTech = document.getElementById('modal-tech');
  const modalYear = document.getElementById('modal-year');
  const modalDescription = document.getElementById('modal-description');

  if (modal) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const mediaContainer = card.querySelector('.media-container');
        if (mediaContainer) {
          modalMediaContainer.innerHTML = mediaContainer.innerHTML;
        }

        if (modalTitle) modalTitle.textContent = card.getAttribute('data-title') || 'Sin título';
        if (modalTech) modalTech.textContent = card.getAttribute('data-tech') || 'N/A';
        if (modalYear) modalYear.textContent = card.getAttribute('data-year') || 'N/A';
        if (modalDescription) modalDescription.textContent = card.getAttribute('data-description') || 'Sin descripción disponible.';

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const aboutModal = document.getElementById('about-modal');
  const closeAboutBtn = document.getElementById('close-about-btn');

  // Selecciona TODOS los enlaces que digan 'about me' o apunten a #about
  const aboutLinks = document.querySelectorAll('a[href="#about"], .mobile-nav-links a:first-child');

  aboutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Evita que recargue o salte la página
      if (aboutModal) {
        aboutModal.classList.add('active');
      }
    });
  });

  // Cerrar con la X
  if (closeAboutBtn && aboutModal) {
    closeAboutBtn.addEventListener('click', () => {
      aboutModal.classList.remove('active');
    });
  }

  // Cerrar haciendo clic en el fondo oscuro afuera de la ventana
  if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) {
        aboutModal.classList.remove('active');
      }
    });
  }
});