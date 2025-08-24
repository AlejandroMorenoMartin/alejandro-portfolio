document.addEventListener("DOMContentLoaded", () => {
  /* ================================
      MULTI-IDIOMA / TABLE OF CONTENT
  ================================= */
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
      BANNER (solo en index)
  ================================= */
  const banner = document.querySelector(".banner");
  const nav = document.querySelector(".navContainer");
  const toc = document.querySelector("#tableOfContents");

  if (
    banner &&
    window.location.pathname.includes("index.html") &&
    !sessionStorage.getItem("bannerClosed")
  ) {
    // Esperamos al render completo
    requestAnimationFrame(() => {
      const bannerHeight = banner.offsetHeight;
      const extraSpace = 0; // opcional

      nav.style.top = `${bannerHeight + extraSpace}px`;
      if (toc) toc.style.marginTop = `${bannerHeight + extraSpace}px`;
    });

    // Botón cerrar
    const closeBtn = banner.querySelector(".fa-x");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeBanner());
    }

    // Botón CTA (tarifas)
    const tarifaBtn = banner.querySelector(".buttonBanner");
    if (tarifaBtn) {
      tarifaBtn.addEventListener("click", () => closeBanner());
    }

    function closeBanner() {
      banner.classList.add("hidden");
      sessionStorage.setItem("bannerClosed", "true");

      setTimeout(() => {
        banner.style.display = "none";

        // Volvemos a posiciones originales
        nav.style.top = "0px";
        if (toc) toc.style.marginTop = "0px";
      }, 200);
    }
  } else {
    // Si no hay banner o ya fue cerrado
    nav.style.top = "0px";
    if (toc) toc.style.marginTop = "0px";
    if (banner) banner.style.display = "none";
  }
});

/* ================================
    BUTTON PANNEL (scroll control)
  ================================= */
/* ================================
  BUTTON PANNEL (scroll control)
================================= */
document.addEventListener("DOMContentLoaded", () => {
  const buttonPannel = document.querySelector(".buttonPannel");
  const mainSections = document.querySelectorAll(
    ".mainContainerSections section"
  );

  if (buttonPannel && mainSections.length > 2) {
    const firstSection = mainSections[0];
    const lastSection = mainSections[mainSections.length - 1];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Hide the button panel if the first section is in view
          if (entry.target === firstSection && entry.isIntersecting) {
            buttonPannel.classList.remove("visible");
          }
          // Show the button panel if the first section is out of view
          if (entry.target === firstSection && !entry.isIntersecting) {
            buttonPannel.classList.add("visible");
          }
          // Hide the button panel if the last section is in view
          if (entry.target === lastSection && entry.isIntersecting) {
            buttonPannel.classList.remove("visible");
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(firstSection);
    observer.observe(lastSection);
  }
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
