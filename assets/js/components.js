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