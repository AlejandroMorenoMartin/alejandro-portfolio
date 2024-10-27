/* HEADER & FOOTER & TABLE OF CONTENT */

// Variables para almacenar el estado del scroll anterior
let previousScrollPosition = window.pageYOffset;
const navBar = document.querySelector('.navBar');
const footer = document.querySelector('.footer');
const tableOfContent = document.querySelector('.tableOfContent'); // Verificamos si existe

// Función para manejar el evento de scroll
window.onscroll = function () {
    let currentScrollPosition = window.pageYOffset;

    if (previousScrollPosition > currentScrollPosition) {
        // Si el usuario hace scroll hacia arriba
        navBar.style.transform = "translateY(0)"; // Vuelve a la posición original
        footer.style.transform = "translateY(0)"; // Vuelve a la posición original

        // Si existe la tabla de contenido, también la movemos
        if (tableOfContent) {
            tableOfContent.style.transform = "translateY(0)";
        }
    } else {
        // Si el usuario hace scroll hacia abajo
        navBar.style.transform = "translateY(-68px)"; // Se desplaza hacia arriba
        footer.style.transform = "translateY(58px)";  // Se desplaza hacia abajo

        // Si existe la tabla de contenido, también la movemos
        if (tableOfContent) {
            tableOfContent.style.transform = "translateY(-68px)";
        }
    }

    // Actualiza la posición anterior del scroll
    previousScrollPosition = currentScrollPosition;
};

// Estilos CSS recomendados para la transición suave
document.addEventListener("DOMContentLoaded", function () {
    navBar.style.transition = "transform 0.6s ease";
    footer.style.transition = "transform 0.6s ease";

    // Si existe la tabla de contenido, le aplicamos la transición también
    if (tableOfContent) {
        tableOfContent.style.transition = "transform 0.6s ease";
    }
});


/* ----- NAVBAR ----- */

document.addEventListener('DOMContentLoaded', function () {
    fetch('components/navigation/navBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navBarContainer').innerHTML = data;

            initializeNavigation();
        });
});

function initializeNavigation() {
    activateCurrentPage();
    initializeSwitchers();
    setupMobileNavToggle();
}

function activateCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.navBarNavigation a').forEach(link => {
        link.classList.toggle('activa', link.getAttribute('href') === currentPage);
    });
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

function setupMobileNavToggle() {
    const navToggle = document.querySelector(".mobileNavToggle");
    const primaryNav = document.querySelector(".mobileNavigation");
    const navBar = document.querySelector('.navBar');

    navToggle.addEventListener("click", () => {
        const isVisible = primaryNav.hasAttribute("data-visible");
        navToggle.setAttribute("aria-expanded", !isVisible);
        primaryNav.toggleAttribute("data-visible");
        navBar.toggleAttribute("data-overlay");
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