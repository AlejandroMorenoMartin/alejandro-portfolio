/* ----- NAVBAR ----- */

document.addEventListener('DOMContentLoaded', function () {
  initializeNavigation(); // Inicializar la navegación sin cargar el navBar
});

function initializeNavigation() {
  initializeSwitchers();
}

function initializeSwitchers() {
  const languageSwitch = document.getElementById('languageSwitch');
  const themeSwitch = document.getElementById('themeSwitch');

  // Cargar y aplicar las preferencias guardadas de idioma y tema
  const loadPreferences = () => {
    const savedLang = localStorage.getItem('lang') || 'en';
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Configurar las opciones guardadas de idioma y tema
    translate(savedLang);
    updateTheme(savedTheme);

    // Actualizar el estado de los switches según las preferencias guardadas
    languageSwitch.checked = savedLang === 'es';
    themeSwitch.checked = savedTheme === 'light';
  };

  // Función para traducir y actualizar el atributo lang
  const translate = async (lang) => {
    try {
      const response = await fetch(`language/${lang}.json`);
      const translations = await response.json();

      document.querySelectorAll('[data-key]').forEach((element) => {
        const key = element.getAttribute('data-key');
        if (translations[key]) element.textContent = translations[key];
      });

      // Actualizar el atributo lang
      document.documentElement.setAttribute('lang', lang);
      updateLabels(document.querySelectorAll('#languageSwitcherContainer label'), lang);

      // Cargar y actualizar el TOC
      loadLanguage(lang); // Llama a esta función para actualizar el TOC

      // Guardar la preferencia de idioma en localStorage
      localStorage.setItem('lang', lang);
    } catch (error) {
      console.error('Error loading translation file:', error);
    }
  };

  // Función para actualizar el tema
  const updateTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    updateLabels(document.querySelectorAll('#themeSwitcherContainer label'), theme);

    // Guardar la preferencia de tema en localStorage
    localStorage.setItem('theme', theme);
  };

  const updateLabels = (labels, activeState) => {
    labels.forEach(label => label.classList.toggle('active', label.getAttribute('data-state') === activeState));
  };

  // Configuración de los eventos de cambio
  languageSwitch.addEventListener('change', () => {
    const lang = languageSwitch.checked ? 'es' : 'en';
    translate(lang);
  });

  themeSwitch.addEventListener('change', () => {
    const theme = themeSwitch.checked ? 'light' : 'dark';
    updateTheme(theme);
  });

  // Cargar las preferencias del usuario al cargar la página
  loadPreferences();
}

// Controla la posicion de tabContainerSlide

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("languageSwitch");
  const slide = document.getElementById("languageSlider");

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      // Si el checkbox está activado, mueve el slide a la derecha
      slide.style.left = "calc(100% - 51%)";
    } else {
      // Si el checkbox no está activado, mueve el slide a la posición inicial
      slide.style.left = "1%";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("themeSwitch");
  const slide = document.getElementById("themeSlider");

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      // Si el checkbox está activado, mueve el slide a la derecha
      slide.style.left = "calc(100% - 51%)";
    } else {
      // Si el checkbox no está activado, mueve el slide a la posición inicial
      slide.style.left = "1%";
    }
  });
});

