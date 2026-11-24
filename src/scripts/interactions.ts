import { product, formatPrice } from "../data/product";
import { buildOrderUrl } from "../lib/order";

// Browser behavior stays in plain TypeScript; no UI framework is needed.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Stagger groups independently so large sections don't appear all at once.
document
  .querySelectorAll<HTMLElement>("[data-reveal-stagger]")
  .forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      if (!(child instanceof HTMLElement)) return;
      child.dataset.reveal ||= "up";
      child.style.setProperty(
        "--reveal-delay",
        `${Math.min(index, 3) * 100}ms`,
      );
    });
  });

// Reveal once, shortly after each element enters the viewport.
if (!reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -45px 0px" },
  );
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    if (element.getBoundingClientRect().bottom <= 0)
      element.classList.add("is-visible");
    else observer.observe(element);
  });
  document.documentElement.classList.add("motion-ready");
} else {
  document
    .querySelectorAll("[data-reveal]")
    .forEach((element) => element.classList.add("is-visible"));
}
reducedMotion.addEventListener("change", (event) => {
  if (event.matches)
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => element.classList.add("is-visible"));
  document.documentElement.classList.toggle("motion-ready", !event.matches);
});

const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const menu = document.querySelector<HTMLElement>(".mobile-menu");
function setMenu(open: boolean) {
  if (!menu || !menuToggle) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
  menu.classList.toggle("is-open", open);
  menu.inert = !open;
  document
    .querySelector(".site-header")
    ?.classList.toggle("menu-is-open", open);
}
menuToggle?.addEventListener("click", () =>
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
);
menu
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle?.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    menuToggle.focus();
  }
});
window.matchMedia("(min-width: 701px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

document
  .querySelectorAll<HTMLButtonElement>(".service-toggle")
  .forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const shouldOpen = toggle.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll<HTMLElement>(".service").forEach((service) => {
        const button =
          service.querySelector<HTMLButtonElement>(".service-toggle")!;
        const panel = service.querySelector<HTMLElement>(".service-panel")!;
        const open = button === toggle && shouldOpen;
        service.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
        panel.inert = !open;
      });
    });
  });

document
  .querySelectorAll<HTMLInputElement>(".comparison-range")
  .forEach((range) => {
    range.addEventListener("input", () => {
      range
        .closest<HTMLElement>(".comparison")
        ?.style.setProperty("--position", `${range.value}%`);
      range.setAttribute("aria-valuetext", `${range.value} بالمئة قبل العناية`);
    });
  });

const slides = Array.from(
  document.querySelectorAll<HTMLElement>(".testimonial-slide"),
);
let slideIndex = 0;
function changeSlide(direction: number) {
  slideIndex = Math.max(0, Math.min(slides.length - 1, slideIndex + direction));
  slides.forEach((slide, index) => {
    const active = index === slideIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
    slide.inert = !active;
  });
  const progress = document.querySelector<HTMLElement>(
    ".carousel-progress span",
  );
  if (progress) progress.style.transform = `translateY(${slideIndex * 100}%)`;
  const previous = document.querySelector<HTMLButtonElement>(".previous");
  const next = document.querySelector<HTMLButtonElement>(".next");
  if (previous) previous.disabled = slideIndex === 0;
  if (next) next.disabled = slideIndex === slides.length - 1;
}
document
  .querySelector(".next")
  ?.addEventListener("click", () => changeSlide(1));
document
  .querySelector(".previous")
  ?.addEventListener("click", () => changeSlide(-1));
let touchStart = 0;
const carousel = document.querySelector<HTMLElement>(".testimonial-carousel");
carousel?.addEventListener(
  "touchstart",
  (event) => {
    touchStart = event.changedTouches[0].screenX;
  },
  { passive: true },
);
carousel?.addEventListener(
  "touchend",
  (event) => {
    const difference = touchStart - event.changedTouches[0].screenX;
    if (Math.abs(difference) > 50) changeSlide(difference > 0 ? 1 : -1);
  },
  { passive: true },
);

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      const target = Number(element.dataset.count);
      if (!reducedMotion.matches) {
        const start = performance.now();
        const from = Math.max(0, target - 2);
        function tick(now: number) {
          const progress = Math.min((now - start) / 1200, 1);
          element.textContent = String(
            Math.round(from + (target - from) * (1 - (1 - progress) ** 3)),
          );
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
      countObserver.unobserve(element);
    });
  },
  { threshold: 1 },
);
document
  .querySelectorAll("[data-count]")
  .forEach((element) => countObserver.observe(element));

const heroProduct = document.querySelector<HTMLElement>("[data-parallax]");
let frameRequested = false;
function updateParallax() {
  frameRequested = false;
  if (heroProduct && !reducedMotion.matches && window.scrollY < 1100) {
    heroProduct.style.transform = `translateY(${window.scrollY * 0.12}px) rotate(${Math.min(window.scrollY * 0.004, 3)}deg)`;
  }
}
window.addEventListener(
  "scroll",
  () => {
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(updateParallax);
    }
  },
  { passive: true },
);

