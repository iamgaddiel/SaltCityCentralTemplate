/* ========================================
   HEADER BACKGROUND + CONTRAST LOGIC
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("mainHeader");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight * 0.2;

    // Dark background after scroll threshold
    if (scrollY > heroHeight) {
      header.classList.add("scrolled");
      header.classList.remove("light-bg");
    } else {
      header.classList.remove("scrolled");

      // Detect bright background (optional, manual class)
      const bgSection = document.elementFromPoint(window.innerWidth / 2, 80);
      const isBright = bgSection && window.getComputedStyle(bgSection).backgroundColor.match(/rgb\((\d+), (\d+), (\d+)/);
      if (isBright) {
        const [_, r, g, b] = isBright.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness > 180) {
          header.classList.add("light-bg");
        } else {
          header.classList.remove("light-bg");
        }
      }
    }
  });
});
