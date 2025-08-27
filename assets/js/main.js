document.addEventListener("DOMContentLoaded", () => {
  /* ================================
      MULTI-IDIOMA / TABLE OF CONTENT
  ================================= */
  const htmlElement = document.documentElement;
  const langButton = document.querySelector(".langButton");
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

  async function setLanguage(lang) {
    localStorage.setItem("userLanguage", lang);
    htmlElement.setAttribute("lang", lang);
    await loadTranslations(lang);
    applyTranslations();
    generateTableOfContents();
    console.log(`Idioma establecido: ${lang}`);
  }

  // Detectar idioma inicial
  function detectInitialLanguage() {
    const savedLang = localStorage.getItem("userLanguage");
    if (savedLang) return savedLang;

    const browserLang = navigator.language || navigator.userLanguage || "es";
    return browserLang.startsWith("es") ? "es" : "en";
  }

  // Alternar idioma al pulsar el botón
  langButton.addEventListener("click", () => {
    const currentLang = htmlElement.getAttribute("lang") || "es";
    const newLang = currentLang === "es" ? "en" : "es";
    setLanguage(newLang);
  });

  // Inicialización
  const initialLang = detectInitialLanguage();
  setLanguage(initialLang);

  // Efecto scroll
  const nav = document.querySelector(".navContainer");
        if (!nav) return;

        const onScroll = () => {
          if (window.scrollY >= 64) {
            nav.classList.add("scrolled");
          } else {
            nav.classList.remove("scrolled");
          }
        };
        onScroll();
        window.addEventListener("scroll", onScroll);

  /* ================================
  BUTTON PROGRESS
  ================================= */
  const scrollBtn = document.getElementById("scrollToTop");
        const progressCircle = document.getElementById("progressCircle");

        if (!scrollBtn || !progressCircle) return;

        const radius = 48; //
        const circumference = 2 * Math.PI * radius;

        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference;

        function setProgress(percent) {
          const offset = circumference - (percent / 100) * circumference;
          progressCircle.style.strokeDashoffset = offset;
        }

        function updateScrollProgress() {
          const scrollTop =
            window.scrollY || document.documentElement.scrollTop;
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

          let scrollPercent = (scrollTop / docHeight) * 100;

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

        updateScrollProgress();

        window.addEventListener("scroll", updateScrollProgress);

  /* ================================
      TABLE OF CONTENT (sin cambios)
  ================================= */
  function generateTableOfContents() {
    const toc = document.getElementById("tableOfContents");
    if (!toc) return;

    const sections = document.querySelectorAll(".indexSection");
    const wrapper = document.createElement("div");
    const title = document.createElement("p");
    const list = document.createElement("ul");

    title.dataset.key = "tocTitle";
    title.classList.add("toc-title");
    wrapper.appendChild(title);

    sections.forEach((section) => {
      const id = section.id;
      const titleElement = section.querySelector("h2");
      if (id && titleElement && titleElement.textContent.trim() !== "") {
        const text = titleElement.textContent.trim().replace(/\.$/, "");
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
    applyTranslations();
    enableSmoothScrollForTOC();
    highlightTOCOnScroll();
  }

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

        window.scrollTo({ top: topPosition, behavior: "smooth" });
      });
    });
  }

  function highlightTOCOnScroll() {
    const tocLinks = document.querySelectorAll("#tableOfContents a");
    const sections = document.querySelectorAll(
      ".indexSection, .indexSubSection"
    );
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
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${currentId}`
        );
      });
    });
  }

  /* ================================
      SCROLL MANUAL BOTÓN
  ================================= */
  const projectsBtn = document.querySelector('a.button[href="#projects"]');
  const pricesBtn = document.querySelector('a.buttonSecondary[href="#prices"]');

  if (projectsBtn) {
    projectsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const offset = 104;
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      const topPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top: topPosition, behavior: "smooth" });
    });
  }

  if (pricesBtn) {
    pricesBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const offset = 104;
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      const topPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top: topPosition, behavior: "smooth" });
    });
  }

  /* ================================
      TESTIMONIOS SLIDER
  ================================= */
  const track = document.querySelector(".sliderTrack");
  const cards = document.querySelectorAll(".cardTestimony");
  const prevBtn = document.querySelectorAll(".sliderButton")[0];
  const nextBtn = document.querySelectorAll(".sliderButton")[1];
  const indicatorContainer = document.querySelector(".sliderIndicators");
  let currentIndex = 0;

  if (track && cards.length > 0) {
    const updateCardWidths = () => {
      const containerWidth =
        document.querySelector(".indexSectionFrame").offsetWidth;
      cards.forEach((card) => {
        card.style.minWidth = `${containerWidth}px`;
      });
    };

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
      document
        .querySelectorAll(".sliderDot")
        .forEach((dot, i) =>
          dot.classList.toggle("active", i === currentIndex)
        );
    };

    const updateCardVisibility = () => {
      cards.forEach((card, i) => {
        card.classList.toggle("showing", i === currentIndex);
        card.classList.toggle("hiddenUntilActive", i !== currentIndex);
      });
    };

    const updateButtonVisibility = () => {
      prevBtn.classList.toggle("disabled", currentIndex === 0);
      nextBtn.classList.toggle("disabled", currentIndex === cards.length - 1);
    };

    const updateSlider = () => {
      const width = cards[0].offsetWidth;
      track.style.transform = `translateX(-${currentIndex * width}px)`;
      updateIndicators();
      updateCardVisibility();
      updateButtonVisibility();
    };

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

    updateCardWidths();
    createIndicators();
    updateSlider();
    window.addEventListener("resize", () => {
      updateCardWidths();
      updateSlider();
    });
  }

  /* ================================
      EFECTOS VISUALES
  ================================= */
  const titles = document.querySelectorAll("h2");
  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
        entry.target.classList.toggle("hidden", !entry.isIntersecting);
      });
    },
    { threshold: 1 }
  );
  titles.forEach((title) => titleObserver.observe(title));

  const heroSection = document.querySelector(".heroSectionText");
  if (heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) heroSection.classList.add("heroAnimate");
        });
      },
      { threshold: 0.5 }
    );
    heroObserver.observe(heroSection);
  }

  /* ================================
  BUTTON PANNEL (scroll control)
  ================================= */
  const buttonPannel = document.querySelector(".buttonPannel");
  if (!buttonPannel) return;

  function toggleButtonPanel() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    const distanceFromBottom = docHeight - (scrollTop + windowHeight);

    if (scrollTop > 1000 && distanceFromBottom > 1000) {
      // Usuario a más de 2000px del top y a más de 2000px del bottom → mostrar
      buttonPannel.classList.add("visible");
    } else {
      // Usuario muy arriba o muy abajo → ocultar
      buttonPannel.classList.remove("visible");
    }
  }

  // Ejecutar en scroll y al cargar
  window.addEventListener("scroll", toggleButtonPanel);
  toggleButtonPanel();
});

/* ================================
    SCROLLER ANIMATION
================================= */
const scrollers = document.querySelectorAll(".scroller");
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", true);
    const scrollerInner = scroller.querySelector(".scroller__inner");
    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

/* ================================
    TEMA OSCURO/CLARO
================================= */
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const icon = themeToggle.querySelector("i");
  if (theme === "dark") {
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
  }
}

const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  setTheme(currentTheme === "light" ? "dark" : "light");
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

document.querySelectorAll(".cardFAQsFrame").forEach((frame) => {
  frame.addEventListener("click", () => {
    const card = frame.parentElement;
    card.classList.toggle("active");
  });
});
