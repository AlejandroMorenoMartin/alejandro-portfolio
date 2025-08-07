document.addEventListener("DOMContentLoaded", () => {
  const htmlElement = document.documentElement;
  const langButtons = document.querySelectorAll(".langButton");
  const activeLangClass = "active";
  let currentTranslations = {};

  async function loadTranslations(lang) {
    try {
      const response = await fetch(`./language/${lang}.json`);
      if (!response.ok) throw new Error("Error al cargar traducciones.");
      currentTranslations = await response.json();
    } catch (error) {
      console.error(`No se pudo cargar '${lang}':`, error);
      currentTranslations = {};
    }
  }

  function applyTranslations() {
    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.dataset.key;
      const text = currentTranslations[key];
      if (text !== undefined) {
        el.innerHTML = text;
      } else {
        console.warn(`Clave '${key}' no encontrada.`);
      }
    });
  }

  function generateTableOfContents() {
    const toc = document.getElementById("tableOfContents");
    if (!toc) return;

    const sections = document.querySelectorAll(".indexSection");
    const wrapper = document.createElement("div");
    const title = document.createElement("p");
    const list = document.createElement("ul");

    title.dataset.key = "tocTitle";
    title.classList.add("toc-title"); // para margen
    wrapper.appendChild(title);

    sections.forEach((section) => {
      const id = section.id;
      const titleElement = section.querySelector("h2");
      if (id && titleElement && titleElement.textContent.trim() !== "") {
        const text = titleElement.textContent.trim();
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${id}`;
        link.textContent = text;
        listItem.appendChild(link);
        list.appendChild(listItem);
      }
    });

    wrapper.appendChild(list);
    toc.innerHTML = "";
    toc.appendChild(wrapper);
    applyTranslations(); // volver a aplicar después de regenerar
    enableSmoothScrollForTOC();
    highlightTOCOnScroll();
  }

  async function setLanguage(lang) {
    localStorage.setItem("userLanguage", lang);
    htmlElement.setAttribute("lang", lang);
    await loadTranslations(lang);
    applyTranslations();
    generateTableOfContents();

    langButtons.forEach((btn) => {
      btn.classList.remove(activeLangClass);
      if (btn.dataset.lang === lang) btn.classList.add(activeLangClass);
    });

    console.log(`Idioma establecido: ${lang}`);
  }

  const savedLang = localStorage.getItem("userLanguage") || "es";
  setLanguage(savedLang);

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
    });
  });

  function enableSmoothScrollForTOC() {
    const offset = 96;
    const tocLinks = document.querySelectorAll("#tableOfContents a");

    tocLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const topPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          offset;

        window.scrollTo({
          top: topPosition,
          behavior: "smooth",
        });
      });
    });
  }

  function highlightTOCOnScroll() {
    const tocLinks = document.querySelectorAll("#tableOfContents a");
    const sections = document.querySelectorAll(".indexSection");
    const offset = 100;

    window.addEventListener("scroll", () => {
      let currentId = "";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          currentId = section.id;
        }
      });

      tocLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${currentId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    });
  }
});

/* salto de linea */
document
  .querySelector('a.button[href="#projects"]')
  .addEventListener("click", function (e) {
    e.preventDefault(); // Evita el salto automático
    const offset = 96; // altura del nacContainer
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    const topPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: topPosition,
      behavior: "smooth",
    });
  });

/* scroll to top */
document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.getElementById("scrollToTop");
  const progressCircle = document.getElementById("progressCircle");
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = circumference;
  progressCircle.style.strokeDashoffset = circumference;

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    let scrollPercent = (scrollTop / docHeight) * 100;

    // Forzar el 100% si estás muy cerca del final
    if (scrollPercent > 99.5) scrollPercent = 100;

    setProgress(scrollPercent);

    if (scrollPercent > 5) {
      scrollBtn.style.opacity = "1";
      scrollBtn.style.pointerEvents = "auto";
    } else {
      scrollBtn.style.opacity = "0";
      scrollBtn.style.pointerEvents = "none";
    }
  }

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateScrollProgress);

  updateScrollProgress();
});

/* tools */
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
  });
}

/* testimonySection */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".sliderTrack");
  const cards = document.querySelectorAll(".cardTestimony");
  const prevBtn = document.querySelectorAll(".sliderButton")[0];
  const nextBtn = document.querySelectorAll(".sliderButton")[1];
  const indicatorContainer = document.querySelector(".sliderIndicators");

  let currentIndex = 0;

  // Ajustar el ancho de las cards para ocupar todo el frame
  const updateCardWidths = () => {
    const containerWidth =
      document.querySelector(".indexSectionFrame").offsetWidth;
    cards.forEach((card) => {
      card.style.minWidth = `${containerWidth}px`;
    });
  };

  // Crear indicadores
  const createIndicators = () => {
    indicatorContainer.innerHTML = "";
    cards.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("sliderDot");
      if (index === currentIndex) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
      });
      indicatorContainer.appendChild(dot);
    });
  };

  const updateIndicators = () => {
    const dots = document.querySelectorAll(".sliderDot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  };

  // Ocultar/mostrar cards según el índice
  const updateCardVisibility = () => {
    cards.forEach((card, i) => {
      if (i === currentIndex) {
        card.classList.add("showing");
        card.classList.remove("hiddenUntilActive");
      } else {
        card.classList.remove("showing");
        card.classList.add("hiddenUntilActive");
      }
    });
  };

  // Aplicar clase 'disabled' a los botones si corresponde
  const updateButtonVisibility = () => {
    prevBtn.classList.toggle("disabled", currentIndex === 0);
    nextBtn.classList.toggle("disabled", currentIndex === cards.length - 1);
  };

  // Mover el slider
  const updateSlider = () => {
    const width = cards[0].offsetWidth;
    track.style.transform = `translateX(-${currentIndex * width}px)`;
    updateIndicators();
    updateCardVisibility();
    updateButtonVisibility();
  };

  // Botones
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  // Inicializar
  updateCardWidths();
  createIndicators();
  updateSlider();

  // Recalcular en resize
  window.addEventListener("resize", () => {
    updateCardWidths();
    updateSlider();
  });
});

/* h2 efecto */
document.addEventListener("DOMContentLoaded", () => {
  const titles = document.querySelectorAll("h2");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target;

        if (entry.isIntersecting) {
          target.classList.add("visible");
          target.classList.remove("hidden");
        } else {
          target.classList.remove("visible");
          target.classList.add("hidden");
        }
      });
    },
    {
      root: null,
      threshold: 1,
    }
  );

  titles.forEach((title) => observer.observe(title));
});

/* efecto hero */
document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.querySelector(".heroSectionText");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heroSection.classList.add("heroAnimate");
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(heroSection);
});

/* pageLoader */
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("pageLoader");

  const MIN_TIME = 1000;
  const start = performance.now();

  window.addEventListener("load", () => {
    const elapsed = performance.now() - start;
    const delay = Math.max(0, MIN_TIME - elapsed);

    setTimeout(() => {
      loader.classList.add("hidden");
    }, delay);
  });
});

/* navContainer */
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".navContainer");
  if (!nav) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY >= 64) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
});

