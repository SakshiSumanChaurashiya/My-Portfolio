
/* ==============================
   1. MOBILE NAVIGATION
================================ */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");

      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  document.addEventListener("click", (event) => {
    if (
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      navLinks.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");

      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

/* ==============================
   2. TYPING ANIMATION
================================ */

const typingText = document.getElementById("typing-text");

const roles = [
  "BCA Student",
  "Frontend Developer",
  "Aspiring Full-Stack Developer",
  "Web Development Learner"
];

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (typingText) {
  if (reduceMotion) {
    typingText.textContent = "Aspiring Full-Stack Developer";
  } else {
    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeRole() {
      const currentRole = roles[roleIndex];

      if (deleting) {
        characterIndex--;
      } else {
        characterIndex++;
      }

      typingText.textContent = currentRole.slice(0, characterIndex);

      let delay = deleting ? 45 : 85;

      if (!deleting && characterIndex === currentRole.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }

      window.setTimeout(typeRole, delay);
    }

    typeRole();
  }
}

/* ==============================
   3. AUTOMATIC FOOTER YEAR
================================ */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* ==============================
   4. SCROLL REVEAL ANIMATION
================================ */

const revealElements = document.querySelectorAll(
  ".section-heading, .about-card, .skill-card, .project-card, .resume-card, .contact-card"
);

if ("IntersectionObserver" in window && !reduceMotion) {
  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* ==============================
   5. ACTIVE NAVIGATION LINK
================================ */

const pageSections = document.querySelectorAll(
  "main section[id]"
);

const navigationLinks = document.querySelectorAll(
  ".nav-links a"
);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navigationLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: 0
    }
  );

  pageSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* ==============================
   6. WORKING CONTACT FORM
================================ */

// IMPORTANT:
// Replace this with your actual BACKEND Render URL.
// Do not use your frontend Static Site URL here.

const API_URL = "https://YOUR-BACKEND-NAME.onrender.com/api/contact";

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document
      .getElementById("visitor-name")
      .value.trim();

    const email = document
      .getElementById("visitor-email")
      .value.trim();

    const message = document
      .getElementById("visitor-message")
      .value.trim();

    const formNote = document.querySelector(".form-note");
    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );

    if (!formNote || !submitButton) {
      console.error("Contact form message or submit button is missing.");
      return;
    }

    if (!name || !email || !message) {
      formNote.textContent = "Please fill in all fields.";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      formNote.textContent = "Please enter a valid email address.";
      return;
    }

    try {
      submitButton.disabled = true;

      submitButton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      formNote.textContent = "Sending your message...";

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Email could not be sent."
        );
      }

      if (result.success) {
        formNote.textContent =
          "Your message was sent successfully!";

        contactForm.reset();
      } else {
        throw new Error(
          result.message || "Email could not be sent."
        );
      }

    } catch (error) {
      console.error("Contact form error:", error);

      formNote.textContent =
        error.message || "Something went wrong. Please try again.";

    } finally {
      submitButton.disabled = false;

      submitButton.innerHTML =
        '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
  });
}
