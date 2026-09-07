document.addEventListener("DOMContentLoaded", loadHero);

async function loadHero() {
  const stack = document.getElementById("heroPhotoStack");
  if (!stack) return;

  try {
    const res = await fetch(`${API_BASE_URL}/hero-slides`);
    const slides = res.ok ? await res.json() : [];

    if (!slides.length) {
      stack.innerHTML = `<div class="hero-photo-layer active" style="display:flex; align-items:center; justify-content:center; background:linear-gradient(150deg,#2A2119,#1D1712);">
        <span style="font-family:'Karla',sans-serif; color:var(--taupe); font-size:0.85rem; text-align:center; padding:24px;">
          Add a hero photo from the Admin panel
        </span>
      </div>`;
      return;
    }

    stack.innerHTML = slides
      .map(
        (s, i) =>
          `<div class="hero-photo-layer${i === 0 ? " active" : ""}" style="background-image:url('${UPLOADS_BASE_URL}/${s.filename}')"></div>`
      )
      .join("");

    if (slides.length > 1) {
      let current = 0;
      const layers = stack.querySelectorAll(".hero-photo-layer");
      setInterval(() => {
        layers[current].classList.remove("active");
        current = (current + 1) % layers.length;
        layers[current].classList.add("active");
      }, 5000);
    }
  } catch (err) {
    console.warn("Couldn't load hero image:", err);
  }
}
