/* ----- TABCONTAINER ----- */

document.addEventListener('DOMContentLoaded', function () {
  const experienceContainer = document.getElementById('experienceContainer');
  const educationContainer = document.getElementById('educationContainer');

  document.querySelectorAll('.buttonTabComponent').forEach(tab => {
    tab.addEventListener('click', function () {
      // Remover la clase 'active' de todos los elementos
      document.querySelectorAll('.buttonTabComponent').forEach(tab => tab.classList.remove('active'));

      // Agregar la clase 'active' al elemento clicado
      this.classList.add('active');

      // Mostrar y ocultar contenedores según el botón activo
      if (this.id === 'buttonTab1') {
        experienceContainer.classList.remove('hidden');
        educationContainer.classList.add('hidden');
      } else if (this.id === 'buttonTab2') {
        experienceContainer.classList.add('hidden');
        educationContainer.classList.remove('hidden');
      }
    });
  });
});

/* ----- SWITCHLANGUAGE ----- */

document.addEventListener('DOMContentLoaded', () => {
  // Función para cargar el archivo JSON de idioma
  const loadLanguage = async (language) => {
    try {
      const response = await fetch(`language/${language}.json`);
      if (!response.ok) {
        throw new Error(`Could not load ${language} language file`);
      }
      const data = await response.json();
      console.log(`Loaded ${language} language file`, data); // Debugging line
      applyLanguage(data);
    } catch (error) {
      console.error('Error loading language file:', error);
    }
  };

  // Función para aplicar el idioma al HTML
  const applyLanguage = (languageData) => {
    document.querySelectorAll('[data-key]').forEach(element => {
      const key = element.getAttribute('data-key');
      if (languageData[key]) {
        element.textContent = languageData[key];
        console.log(`Updated ${key} to ${languageData[key]}`); // Debugging line
      } else {
        console.warn(`Key "${key}" not found in language data`); // Debugging line
      }
    });
  };

  // Cargar el idioma por defecto (inglés)
  loadLanguage('en');

  // Añadir evento a todos los switchers de idioma
  document.querySelectorAll('.languageSwitcher').forEach((switcher) => {
    switcher.addEventListener('change', (event) => {
      const newLanguage = event.target.checked ? 'es' : 'en';
      loadLanguage(newLanguage);
    });
  });

  // Función para aplicar el tema al HTML
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    console.log(`Applied ${theme} theme`); // Debugging line
  };

  // Cargar el tema desde localStorage o usar 'dark' por defecto
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  // Añadir evento a todos los switchers de tema
  document.querySelectorAll('.themeSwitcher').forEach((switcher) => {
    switcher.checked = savedTheme === 'dark';
    switcher.addEventListener('change', (event) => {
      const newTheme = event.target.checked ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme); // Guardar el tema en localStorage
    });
  });
});

/* ----- GREETINGS ----- */

// Variable para almacenar las traducciones cargadas
let translations = {};

// Función para obtener el idioma actual
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'en'; // Valor por defecto 'en'
}

// Función para establecer el idioma actual
function setCurrentLanguage(lang) {
  localStorage.setItem('language', lang);
}

// Función para cargar las traducciones desde un archivo JSON
async function loadTranslations(lang) {
  try {
    const response = await fetch(`language/${lang}.json`);
    if (!response.ok) throw new Error(`Failed to load translations for ${lang}`);
    translations[lang] = await response.json();
  } catch (error) {
    console.error(error);
  }
}

// Función para obtener una traducción
function getTranslation(key) {
  const lang = getCurrentLanguage();
  return translations[lang][key] || key;
}

// Función para actualizar el saludo basado en la hora y el idioma
async function updateGreeting() {
  const dt = new Date();
  let hours = dt.getHours();
  const minutes = dt.getMinutes();
  const ampmKey = hours >= 12 ? 'timeFormatPM' : 'timeFormatAM';
  const ampm = getTranslation(ampmKey);

  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const timeString = `[${formattedHours}:${formattedMinutes} ${ampm}]`;

  document.getElementById('currentTime').innerHTML = timeString;

  let greetingsKey;
  let imageSrc;

  if (hours >= 6 && hours < 12) {
    greetingsKey = 'greetingsMorning';
    imageSrc = 'assets/icons/greetings/morning.png';
  } else if (hours >= 12 && hours < 20) {
    greetingsKey = 'greetingsAfternoon';
    imageSrc = 'assets/icons/greetings/afternoon.png';
  } else {
    greetingsKey = 'greetingsEvening';
    imageSrc = 'assets/icons/greetings/evening.png';
  }

  const greetingText = getTranslation(greetingsKey);
  document.getElementById('greetingsText').innerHTML = greetingText;
  document.getElementById('greetingsIcon').src = imageSrc;
}

