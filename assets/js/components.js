/* ----- NAVBAR ----- */

document.addEventListener('DOMContentLoaded', function () {
    fetch('components/navigation/navBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navBarContainer').innerHTML = data;

            // Inicializamos las funcionalidades después de cargar el componente
            activateCurrentPage();
            initializeThemeAndLanguageSwitchers();
            initializeMobileNavToggle();
        });
});

function activateCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.navBarNavigation a');

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('activa');
        } else {
            link.classList.remove('activa');
        }
    });
}

function initializeThemeAndLanguageSwitchers() {
    const languageSwitch = document.getElementById('languageSwitch');
    const themeSwitch = document.getElementById('themeSwitch');

    // Función para cargar las traducciones
    const translate = async (lang) => {
        try {
            const response = await fetch(`language/${lang}.json`);
            const translations = await response.json();

            // Traducir todos los elementos con atributo data-key
            document.querySelectorAll('[data-key]').forEach((element) => {
                const key = element.getAttribute('data-key');
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });

            // Actualizar la clase active en las etiquetas de idioma
            updateLabels(document.querySelectorAll('#languageSwitcherContainer label'), lang);
        } catch (error) {
            console.error('Error loading translation file:', error);
        }
    };

    // Función para actualizar el tema
    const updateTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        updateLabels(document.querySelectorAll('#themeSwitcherContainer label'), theme);
    };

    // Función para actualizar la clase active en las etiquetas
    const updateLabels = (labels, activeState) => {
        labels.forEach((label) => {
            if (label.getAttribute('data-state') === activeState) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    };

    // Función para inicializar el idioma
    const initLanguage = () => {
        const lang = languageSwitch.checked ? 'es' : 'en';
        translate(lang);
    };

    // Función para inicializar el tema
    const initTheme = () => {
        const theme = themeSwitch.checked ? 'light' : 'dark';
        updateTheme(theme);
    };

    // Configurar el checkbox de idioma
    languageSwitch.addEventListener('change', () => {
        const lang = languageSwitch.checked ? 'es' : 'en';
        translate(lang);
    });

    // Configurar el checkbox de tema
    themeSwitch.addEventListener('change', () => {
        const theme = themeSwitch.checked ? 'light' : 'dark';
        updateTheme(theme);
    });

    // Cargar idioma y tema inicial
    initLanguage();
    initTheme();
}

function initializeMobileNavToggle() {
    const navToggle = document.querySelector(".mobileNavToggle");
    const primaryNav = document.querySelector(".mobileNavigation");
    const navBar = document.querySelector('.navBar');

    navToggle.addEventListener("click", () => {
        const isVisible = primaryNav.hasAttribute("data-visible");

        navToggle.setAttribute("aria-expanded", !isVisible);
        primaryNav.toggleAttribute("data-visible");
        navBar.toggleAttribute("data-overlay");

        // Alternar la visibilidad de los iconos
        navToggle.querySelector('.iconClose').style.display = isVisible ? 'none' : 'block';
        navToggle.querySelector('.iconHamburger').style.display = isVisible ? 'block' : 'none';

        // Alternar la clase 'no-scroll' en el body
        document.body.classList.toggle('no-scroll', !isVisible);
    });
}

/* CARDSPROJECTS */

document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar una tarjeta de proyecto desde un archivo HTML
    const loadProjectCard = async (filePath, containerId) => {
        try {
            const response = await fetch(filePath);
            const htmlContent = await response.text();
            document.getElementById(containerId).innerHTML = htmlContent;
        } catch (error) {
            console.error('Error loading project card:', error);
        }
    };

    // Cargar tarjetas de proyecto dinámicamente
    loadProjectCard('components/cards/projects/cardGeomites.html', 'cardGeomites');
    loadProjectCard('components/cards/projects/cardAtipikoTours.html', 'cardAtipikoTours');
    loadProjectCard('components/cards/projects/cardTattooParadise.html', 'cardTattooParadise');
    loadProjectCard('components/cards/projects/cardPortfolio.html', 'cardPortfolio');
    loadProjectCard('components/cards/projects/cardSenzoStudio.html', 'cardSenzoStudio');
});


/* ----- FOOTER ----- */

function loadComponent(componentId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(componentId).innerHTML = data;
        })
        .catch(error => console.error('Error loading the component:', error));
}

loadComponent('footer', 'components/navigation/footer.html');



/* ----- CONTACTFORM ----- */

function loadContactForm() {
    fetch('components/forms/contactForm.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('contactFormContainer').innerHTML = html;
  
        // Una vez cargado el formulario, asigna los event listeners
        const contactForm = document.querySelector('.contactForm');
        const closeContactFormBtn = document.getElementById('closeContactForm');
        const overlay = document.querySelector('.overlay');
        const body = document.body;
  
        // Función para abrir el formulario
        function openForm() {
          contactForm.classList.add('open');
          overlay.classList.add('show');
          body.classList.add('no-scroll');
        }
  
        // Función para cerrar el formulario
        function closeForm() {
          contactForm.classList.remove('open');
          overlay.classList.remove('show');
          body.classList.remove('no-scroll');
        }
  
        // Abrir el formulario al hacer clic en los botones de apertura
        document.querySelectorAll('.openContactForm').forEach(btn => {
          btn.addEventListener('click', openForm);
        });
  
        // Cerrar el formulario al hacer clic en el botón de cierre
        closeContactFormBtn.addEventListener('click', closeForm);
  
        // Cerrar el formulario al hacer clic en la superposición
        overlay.addEventListener('click', closeForm);
      })
      .catch(error => console.error('Error loading contact form:', error));
  }
  
  // Llama a la función para cargar el formulario cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', loadContactForm);


  