const video = document.querySelector<HTMLVideoElement>(".video-banner video");
const videoControl =
  document.querySelector<HTMLButtonElement>(".video-control");
let videoPausedByUser = false;
function updateVideoButton() {
  if (!video || !videoControl) return;
  videoControl.textContent = video.paused ? "تشغيل الفيديو" : "إيقاف الفيديو";
  videoControl.setAttribute("aria-label", videoControl.textContent);
}
if (video) {
  video.muted = true;
  new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        !reducedMotion.matches &&
        !videoPausedByUser
      )
        video.play().catch(() => {});
      else video.pause();
    },
    { threshold: 0.1 },
  ).observe(video);
  video.addEventListener("play", updateVideoButton);
  video.addEventListener("pause", updateVideoButton);
  videoControl?.addEventListener("click", () => {
    videoPausedByUser = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
}

const searchDialog =
  document.querySelector<HTMLDialogElement>(".search-dialog");
const searchInput = document.querySelector<HTMLInputElement>("#site-search");
const results = document.querySelector<HTMLElement>(".search-results");
const searchEntries = [
  { label: "من نحن — هنا يزهر جمال بشرتك", href: "#about" },
  {
    label: "خدماتنا — ترطيب عميق وتجديد البشرة وعناية للإشراقة وتنقية الوجه",
    href: "#services",
  },
  { label: "النتائج — قبل وبعد العناية", href: "#result" },
  { label: "آراء العميلات — تجارب حقيقية", href: "#testimonials" },
  { label: "طلب الشراء — تواصلي معنا ومعلومات التوصيل", href: "#contact" },
];
function renderResults() {
  if (!results) return;
  results.replaceChildren();
  const query = searchInput?.value.trim().toLocaleLowerCase() || "";
  const matches = searchEntries.filter((item) =>
    item.label.toLocaleLowerCase().includes(query),
  );
  matches.forEach((item) => {
    const link = document.createElement("a");
    link.textContent = item.label;
    link.href = item.href;
    link.addEventListener("click", () => searchDialog?.close());
    results.append(link);
  });
  if (!matches.length) results.textContent = "ما لقيناش نتائج. جرّبي كلمة أخرى.";
}
document.querySelector(".search-toggle")?.addEventListener("click", () => {
  setMenu(false);
  renderResults();
  searchDialog?.showModal();
  searchInput?.focus();
});
searchInput?.addEventListener("input", renderResults);
document
  .querySelector(".dialog-close")
  ?.addEventListener("click", () => searchDialog?.close());
searchDialog?.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      searchDialog.close();
    }
  },
  { capture: true },
);
searchDialog?.addEventListener("click", (event) => {
  if (event.target === searchDialog) {
    const rect = searchDialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      searchDialog.close();
  }
});

// This static template has no mailing-list provider: never imply an email was sent.
document
  .querySelector<HTMLFormElement>("#newsletter")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector<HTMLElement>(".newsletter-status");
    if (status)
      status.textContent =
        "الاشتراك غير مفعّل بعد. سيتم تفعيله عند ربط خدمة البريد.";
  });

// The customer reviews and sends the message in WhatsApp; no data is stored here.
const purchaseForm = document.querySelector<HTMLFormElement>("#purchase-form");
const quantityInput =
  document.querySelector<HTMLInputElement>("#order-quantity");
quantityInput?.addEventListener("input", () => {
  const preview = document.querySelector("#quantity-preview");
  const quantity = Number(quantityInput.value);
  const valid = Number.isInteger(quantity) && quantity >= 1 && quantity <= 20;
  if (preview) preview.textContent = valid ? String(quantity) : "—";
  const total = document.querySelector("#order-total");
  if (total)
    total.textContent = valid ? formatPrice(quantity * product.unitPrice) : "—";
});
purchaseForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!purchaseForm.reportValidity()) return;
  const data = new FormData(purchaseForm);
  const value = (name: string) => String(data.get(name) || "").trim();
  const url = buildOrderUrl({
    quantity: Number(value("quantity")),
    fullName: value("fullName"),
    phone: value("phone"),
    city: value("city"),
    address: value("address"),
    notes: value("notes"),
  });
  const feedback = document.querySelector<HTMLElement>(".order-feedback");
  const link = document.querySelector<HTMLAnchorElement>(
    "#whatsapp-order-link",
  );
  if (link) link.href = url;
  if (feedback) {
    feedback.hidden = false;
    feedback.querySelector("[role=status]")!.textContent =
      "راجعي معلوماتك فـ WhatsApp واضغطي «إرسال» باش يوصلنا الطلب. إلا ما تفتحاتش الرسالة، استعملي الرابط اللي تحت.";
  }
  window.open(url, "_blank", "noopener,noreferrer");
});
