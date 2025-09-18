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

  function detectInitialLanguage() {
    const savedLang = localStorage.getItem("userLanguage");
    if (savedLang) return savedLang;
    const browserLang = navigator.language || navigator.userLanguage || "es";
    return browserLang.startsWith("es") ? "es" : "en";
  }

  if (langButton) {
    langButton.addEventListener("click", () => {
      const currentLang = htmlElement.getAttribute("lang") || "es";
      const newLang = currentLang === "es" ? "en" : "es";
      setLanguage(newLang);
    });
  }

  const initialLang = detectInitialLanguage();
  setLanguage(initialLang);

  /* ================================
      COPY EMAIL BUTTON
  ================================= */
  const copyBtn = document.getElementById("copyEmail");
  const emailElement = document.getElementById("email");
  const toolTipText = copyBtn?.querySelector(".toolTipText p");
  const icon = copyBtn?.querySelector("i");

  if (copyBtn && emailElement && toolTipText && icon) {
    copyBtn.addEventListener("click", async () => {
      const email = emailElement.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        icon.classList.replace("fa-copy", "fa-check");
        toolTipText.dataset.key = "toolTipTextThirteen";
        applyTranslations();
        setTimeout(() => {
          icon.classList.replace("fa-check", "fa-copy");
          toolTipText.dataset.key = "toolTipTextTwelve";
          applyTranslations();
        }, 1000);
      } catch (err) {
        console.error("Error copiando al portapapeles:", err);
      }
    });
  } else {
    console.warn("Elementos para copiar email no encontrados");
  }

  /* ================================
      NAV EFFECT ON SCROLL
  ================================= */
  const nav = document.querySelector(".navContainer");
  if (nav) {
    const onScroll = () => {
      if (window.scrollY >= 64) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
  }

  /* ================================
      TABLE OF CONTENT
  ================================= */
  function generateTableOfContents() {
    const toc = document.getElementById("tableOfContents");
    if (!toc) return;

    const sections = document.querySelectorAll(
      ".sectionHeader, .sectionHeaderTwo"
    );
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

        // --- highlight temporal del h2 ---
        const h2 = targetElement.querySelector("h2");
        if (h2) {
          h2.classList.add("highlight");
          setTimeout(() => {
            h2.classList.remove("highlight");
          }, 2000); // Dura 2s
        }
      });
    });
  }

  function highlightTOCOnScroll() {
    const toc = document.getElementById("tableOfContents");
    if (!toc) return;

    const tocLinks = document.querySelectorAll("#tableOfContents a");
    const sections = document.querySelectorAll(
      ".sectionHeader, .sectionHeaderTwo"
    );
    const offset = 100;
    const showFromTop = 750;
    const hideFromBottom = 250;

    window.addEventListener("scroll", () => {
      let currentId = "";
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + windowHeight);

      if (scrollTop > showFromTop && distanceFromBottom > hideFromBottom) {
        toc.classList.add("visible");
      } else {
        toc.classList.remove("visible");
      }

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
      SCROLL MANUAL BOTONES
  ================================= */
  function smoothScrollTrigger(selector, offset = 104) {
    const btn = document.querySelector(selector);
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      const topPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: topPosition, behavior: "smooth" });
    });
  }

  smoothScrollTrigger('a.button[href="#projects"]');
  smoothScrollTrigger('a.buttonSecondary[href="#prices"]');

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
        document.querySelector(".sectionHeader").offsetWidth;
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
      BUTTON PANNEL 
  ================================= */
  function buttonPannelVisibility() {
    const variablePanel = document.querySelector(".buttonPannelVariable");
    if (!variablePanel) {
      console.warn("buttonPannelVariable no encontrado");
      return;
    }
    const showFromTop = 750;
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      variablePanel.classList.toggle("visible", scrollTop > showFromTop);
    });
  }
  buttonPannelVisibility();

  /* ================================
      BUTTON SCROLL TO TOP
  ================================= */
  function scrollToTopButton() {
    const button = document.getElementById("buttonBackToTop");
    if (!button) return;

    // Lógica para mostrar/ocultar el botón
    const showFromTop = 750;

    window.addEventListener("scroll", () => {
      if (window.scrollY > showFromTop) {
        button.classList.add("visible");
      } else {
        button.classList.remove("visible");
      }
    });

    // Lógica del clic del botón
    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  scrollToTopButton();

  /* ================================
      PROGRESS BAR
  ================================= */
  function scrollProgressBar() {
    const progressBar = document.getElementById("scrollProgressBar");
    if (!progressBar) {
      console.warn("scrollProgressBar no encontrado");
      return;
    }
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    });
  }
  scrollProgressBar();

  /* ================================
      FAQS
  ================================= */
  // Select all elements with the class 'cardFAQs'
  const cardsFaqs = document.querySelectorAll(".cardFAQs");

  // Loop through each card
  cardsFaqs.forEach((card) => {
    // Add a 'click' event listener to each card
    card.addEventListener("click", () => {
      // Toggle the 'active' class on the clicked card
      // This will show or hide the answer based on the CSS rules
      card.classList.toggle("active");
    });
  });
});

/* ================================
    SCROLLER ANIMATION (outside DOMContentLoaded)
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
    TEMA OSCURO/CLARO (outside DOMContentLoaded)
================================= */
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  // Si hay un tema guardado, lo aplicamos directamente
  setTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;

  if (prefersDark) {
    setTheme("dark");
  } else if (prefersLight) {
    setTheme("light");
  } else {
    // Si no hay preferencia → dark por defecto
    setTheme("dark");
  }
}

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

/* ================================
    EFECTO TÍTULO DE PÁGINA (outside DOMContentLoaded)
================================= */
function showTitleOnScroll() {
  const title = document.querySelector(".navContainer .regularBold");
  if (!title) return;

  const showFromTop = 750;

  window.addEventListener("scroll", () => {
    if (window.scrollY > showFromTop) {
      title.classList.add("visible");
    } else {
      title.classList.remove("visible");
    }
  });
}

showTitleOnScroll();

/* ================================
    CHAT STATE
================================= */
document.addEventListener('DOMContentLoaded', () => {
    const chatStatusSpan = document.querySelector('.chatContainer span');
    const chatStatusText = document.querySelector('[data-key="chatContainerText"]');
    const chatButtonLink = document.querySelector('.chatButton');
    const chatButtonText = document.querySelector('[data-key="chatContainerButton"]');

    const now = new Date();
    const currentHour = now.getHours();

    // Comprueba si la hora está entre las 6:00 y las 18:00
    if (currentHour >= 6 && currentHour < 18) {
        // Horario diurno: Conectado
        chatStatusSpan.style.backgroundColor = 'var(--green)';
        chatStatusText.textContent = 'Connected';
        chatButtonLink.href = 'https://wa.me/34618110583';
        chatButtonText.textContent = 'Chat';
    } else {
        // Horario nocturno: Desconectado
        chatStatusSpan.style.backgroundColor = 'var(--red)';
        chatStatusText.textContent = 'Disconnected';
        chatButtonLink.href = 'mailto:alejandromorenomartin1990@gmail.com';
        chatButtonText.textContent = 'Email';
        // Quita la animación de "pulse" en modo desconectado
        chatStatusSpan.style.animation = 'none';
        chatStatusSpan.style.opacity = '1'; 
    }
});