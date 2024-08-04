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
const primaryNav = document.querySelector(".primaryNavigation");
const body = document.body;

navToggle.addEventListener("click", () => {
  const isVisible = primaryNav.hasAttribute("data-visible");

  navToggle.setAttribute("aria-expanded", !isVisible);
  primaryNav.toggleAttribute("data-visible");
  navBar.toggleAttribute("data-overlay");

  // Alternar la visibilidad de los iconos
  navToggle.querySelector('.iconClose').style.display = isVisible ? 'none' : 'block';
  navToggle.querySelector('.iconHamburger').style.display = isVisible ? 'block' : 'none';

  // Alternar la clase 'no-scroll' en el body
  body.classList.toggle('no-scroll', !isVisible);
});

/* ----- BUTTONPROGRESS ----- */

let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progressButton");
  let pos = document.documentElement.scrollTop;

  let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrollValue = Math.round((pos * 100) / calcHeight);

  if (pos > 100) {
    scrollProgress.style.display = "grid";
  } else {
    scrollProgress.style.display = "none";
  }

  scrollProgress.addEventListener("click", () => {
    document.documentElement.scrollTop = 0;
  });

  scrollProgress.style.background = `conic-gradient(var(--primary-500)${scrollValue}%, var(--neutral-600) ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

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

/* ----- SHARE BUTTONS ----- */

const whatsapp = document.querySelector('.whatsapp');
const linkedin = document.querySelector('.linkedin');

const pageUrl = encodeURIComponent(location.href);
const message2 = encodeURIComponent('Read this, it only takes a few minutes');

const whatsappApi = `https://wa.me/?text=${pageUrl}. ${message2}`;
const linkedinApi = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}&summary=${message2}`;

whatsapp.addEventListener('click', () => {
  window.open(whatsappApi, '_blank');
});

linkedin.addEventListener('click', () => {
  window.open(linkedinApi, '_blank');
});

/* ----- ANIMATEDTEXT ----- */
