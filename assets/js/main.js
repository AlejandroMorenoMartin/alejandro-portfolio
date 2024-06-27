/* 1.2 Button - index-hero (Salto a sección) */

document.addEventListener('DOMContentLoaded', function () {
  // Función para manejar el clic en el enlace
  function scrollToSection() {
    const section = document.getElementById('step-section');
    const yOffset = -100; // Ajusta este valor según tus necesidades

    // Obtener la posición de la sección
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    // Desplazamiento suave
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  // Agregar el evento de clic al enlace
  const myLink = document.getElementById('step-link');
  myLink.addEventListener('click', function (event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
    scrollToSection();
  });
});

/* ----- Menu Sidebar ----- */

function showSidebar(){
  const sidebar = document.querySelector('.sidebar')
  sidebar.style.display = 'flex'
}

function hideSidebar(){
  const sidebar = document.querySelector('.sidebar')
  sidebar.style.display = 'none'
}

/* ----- Progress bar & go top ----- */

let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progress-button");
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

/* ----- Toolstack - scroller ----- */

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
    const scrollerInner = scroller.querySelector(".scroller__inner");
    const scrollerContent = Array.from(scrollerInner.children);

    // For each item in the array, clone it
    // add aria-hidden to it
    // add it into the `.scroller-inner`
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
    // Agregar eventos de mouseover y mouseout para pausar y reanudar la animación
    scroller.addEventListener("mouseover", pauseAnimation);
    scroller.addEventListener("mouseout", resumeAnimation);
  });
}

function pauseAnimation(event) {
  const scrollerInner = event.currentTarget.querySelector(".scroller__inner");
  scrollerInner.style.animationPlayState = "paused";
}

function resumeAnimation(event) {
  const scrollerInner = event.currentTarget.querySelector(".scroller__inner");
  scrollerInner.style.animationPlayState = "running";
}

/* ----- Table of content (Article) ----- */

document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.table-of-content__navigation-link');
  const sections = document.querySelectorAll('.main-3__article-sections-section');
  const offset = 160; // Offset for the top margin

  const options = {
    root: null, // Use the viewport as the root
    rootMargin: `-${offset}px 0px -${window.innerHeight - offset - 1}px 0px`,
    threshold: 0
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      const link = document.querySelector(`.table-of-content__navigation-link[href="#${entry.target.id}"]`);
      if (entry.isIntersecting) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });

  links.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

/* ----- Table of content (Projects) ----- */

document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.table-of-content__navigation-link');
  const sections = document.querySelectorAll('.main__project-sections-section');
  const offset = 160; // Offset for the top margin

  const options = {
    root: null, // Use the viewport as the root
    rootMargin: `-${offset}px 0px -${window.innerHeight - offset - 1}px 0px`,
    threshold: 0
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      const link = document.querySelector(`.table-of-content__navigation-link[href="#${entry.target.id}"]`);
      if (entry.isIntersecting) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });

  links.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

/* ----- Share buttons ----- */

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