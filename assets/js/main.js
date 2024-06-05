/* ESTRUCTURA JS 

1. Navigation
  1.1 Menu (appears and dissapear)
  1.2 Button - index-hero (Salto a sección)  
  1.3 Button - progress bar (Barra de progreso y go top) 
  1.4 Scroller - toolstack-scroller
  1.5 Tab - experience-education 
  1.6 Carousel - carousel-project-hero  

/* ----------------- NAVIGATION ----------------- */

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

/* ----------------------------------------------- */

/* 1.3 Button - progress bar (Barra de progreso y go top) */

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

  scrollProgress.style.background = `conic-gradient(var(--primary-500)${scrollValue}%, var(--neutral-500) ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

/* ----------------------------------------------- */

/* 1.4 Scroller - toolstack-scroller */

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

/* ----------------------------------------------- */

/* 1.5 Tab - experience-education */

function changeTab(tab) {
  // Obtener todos los botones de pestañas
  var tabButtons = document.getElementsByClassName("tab-button");

  // Eliminar la clase 'active' de todos los botones
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  // Agregar la clase 'active' al botón clicado
  var activeButton = document.getElementById(tab + "Btn");
  activeButton.classList.add("active");

  // Llamar a la función showTab con el nombre de la pestaña
  showTab(tab);
}

function showTab(tabName) {
  // Oculta todos los bloques de contenido
  var tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(function (tab) {
    tab.classList.remove('active');
  });

  // Muestra el bloque de contenido correspondiente a la pestaña seleccionada
  document.getElementById(tabName).classList.add('active');
}

/* ----------------------------------------------- */

/* 1.6 Carousel - carousel-project-hero */

/*const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__button--right');
const prevButton = document.querySelector('.carousel__button--left');
const dotsNav = document.querySelector('.carousel__nav');
const dots = Array.from(dotsNav.children);
const slideWidth = slides[0].getBoundingClientRect().width;

// arrange the slides next to one another
// slides[0].style.left = slideWidth * 0 + 'px';
// slides[1].style.left = slideWidth * 1 + 'px';
// slides[2].style.left = slideWidth * 2 + 'px';

const setSlidePosition = (slide, index) => {
  slide.style.left = slideWidth * index + 'px';
};
slides.forEach(setSlidePosition);

const moveToSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
}

const updateDots = (currentDot, targetDot) => {
  currentDot.classList.remove('current-slide');
  targetDot.classList.add('current-slide');
}

const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
  if (targetIndex === 0) {
    prevButton.classList.add('is-hidden');
    nextButton.classList.remove('is-hidden');
  } else if (targetIndex === slides.length - 1) {
    prevButton.classList.remove('is-hidden');
    nextButton.classList.add('is-hidden');
  } else {
    prevButton.classList.remove('is-hidden');
    nextButton.classList.remove('is-hidden');
  }
}

// when I click right, move slides to the right
nextButton.addEventListener('click', e => {
  const currentSlide = track.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling;
  const currentDot = dotsNav.querySelector('.current-slide');
  const nextDot = currentDot.nextElementSibling;
  const nextIndex = slides.findIndex(slide => slide === nextSlide);

  moveToSlide(track, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
  hideShowArrows(slides, prevButton, nextButton, nextIndex);
})


// when I click left, move slides to the left
prevButton.addEventListener('click', e => {
  const currentSlide = track.querySelector('.current-slide');
  const prevSlide = currentSlide.previousElementSibling;
  const currentDot = dotsNav.querySelector('.current-slide');
  const prevDot = currentDot.previousElementSibling;
  const prevIndex = slides.findIndex(slide => slide === prevSlide);

  moveToSlide(track, currentSlide, prevSlide);
  updateDots(currentDot, prevDot);
  hideShowArrows(slides, prevButton, nextButton, prevIndex);
})


// when I click the nav indicators, move to that slide
dotsNav.addEventListener('click', e => {
  // what indicator was clicked on?
  const targetDot = e.target.closest('button');

  if (!targetDot) return;

  const currentSlide = track.querySelector('.current-slide');
  const currentDot = dotsNav.querySelector('.current-slide');
  const targetIndex = dots.findIndex(dot => dot === targetDot);
  const targetSlide = slides[targetIndex];

  moveToSlide(track, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
  hideShowArrows(slides, prevButton, nextButton, targetIndex);
}) */

/* ----------------------------------------------- */

/* [Table of content] */

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

/* ----------------------------------------------- */

/* [Share buttons] */

const whatsapp = document.querySelector('.whatsapp');
const twitter = document.querySelector('.twitter');

const pageUrl = location.href;
const message2 = 'Read this, it only takes a few minutes';

const whatsappApi = `https://wa.me/?text=${pageUrl}. ${message2}`;
const twitterApi = `https://twitter.com/intent/tweet?text=${pageUrl}. ${message2}`;

whatsapp.addEventListener('click', () => {
  window.open(url = whatsappApi, target='blank')
});

twitter.addEventListener('click', () => {
  window.open(url = twitterApi, target='blank')
});