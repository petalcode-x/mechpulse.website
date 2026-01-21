const pages = document.querySelectorAll(".page");
let currentPage = 0;

const pageNumEl = document.getElementById("page-num");
const pageCountEl = document.getElementById("page-count");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const downloadBtn = document.getElementById("download-btn");

// Show a given page index
function showPage(num) {
  if (num < 0) num = 0;
  if (num >= pages.length) num = pages.length - 1;
  currentPage = num;

  pages.forEach((p, i) => p.classList.toggle("active", i === num));
  pageNumEl.textContent = currentPage + 1;
  pageCountEl.textContent = pages.length;

  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
}

function nextPage() {
  if (currentPage < pages.length - 1) showPage(currentPage + 1);
}
function prevPage() {
  if (currentPage > 0) showPage(currentPage - 1);
}

prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") prevPage();
});

// Mobile touch swipe for pages
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
document.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  // Only trigger page flip on horizontal swipe
  if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) nextPage(); // swipe left
    else prevPage(); // swipe right
  }
});

// Mobile-friendly horizontal gallery swipe
document.querySelectorAll(".gallery").forEach((gallery) => {
  let startX = 0;
  gallery.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    e.stopPropagation();
  });

  gallery.addEventListener("touchmove", (e) => {
    const moveX = e.touches[0].clientX;
    const diff = startX - moveX;
    gallery.scrollLeft += diff;
    startX = moveX;
    e.stopPropagation();
  });
});

// PDF Download
downloadBtn?.addEventListener("click", () => {
  const clone = document.createElement("div");
  clone.style.width = "100%";
  clone.style.background = "#fff";
  clone.style.padding = "16px";

  pages.forEach((p) => {
    const c = p.cloneNode(true);
    c.style.display = "block";
    c.style.pageBreakAfter = "always";
    clone.appendChild(c);
  });

  html2pdf().from(clone).set({
    margin: 0.2,
    filename: "flipbook.pdf",
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  }).save();
});

// Initialize
showPage(0);
