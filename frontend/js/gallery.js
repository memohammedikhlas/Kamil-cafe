document.addEventListener("DOMContentLoaded", loadGallery);

const FALLBACK_IMAGES = [
  { src: "assets/images/gallery-1.jpg", caption: "Window Bar" },
  { src: "assets/images/gallery-2.jpg", caption: "Espresso Station" },
  { src: "assets/images/gallery-3.jpg", caption: "Lounge Corner" },
  { src: "assets/images/gallery-4.jpg", caption: "Pastry Case" },
  { src: "assets/images/gallery-5.jpg", caption: "Evening Ambience" },
  { src: "assets/images/gallery-6.jpg", caption: "Reading Nook" },
  { src: "assets/images/gallery-7.jpg", caption: "Outdoor Seating" },
  { src: "assets/images/gallery-8.jpg", caption: "Entrance" },
];

async function loadGallery() {
  const loading = document.getElementById("galleryLoading");
  const grid = document.getElementById("galleryGrid");

  let images = FALLBACK_IMAGES;

  try {
    const res = await fetch(`${API_BASE_URL}/gallery`);
    if (res.ok) {
      const data = await res.json();
      if (data.length) {
        images = data.map((img) => ({
          src: `${UPLOADS_BASE_URL}/${img.filename}`,
          caption: img.caption || "Kamil Cafe",
        }));
      }
    }
  } catch (err) {
    console.warn("Gallery API not reachable, showing placeholder photos.", err);
  }

  loading.style.display = "none";
  grid.innerHTML = images
    .map((img) => `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.caption)}" data-caption="${escapeHtml(img.caption)}">`)
    .join("");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  grid.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.dataset.caption;
      lightbox.classList.add("open");
    });
  });

  document.getElementById("lightboxClose").addEventListener("click", () => {
    lightbox.classList.remove("open");
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("open");
  });
}