// Función para actualizar las traducciones en la página
async function updateTranslations() {
  const lang = getCurrentLanguage();
  if (!translations[lang]) {
    await loadTranslations(lang);
  }

  const elements = document.querySelectorAll('[data-key]');
  elements.forEach((element) => {
    const key = element.getAttribute('data-key');
    element.innerHTML = getTranslation(key);
  });
}

// Función para cambiar el idioma
async function changeLanguage(lang) {
  setCurrentLanguage(lang);
  await updateTranslations();
  await updateGreeting();
}

// Inicializa la página con el idioma actual
document.addEventListener('DOMContentLoaded', async () => {
  await loadTranslations(getCurrentLanguage());
  await updateTranslations();
  await updateGreeting();
});

// Maneja el cambio de idioma con los switchers
document.querySelectorAll('.languageSwitcher').forEach((switcher) => {
  switcher.addEventListener('change', (event) => {
    const newLang = event.target.checked ? 'es' : 'en'; // Ajusta según tu lógica de idiomas
    changeLanguage(newLang);
  });
});

/* ----- NAVIGATION ----- */

const navBar = document.querySelector('.navBar');
const navToggle = document.querySelector(".mobileNavToggle");
const primaryNav = document.querySelector(".mobileNavigation");

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

/* ----- CONTACT FORM ----- */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contactForm');
  const openContactFormBtns = document.querySelectorAll('.openContactForm');
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
  openContactFormBtns.forEach(btn => btn.addEventListener('click', openForm));

  // Cerrar el formulario al hacer clic en el botón de cierre
  closeContactFormBtn.addEventListener('click', closeForm);

  // Cerrar el formulario al hacer clic en la superposición
  overlay.addEventListener('click', closeForm);
});

/* ----- BUTTONPROGRESS ----- */

document.addEventListener('DOMContentLoaded', () => {
  const scrollTopBtn = document.querySelector('.js-scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.onclick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  const offset = 100;
  window.addEventListener(
    'scroll',
    function (event) {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      if (scrollPos > offset) {
        scrollTopBtn.classList.add('is-active');
      } else {
        scrollTopBtn.classList.remove('is-active');
      }
    },
    false,
  );

  const progressPath = document.querySelector('.progress-circle path');
  if (progressPath) {
    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = function() {
      const scroll = window.scrollY || document.documentElement.scrollTop;

      const docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );

      const windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      const height = docHeight - windowHeight;
      const progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;
    };

    window.addEventListener('scroll', function(event) {
      updateProgress();
    });

    // Call updateProgress initially to set the correct state
    updateProgress();
  }
});


/* ----- SCROLLER ----- */

const scrollers = document.querySelectorAll(".scroller");

// If a user hasn't opted in for recuded motion, then we add the animation
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach((scroller) => {
    // add data-animated="true" to every `.scroller` on the page
    scroller.setAttribute("data-animated", true);

    // Make an array from the elements within `.scroller-inner`
    const scrollerInner = scroller.querySelector(".scrollerInner");
    const scrollerContent = Array.from(scrollerInner.children);

    // For each item in the array, clone it
    // add aria-hidden to it
    // add it into the `.scroller-inner`
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

/* ----- TABLE OF CONTENT ----- */

document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".articleBodyContent > div[id]");
  const tocLinks = document.querySelectorAll(".TOCContent a");
  
  // Convertir 10vh a píxeles
  const offsetVH = 20; // Valor en vh que quieres usar
  let offset = (window.innerHeight * offsetVH) / 100; // Convierte vh a píxeles

  window.addEventListener("resize", () => {
    // Recalcula el offset en caso de que el tamaño de la ventana cambie
    offset = (window.innerHeight * offsetVH) / 100;
  });

  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop - offset; // Ajustar la posición con el offset
      const sectionHeight = section.offsetHeight;
      const nextSectionTop = sections[index + 1] ? sections[index + 1].offsetTop - offset : Infinity;

      if (pageYOffset >= sectionTop - sectionHeight / 3 && pageYOffset < nextSectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute("id");
      }
    });

    tocLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");

        // Movimiento horizontal para centrar el enlace en el TOC
        const linkOffsetLeft = link.offsetLeft;
        const linkWidth = link.offsetWidth;
        const tocContentWidth = document.querySelector('.TOCContent').offsetWidth;
        
        document.querySelector('.TOCContent').scrollTo({
          left: linkOffsetLeft - (tocContentWidth / 2) + (linkWidth / 2),
          behavior: 'smooth' // Hace que el desplazamiento sea suave
        });
      }
    });
  });

  // Manejar clics en los enlaces del TOC
  tocLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Prevenir el comportamiento de anclaje predeterminado

      const targetId = this.getAttribute('href').substring(1); // Obtener el ID de la sección
      const targetSection = document.getElementById(targetId);

      // Desplazar la ventana hasta la sección con el offset adicional
      window.scrollTo({
        top: targetSection.offsetTop - offset,
        behavior: 'smooth'
      });
    });
  });
});