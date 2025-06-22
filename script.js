// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
// Update the contactForm selection to use the new ID
const contactForm = document.getElementById("contactForm")
const formMessage = document.getElementById("form-message")
const submitBtn = document.getElementById("submit-btn")

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i")
  if (theme === "dark") {
    icon.className = "fas fa-sun"
  } else {
    icon.className = "fas fa-moon"
  }
}

// Mobile Navigation
function toggleMobileMenu() {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
}

function closeMobileMenu() {
  hamburger.classList.remove("active")
  navMenu.classList.remove("active")
}

// Smooth Scrolling for Navigation Links
function handleNavClick(e) {
  const href = e.target.getAttribute("href")

  // Check if it's an anchor link on the same page
  if (href && href.startsWith("#")) {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 70 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }

    closeMobileMenu()
  } else if (href && !href.startsWith("http") && !href.includes(".html")) {
    // Handle links to sections on index page from contact page
    closeMobileMenu()
  }
}

// Active Navigation Link
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)

    if (navLink && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active"))
      navLink.classList.add("active")
    }
  })
}

// Contact Form Handling with Formspree
async function handleContactForm(e) {
  e.preventDefault()

  const submitBtn = document.getElementById("submitBtn")
  const formMessage = document.getElementById("form-message")

  // Show loading state
  submitBtn.textContent = "Sending..."
  submitBtn.disabled = true
  hideMessage()

  try {
    const formData = new FormData(contactForm)

    // Submit to Formspree
    const response = await fetch("https://formspree.io/f/mdkzlyan", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })

    if (response.ok) {
      showMessage("Thank you! Your message has been sent successfully. I'll get back to you soon.", "success")
      contactForm.reset()
    } else {
      throw new Error("Form submission failed")
    }
  } catch (error) {
    console.error("Error sending form:", error)
    showMessage("Sorry, there was an error sending your message. Please try again or contact me directly.", "error")
  } finally {
    // Reset button state
    submitBtn.textContent = "Send Message"
    submitBtn.disabled = false
  }
}

function showLoading(show) {
  const btnText = submitBtn.querySelector(".btn-text")
  const btnLoading = submitBtn.querySelector(".btn-loading")

  if (show) {
    btnText.style.display = "none"
    btnLoading.style.display = "inline-flex"
    submitBtn.disabled = true
  } else {
    btnText.style.display = "inline"
    btnLoading.style.display = "none"
    submitBtn.disabled = false
  }
}

function showMessage(message, type) {
  formMessage.textContent = message
  formMessage.className = `form-message ${type}`
  formMessage.style.display = "block"

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(hideMessage, 5000)
  }
}

function hideMessage() {
  formMessage.style.display = "none"
}

// Navbar Background on Scroll
function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      navbar.style.background = "rgba(17, 24, 39, 0.98)"
    }
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      navbar.style.background = "rgba(17, 24, 39, 0.95)"
    }
  }
}

// Intersection Observer for Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(".skill-category, .project-card, .testimonial-card")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Remove EmailJS initialization and replace with Web3Forms setup
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme
  initTheme()

  // Initialize scroll animations
  initScrollAnimations()

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }

  // Mobile menu
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu)
  }

  // Navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavClick)
  })

  // Contact form with Web3Forms
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // Scroll events
  window.addEventListener("scroll", () => {
    updateActiveNavLink()
    handleNavbarScroll()
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu()
    }
  })

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu()
    }
  })
})

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Smooth scroll polyfill for older browsers
if (!("scrollBehavior" in document.documentElement.style)) {
  const smoothScrollPolyfill = () => {
    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 70
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })
  }
  smoothScrollPolyfill()
}

// Performance optimization: Throttle scroll events
const throttledScroll = debounce(() => {
  updateActiveNavLink()
  handleNavbarScroll()
}, 10)

window.addEventListener("scroll", throttledScroll)