/* TABLE OF CONTENT */
document.addEventListener("DOMContentLoaded", () => {
  const tocLinks = document.querySelectorAll('.tableOfContentLinks a');
  const sections = document.querySelectorAll('section');
  const tocContainer = document.querySelector('.tableOfContentLinks');
  const tableOfContent = document.querySelector('.tableOfContent');

  // Función para eliminar la clase active de todos los enlaces
  function removeActiveClasses() {
    tocLinks.forEach(link => link.classList.remove('active'));
  }

  // Función para desplazar el contenedor de enlaces al margen izquierdo
  function scrollToActiveLink(activeLink) {
    const linkOffset = activeLink.offsetLeft;
    tocContainer.scrollTo({
      left: linkOffset,
      behavior: 'smooth' // Desplazamiento suave
    });
  }

  // IntersectionObserver para observar cada sección
  const observer = new IntersectionObserver((entries) => {
    let closestSection = null;
    let minDistance = Number.POSITIVE_INFINITY;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const distanceFromTop = Math.abs(entry.boundingClientRect.top);
        if (distanceFromTop < minDistance) {
          minDistance = distanceFromTop;
          closestSection = entry.target;
        }
      }
    });

    if (closestSection) {
      removeActiveClasses();
      const activeLink = document.querySelector(`.tableOfContentLinks a[href="#${closestSection.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        scrollToActiveLink(activeLink); // Desplaza el contenedor de enlaces
      }
    }

    // Mostrar u ocultar el tableOfContent según la clase active
    const hasActiveLink = Array.from(tocLinks).some(link => link.classList.contains("active"));
    if (hasActiveLink) {
      tableOfContent.style.transform = "translateY(0)";
      tableOfContent.style.opacity = "1";
    } else {
      tableOfContent.style.transform = "translateY(-100%)";
      tableOfContent.style.opacity = "0";
    }
  }, {
    root: null,
    threshold: 0.1
  });

  // Inicialmente, oculta tableOfContent
  tableOfContent.style.transform = "translateY(-100%)";
  tableOfContent.style.opacity = "0";
  tableOfContent.style.transition = "transform 0.5s ease, opacity 0.5s ease";

  // Añade cada sección al observador
  sections.forEach(section => observer.observe(section));
});

/* OPEN OVERLAY */
document.addEventListener("DOMContentLoaded", () => {
  const settingsButton = document.getElementById("openSeetingsOverlay");
  const settingsOverlay = document.querySelector(".seetingsOverlay");

  // Función para abrir/cerrar el overlay
  const toggleSettingsOverlay = (event) => {
    const isOpen = settingsOverlay.classList.contains("active");

    if (!isOpen) {
      // Posicionar el overlay
      const buttonRect = settingsButton.getBoundingClientRect();
      settingsOverlay.style.top = `${buttonRect.bottom + 8}px`; // 2rem = 32px
      settingsOverlay.style.right = `${window.innerWidth - buttonRect.right}px`;
      settingsOverlay.classList.add("active");
    } else {
      settingsOverlay.classList.remove("active");
    }
  };

  // Cerrar al hacer clic fuera del overlay
  const closeOverlayOnClickOutside = (event) => {
    if (!settingsOverlay.contains(event.target) && event.target !== settingsButton) {
      settingsOverlay.classList.remove("active");
    }
  };

  // Evento de clic en el botón
  settingsButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Evitar que se cierre al pulsar el botón
    toggleSettingsOverlay();
  });

  // Evento de clic fuera del overlay
  document.addEventListener("click", closeOverlayOnClickOutside);
});

/* SLIDER */
// Selección de elementos comunes
const sliders = [
  {
    container: document.querySelector('.experienceContainer'),
    buttonLeft: document.querySelector('.buttonSliderLeftExperience'),
    buttonRight: document.querySelector('.buttonSliderRightExperience'),
    cardWidth: 1280,
    gap: 16,
    totalCards: document.querySelectorAll('.cardExperience').length
  },
  {
    container: document.querySelector('.educationContainer'),
    buttonLeft: document.querySelector('.buttonSliderLeftEducation'),
    buttonRight: document.querySelector('.buttonSliderRightEducation'),
    cardWidth: 632,
    gap: 16,
    totalCards: document.querySelectorAll('.cardEducation').length
  },
  {
    container: document.querySelector('.skillsContainer'),
    buttonLeft: document.querySelector('.buttonSliderLeftSkills'),
    buttonRight: document.querySelector('.buttonSliderRightSkills'),
    cardWidth: 632,
    gap: 16,
    totalCards: document.querySelectorAll('.cardSkill').length
  },
  {
    container: document.querySelector('.testimonialContainer'),
    buttonLeft: document.querySelector('.buttonSliderLeftTestimonial'),
    buttonRight: document.querySelector('.buttonSliderRightTestimonial'),
    cardWidth: 632,
    gap: 16,
    totalCards: document.querySelectorAll('.cardTestimonial').length
  },
  {
    container: document.querySelector('.readingsContainer'),
    buttonLeft: document.querySelector('.buttonSliderLeftReadings'),
    buttonRight: document.querySelector('.buttonSliderRightReadings'),
    cardWidth: 632,
    gap: 16,
    totalCards: document.querySelectorAll('.cardReading').length
  }
];

// Función para actualizar el estado de los botones
function updateButtons(slider) {
  const { container, buttonLeft, buttonRight, currentPosition, maxScroll } = slider;
  buttonLeft.style.opacity = currentPosition === 0 ? '0.25' : '1';
  buttonLeft.disabled = currentPosition === 0;

  buttonRight.style.opacity = currentPosition === maxScroll ? '0.25' : '1';
  buttonRight.disabled = currentPosition === maxScroll;
}

// Función genérica para manejar el desplazamiento
function handleSliderMovement(slider, direction) {
  const { container, cardWidth, gap, maxScroll } = slider;
  const moveAmount = direction === 'left' ? cardWidth + gap : -(cardWidth + gap);

  if ((direction === 'left' && slider.currentPosition < 0) || (direction === 'right' && slider.currentPosition > maxScroll)) {
    slider.currentPosition += moveAmount;
    container.style.transform = `translateX(${slider.currentPosition}px)`;
  }

  updateButtons(slider);
}

// Inicializar los deslizadores
sliders.forEach(slider => {
  const { buttonLeft, buttonRight, cardWidth, gap, totalCards } = slider;
  slider.maxScroll = -((cardWidth + gap) * (totalCards - 1));
  slider.currentPosition = 0;

  // Manejadores de eventos para los botones
  buttonLeft.addEventListener('click', () => handleSliderMovement(slider, 'left'));
  buttonRight.addEventListener('click', () => handleSliderMovement(slider, 'right'));

  // Actualizar botones al inicio
  updateButtons(slider);
});
