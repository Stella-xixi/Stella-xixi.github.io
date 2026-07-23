document.getElementById("year").textContent = new Date().getFullYear();

const clock = document.getElementById("local-time");
const updateClock = () => {
  clock.textContent = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", hour12: false
  }).format(new Date());
};
updateClock();
setInterval(updateClock, 30000);

const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min((index % 4) * 55, 165)}ms`;
    observer.observe(item);
  });
} else {
  items.forEach(item => item.classList.add("visible"));
}

const sectionNavLinks = [...document.querySelectorAll('.topbar nav a[href^="#"]')];
const sectionNavItems = sectionNavLinks
  .map(link => {
    const id = link.getAttribute("href").slice(1);
    return { id, link, section: document.getElementById(id) };
  })
  .filter(item => item.id && item.section);

let navTicking = false;
let activeSectionId = "";

const setActiveSection = id => {
  sectionNavItems.forEach(item => {
    const isCurrent = item.id === id;
    item.link.classList.toggle("active", isCurrent);
    if (isCurrent) {
      item.link.setAttribute("aria-current", "location");
    } else {
      item.link.removeAttribute("aria-current");
    }
  });

  if (id !== activeSectionId) {
    const activeItem = sectionNavItems.find(item => item.id === id);
    if (window.innerWidth <= 680) {
      activeItem?.link.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
    activeSectionId = id;
  }
};

const updateActiveNav = () => {
  if (!sectionNavItems.length) return;

  const topbarHeight = document.querySelector(".topbar")?.offsetHeight || 0;
  const activationLine = topbarHeight + Math.min(window.innerHeight * 0.24, 220);
  let currentId = sectionNavItems[0].id;

  sectionNavItems.forEach(item => {
    if (item.section.getBoundingClientRect().top <= activationLine) {
      currentId = item.id;
    }
  });

  const pageBottom = window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 2;
  if (pageBottom) {
    currentId = sectionNavItems[sectionNavItems.length - 1].id;
  }

  setActiveSection(currentId);
  navTicking = false;
};

const requestNavUpdate = () => {
  if (navTicking) return;
  navTicking = true;
  window.requestAnimationFrame(updateActiveNav);
};

window.addEventListener("scroll", requestNavUpdate, { passive: true });
window.addEventListener("resize", requestNavUpdate);
window.addEventListener("load", requestNavUpdate);

sectionNavLinks.forEach(link => {
  link.addEventListener("click", () => {
    setActiveSection(link.getAttribute("href").slice(1));
  });
});

updateActiveNav();
