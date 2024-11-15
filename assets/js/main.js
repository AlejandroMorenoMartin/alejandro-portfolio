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

document.addEventListener('DOMContentLoaded', function () {
  // Obtener el elemento donde se mostrará la hora
  const currentTimeElement = document.getElementById('currentTime');

  // Función para actualizar la hora
  function updateTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    currentTimeElement.textContent = now.toLocaleString([], options); // Solo mostrar la hora
  }

  // Actualizar la hora al cargar la página
  updateTime();

  // Opcional: Actualizar la hora cada minuto
  setInterval(updateTime, 60000); // 60000 ms = 1 minuto
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

/* SALTO A LA SECCIÓN */

document.querySelectorAll('.tableOfContent a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(event) {
      event.preventDefault();

      // Obtener el ID de la sección
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.querySelector(`#${targetId} h2`);

      if (targetElement) {
          // Obtener la posición actual de la tabla de contenido y restar el offset
          const tableOfContentOffset = document.querySelector('.tableOfContent').getBoundingClientRect().bottom;
          const offset = 64; // 2rem es igual a 32px

          // Calcular la posición de destino en relación a la posición de .tableOfContent
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - tableOfContentOffset - offset;

          // Hacer scroll a la posición calculada
          window.scrollTo({
              top: targetPosition,
              behavior: "smooth"
          });
      }
  });
});

document.getElementById('buttonHero').addEventListener('click', function (e) {
  e.preventDefault(); // Evita el comportamiento predeterminado del enlace

  // Obtén el destino
  const targetId = this.getAttribute('href').substring(1); // Elimina el "#"
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
      // Calcula la posición con un offset de 64px
      const offset = 168; // Distancia fija en píxeles
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      // Realiza el desplazamiento con animación
      window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
      });
  }
});




