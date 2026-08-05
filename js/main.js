/* =========================================================
   LOUD FIT ANCHIETA — LANDING PAGE
   main.js
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     CONFIG — EDITE AQUI as informações reais da unidade
     ======================================================= */
  const CONFIG = {
    // Número do WhatsApp com DDI 55 + DDD + número, sem espaços ou símbolos.
    whatsappNumber: "5511900000000", // EDITAR: número real da unidade
    defaultMessage:
      "Olá! Vi o site da Loud Fit Anchieta e gostaria de conhecer os planos e agendar uma aula experimental.",
    instagramUrl: "https://instagram.com/loudfit.anchieta", // EDITAR
    mapsDirectionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Loud+Fit+Anchieta", // EDITAR com endereço real
    googleReviewsUrl: "https://www.google.com/search?q=Loud+Fit+Anchieta+avalia%C3%A7%C3%B5es", // EDITAR
    phoneDisplay: "[Inserir telefone]" // EDITAR
  };

  function waLink(message) {
    const msg = message || CONFIG.defaultMessage;
    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
  }

  /* =======================================================
     DATA LAYER / TRACKING
     ======================================================= */
  window.dataLayer = window.dataLayer || [];

  function trackEvent(eventName, params) {
    const payload = Object.assign({ event: eventName }, params || {});
    window.dataLayer.push(payload);
    if (window.gtag) {
      window.gtag("event", eventName, params || {});
    }
    if (window.fbq) {
      window.fbq("trackCustom", eventName, params || {});
    }
    // console.debug("[track]", payload);
  }

  document.addEventListener("click", function (e) {
    const el = e.target.closest("[data-track]");
    if (!el) return;
    trackEvent(el.getAttribute("data-track"), {
      label: el.textContent.trim().slice(0, 60),
      plan: el.getAttribute("data-plan") || undefined
    });
  });

  // Fire "view" events once when elements enter the viewport
  const viewTargets = document.querySelectorAll("[data-track-view]");
  if (viewTargets.length && "IntersectionObserver" in window) {
    const viewObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent(entry.target.getAttribute("data-track-view"));
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    viewTargets.forEach((t) => viewObserver.observe(t));
  }

  // Scroll depth tracking (25/50/75/100)
  (function scrollDepthTracking() {
    const thresholds = [25, 50, 75, 100];
    const fired = new Set();
    let ticking = false;

    function checkDepth() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      thresholds.forEach((t) => {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll_depth", { percent: t });
        }
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(checkDepth);
          ticking = true;
        }
      },
      { passive: true }
    );
  })();

  /* =======================================================
     WIRE UP WHATSAPP / INSTAGRAM / MAPS LINKS
     ======================================================= */
  function wireExternalLinks() {
    // Generic WhatsApp elements (default message)
    document.querySelectorAll("#whatsappFloat, #mobileWhatsapp, #finalWhatsapp, #footerWhatsapp, #infoWhatsapp").forEach((el) => {
      el.setAttribute("href", waLink(CONFIG.defaultMessage));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    // Elements carrying a custom pre-filled message (plans, consultor CTA)
    document.querySelectorAll("[data-wa-msg]").forEach((el) => {
      el.setAttribute("href", waLink(el.getAttribute("data-wa-msg")));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    // Instagram
    document.querySelectorAll("#infoInstagram, #footerInstagram").forEach((el) => {
      el.setAttribute("href", CONFIG.instagramUrl);
    });

    // Google Maps directions
    document.querySelectorAll("#routeBtn, #footerRoute").forEach((el) => {
      el.setAttribute("href", CONFIG.mapsDirectionsUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    // Google reviews
    const reviewsLink = document.getElementById("googleReviewsLink");
    if (reviewsLink) reviewsLink.setAttribute("href", CONFIG.googleReviewsUrl);

    // Phone display
    const infoPhone = document.getElementById("infoPhone");
    if (infoPhone && CONFIG.phoneDisplay) infoPhone.textContent = CONFIG.phoneDisplay;
  }
  wireExternalLinks();

  /* =======================================================
     AUTOPLAY DO VÍDEO PRINCIPAL (HERO) COM FALLBACK
     ======================================================= */
  const autoplayVideos = document.querySelectorAll("video[autoplay]");
  autoplayVideos.forEach((video) => {
    const playback = video.play();
    if (playback !== undefined) {
      playback.catch(() => {
        const startPlayback = () => {
          video.play().catch(() => {});
          document.removeEventListener("touchstart", startPlayback);
          document.removeEventListener("click", startPlayback);
        };
        document.addEventListener("touchstart", startPlayback, { once: true });
        document.addEventListener("click", startPlayback, { once: true });
      });
    }
  });

  /* =======================================================
     VÍDEOS SECUNDÁRIOS (lazy load + play/pause por viewport)
     ======================================================= */
  const secondaryVideos = document.querySelectorAll("video[data-lazy-video]");
  if (secondaryVideos.length && "IntersectionObserver" in window) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (!video.dataset.loaded) {
              const sources = video.querySelectorAll("source[data-src]");
              sources.forEach((source) => {
                source.src = source.dataset.src;
              });
              video.load();
              video.dataset.loaded = "true";
            }
            if (!prefersReducedMotion) {
              video.play().catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "300px 0px", threshold: 0.1 }
    );

    secondaryVideos.forEach((video) => videoObserver.observe(video));
  }

  /* =======================================================
     HEADER: fundo ao rolar
     ======================================================= */
  const header = document.getElementById("siteHeader");
  function updateHeaderState() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* =======================================================
     MENU MOBILE
     ======================================================= */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const scrim = document.createElement("div");
  scrim.className = "menu-scrim";
  document.body.appendChild(scrim);

  function openMenu() {
    mobileMenu.classList.add("open");
    scrim.classList.add("open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobileMenu.classList.remove("open");
    scrim.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });
  scrim.addEventListener("click", closeMenu);
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* =======================================================
     SCROLL REVEAL
     ======================================================= */
  const revealTargets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((t) => revealObserver.observe(t));
  } else {
    revealTargets.forEach((t) => t.classList.add("in-view"));
  }

  /* =======================================================
     FAQ ACCORDION
     ======================================================= */
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".accordion-trigger").forEach((otherTrigger) => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute("aria-expanded", "false");
          otherTrigger.nextElementSibling.style.maxHeight = null;
        }
      });

      if (isOpen) {
        trigger.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      } else {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* =======================================================
     FORMULÁRIO DE AULA EXPERIMENTAL -> WHATSAPP
     ======================================================= */
  const trialForm = document.getElementById("trialForm");
  const formFeedback = document.getElementById("formFeedback");

  if (trialForm) {
    trialForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = trialForm.nome.value.trim();
      const telefone = trialForm.telefone.value.trim();

      if (!nome || !telefone) {
        formFeedback.textContent = "Preencha nome e telefone para continuar.";
        formFeedback.style.color = "#ff6b6b";
        return;
      }

      const objetivo = trialForm.objetivo.value;
      const plano = trialForm.plano.value;
      const horario = trialForm.horario.value.trim();
      const mensagem = trialForm.mensagem.value.trim();

      let text = "Olá! Gostaria de agendar uma aula experimental na Loud Fit Anchieta.\n";
      text += "Nome: " + nome + "\n";
      text += "Telefone: " + telefone + "\n";
      if (objetivo) text += "Objetivo: " + objetivo + "\n";
      if (plano) text += "Plano de interesse: " + plano + "\n";
      if (horario) text += "Melhor horário: " + horario + "\n";
      if (mensagem) text += "Mensagem: " + mensagem;

      trackEvent("submit_lead", { objetivo: objetivo, plano: plano });

      formFeedback.style.color = "var(--yellow)";
      formFeedback.textContent = "Perfeito! Vamos te chamar no WhatsApp para confirmar o agendamento.";

      window.open(waLink(text), "_blank", "noopener");
      trialForm.reset();
    });
  }

  /* =======================================================
     RODAPÉ: ano atual
     ======================================================= */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
