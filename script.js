
"use strict";

/* =========================
   MOBILE NAVBAR
========================= */

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-label", "Toggle navigation");
    });
  });

  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-label", "Toggle navigation");
    }
  });
}

/* =========================
   FORMSPREE CONTACT FORM
========================= */

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );

    if (!submitButton) {
      console.error("Contact form submit button was not found.");
      return;
    }

    const submitText = submitButton.querySelector(".submit-text");
    const endpoint = contactForm.action;

    if (
      !endpoint.startsWith("https://formspree.io/f/") ||
      endpoint.includes("YOUR_FORM_ID")
    ) {
      formStatus.textContent =
        "Please configure your Formspree endpoint first.";
      formStatus.className = "form-status visible error";
      return;
    }

    formStatus.textContent = "";
    formStatus.className = "form-status";
    submitButton.disabled = true;

    if (submitText) {
      submitText.textContent = "Sending...";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        // The server may return a response without JSON.
      }

      if (!response.ok || result.ok === false) {
        const details = Array.isArray(result.errors)
          ? result.errors.map((item) => item.message).join(" ")
          : "";

        throw new Error(
          details || "Your message could not be sent. Please try again."
        );
      }

      formStatus.textContent =
        "Message submitted successfully! Thanks for reaching out.";
      formStatus.className = "form-status visible success";

      contactForm.reset();
    } catch (error) {
      console.error("Contact form submission failed:", error);

      formStatus.textContent =
        error.message ||
        "Network error. Check your connection and try again.";

      formStatus.className = "form-status visible error";
    } finally {
      submitButton.disabled = false;

      if (submitText) {
        submitText.textContent = "Send Message";
      }
    }
  });
}

/* =========================
   EMAIL POPUP
========================= */

const emailPopup = document.querySelector("#email-popup");
const openEmailButton = document.querySelector("#open-email-popup");
const closeEmailButton = document.querySelector("#close-email-popup");
const copyEmailButton = document.querySelector("#copy-email");
const emailAddress = document.querySelector("#popup-email-address");
const emailStatus = document.querySelector("#email-popup-status");

let previousFocus = null;

function openEmailPopup() {
  if (!emailPopup) return;

  previousFocus = document.activeElement;

  emailPopup.classList.add("show");
  emailPopup.setAttribute("aria-hidden", "false");
  document.body.classList.add("popup-open");

  if (closeEmailButton) {
    closeEmailButton.focus();
  }
}

function closeEmailPopup() {
  if (!emailPopup) return;

  emailPopup.classList.remove("show");
  emailPopup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("popup-open");

  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}

if (openEmailButton) {
  openEmailButton.addEventListener("click", openEmailPopup);
}

if (closeEmailButton) {
  closeEmailButton.addEventListener("click", closeEmailPopup);
}

if (emailPopup) {
  emailPopup.addEventListener("click", (event) => {
    if (event.target === emailPopup) {
      closeEmailPopup();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    emailPopup &&
    emailPopup.classList.contains("show")
  ) {
    closeEmailPopup();
  }
});

/* =========================
   COPY EMAIL ADDRESS
========================= */

if (copyEmailButton && emailAddress && emailStatus) {
  copyEmailButton.addEventListener("click", async () => {
    const email = emailAddress.textContent.trim();

    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(email);

      emailStatus.textContent = "Email copied to clipboard!";
      copyEmailButton.textContent = "Copied!";
    } catch {
      emailStatus.textContent =
        "Automatic copying isn't available. Select the email address and copy it manually.";

      copyEmailButton.textContent = "Try again";
    }
  });
}
