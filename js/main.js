(function () {
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("open", !open);
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("open");
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const service = String(data.get("service") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !service || !message) {
        if (status) {
          status.textContent = "Please complete every field.";
          status.className = "form-status err";
        }
        return;
      }

      const subject = encodeURIComponent(`Project inquiry — ${service}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`
      );

      if (status) {
        status.textContent = "Opening your email app…";
        status.className = "form-status ok";
      }

      window.location.href = `mailto:hello@trickit.co.uk?subject=${subject}&body=${body}`;
      form.reset();
    });
  }

  // Mark current nav item (works on GitHub Pages subpaths too)
  const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const current = file === "" || file === "trickit" ? "index.html" : file;
  document.querySelectorAll("[data-nav] a").forEach((link) => {
    const href = (link.getAttribute("href") || "").split("#")[0];
    const target = (href.split("/").pop() || "").toLowerCase();
    if (!target || target.startsWith("mailto:")) return;
    if (target === current || (current === "index.html" && (target === "index.html" || href === "./"))) {
      link.setAttribute("aria-current", "page");
    }
  });
})();
