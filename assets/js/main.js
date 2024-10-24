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
  console.log(`Idioma establecido: ${lang}`); // Verificar qué idioma se establece
}

// Función para cargar las traducciones desde un archivo JSON
async function loadTranslations(lang) {
  try {
    const response = await fetch(`language/${lang}.json`);
    if (!response.ok) throw new Error(`Failed to load translations for ${lang}`);
    translations[lang] = await response.json();
    console.log(`Traducciones cargadas para ${lang}`, translations[lang]); // Verificar que las traducciones se carguen correctamente
  } catch (error) {
    console.error(error);
  }
}

// Función para obtener una traducción
function getTranslation(key) {
  const lang = getCurrentLanguage();
  const translation = translations[lang] ? translations[lang][key] : key;
  console.log(`Traducción obtenida para ${key}: ${translation}`); // Verificar qué traducción se obtiene
  return translation;
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

  if (hours >= 6 && hours < 12) {
    greetingsKey = 'greetingsMorning';
  } else if (hours >= 12 && hours < 20) {
    greetingsKey = 'greetingsAfternoon';
  } else {
    greetingsKey = 'greetingsEvening';
  }

  const greetingText = getTranslation(greetingsKey);
  document.getElementById('greetingsText').innerHTML = greetingText;
  console.log(`Saludo actualizado: ${greetingText}`); // Verificar qué saludo se actualiza
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

    const updateProgress = function () {
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

    window.addEventListener('scroll', function (event) {
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


/* ANIMACIÓN HEADERS */

document.addEventListener("DOMContentLoaded", function() {
  // Selecciona todas las etiquetas h2 y h4
  const headings = document.querySelectorAll("h2, h4");

  // Función para verificar si el elemento está visible en el viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Función que maneja el scroll y aplica las clases cuando corresponda
  function handleScroll() {
    headings.forEach(heading => {
      if (isInViewport(heading)) {
        heading.classList.add("visible");
      }
    });
  }

  // Escuchar el evento scroll
  window.addEventListener("scroll", handleScroll);

  // Llamar a la función de scroll una vez para verificar al cargar la página
  handleScroll();
});

